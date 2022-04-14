import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';
import { sortBy } from 'lodash';
import moment from 'moment-timezone';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
// Constants
import { timeDiff } from '../../commons/constants';

class BulkUpdateSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedField: null,
            selectedValue: null,
            optionalValue: null,
            errorMsg: null,
            formInputs: {},
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
        clientname: PropTypes.string,
        fps: PropTypes.array
    };

    onClickCancel() {
        this.setState({selectedField: null, selectedValue: null});
        this.props.toggleSlider();
    }

    onClickUpdateBtn() {
        const {selectedValue, selectedField, optionalValue, formInputs} = this.state;
        const {selectedBookingIds, fps} = this.props;

        if (selectedField === 'status' && !optionalValue) {
            this.setState({errorMsg: 'Event Date Time is required!'});
        } else {
            const value = selectedField === 'fp_scan' ? formInputs: selectedValue;

            if (selectedField === 'fp_scan') {
                const selectedFP = fps.find((fp) => fp.fp_company_name === formInputs['fp']);

                if (selectedFP)
                    value['fp'] = selectedFP.id;
            }

            this.props.onUpdate(selectedField, value, selectedBookingIds, optionalValue);
            this.setState({selectedValue: null, selectedField: null, optionalValue: null, errorMsg: null});
        }
    }

    onSelected(e, src) {
        const {clientname} = this.props;
        const {selectedField} = this.state;
        let errorMsg = null;

        // Jason L
        if (clientname === 'Jason L' &&
            selectedField === 'vx_freight_provider' &&
            (e.target.value === 'JasonL In house' ||
             e.target.value === 'Customer Pickup' ||
             e.target.value === 'Line haul General'
            )
        ) {
            errorMsg = 'Please note that changing the provider with this function will set the selected booking to to DMEM manual bookings.';
        }

        if (src === 'value') {
            this.setState({selectedValue: e.target.value, errorMsg});
        } else if (src === 'field') {
            this.setState({selectedField: e.target.value, selectedValue: null, errorMsg});
        }
    }

    onHandleInput(e) {
        const { formInputs, selectedField } = this.state;

        if (selectedField === 'fp_scan') {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;

            formInputs[name] = value;
            this.setState({formInputs});
        } else {
            this.setState({selectedValue: e.target.value, errorMsg: null});
        }
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
        const { formInputs, selectedField } = this.state;
        let conveted_date = moment(dateTime).add(this.tzOffset, 'h');   // Current -> UTC
        conveted_date = conveted_date.add(timeDiff, 'h');               // UTC -> Sydney

        if (selectedField === 'fp_scan') {
            formInputs['event_timestamp'] = conveted_date;
            this.setState({formInputs, selectedValue: 'fake-value'});
        } else {
            if (dateTime) {
                if (valueType === 'optionalValue') {
                    this.setState({optionalValue: moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ')});
                } else {
                    this.setState({selectedValue: moment(conveted_date).format('YYYY-MM-DD HH:mm:ssZ')});
                }
            }
        }

        this.setState({errorMsg: null});
    }

    render() {
        const { isOpen, allBookingStatus, clientname, fps } = this.props;
        const { selectedField, selectedValue, optionalValue, errorMsg, formInputs } = this.state;
        const bookingStatusList = sortBy(allBookingStatus, ['sort_order']).map((bookingStatus, key) => {
            if (bookingStatus.dme_delivery_status === 'On Hold') {
                return [
                    (<option key={key + 10} value="" disabled>*******************************************************************************</option>),
                    (<option key={key} value={bookingStatus.dme_delivery_status}>{bookingStatus.dme_delivery_status}</option>)
                ];
            } else {
                return (<option key={key} value={bookingStatus.dme_delivery_status}>{bookingStatus.dme_delivery_status}</option>);
            }
        });

        const fpOptions = fps.map((fp, index) => {
            if (clientname === 'Jason L') { // Jason L
                if (
                    fp.fp_company_name === 'Allied' ||
                    fp.fp_company_name === 'TNT' ||
                    fp.fp_company_name === 'Hunter' ||
                    fp.fp_company_name === 'Century' ||
                    fp.fp_company_name === 'In House Fleet' ||
                    fp.fp_company_name === 'Customer Collect' ||
                    fp.fp_company_name === 'Deliver-ME Direct'
                )
                    return (<option key={index} value={fp.fp_company_name}>{fp.fp_company_name}</option>);
            } else if (clientname === 'Bathroom Sales Direct') { // Bathroom Sales Direct
                if (
                    fp.fp_company_name === 'Allied' ||
                    fp.fp_company_name === 'TNT' ||
                    fp.fp_company_name === 'Hunter' ||
                    fp.fp_company_name === 'In House Fleet' ||
                    fp.fp_company_name === 'Customer Collect' ||
                    fp.fp_company_name === 'Deliver-ME Direct'
                )
                    return (<option key={index} value={fp.fp_company_name}>{fp.fp_company_name}</option>);
            } else {
                return (<option key={index} value={fp.fp_company_name}>{fp.fp_company_name}</option>);
            }
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
                            <option value="" selected disabled hidden>--- Select a field ---</option>
                            {clientname === 'dme' && <option value="flag">Flag</option>}
                            {(clientname === 'dme' || clientname === 'Jason L' || clientname === 'Bathroom Sales Direct') &&
                                <option value="puPickUpAvailFrom_Date">Pickup From Date</option>
                            }
                            {(clientname === 'dme' || clientname === 'Jason L' || clientname === 'Bathroom Sales Direct') &&
                                <option value="vx_freight_provider">Freight Provider</option>
                            }
                            {clientname === 'dme' && <option value="b_client_name" disabled>Client</option>}
                            {clientname === 'dme' && <option value="b_client_name_sub">Sub Client</option>}
                            {clientname === 'dme' && <option value="status">Status</option>}
                            {clientname === 'dme' && <option value="dme_status_detail">Status Detail</option>}
                            {clientname === 'dme' && <option value="dme_status_action">Status Action</option>}
                            {clientname === 'dme' && <option value="b_booking_Notes">Status History Note</option>}
                            {clientname === 'dme' && <option value="inv_billing_status_note">Invoice Billing Status Note</option>}

                            {clientname === 'dme' && <option value="puCompany">Pickup Entity</option>}
                            {clientname === 'dme' && <option value="pu_Address_Street_1">Pickup Street 1</option>}
                            {clientname === 'dme' && <option value="pu_Address_street_2">Pickup Street 2</option>}
                            {clientname === 'dme' && <option value="pu_Address_Suburb" disabled>Pickup Suburb</option>}
                            {clientname === 'dme' && <option value="pu_Address_State" disabled>Pickup State</option>}
                            {clientname === 'dme' && <option value="pu_Address_PostalCode" disabled>Pickup PostalCode</option>}
                            {clientname === 'dme' && <option value="pu_Address_Country">Pickup Country</option>}
                            {clientname === 'dme' && <option value="pu_Contact_F_L_Name">Pickup Contact</option>}
                            {clientname === 'dme' && <option value="pu_Phone_Main">Pickup Tel</option>}
                            {clientname === 'dme' && <option value="pu_Phone_Mobile">Pickup Mobile</option>}
                            {clientname === 'dme' && <option value="pu_Email">Pickup Email</option>}
                            {clientname === 'dme' && <option value="pu_PickUp_By_Date_DME">Pickup By</option>}
                            {clientname === 'dme' && <option value="pu_pickup_instructions_address">Pickup Instructions</option>}

                            {clientname === 'dme' && <option value="deToCompanyName">Deliver to Entity</option>}
                            {clientname === 'dme' && <option value="de_To_Address_Street_1">Deliver to Street 1</option>}
                            {clientname === 'dme' && <option value="de_To_Address_Street_2">Deliver to Street 2</option>}
                            {clientname === 'dme' && <option value="de_To_Address_Suburb" disabled>Deliver to Suburb</option>}
                            {clientname === 'dme' && <option value="de_To_Address_State" disabled>Deliver to State</option>}
                            {clientname === 'dme' && <option value="de_To_Address_PostalCode" disabled>Deliver to PostalCode</option>}
                            {clientname === 'dme' && <option value="de_To_Address_Country">Deliver to Country</option>}
                            {clientname === 'dme' && <option value="de_to_Contact_F_LName">Deliver to Contact</option>}
                            {clientname === 'dme' && <option value="de_to_Phone_Main">Deliver to Tel</option>}
                            {clientname === 'dme' && <option value="de_to_Phone_Mobile">Deliver to Mobile</option>}
                            {clientname === 'dme' && <option value="de_Email">Deliver to Email</option>}
                            {clientname === 'dme' && <option value="de_Deliver_From_Date">Deliver to From</option>}
                            {clientname === 'dme' && <option value="de_Deliver_By_Date">Deliver to By</option>}
                            {clientname === 'dme' && <option value="de_to_Pick_Up_Instructions_Contact">Deliver to Instructions</option>}

                            {clientname === 'dme' && <option value="b_booking_Priority">Priority</option>}
                            {clientname === 'dme' && <option value="b_booking_Category">Category</option>}
                            {clientname === 'dme' && <option value="v_vehicle_Type">Vehicle Type</option>}
                            {clientname === 'dme' && <option value="inv_dme_invoice_no">DME Invoice No</option>}
                            {clientname === 'dme' && <option value="b_client_sales_inv_num">Your Invoice No</option>}

                            {clientname === 'dme' && <option value="b_booking_project">Vehicle Loaded</option>}
                            {clientname === 'dme' && <option value="b_project_due_date">Vehicle Departure Date</option>}
                            {clientname === 'dme' && <option value="fp_received_date_time">Transport Received</option>}
                            {clientname === 'dme' && <option value="b_given_to_transport_date_time">Given to Transport</option>}
                            {clientname === 'dme' && <option value="fp_scan">FP Scan</option>}
                        </select>
                    </label>
                    <br />
                    <div className="value">
                        {(selectedField && selectedField !== 'fp_scan') ? <label className="value">Value: </label> : null}
                        {
                            selectedField === 'flag' ?
                                <select onChange={(e) => this.onSelected(e, 'value')}>
                                    <option value="" disabled selected hidden>-------------     Flags    -------------</option>
                                    <option value="flag_add_on_services">Flag - add on services</option>
                                    <option value="unflag_add_on_services">Unflag - add on services</option>
                                </select>
                                : null
                        }
                        {
                            selectedField === 'status' ?
                                <select onChange={(e) => this.onSelected(e, 'value')}>
                                    <option value="" disabled selected hidden>-------------     Booking Status    -------------</option>
                                    { bookingStatusList }
                                </select>
                                : null
                        }
                        {
                            selectedField &&
                            (selectedField === 'dme_status_detail' ||
                            selectedField === 'dme_status_action' ||
                            selectedField === 'b_booking_Notes' ||
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
                                    value={selectedValue ? new Date(moment(selectedValue).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'})) : null}
                                    format={'dd/MM/yyyy HH:mm'}
                                />
                                : null
                        }
                        {selectedField && (selectedField === 'vx_freight_provider') &&
                            <select
                                required
                                onChange={(e) => this.onSelected(e, 'value')} 
                            >
                                <option value="" selected disabled hidden>--- Select a Freight Provider ---</option>
                                {fpOptions}
                            </select>
                        }
                        {selectedField && (selectedField === 'fp_scan') &&
                            <div className="form-view">
                                <h2>{'Create a new FP Scan for selected Bookings'}</h2>
                                <form>
                                    <label>
                                        <span className="text-left">Status*</span>
                                        <input
                                            className="form-control"
                                            required
                                            name="status"
                                            value={formInputs['status']}
                                            onChange={(e) => this.onHandleInput(e)}
                                        />
                                    </label><br />
                                    <label>
                                        <span className="text-left">Description*</span>
                                        <input
                                            className="form-control"
                                            required
                                            name="desc"
                                            value={formInputs['desc']}
                                            onChange={(e) => this.onHandleInput(e)}
                                        />
                                    </label><br />
                                    <label>
                                        <span className="text-left">Select a Freight Provider*</span>
                                        <select 
                                            required
                                            name='fp'
                                            onChange={(e) => this.onHandleInput(e)}
                                            value={formInputs['fp']}
                                        >
                                            <option key={0} value="" disabled selected='selected'>Select a FP</option>
                                            {fpOptions}
                                        </select>
                                    </label><br />
                                    <label>
                                        <span className="text-left">Scan timestamp*</span>
                                        <DateTimePicker
                                            onChange={(date) => this.onChangeDateTime(date, 'event_timestamp')}
                                            value={formInputs['event_timestamp'] ?
                                                new Date(moment(formInputs['event_timestamp']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))
                                                : null}
                                            format={'dd/MM/yyyy HH:mm'}
                                        />
                                    </label>
                                </form>
                            </div>
                        }
                    </div>
                    <br />
                    <div className="optional">
                        {selectedField === 'status' && <label className="value">Event Date: </label>}
                        {selectedField === 'status' &&
                            <DateTimePicker
                                onChange={(date) => this.onChangeDateTime(date, 'optionalValue')}
                                value={optionalValue ? new Date(moment(optionalValue).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'})) : null}
                                format={'dd/MM/yyyy HH:mm'}
                            />
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
