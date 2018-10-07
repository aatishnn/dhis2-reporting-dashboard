import React, { Component } from 'react'
import './NepaliDatePicker.css';
const $ = window.jQuery;
const nepaliCalendar = $.calendars.instance('nepali', 'ne')

class NepaliDatePicker extends Component {
    componentDidMount() {
        this.$el = $(this.el);
        this.$el.calendarsPicker(
            {
                calendar: nepaliCalendar,
                onSelect: (selected) => {
                    if (selected.length > 0) {
                        this.props.onSelect(this.$el.val())
                    }
                }
            }); 
    }

    componentWillUnmount() {
        //this.$el.somePlugin('destroy');
    }

    render() {
        return (
            <div>
                <input value={this.props.initial} type="text" ref={el => this.el = el}/>
            </div>
        )
    }
}

export default NepaliDatePicker
