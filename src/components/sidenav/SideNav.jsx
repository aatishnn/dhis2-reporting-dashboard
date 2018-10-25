import React, { Component } from 'react'
import OrgUnitTree from './org-unit-tree/OrgUnitTree';

class SideNav extends Component {
  render() {
    return (
      <nav className="col-md-2 d-none d-md-block bg-light sidebar">
        <div className="sidebar-sticky">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link active" href=".">
                <span data-feather="home"></span>
                Dashboard <span className="sr-only">(current)</span>
              </a>
            </li>
            <OrgUnitTree/>
          </ul>
        </div>
      </nav>

    )
  }
}

export default SideNav
