import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DataService from '../../../services/dataService';
import FavoriteList from './favoritelist/FavoriteList';
import { withDashboard } from '../../../App';


class SaveFavorite extends Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
    }
    onSave = () => {
        DataService.saveFavorite(this.input.current.value, this.props.context)
        .then((result) => {
            this.props.toggle();
        })
        .catch((error)=> {
            console.log(error);
        })
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} backdrop>
                <ModalHeader toggle={this.props.toggle}>Save Favorite as:</ModalHeader>
                <ModalBody>
                    <label> Name:
                    <input type="text" ref={this.input}/>
                    </label>
                    <FavoriteList/>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.onSave}>Save as Favorite</Button>{' '}
                    <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default withDashboard(SaveFavorite);
