import React, { Component } from 'react'
import FavoriteList from '../charts/savefavorite/favoritelist/FavoriteList';
import dataService from '../../services/dataService';
import SummaryChart from '../charts/summarychart/SummaryChart';

class DHIS2DashboardWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            chartConfig: null,
            rows: []
        }
        
    }

    componentDidMount() {
        dataService.getWidgetFavorite(this.props.dashboardItemId)
            .then((chartConfig) => {
                dataService.getPrimaryData(chartConfig.startDate, chartConfig.endDate, chartConfig.ouUid)
                    .then((data)=> {
                        this.setState({
                            loading: false,
                            chartConfig,
                            rows: data['rows']
                        })
                    })
                
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    loading: false
                })
            })
    }
    render() {
        return (
            <div>
                {!this.state.loading && this.state.chartConfig == null && <FavoriteList dashboardItemId={this.props.dashboardItemId} /> }
                {!this.state.loading && this.state.chartConfig != null && <SummaryChart
                    rows={this.state.rows}
                    groupBy={this.state.chartConfig.groupBy}
                    calculatePercentage={this.state.chartConfig.calculatePercentage}
                    chartType={this.state.chartConfig.chartType}
                    aggregate={this.state.chartConfig.aggregate} />}
            </div>
            
        )
    }
}

export default DHIS2DashboardWidget
