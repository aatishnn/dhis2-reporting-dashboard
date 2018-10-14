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
        console.log(optionName, value)
        if (optionName === 'aggregate' && value === false) {
            // doesn't make sense to group by OU on non-aggregated data
            newState['groupBy'] = COLUMNS.MONTH
            newState['chartType'] = CHARTS.LINE
        }
        if (optionName === 'chartType' && value === CHARTS.COLUMN) {
            // doesn't make sense to show bar chart when not aggregated
            newState['aggregate'] = true
        }
        if (optionName === 'groupBy' && value === COLUMNS.OU && this.state.aggregate === false) {
            // doesn't make sense to group by OU on non-aggregated data
            newState['aggregate'] = true;
        }

        if (optionName === 'chartType' && value === CHARTS.LINE) {
            // doesn't make sense to show line chart grouped by OU
            newState['groupBy'] = COLUMNS.MONTH
        }
        if (optionName === 'groupBy' && value === COLUMNS.OU && this.state.chartType === CHARTS.LINE) {
            // doesn't make sense to show line chart grouped by OU
            newState['chartType'] = CHARTS.COLUMN;
        }
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
                                    <input type="radio" name="aggregateOptions" autocomplete="off"
                                        onChange={(event) => this.handleOptionChange('aggregate', true)}
                                        checked={this.isChecked('aggregate', true)} /> Aggregate
                                </label>
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('aggregate', false) })}>
                                    <input type="radio" name="aggregateOptions" autocomplete="off"
                                        onChange={(event) => this.handleOptionChange('aggregate', false)}
                                        checked={this.isChecked('aggregate', false)} /> Don't Aggregate
                                </label>
                            </div>

                            <div class="btn-group btn-group-toggle mr-2" data-toggle="buttons">
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('groupBy', COLUMNS.MONTH) })}>
                                    <input type="radio" name="groupingOptions" autocomplete="off"
                                        onChange={(event) => this.handleOptionChange('groupBy', COLUMNS.MONTH)}
                                        checked={this.isChecked('groupBy', COLUMNS.MONTH)} /> Group by Date
                                </label>
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('groupBy', COLUMNS.OU) })}>
                                    <input type="radio" name="groupingOptions" autocomplete="off"
                                        onChange={(event) => this.handleOptionChange('groupBy', COLUMNS.OU)}
                                        checked={this.isChecked('groupBy', COLUMNS.OU)} /> Group by OU
                                </label>
                            </div>
                            <div class="btn-group btn-group-toggle mr-2" data-toggle="buttons">
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('chartType', CHARTS.LINE) })}>
                                    <input type="radio" name="chartTypeOptions" autocomplete="off"
                                        onChange={(event) => this.handleOptionChange('chartType', CHARTS.LINE)}
                                        checked={this.isChecked('chartType', CHARTS.LINE)} /> Line Chart
                                </label>
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('chartType', CHARTS.COLUMN) })}>
                                    <input type="radio" name="chartTypeOptions" autocomplete="off"
                                        onChange={(event) => this.handleOptionChange('chartType', CHARTS.COLUMN)}
                                        checked={this.isChecked('chartType', CHARTS.COLUMN)} /> Bar Chart
                                </label>
                            </div>
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('calculatePercentage', true) })}>
                                    <input type="radio" name="percentageOptions" autocomplete="off"
                                        onChange={(event) => this.handleOptionChange('calculatePercentage', true)}
                                        checked={this.isChecked('calculatePercentage', true)} /> Percentage
                                </label>
                                <label class={classnames("btn btn-sm btn-outline-info", { active: this.isChecked('calculatePercentage', false) })}>
                                    <input type="radio" name="percentageOptions" autocomplete="off"
                                        onChange={(event) => this.handleOptionChange('calculatePercentage', false)}
                                        checked={this.isChecked('calculatePercentage', false)} /> Values
                                </label>
                            </div>
                        </div>

                        <div class="d-flex justify-content-end mb-4">
                            <label>Data to plot:
                                <select class="custom-select">
                                    <option>Timely</option>
                                    <option>Late</option>
                                    <option>Timely + Late</option>
                                    <option>Unreported</option>
                                    <option>Electronically Submitted by Facility</option>
                                    <option>Date Entered by Parent Facility</option>
                                </select>
                            </label>   
                        </div>
                        <hr/>
                        <SummaryChart
                            rows={this.props.rows}
                            groupBy={this.props.context.groupBy}
                            calculatePercentage={this.props.context.calculatePercentage}
                            chartType={this.props.context.chartType}
                            aggregate={this.props.context.aggregate} />
                        <SaveFavorite isOpen={this.state.isFavoriteModalOpen} toggle={this.toggleFavoriteModal} />
                    </CardBody>
                </Card>

            </div>


        )
    }
}

export default withDashboard(SummaryDonut);
