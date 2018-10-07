import React, { Component } from 'react'
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
        let nonAggregatedLabel = !this.props.aggregate ? '(Timely + Late)' : '';
        let summarized;
        if (this.props.aggregate) {
            summarized = generateSummary(this.props.rows, this.props.groupBy, this.props.calculatePercentage);
        } else {
            summarized = generateNonAggregatedSummary(this.props.rows, this.props.groupBy, this.props.calculatePercentage);
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
                min: 0,
                title: {
                    text: 'Submissions ' + percentageSymbol + " " + nonAggregatedLabel
                }
            },

            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            redraw: false,
            series: summarized.series
        }
        return (
            <HighchartsReact
                highcharts={Highcharts}
                options={options} />
        )
    }
}

export default SummaryChart
