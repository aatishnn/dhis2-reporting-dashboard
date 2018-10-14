import React, { Component } from 'react'
import classnames from 'classnames';

import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { defaultStaticRanges } from '../../../utils/DateUtils';
import { withDashboard } from '../../../App';
import {OWNWERSHIP} from '../../../constants/Constants';
import NepaliDatePicker from '../../nepalidatepicker/NepaliDatePicker';


class DashboardNav extends Component {
  state = {
    'clickedRange': null,
    'dropdownOpen': false,
    'dropdownStartDate': '',
    'dropdownEndDate': ''
  }


  onRangeButtonClicked = (r, index) => {
    this.setState({clickedRange: index})
    this.props.context.setDateRange(
      r.rangeDate().startDate, r.rangeDate().endDate
    )
  }

  setDropdownRange = () => {
    if(this.state.dropdownStartDate && this.state.dropdownEndDate) {
      this.props.context.setDateRange(this.state.dropdownStartDate, this.state.dropdownEndDate)
      // set clicked to static ranges + 1 i.e. custom
      this.setState({ clickedRange: defaultStaticRanges.length, dropdownOpen: false })
    }
    
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  toggleFake = () => {
    this.setState(prevState => ({
      dropdownOpen: true
    }));
  }


  render() {
    return (
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <label>Ownership:
          <select class="custom-select" 
            value={this.props.context.ownership}
            onChange={event=> this.props.context.setOwnership(event.target.value)}
            >
            <option value={OWNWERSHIP.PUBLIC}>Public</option>
            <option value={OWNWERSHIP.PRIVATE}>Non-Public</option>
            <option value={OWNWERSHIP.ALL}>Any</option>
          </select>
        </label>
        <h1 className="h4">{this.props.context.startDate} - {this.props.context.endDate}</h1>

        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            {defaultStaticRanges.map((r, index) => 
            <button
              key={index}
                className={classnames(["btn", "btn-sm", "btn-outline-info"], {
                "active": this.state.clickedRange === index,

              })}
              onClick={() => this.onRangeButtonClicked(r, index)}>
              {r.label}
            </button>)}


          </div>
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleFake}>
            <DropdownToggle caret className={classnames(["btn-outline-secondary"], {
              "active": this.state.clickedRange === defaultStaticRanges.length})}>
              Custom
            </DropdownToggle>
            <DropdownMenu right>
              From: <NepaliDatePicker initial={this.state.dropdownStartDate}
                      onSelect={(date) => {this.setState({dropdownStartDate: date})}}/>
              To:   <NepaliDatePicker initial={this.state.dropdownEndDate}
                      onSelect={(date) => { this.setState({ dropdownEndDate: date }) }} />
              <div class="d-flex p-2 justify-content-around">
                <button class="btn btn-sm btn-outline-primary" onClick={this.setDropdownRange}>Go</button>
                <button class="btn btn-sm btn-outline-dark" onClick={this.toggle}>Cancel</button>
              </div>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

    )
  }
}

export default withDashboard(DashboardNav);
