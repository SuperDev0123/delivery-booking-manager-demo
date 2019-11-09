import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import moment from 'moment-timezone';
import { Button } from 'reactstrap';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import DateTimePicker from 'react-datetime-picker';

class ProjectDataSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            b_booking_project: '',
            b_project_opened: new Date(),
            b_project_inventory_due: new Date(),
            b_project_wh_unpack: new Date(),
            b_project_dd_receive_date: new Date(),
            errorMessage: '',
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleDateSlider: PropTypes.func.isRequired,
        booking: PropTypes.object.isRequired,
        OnUpdateBooking: PropTypes.func.isRequired,
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const b_booking_project = nextProps.booking.b_booking_project;
        const b_project_opened = nextProps.booking.b_project_opened;
        const b_project_inventory_due = nextProps.booking.b_project_inventory_due;
        const b_project_wh_unpack = nextProps.booking.b_project_wh_unpack;
        const b_project_dd_receive_date = nextProps.booking.b_project_dd_receive_date;
        this.setState({b_booking_project, b_project_opened, b_project_inventory_due, b_project_wh_unpack, b_project_dd_receive_date});
    }

    onClickSave() {
        const { booking } = this.props;
        const { b_booking_project, b_project_opened , b_project_inventory_due, b_project_wh_unpack, b_project_dd_receive_date} = this.state;

        booking['b_booking_project'] = b_booking_project;
        booking['b_project_opened'] = b_project_opened;
        booking['b_project_inventory_due'] = b_project_inventory_due;
        booking['b_project_wh_unpack'] = b_project_wh_unpack;
        booking['b_project_dd_receive_date'] = b_project_dd_receive_date;
        this.props.OnUpdateBooking(booking);
        this.props.toggleDateSlider();
    }

    onInputChange(event) {
        this.setState({b_booking_project: event.target.value, errorMessage: ''});
    }

    onChangeDate(date, fieldName) {
        if (fieldName === 'b_project_opened') {
            this.setState({b_project_opened: date});
        } else if (fieldName === 'b_project_inventory_due') {
            this.setState({b_project_inventory_due: date});
        } else if (fieldName === 'b_project_wh_unpack') {
            this.setState({b_project_wh_unpack: date});
        } else if (fieldName === 'b_project_dd_receive_date') {
            this.setState({b_project_dd_receive_date: date});
        }
    }

    render() {
        const { isOpen } = this.props;
        const { errorMessage, b_booking_project, b_project_opened , b_project_inventory_due, b_project_wh_unpack, b_project_dd_receive_date } = this.state;

        return (
            <SlidingPane
                className='pd-slider'
                overlayClassName='pd-slider-overlay'
                isOpen={isOpen}
                title='Project Data Slider'
                onRequestClose={this.props.toggleDateSlider}>
                <div className="slider-content">
                    {
                        <div className="form-view">
                            <label>
                                <p>Project Name</p>
                                <textarea
                                    name="b_booking_project"
                                    value={b_booking_project}
                                    onChange={(e) => this.onInputChange(e)}
                                />
                            </label>
                            <label>
                                <p>Project Opened</p>
                                <DateTimePicker
                                    onChange={(date) => this.onChangeDate(date, 'b_project_opened')}
                                    value={b_project_opened ? moment(b_project_opened).toDate() : null}
                                    format={'dd/MM/yyyy hh:mm a'}
                                />
                            </label>
                            <label>
                                <p>Project Inventory Due</p>
                                <DateTimePicker
                                    onChange={(date) => this.onChangeDate(date, 'b_project_inventory_due')}
                                    value={b_project_inventory_due ? moment(b_project_inventory_due).toDate() : null}
                                    format={'dd/MM/yyyy hh:mm a'}
                                />
                            </label>
                            <label>
                                <p>Project Wh Pack</p>
                                <DateTimePicker
                                    onChange={(date) => this.onChangeDate(date, 'b_project_wh_unpack')}
                                    value={b_project_wh_unpack ? moment(b_project_wh_unpack).toDate() : null}
                                    format={'dd/MM/yyyy hh:mm a'}
                                />
                            </label>
                            <label>
                                <p>Project DD Receive Date</p>
                                <DateTimePicker
                                    onChange={(date) => this.onChangeDate(date, 'b_project_dd_receive_date')}
                                    value={b_project_dd_receive_date ? moment(b_project_dd_receive_date).toDate() : null}
                                    format={'dd/MM/yyyy hh:mm a'}
                                />
                            </label>

                            {
                                _.isEmpty(errorMessage) ?
                                    null
                                    :
                                    <label>
                                        <p className='red'>{errorMessage}</p>
                                    </label>
                            }
                            <Button
                                color="primary"
                                onClick={() => this.onClickSave()}
                            >
                               Save
                            </Button>
                            <Button color="danger" onClick={() => this.props.toggleDateSlider()}>
                                Cancel
                            </Button>
                        </div>
                    }
                </div>
            </SlidingPane>
        );
    }
}

export default ProjectDataSlider;
