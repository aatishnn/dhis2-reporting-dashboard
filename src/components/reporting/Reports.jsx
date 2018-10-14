import React, { Component } from 'react'
import { Card, CardBody, Table } from 'reactstrap';
import { CSVLink } from 'react-csv/lib';
import { SECONDARY_COLUMNS } from '../../constants/Constants';

class Reports extends Component {

    nonReportingFacilities(rows) {
        return rows.filter((value) => {
            return !value[SECONDARY_COLUMNS.REPORTED_ON];
        })
    }

    reportingFacilities(rows) {
        return rows.filter((value) => {
            return value[SECONDARY_COLUMNS.REPORTED_ON];
        })
    }

    timelyReportingFacilities = (rows) => {
        return this.reportingFacilities(rows).filter((value)=> {
            return value[SECONDARY_COLUMNS.TIMELINESS] === SECONDARY_COLUMNS.VALUE_TIMELY;
        })
    }
    lateReportingFacilities = (rows) => {
        return this.reportingFacilities(rows).filter((value) => {
            return value[SECONDARY_COLUMNS.TIMELINESS] === SECONDARY_COLUMNS.VALUE_LATE;
        })
    }

    csvDownloadLink(filter) {
        return (
            <CSVLink
                data={filter(this.props.rows)}
                headers={this.props.headers.map((header) => header.name)}
                filename={"data.csv"}
                className="btn btn-sm btn-outline-primary">
                Export
            </CSVLink>
        )
    }

    render() {
        return (
            <Card className="border-top-0">
                <CardBody>
                    <Table hover responsive bordered>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Facilities not reporting in given time period</td>
                                <td>{this.csvDownloadLink(this.nonReportingFacilities)}</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Facilities reporting in given time period</td>
                                <td>{this.csvDownloadLink(this.reportingFacilities)}</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Facilities timely reporting in given time period</td>
                                <td>{this.csvDownloadLink(this.timelyReportingFacilities)}</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>Facilities reporting late in given time period</td>
                                <td>{this.csvDownloadLink(this.lateReportingFacilities)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        )
    }
}

export default Reports
