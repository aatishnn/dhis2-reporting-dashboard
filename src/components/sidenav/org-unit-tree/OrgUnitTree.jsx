import React, { Component } from 'react'
import 'rc-tree/assets/index.css';

import Tree, { TreeNode } from 'rc-tree';

import { init } from 'd2/lib/d2';
import { withDashboard } from '../../../App';

const OU_FIELDS = 'id,displayName~rename(name),children[id,displayName~rename(name)]'

const defaultOrgUnitParams = {fields: OU_FIELDS, paging: false, userDataViewFallback: true, order:'name:asc'}

var d2API = null;


function orgUnitModelToPOJO(ou) {
  return { key: ou.id, id: ou.id, name: ou.name}
}



function orgUnitsToTreeRepresentation(orgUnits){
  return orgUnits.toArray().map(ou => { 
    return { ...orgUnitModelToPOJO(ou), children: ou.children.toArray().map(ou => {
      return orgUnitModelToPOJO(ou)})
    } 
  });
}




function getNewTreeData(treeData, curKey, child) {
  const loop = (data) => {
    data.forEach((item) => {
      if (curKey.indexOf(item.key) === 0) {
          item.children = child;
      } else {
        loop(item.children || [])
      }
      
    });
  };
  loop(treeData);
}

class OrgUnitTree extends Component {
  state = {
    treeData: []
  };

  componentDidMount() {
    init({ baseUrl: '/hmis/api' })
      .then(d2 => {
        d2API = d2;
        d2.models.organisationUnits.list({ ...defaultOrgUnitParams })
          .then((orgUnits) => this.setOrgUnitsState(orgUnits))
          .catch(this.handleLoadingError)
      });
  }

  onLoadData = (treeNode) => {
    return this.getDescendantOrgUnits(treeNode);
  }

  setOrgUnitsState(orgUnits) {
    const ous = orgUnitsToTreeRepresentation(orgUnits)
    this.setState({
      treeData: ous,
    });
  }

  handleLoadingError(err) {
    console.log('Failed to load all org units:', err);
  }


  getDescendantOrgUnits(treeNode) {
    let parentId = treeNode.props.eventKey;
    return d2API.models.organisationUnits.get(parentId, {
      ...defaultOrgUnitParams
    })
      .then((orgUnit) => {
        const treeData = [...this.state.treeData];
        getNewTreeData(treeData, treeNode.props.eventKey, orgUnitsToTreeRepresentation(orgUnit.children));
        this.setState({ treeData });
      })
      .catch(this.handleLoadingError)
  }

  render() {
    const loop = (data) => {
      return data.sort((a, b) => {return a.name > b.name}).map((item) => {
        if (item.children) {
          return <TreeNode title={item.name} key={item.key}>{loop(item.children)}</TreeNode>;
        }
        return (
          <TreeNode title={item.name} key={item.key} isLeaf={item.isLeaf}
            disabled={item.key === '0-0-0'}
          />
        );
      });
    };
    const treeNodes = loop(this.state.treeData);
    return (
      <div>
        <Tree
          onSelect={this.props.context.setOuUid}
          checkable={false}
          loadData={this.onLoadData}>
          {treeNodes}
        </Tree>
      </div>
    );
  }
}

export default withDashboard(OrgUnitTree);
