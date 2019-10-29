import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import moment from 'moment-timezone';
import { Button } from 'reactstrap';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import DateTimePicker from 'react-datetime-picker';
// import LoadingOverlay from 'react-loading-overlay';

class StatusHistorySlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formInputs: {
                b_booking_project: ''
            },
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
        const { formInputs } = this.state;
        formInputs['b_booking_project'] = nextProps.booking.b_booking_project;

        this.setState({formInputs});

        let b_project_opened = new Date(nextProps.booking.b_project_opened);
        let b_project_inventory_due = new Date(nextProps.booking.b_project_inventory_due);
        let b_project_wh_unpack = new Date(nextProps.booking.b_project_wh_unpack);
        let b_project_dd_receive_date = new Date(nextProps.booking.b_project_dd_receive_date);
        
        this.setState({b_project_opened, b_project_inventory_due, b_project_wh_unpack, b_project_dd_receive_date });
    }

    onClickSave() {
        const { booking } = this.props;
        const { formInputs, b_project_opened , b_project_inventory_due, b_project_wh_unpack, b_project_dd_receive_date} = this.state;

        booking['b_booking_project'] = formInputs['b_booking_project'];
        booking['b_project_opened'] = moment(b_project_opened).format('YYYY-MM-DD hh:mm:ss');
        booking['b_project_inventory_due'] = moment(b_project_inventory_due).format('YYYY-MM-DD hh:mm:ss');
        booking['b_project_wh_unpack'] = moment(b_project_wh_unpack).format('YYYY-MM-DD hh:mm:ss');
        booking['b_project_dd_receive_date'] = moment(b_project_dd_receive_date).format('YYYY-MM-DD hh:mm:ss');

        this.props.OnUpdateBooking(booking);
    }

    onInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        const formInputs = this.state.formInputs;
        formInputs[name] = value;
        this.setState({formInputs, errorMessage: ''});
    }

    onChangeDate(date, fieldName) {
        if (fieldName === 'b_project_opened') {
            this.setState({b_project_opened: date});
        }
        if (fieldName === 'b_project_inventory_due') {
            this.setState({b_project_inventory_due: date});
        }
        if (fieldName === 'b_project_wh_unpack') {
            this.setState({b_project_wh_unpack: date});
        }
        if (fieldName === 'b_project_dd_receive_date') {
            this.setState({b_project_dd_receive_date: date});
        }
    }

    render() {
        const { isOpen } = this.props;
        const { formInputs, errorMessage, b_project_opened , b_project_inventory_due, b_project_wh_unpack, b_project_dd_receive_date} = this.state;

        return (
            <SlidingPane
                className='sh-slider'
                overlayClassName='sh-slider-overlay'
                isOpen={isOpen}
                title='Date Slider'
                onRequestClose={this.props.toggleDateSlider}>
                <div className="slider-content">
                    {
                        <div className="form-view">
                            <label>
                                <h1>Date Details</h1>
                            </label>
                            
                            <label>
                                <p>Project Name</p>
                                <textarea
                                    name="b_booking_project"
                                    value={formInputs['b_booking_project']} 
                                    onChange={(e) => this.onInputChange(e)}
                                />
                            </label>
                            <label>
                                <p>Project Opened</p>
                                <DateTimePicker
                                    onChange={(date) => this.onChangeDate(date, 'b_project_opened')}
                                    value={b_project_opened}
                                />
                            </label>
                            <label>
                                <p>Project Inventory Due</p>
                                <DateTimePicker
                                    onChange={(date) => this.onChangeDate(date, 'b_project_inventory_due')}
                                    value={b_project_inventory_due}
                                />
                            </label>
                            <label>
                                <p>Project Wh Pack</p>
                                <DateTimePicker
                                    onChange={(date) => this.onChangeDate(date, 'b_project_wh_unpack')}
                                    value={b_project_wh_unpack}
                                />
                            </label>
                            <label>
                                <p>Project DD Receive Date</p>
                                <DateTimePicker
                                    onChange={(date) => this.onChangeDate(date, 'b_project_dd_receive_date')}
                                    value={b_project_dd_receive_date}
                                />
                            </label>

                            {
                                _.isEmpty(errorMessage) ?
                                    <label></label>
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
                            <Button color="primary" onClick={() => this.props.toggleDateSlider()}>
                                Cancel
                            </Button>
                        </div>
                    }
                </div>
            </SlidingPane>
        );
    }
}

export default StatusHistorySlider;
