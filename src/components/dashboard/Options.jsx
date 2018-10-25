import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withDashboard } from '../../App';
import TimelySlider from '../slider/TimelySlider';
import NepaliDatePicker from '../nepalidatepicker/NepaliDatePicker';


class Options extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timelyDays: this.props.context.timelyReferenceDays,
            cutOffDate: this.props.context.cutOffDate
        }
    }
    onSave = () => {
        this.props.context.setContext({
            timelyReferenceDays: this.state.timelyDays,
            cutOffDate: this.state.cutOffDate
        })
        this.props.toggle();
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>Options</ModalHeader>
                <ModalBody>
                    <div class="form-group">
                        Reference Days for Timely: {this.state.timelyDays}
                        <TimelySlider min={7} max={60} defaultValue={this.state.timelyDays} onChange={(e) => this.setState({timelyDays: e})}/>
                    </div>
                    <div class="form-group">
                        Cutoff Date:
                        <NepaliDatePicker initial={this.state.cutOffDate}
                            onSelect={(date) => { this.setState({ cutOffDate: date }) }}/>
                    </div>
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
