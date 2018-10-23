import React, { Component } from 'react'

class Nav extends Component {
  render() {
    return (
      <nav className="navbar  navbar-dark bg-primary fixed-top flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0" href=".">Reporting Status Dashboard</a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            <a className="nav-link" href="/">DHIS2 Home</a>
          </li>
        </ul>
      </nav>
    )
  }
}

export default Nav
