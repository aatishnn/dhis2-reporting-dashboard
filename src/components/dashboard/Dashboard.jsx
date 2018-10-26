import React, { Component } from 'react'
import Loader from 'react-loader-spinner'
import Joyride from 'react-joyride';


import ReportTable from '../ReportTable/ReportTable';
import SummaryDonut from '../charts/SummaryContainer';
import DashboardNav from './dashboard-nav/DashboardNav';
import Tabs from './tabs/Tabs';
import Reports from '../reporting/Reports';
import DataService from '../../services/dataService';
import { withDashboard } from '../../App';


const loaderParams = {
  type: "Bars",
  color: "#00BFFF",
  height: "100",
  width: "100"
}


class Dashboard extends Component {
  state = {
    loading: false,
    headers: [],
    rows: [],
    secondaryHeaders: [],
    secondaryRows: [],
  }


  loadData() {
    let context = this.props.context;
    this.setState({loading:true})
    DataService.getPrimaryData(
      context.startDate, context.endDate, context.ouUid, context.ownership, context.timelyReferenceDays,
      context.cutOffDate
    )
    .then((data) => {
      this.setState({
        headers: data['headers'],
        rows: data['rows'],
        loading: false
      });
    })
    .catch((error) => {console.log(error); this.setState({loading: false})})

    DataService.getSecondaryData(context.startDate, context.endDate, context.ouUid, context.timelyReferenceDays, context.cutOffDate)
    .then((data) => {
      this.setState({
        secondaryHeaders: data['headers'],
        secondaryRows: data['rows']
      });
    })
    .catch(console.log)
            
  }
  componentDidMount() {
    this.loadData()
  }
  componentDidUpdate(prevProps, prevState) {
    let prevContext = prevProps.context;
    let context = this.props.context;
    if(prevContext.ouUid !== context.ouUid 
      || prevContext.startDate !== context.startDate 
      || prevContext.endDate !== context.endDate
      || prevContext.cutOffDate !== context.cutOffDate
      || prevContext.ownership !== context.ownership
      || prevContext.timelyReferenceDays !== context.timelyReferenceDays ) {
      this.loadData()
    }
  }


  render() {
    return (
      <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
        <DashboardNav/>
        <div>
          {this.state.loading ? <div className="loader"><Loader {...loaderParams} /></div> :
            <div>
              <Tabs items={[
                {title: 'Summary', children: <SummaryDonut rows={this.state.rows}/> },
                {title: 'Detail', children: <ReportTable  headers={this.state.headers} rows={this.state.rows} /> },
                {title: 'Raw Data', children: <ReportTable  headers={this.state.secondaryHeaders} rows={this.state.secondaryRows} /> },
                {title: 'Reports', children: <Reports headers={this.state.secondaryHeaders} rows={this.state.secondaryRows} /> },
              ]}/>
            </div>

          }
        </div>

        <Joyride
          steps={
            [{
              target: '.custom-select',
              content: 'Filter by ownership here',
              placement: 'auto',
            },
            {
              target: '.btn-toolbar',
              content: 'Either select relative period or use a custom date range',
              placement: 'auto',
            }
          
          ]}
          run={true}
        />
      </main>
    )
  }
}

export default withDashboard(Dashboard);
