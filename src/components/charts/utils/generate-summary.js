import _ from 'lodash';
import { COLUMNS } from '../../../constants/Constants';
import { humanizedNepali } from '../../../utils/DateUtils';


export default function generateSummary(
    tableData, 
    group_by_column = COLUMNS.MONTH,                    // group_by_column: column index to group by
    calculatePercentage = true,                         // calculatePercentage: whether to calculate percentage based on total_column
    skip_columns = [COLUMNS.MONTH, COLUMNS.OU],         // skip_columns: columns to skip when aggregating. 
    total_column = COLUMNS.EXPECTED,                    // total_column: column to use for calculating percentage
) {

    let RATO = 'rgb(255, 0, 0)'
    let HARIYO = 'rgb(50,205,50)'
    let NILO = 'rgb(0, 0, 255)'
    let YELLOW = 'rgb(255,255,0)'
    let ORANGE = 'rgb(255, 165, 0)'
    let VIOLET = 'rgb(238,130,238)'
    
    let data = _.cloneDeep(tableData);
    let categories = [];
    let series = [

        {
            name: 'Unreported',
            columnIndex: 4,
            color: RATO,
            visible: true,
            data: [],
            stack: 'timeliness'
        }, 
        {
            name: 'Late',
            columnIndex: 3,
            visible: true,
            color: VIOLET,
            data: [],
            stack: 'timeliness'
        }, 
        {
            name: 'Timely',
            columnIndex: 2,
            visible: true,
            color: NILO,
            data: [],
            stack: 'timeliness'
        },  {
            name: 'Self Submitted',
            columnIndex: 6,
            data: [],
            color: HARIYO,
            stack: 'submission'
        }, {
            name: 'Submitted by Parent',
            columnIndex: 7,
            visible: true,
            color: ORANGE,
            data: [],
            stack: 'submission'
        }
    ]


    let groupedData = _.groupBy(data, function (d) { return d[group_by_column] });
    _.forOwn(groupedData, function (rows, key) {
        let aggregatedRow = [];
        _.forEach(rows, (row, i) => {
            _.forEach(row, (value, index) => {
                aggregatedRow[index] = (!skip_columns.includes(index)) && aggregatedRow[index] ?
                    (Number(aggregatedRow[index]) + Number(value)) : value;      
          
            });

        });
        // calculate percentage if calculatePercentage is true
        let total = aggregatedRow[total_column]
        _.forEach(aggregatedRow, (value, index) => {
            aggregatedRow[index] = (calculatePercentage && !skip_columns.includes(index) && value) ?
                Math.round(100 * value / total)  : value;
        });
        
        groupedData[key] = aggregatedRow;
        if (group_by_column === COLUMNS.MONTH) {
            key = humanizedNepali(key);
        }
        categories.push(key); // push grouping column's value to categories

        _.forEach(series, (data, index) => {
            series[index]['data'].push(aggregatedRow[data['columnIndex']])
        });

    });
    return { series, categories };
}


