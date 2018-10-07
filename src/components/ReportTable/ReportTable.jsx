import React, { PureComponent } from 'react'
import ReactTable from "react-table";
import {CSVLink} from 'react-csv';

import 'react-table/react-table.css'
import './ReportTable.css';



class ReportTable extends PureComponent {

  csvDownloadLink() {
    return (
      <CSVLink 
      data={this.props.rows} 
      headers={this.props.headers.map((header) => header.name)}
      filename={"data.csv"}
      className="btn btn-sm btn-outline-secondary">
          Export
      </CSVLink>
    )
  }

  render() {
    const columns = this.props.headers.map((header, index) => { return {
      Header: header.name,
      accessor: index.toString()
    }})
    return (
      <div>
        <div className="d-flex flex-row-reverse mb-2"><span>{this.csvDownloadLink()}</span></div>
        <ReactTable
          filterable
          defaultFilterMethod={(filter, row) => {
            return String(row[filter.id]).toLowerCase().startsWith(filter.value.toLowerCase())}
          }
          data={this.props.rows}
          columns={columns}
          className="-striped -highlight"
        />
      </div>
    )
  }
}

export default ReportTable


