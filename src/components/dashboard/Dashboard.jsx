import React, { Component } from 'react'
import ReportTable from '../ReportTable/ReportTable';
import SummaryDonut from '../charts/SummaryContainer';
import Loader from 'react-loader-spinner'


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
    DataService.getPrimaryData(context.startDate, context.endDate, context.ouUid)
    .then((data) => {
      this.setState({
        headers: data['headers'],
        rows: data['rows'],
        loading: false
      });
    })
    .catch((error) => {console.log(error); this.setState({loading: false})})

    DataService.getSecondaryData(context.startDate, context.endDate, context.ouUid)
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
      || prevContext.endDate !== context.endDate) {
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


      </main>
    )
  }
}

export default withDashboard(Dashboard);
