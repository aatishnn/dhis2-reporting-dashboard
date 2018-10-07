import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import './tabs.css';


class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: 0
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    render() {
        return (
            <div>
                <Nav tabs>
                        {this.props.items.map((item, index)=> <NavItem 
                            key={index}>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === index })}
                            onClick={() => { this.toggle(index); }}
                        >
                            {item.title}
                        </NavLink>
                    </NavItem>)}
                       
                    
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    {this.props.items.map((item, index)=> <TabPane key={index} tabId={index}>{item.children}</TabPane>)}                    
                </TabContent>
            </div>
        );
    }
}
export default Tabs;