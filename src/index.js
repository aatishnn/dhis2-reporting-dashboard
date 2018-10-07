import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import DHIS2DashboardWidget from './components/dhis2dashboardwidget/DHIS2DashboardWidget';


// Get the dashboardItemId query parameter from the URL
var dashboardItemId = (/[?&]dashboardItemId=([a-zA-Z0-9]{11})(?:&|$)/g.exec(window.location.search) || [undefined]).pop();
var appComponent = <App/>;

if(dashboardItemId) {
    // not opened as a dashboard widget
    appComponent = <DHIS2DashboardWidget dashboardItemId={dashboardItemId}/>;
}


ReactDOM.render(appComponent, document.getElementById('root'));
registerServiceWorker();
