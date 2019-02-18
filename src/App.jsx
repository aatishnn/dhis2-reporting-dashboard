import React, { Component } from 'react';
import './App.css';

import { Container } from 'reactstrap';


import Nav from './components/nav/Nav';
import SideNav from './components/sidenav/SideNav';
import Dashboard from './components/dashboard/Dashboard';
import { COLUMNS, CHARTS, OWNERSHIP } from './constants/Constants';
import { defaultStaticRanges, toDateString } from './utils/DateUtils';
import { todayNepali, formatNepaliDate } from './utils/NepaliDateUtils';


const DashboardContext = React.createContext({})


export function withDashboard(Component) {
    return function DashboardContextComponent(props) {
        return (
            <DashboardContext.Consumer>
                {context => <Component {...props} context={context} />}
            </DashboardContext.Consumer>
        )
    }
}

class App extends Component {
    state = {
        // shared context for dashboard childrens
        ouUid: null,
        startDate: defaultStaticRanges[1].rangeDate().startDate,
        endDate: defaultStaticRanges[1].rangeDate().endDate,
        calculatePercentage: true,
        groupBy: COLUMNS.MONTH,
        chartType: CHARTS.COLUMN,
        aggregate: true,            // aggregate non-grouping column
        disaggregateLate: false,     // whether to further disaggregate Late data 
        ownership: OWNERSHIP.ALL,
        disaggregatedDataColumn: [COLUMNS.TIMELY, COLUMNS.LATE],    // columns to use as data when non-grouping column is disaggregated
        timelyReferenceDays: 15,                // number of days to take as timely reports
        cutOffDate: formatNepaliDate(todayNepali()),    // days after which data set registrations are considered unreported. defaults to today

        // setter functions
        setContext: (state) => this.setState(state),
        setContextOf: (name, value) => this.setState({name: value}),
        setDateRange: (startDate, endDate) => {
            this.setState({ startDate, endDate })
        },
        setCalculatePercentage: (value) => this.setContext('calculatePercentage', value),
        setGroupBy: (value) => this.setContextOf('groupBy', value),
        setChartType: (value) => this.setContextOf('chartType', value),
        setAggregate: (value) => this.setContextOf('aggregate', value),
        setOuUid: (ouUid) => {this.setState({ouUid})},
        setDisaggregateLate: (value) => this.setContextOf('disaggregateLate', value),
        setOwnership: (ownership) => { this.setState({ ownership }) },
        setDisaggregatedDataColumn: (value) => this.setContextOf('disaggregatedDataColumn', value),
        setTimelyReferenceDays: value => this.setState({timelyReferenceDays: value}),
        setCutOffDate: value => this.setState({ setCutOffDate: value }),

    }

    render() {
        return (
            <DashboardContext.Provider value={this.state}>
                <div className="App">
                    <Nav />
                    <Container fluid={true}>
                        <SideNav/>
                        {this.state.ouUid != null && <Dashboard/>}
                    </Container>
                </div>
            </DashboardContext.Provider>
        );
    }
}

export default App;
