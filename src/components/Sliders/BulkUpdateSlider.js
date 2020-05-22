import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';
import moment from 'moment-timezone';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

class BulkUpdateSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedField: null,
            selectedValue: null,
            optionalValue: null,
            errorMsg: null,
        };

        moment.tz.setDefault('Australia/Sydney');
        this.tzOffset = new Date().getTimezoneOffset() === 0 ? 0 : -1 * new Date().getTimezoneOffset() / 60;
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        allBookingStatus: PropTypes.array.isRequired,
        selectedBookingIds: PropTypes.array.isRequired,
        onUpdate: PropTypes.func.isRequired,
    };

    onClickCancel() {
        this.setState({selectedField: null, selectedValue: null});
        this.props.toggleSlider();
    }

    onClickUpdateBtn() {
        const {selectedValue, selectedField, optionalValue} = this.state;
        const {selectedBookingIds} = this.props;

        if (selectedField === 'status' && selectedValue === 'In Transit' && !optionalValue) {
            this.setState({errorMsg: 'Event Date Time is required!'});
        } else {
            this.props.onUpdate(selectedField, selectedValue, selectedBookingIds, optionalValue);
            this.setState({selectedValue: null, selectedField: null, optionalValue: null, errorMsg: null});
        }
    }

    onSelected(e, src) {
        if (src === 'value') {
            this.setState({selectedValue: e.target.value, errorMsg: null});
        } else if (src === 'field') {
            this.setState({selectedField: e.target.value, selectedValue: null, errorMsg: null});
        }
    }

    onHandleInput(e) {
        this.setState({selectedValue: e.target.value, errorMsg: null});
    }

    onChangeDate(date, valueType) {
        if (date) {
            if (valueType === 'selectedValue') {
                this.setState({selectedValue: moment(date).format('YYYY-MM-DD')});
            } else if (valueType === 'optionalValue') {
                this.setState({optionalValue: moment(date).format('YYYY-MM-DD')});
            }

            this.setState({errorMsg: null});
        }
    }

    onChangeDateTime(dateTime, valueType=null) {
        let conveted_date = moment(dateTime).tz('Etc/UTC');
        conveted_date = conveted_date.add(this.tzOffset, 'h');
        conveted_date = moment(conveted_date).tz('Australia/Sydney');

        if (dateTime) {
            if (valueType === 'optionalValue') {
                this.setState({optionalValue: moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ')});
            } else {
                this.setState({selectedValue: moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ')});
            }

            this.setState({errorMsg: null});
        }
    }

    render() {
        const { isOpen, allBookingStatus } = this.props;
        const { selectedField, selectedValue, optionalValue, errorMsg } = this.state;
        const bookingStatusList = allBookingStatus.map((bookingStatus, index) => {
            return (<option key={index} value={bookingStatus.dme_delivery_status}>{bookingStatus.dme_delivery_status}</option>);
        });

        return (
            <SlidingPane
                className='bbu-slider'
                overlayClassName='bbu-slider-overlay'
                isOpen={isOpen}
                title='Bulk Booking Update Slider'
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
                    <label className='right-10px'>Field:
                        <select
                            required
                            onChange={(e) => this.onSelected(e, 'field')} 
                        >
                            <option value="" selected disabled hidden>Select a field</option>
                            <option value="flag">Flag</option>
                            <option value="status">Booking status</option>
                            <option value="b_client_name" disabled>Client</option>
                            <option value="b_client_name_sub">Sub Client</option>
                            <option value="dme_status_detail">Status Detail</option>
                            <option value="dme_status_action">Status Action</option>
                            <option value="dme_status_history_notes">Status History Note</option>
                            <option value="inv_billing_status_note">Invoice Billing Status Note</option>

                            <option value="puCompany">Pickup Entity</option>
                            <option value="pu_Address_Street_1">Pickup Street 1</option>
                            <option value="pu_Address_street_2">Pickup Street 2</option>
                            <option value="pu_Address_Suburb" disabled>Pickup Suburb</option>
                            <option value="pu_Address_State" disabled>Pickup State</option>
                            <option value="pu_Address_PostalCode" disabled>Pickup PostalCode</option>
                            <option value="pu_Address_Country">Pickup Country</option>
                            <option value="pu_Contact_F_L_Name">Pickup Contact</option>
                            <option value="pu_Phone_Main">Pickup Tel</option>
                            <option value="pu_Phone_Mobile">Pickup Mobile</option>
                            <option value="pu_Email">Pickup Email</option>
                            <option value="puPickUpAvailFrom_Date">Pickup From</option>
                            <option value="pu_PickUp_By_Date_DME">Pickup By</option>
                            <option value="pu_pickup_instructions_address">Pickup Instructions</option>

                            <option value="deToCompanyName">Deliver to Entity</option>
                            <option value="de_To_Address_Street_1">Deliver to Street 1</option>
                            <option value="de_To_Address_Street_2">Deliver to Street 2</option>
                            <option value="de_To_Address_Suburb" disabled>Deliver to Suburb</option>
                            <option value="de_To_Address_State" disabled>Deliver to State</option>
                            <option value="de_To_Address_PostalCode" disabled>Deliver to PostalCode</option>
                            <option value="de_To_Address_Country">Deliver to Country</option>
                            <option value="de_to_Contact_F_LName">Deliver to Contact</option>
                            <option value="de_to_Phone_Main">Deliver to Tel</option>
                            <option value="de_to_Phone_Mobile">Deliver to Mobile</option>
                            <option value="de_Email">Deliver to Email</option>
                            <option value="de_Deliver_From_Date">Deliver to From</option>
                            <option value="de_Deliver_By_Date">Deliver to By</option>
                            <option value="de_to_Pick_Up_Instructions_Contact">Deliver to Instructions</option>

                            <option value="b_booking_Priority">Priority</option>
                            <option value="b_booking_Category">Category</option>
                            <option value="v_vehicle_Type">Vehicle Type</option>
                            <option value="inv_dme_invoice_no">DME Invoice No</option>
                            <option value="b_client_sales_inv_num">Your Invoice No</option>

                            <option value="b_booking_project">Project Name</option>
                            <option value="b_project_due_date">Project Due Date</option>
                            <option value="fp_received_date_time">Transport Received</option>
                            <option value="b_given_to_transport_date_time">Given to Transport</option>
                        </select>
                    </label>
                    <br />
                    <div className="value">
                        {
                            selectedField ? <label className="value">Value: </label> : null
                        }
                        {
                            selectedField === 'flag' ?
                                <select onChange={(e) => this.onSelected(e, 'value')}>
                                    <option value="" disabled>-------------     Flags    -------------</option>
                                    <option value="flag_add_on_services">Flag - add on services</option>
                                    <option value="unflag_add_on_services">Unflag - add on services</option>
                                </select>
                                : null
                        }
                        {
                            selectedField === 'status' ?
                                <select onChange={(e) => this.onSelected(e, 'value')}>
                                    <option value="" disabled>-------------     Booking Status    -------------</option>
                                    { bookingStatusList }
                                </select>
                                : null
                        }
                        {
                            selectedField &&
                            (selectedField === 'dme_status_detail' ||
                            selectedField === 'dme_status_action' ||
                            selectedField === 'dme_status_history_notes' ||
                            selectedField === 'inv_billing_status_note' ||
                            selectedField === 'pu_pickup_instructions_address' ||
                            selectedField === 'de_to_Pick_Up_Instructions_Contact' ||
                            selectedField === 'b_booking_Category') ?
                                <textarea 
                                    width="100%"
                                    className=""
                                    rows="5"
                                    cols="70"
                                    value={selectedValue ? selectedValue : ''} 
                                    onChange={(e) => this.onHandleInput(e)}
                                />
                                : null
                        }
                        {
                            selectedField &&
                            (selectedField === 'b_client_name_sub' ||
                            selectedField === 'puCompany' ||
                            selectedField === 'pu_Address_Street_1' ||
                            selectedField === 'pu_Address_street_2' ||
                            selectedField === 'pu_Address_Country' ||
                            selectedField === 'pu_Contact_F_L_Name' ||
                            selectedField === 'pu_Phone_Main' ||
                            selectedField === 'pu_Phone_Mobile' ||
                            selectedField === 'pu_Email' ||
                            selectedField === 'deToCompanyName' ||
                            selectedField === 'de_To_Address_Street_1' ||
                            selectedField === 'de_To_Address_Street_2' ||
                            selectedField === 'de_To_Address_Country' ||
                            selectedField === 'de_to_Contact_F_LName' ||
                            selectedField === 'de_to_Phone_Main' ||
                            selectedField === 'de_to_Phone_Mobile' ||
                            selectedField === 'de_Email' ||
                            selectedField === 'b_booking_Priority' ||
                            selectedField === 'v_vehicle_Type' ||
                            selectedField === 'inv_dme_invoice_no' ||
                            selectedField === 'b_client_sales_inv_num' ||
                            selectedField === 'b_booking_project') ?
                                <input 
                                    type="text"
                                    className=""
                                    value={selectedValue ? selectedValue : ''} 
                                    onChange={(e) => this.onHandleInput(e)}
                                />
                                : null
                        }
                        {
                            selectedField &&
                            (selectedField === 'puPickUpAvailFrom_Date' ||
                            selectedField === 'pu_PickUp_By_Date_DME' ||
                            selectedField === 'de_Deliver_From_Date' ||
                            selectedField === 'de_Deliver_By_Date' ||
                            selectedField === 'b_project_due_date') ?
                                <DatePicker
                                    selected={selectedValue ? new Date(selectedValue) : null}
                                    onChange={(date) => this.onChangeDate(date, 'selectedValue')}
                                    dateFormat="dd/MM/yyyy"
                                />
                                : null
                        }
                        {
                            selectedField &&
                            (selectedField === 'b_given_to_transport_date_time' ||
                            selectedField === 'fp_received_date_time') ?
                                <DateTimePicker
                                    onChange={(date) => this.onChangeDateTime(date, 'selectedValue')}
                                    value={selectedValue ? new Date(moment(selectedValue).toDate().toLocaleString('en-US', {timeZone: 'UTC'})) : null}
                                    format={'dd/MM/yyyy HH:mm'}
                                />
                                : null
                        }
                    </div>
                    <br />
                    <div className="optional">
                        {
                            selectedField === 'status' && selectedValue === 'In Transit' ?
                                <label className="value">Event Date: </label> : null
                        }
                        {
                            selectedField === 'status' && selectedValue === 'In Transit' ?
                                <DateTimePicker
                                    onChange={(date) => this.onChangeDateTime(date, 'optionalValue')}
                                    value={optionalValue ? new Date(moment(optionalValue).toDate().toLocaleString('en-US', {timeZone: 'UTC'})) : null}
                                    format={'dd/MM/yyyy HH:mm'}
                                />
                                : null
                        }
                    </div>
                    <br />
                    {errorMsg ? <p className="red">{errorMsg}<br /></p> : null}
                    <Button
                        color="primary"
                        disabled={!selectedField || !selectedValue ? 'disabled' : ''}
                        onClick={() => this.onClickUpdateBtn()}
                    >
                        Update
                    </Button>
                    <Button color="secondary" onClick={() => this.onClickCancel()}>Cancel</Button>
                </div>
            </SlidingPane>
        );
    }
}

export default BulkUpdateSlider;
