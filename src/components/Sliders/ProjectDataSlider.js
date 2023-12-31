import React from 'react';
import PropTypes from 'prop-types';

import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { Button } from 'reactstrap';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Constants
import { timeDiff } from '../../commons/constants';

class ProjectDataSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            b_booking_project: '',
            b_project_opened: null,
            b_project_inventory_due: null,
            b_project_wh_unpack: null,
            b_project_dd_receive_date: null,
            b_project_due_date: null,
            errorMessage: '',
        };

        moment.tz.setDefault('Australia/Sydney');
        this.tzOffset = new Date().getTimezoneOffset() === 0 ? 0 : -1 * new Date().getTimezoneOffset() / 60;
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleDateSlider: PropTypes.func.isRequired,
        booking: PropTypes.object.isRequired,
        OnUpdate: PropTypes.func.isRequired,
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const b_booking_project = nextProps.booking.b_booking_project;
        const b_project_opened = nextProps.booking.b_project_opened;
        const b_project_inventory_due = nextProps.booking.b_project_inventory_due;
        const b_project_wh_unpack = nextProps.booking.b_project_wh_unpack;
        const b_project_dd_receive_date = nextProps.booking.b_project_dd_receive_date;
        const b_project_due_date = nextProps.booking.b_project_due_date;
        this.setState({b_booking_project, b_project_opened, b_project_inventory_due, b_project_wh_unpack, b_project_dd_receive_date, b_project_due_date});
    }

    onClickSave(e) {
        e.preventDefault();
        const { booking } = this.props;
        const { b_booking_project, b_project_opened , b_project_inventory_due, b_project_wh_unpack, b_project_dd_receive_date, b_project_due_date } = this.state;

        booking['b_booking_project'] = b_booking_project;
        booking['b_project_opened'] = b_project_opened;
        booking['b_project_inventory_due'] = b_project_inventory_due;
        booking['b_project_wh_unpack'] = b_project_wh_unpack;
        booking['b_project_dd_receive_date'] = b_project_dd_receive_date;
        booking['b_project_due_date'] = b_project_due_date;

        if (b_project_due_date && !booking['fp_store_scheduled_date']) {
            booking['de_Deliver_From_Date'] = b_project_due_date;
            booking['de_Deliver_By_Date'] = b_project_due_date;
        }

        this.props.OnUpdate(booking);
        this.props.toggleDateSlider();
    }

    onInputChange(event) {
        this.setState({b_booking_project: event.target.value, errorMessage: ''});
    }

    onChangeDate(date, fieldName) {
        let conveted_date = moment(date).add(this.tzOffset, 'h');   // Current -> UTC
        conveted_date = conveted_date.add(timeDiff, 'h');                // UTC -> Sydney

        if (fieldName === 'b_project_opened') {
            this.setState({b_project_opened: conveted_date});
        } else if (fieldName === 'b_project_inventory_due') {
            this.setState({b_project_inventory_due: conveted_date});
        } else if (fieldName === 'b_project_wh_unpack') {
            this.setState({b_project_wh_unpack: conveted_date});
        } else if (fieldName === 'b_project_dd_receive_date') {
            this.setState({b_project_dd_receive_date: conveted_date});
        } else if (fieldName === 'b_project_due_date') {
            this.setState({b_project_due_date: moment(conveted_date).format('YYYY-MM-DD')});
        }
    }

    render() {
        const { isOpen } = this.props;
        const { errorMessage, b_booking_project, b_project_opened , b_project_inventory_due, b_project_wh_unpack, b_project_dd_receive_date, b_project_due_date } = this.state;

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
                            <form onSubmit={(e) => this.onClickSave(e)}>

                                <label>
                                    <p>Vehicle Loaded</p>
                                    <textarea
                                        name="b_booking_project"
                                        value={b_booking_project ? b_booking_project : ''}
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label>
                                <label>
                                    <p>Project Opened</p>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeDate(date, 'b_project_opened')}
                                        value={b_project_opened ? new Date(moment(b_project_opened).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'})) : null}
                                        format={'dd/MM/yyyy HH:mm'}
                                    />
                                </label>
                                <label>
                                    <p>Project Inventory Due</p>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeDate(date, 'b_project_inventory_due')}
                                        value={b_project_inventory_due ? new Date(moment(b_project_inventory_due).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'})) : null}
                                        format={'dd/MM/yyyy HH:mm'}
                                    />
                                </label>
                                <label>
                                    <p>Project Wh Pack</p>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeDate(date, 'b_project_wh_unpack')}
                                        value={b_project_wh_unpack ? new Date(moment(b_project_wh_unpack).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'})) : null}
                                        format={'dd/MM/yyyy HH:mm'}
                                    />
                                </label>
                                <label>
                                    <p>Project DD Receive Date</p>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeDate(date, 'b_project_dd_receive_date')}
                                        value={b_project_dd_receive_date ? new Date(moment(b_project_dd_receive_date).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'})) : null}
                                        format={'dd/MM/yyyy HH:mm'}
                                    />
                                </label>
                                <label>
                                    <p>Vehicle Departure Date</p>
                                    <DatePicker
                                        selected={b_project_due_date ? new Date(b_project_due_date) : null}
                                        onChange={(date) => this.onChangeDate(date, 'b_project_due_date')}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </label>

                                {
                                    isEmpty(errorMessage) ?
                                        null
                                        :
                                        <label>
                                            <p className='red'>{errorMessage}</p>
                                        </label>
                                }
                                <Button
                                    color="primary"
                                    type="submit"
                                >
                                Save
                                </Button>
                                <Button color="danger" onClick={() => this.props.toggleDateSlider()}>
                                    Cancel
                                </Button>
                            </form>
                        </div>
                    }
                </div>
            </SlidingPane>
        );
    }
}

export default ProjectDataSlider;
