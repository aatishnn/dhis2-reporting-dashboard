import React, { PureComponent } from 'react'
import {
    Card, CardBody,
} from 'reactstrap';

import { COLUMNS, CHARTS } from '../../constants/Constants';
import classnames from 'classnames';
import SummaryChart from './summarychart/SummaryChart';
import SaveFavorite from './savefavorite/SaveFavorite';
import { withDashboard } from '../../App';


class SummaryDonut extends PureComponent {
    state = {
        isFavoriteModalOpen: false
    }

    toggleFavoriteModal = () => {
        this.setState({ isFavoriteModalOpen: !this.state.isFavoriteModalOpen });
    }


    handleOptionChange = (optionName, value) => {
        let newState = {
            [optionName]: value
        }
        if (optionName === 'aggregate' && value === false) {
            // doesn't make sense to group by OU on non-aggregated data
            newState['groupBy'] = COLUMNS.MONTH
            newState['chartType'] = CHARTS.LINE
        }
        if (optionName === 'chartType' && value === CHARTS.COLUMN) {
            // doesn't make sense to show bar chart when not aggregated
            newState['aggregate'] = true
        }
        if (optionName === 'groupBy' && value === COLUMNS.OU && this.props.context.aggregate === false) {
            // doesn't make sense to group by OU on non-aggregated data
            newState['aggregate'] = true;
        }

        if (optionName === 'chartType' && value === CHARTS.LINE) {
            // doesn't make sense to show line chart grouped by OU
            newState['groupBy'] = COLUMNS.MONTH
        }
        if (optionName === 'groupBy' && value === COLUMNS.OU && this.props.context.chartType === CHARTS.LINE) {
            // doesn't make sense to show line chart grouped by OU
            newState['chartType'] = CHARTS.COLUMN;
        }
        console.log(optionName, value)
        this.props.context.setContext(newState);
    }

    isChecked = (optionName, value) => {
        return this.props.context[optionName] === value;
    }

    render() {

        return (
            <div>
                <Card className="border-top-0">
                    <CardBody>
                        <div class="d-flex justify-content-end mb-4">
                            <button class="btn btn-small mr-2" onClick={this.toggleFavoriteModal}>Save as</button>

                            <div class="btn-group btn-group-toggle mr-2" data-toggle="buttons">
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('aggregate', true) })}>
                                    <input type="radio" name="aggregateOptions"
                                        onChange={(event) => this.handleOptionChange('aggregate', true)}
                                        checked={this.isChecked('aggregate', true)} /> Aggregate
                                </label>
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('aggregate', false) })}>
                                    <input type="radio" name="aggregateOptions"
                                        onChange={(event) => this.handleOptionChange('aggregate', false)}
                                        checked={this.isChecked('aggregate', false)} /> Don't Aggregate
                                </label>
                            </div>

                            <div class="btn-group btn-group-toggle mr-2" data-toggle="buttons">
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('groupBy', COLUMNS.MONTH) })}>
                                    <input type="radio" name="groupingOptions"
                                        onChange={(event) => this.handleOptionChange('groupBy', COLUMNS.MONTH)}
                                        checked={this.isChecked('groupBy', COLUMNS.MONTH)} /> Group by Date
                                </label>
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('groupBy', COLUMNS.OU) })}>
                                    <input type="radio" name="groupingOptions"
                                        onChange={(event) => this.handleOptionChange('groupBy', COLUMNS.OU)}
                                        checked={this.isChecked('groupBy', COLUMNS.OU)} /> Group by OU
                                </label>
                            </div>
                            <div class="btn-group btn-group-toggle mr-2" data-toggle="buttons">
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('chartType', CHARTS.LINE) })}>
                                    <input type="radio" name="chartTypeOptions"
                                        onChange={(event) => this.handleOptionChange('chartType', CHARTS.LINE)}
                                        checked={this.isChecked('chartType', CHARTS.LINE)} /> Line Chart
                                </label>
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('chartType', CHARTS.COLUMN) })}>
                                    <input type="radio" name="chartTypeOptions"
                                        onChange={(event) => this.handleOptionChange('chartType', CHARTS.COLUMN)}
                                        checked={this.isChecked('chartType', CHARTS.COLUMN)} /> Bar Chart
                                </label>
                            </div>
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('calculatePercentage', true) })}>
                                    <input type="radio" name="percentageOptions"
                                        onChange={(event) => this.handleOptionChange('calculatePercentage', true)}
                                        checked={this.isChecked('calculatePercentage', true)} /> Percentage
                                </label>
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('calculatePercentage', false) })}>
                                    <input type="radio" name="percentageOptions"
                                        onChange={(event) => this.handleOptionChange('calculatePercentage', false)}
                                        checked={this.isChecked('calculatePercentage', false)} /> Values
                                </label>
                            </div>
                        </div>

                        <div class="d-flex justify-content-end mb-4">
                            <div class="form-inline">
                                <div class="form-check form-check-inline">
                                    <label class="form-check-label" htmlFor="disaggregateCb">Disaggregate Late: </label>

                                    {/* Disable disaggregated late checkbox when graph is not in aggregation mode */}
                                    <input class="form-check-input" type="checkbox" id="disaggregateCb"
                                        onChange={(event) => this.handleOptionChange('disaggregateLate', event.target.checked)}
                                        checked={this.isChecked('disaggregateLate', true)}
                                        disabled={this.isChecked('aggregate', false)}
                                    />

                                </div>
                                <label>Data to plot:
                                    {/* Select's value doesn't support arrays. So, before updating the state, split and convert value to Number */}
                                    <select class="custom-select" 
                                        disabled={this.isChecked('aggregate', true)}
                                        value={this.props.context.disaggregatedDataColumn}
                                        onChange={(event) => this.handleOptionChange('disaggregatedDataColumn', event.target.value.split(',').map(Number))}>
                                        <option value={[COLUMNS.TIMELY]}>Timely</option>
                                        <option value={[COLUMNS.LATE]}>Late</option>
                                        <option value={[COLUMNS.TIMELY, COLUMNS.LATE]}>Timely + Late</option>
                                        <option value={[COLUMNS.UNREPORTED]}>Unreported</option>
                                        <option value={[COLUMNS.SELF_SUBMITTED]}>Electronically Submitted by Facility</option>
                                        <option value={[COLUMNS.SUBMITTED_BY_PARENT]}>Date Entered by Parent Facility</option>
                                        <option value={[COLUMNS.TIMELY, COLUMNS.LATE_BY_15]}>Timely + Late (max:15 days)</option>
                                        <option value={[COLUMNS.TIMELY, COLUMNS.LATE_BY_15, COLUMNS.LATE_BY_30]}>Timely + Late (max:30 days)</option>
                                    </select>
                                </label>   
                            </div>
                        </div>
                        <hr/>
                        <SummaryChart
                            rows={this.props.rows}
                            groupBy={this.props.context.groupBy}
                            calculatePercentage={this.props.context.calculatePercentage}
                            chartType={this.props.context.chartType}
                            aggregate={this.props.context.aggregate}
                            disaggregateLate={this.props.context.disaggregateLate} 
                            disaggregatedDataColumn={this.props.context.disaggregatedDataColumn}/>
                        <SaveFavorite isOpen={this.state.isFavoriteModalOpen} toggle={this.toggleFavoriteModal} />
                    </CardBody>
                </Card>

            </div>


        )
    }
}

export default withDashboard(SummaryDonut);
