import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withDashboard } from '../../App';
import TimelySlider from '../slider/TimelySlider';


class Options extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timelyDays: this.props.context.timelyReferenceDays
        }
    }
    onSave = () => {
        this.props.context.setTimelyReferenceDays(this.state.timelyDays);
        this.props.toggle();
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} backdrop>
                <ModalHeader toggle={this.props.toggle}>Options</ModalHeader>
                <ModalBody>
                    Reference Days for Timely: {this.state.timelyDays}
                    <TimelySlider min={1} max={60} defaultValue={this.state.timelyDays} onChange={(e) => this.setState({timelyDays: e})}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.onSave}>Update</Button>{' '}
                    <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default withDashboard(Options);
