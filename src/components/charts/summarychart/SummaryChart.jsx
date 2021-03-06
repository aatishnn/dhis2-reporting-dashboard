import React, { Component } from 'react'
import _ from 'lodash';
import { COLUMNS } from '../../../constants/Constants';
import generateSummary from '../utils/generate-summary';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighChartsExporting from 'highcharts/modules/exporting';
import generateNonAggregatedSummary from '../utils/generate-non-aggregated-summary';

HighChartsExporting(Highcharts);


class SummaryChart extends Component {
    render() {
        let percentageSymbol = this.props.calculatePercentage ? '%' : '';
        let nonAggregatedLabel = !this.props.aggregate ? _(COLUMNS).keys(COLUMNS).reduce((final, value, key) => {
            console.log(final, value, key, this.props.disaggregatedDataColumn)
            if(this.props.disaggregatedDataColumn.includes(key)) return final + " " + value;
            return final;
        }, '') : '';

        let summarized;
        if (this.props.aggregate) {
            summarized = generateSummary(this.props.rows, this.props.groupBy, this.props.calculatePercentage, this.props.disaggregateLate);
        } else {
            console.log(this.props.disaggregatedDataColumn)
            summarized = generateNonAggregatedSummary(this.props.rows, this.props.groupBy, this.props.calculatePercentage, this.props.disaggregatedDataColumn);
        }
        let options = {

            chart: {
                type: this.props.chartType,
                animation: false
            },

            title: {
                text: (this.props.groupBy === COLUMNS.MONTH ? 'Monthly' : 'OU Level'
                ) + ' Distribution of Reporting Status'
            },

            xAxis: {
                categories: summarized.categories
            },

            yAxis: {
                allowDecimals: false,
                title: {
                    text: 'Submissions ' + percentageSymbol + " " + nonAggregatedLabel
                }
            },

            plotOptions: {
                column: {
                    stacking: 'normal'
                },
                series: {
                    animation: false
                }
            },
            redraw: false,
            series: summarized.series
        }

        if (this.props.calculatePercentage === true) {
            // get around Highcharts issue where chart has 125 in yAxis even if max of data is 100
            options["yAxis"]["max"] = 100;
        }
        
        return (
            // use random key to force update highcharts
            <HighchartsReact
                highcharts={Highcharts}
                options={options} 
                key={Math.random()}/> 
        )
    }
}

export default SummaryChart
