import _ from 'lodash';
import { COLUMNS } from '../../../constants/Constants';
import { humanizedNepali } from '../../../utils/DateUtils';


export default function generateNonAggregatedSummary(
    tableData,
    group_by_column = COLUMNS.MONTH,                    // group_by_column: column index to group by
    calculatePercentage = true,                         // calculatePercentage: whether to calculate percentage based on total_column
    dataColumns=[COLUMNS.TIMELY, COLUMNS.LATE],
    skip_columns = [COLUMNS.MONTH, COLUMNS.OU],         // skip_columns: columns to skip when aggregating. 
    total_column = COLUMNS.EXPECTED,                    // total_column: column to use for calculating percentage
) {

    let seriesColumn = COLUMNS.OU;
    let categories = [];
    let series = []

    let data = _.cloneDeep(tableData);


    let groupedData = _.groupBy(data, function (d) { return d[group_by_column] });
    _.forOwn(groupedData, function (rows, key) {
        _.forEach(rows, (row, i) => {
            _.forEach(row, (value, index) => {
                let total = row[total_column]
                // calculate percentage if calculatePercentage is true
                row[index] = (calculatePercentage && !skip_columns.includes(index) && value) ?
                    Math.round(100 * value / total) : value;       
               

            });
            let dataValue = _.map(dataColumns, (col) => Number(row[col]) ).reduce((a, b) => a+b, 0);

            let ouSeries = series.find(x => x.name === row[COLUMNS.OU])
            if (ouSeries) {
                ouSeries.data.push(dataValue);
            } else {
                series.push({
                    name: row[seriesColumn],
                    visible: true,
                    data: [dataValue],
                    stack: 'ou'
                })
            }

        });
        // if it's a month, display it as Nepali Month's name
        if (group_by_column === COLUMNS.MONTH) {
            key = humanizedNepali(key);
        }
       
        categories.push(key); // push grouping column's value to categories

    });
    return { series, categories };
}


