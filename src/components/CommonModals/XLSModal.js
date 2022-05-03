import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {isNull} from 'lodash';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { validateEmail } from '../../commons/validations';

class XLSModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: '', 
            endDate: '',
            emailAddr: '',
            vx_freight_provider: '',
            b_client_name: '',
            report_type: '',
            errorMessage: '',
            showFieldName: false,
            useSelected: false,
        };

        moment.tz.setDefault('Australia/Sydney');
    }

    static propTypes = {
        isShowXLSModal: PropTypes.bool,
        toggleXLSModal: PropTypes.func,
        generateXLS: PropTypes.func.isRequired,
        selectedBookingIds: PropTypes.array.isRequired,
        allFPs: PropTypes.array.isRequired,
        allClients: PropTypes.array.isRequired,
        clientname: PropTypes.string,
    };

    static defaultProps = {
        isShowXLSModal: false,
    };

    componentDidMount() {
        let startDate = '';
        startDate = moment().tz('Australia/Sydney').toDate();

        this.setState({ 
            startDate: moment(startDate).toDate(),
            endDate: moment(startDate).toDate(),
            errorMessage: '',
        });
    }

    onDateChange(date, dateType) {
        let startDate = '';
        let endDate = '';

        if (dateType === 'startDate') {
            if (isNull(date)) {
                startDate = moment().toDate();
            } else {
                startDate = moment(date).toDate();
            }

            if (moment(startDate) > moment(this.state.endDate)) {
                endDate = startDate;
                this.setState({startDate, endDate});    
            } else {
                this.setState({startDate});
            }
        } else if (dateType === 'endDate') {
            if (isNull(date)) {
                endDate = moment().toDate();
            } else {
                endDate = moment(date).toDate();
            }

            if (moment(endDate) < moment(this.state.startDate)) {
                startDate = endDate;
                this.setState({startDate, endDate});    
            } else {
                this.setState({endDate});
            }
        }
    }

    onInputChange(e, type) {
        if (type === 'email') {
            if (validateEmail(e.target.value)) {
                let errorMessage = '';

                if (this.state.vx_freight_provider === '' &&
                    this.state.b_client_name === ''
                ) {
                    errorMessage = 'Please select Client or Freight Provider.';
                } else if (this.state.report_type === '') {
                    errorMessage = 'Please select Report Type.';
                }

                this.setState({emailAddr: e.target.value, errorMessage});
            } else {
                this.setState({emailAddr: e.target.value, errorMessage: 'Please input correct email address.'});
            }
        } else if (type === 'vx_freight_provider') {
            this.setState({vx_freight_provider: e.target.value, errorMessage: ''});

            if (this.state.b_client_name == '') {
                this.setState({b_client_name: 'All'});
            }
        } else if (type === 'b_client_name') {
            this.setState({b_client_name: e.target.value, errorMessage: ''});

            if (this.state.vx_freight_provider == '') {
                this.setState({vx_freight_provider: 'All'});
            }
        } else if (type === 'report_type') {
            this.setState({report_type: e.target.value, errorMessage: ''});
        } else if (type === 'showFieldName') {
            this.setState({showFieldName: e.target.checked, errorMessage: ''});
        } else if (type === 'useSelected') {
            this.setState({useSelected: e.target.checked, errorMessage: ''});

            if (e.target.checked && this.props.selectedBookingIds.length == 0) {
                this.setState({errorMessage: 'No Bookings are selected!'});
            }
        }
    }

    onClickBuildAndSend() {
        const {startDate, endDate, emailAddr, vx_freight_provider, report_type, showFieldName, useSelected, b_client_name} = this.state;
        this.props.generateXLS(
            moment(startDate).format('YYYY-MM-DD'),
            moment(endDate).format('YYYY-MM-DD'),
            emailAddr,
            vx_freight_provider,
            report_type,
            showFieldName,
            useSelected,
            this.props.selectedBookingIds,
            b_client_name
        );
        this.props.toggleXLSModal();
    }

    render() {
        const {isShowXLSModal, allFPs, allClients, selectedBookingIds, clientname} = this.props;
        const {startDate, endDate, emailAddr, errorMessage, vx_freight_provider, report_type, showFieldName, useSelected, b_client_name} = this.state;
        let buttonStatus = false;

        if (validateEmail(emailAddr)) {
            if (report_type !== '' &&
                (useSelected && selectedBookingIds.length > 0)
            ) {
                buttonStatus = true;
            } else if (
                b_client_name !== '' &&
                report_type !== ''
            ) {
                buttonStatus = true;
            } else if (vx_freight_provider !== '' &&
                report_type !== '' &&
                (!useSelected && startDate && endDate))
            {
                buttonStatus = true;
            }
        }

        const fpList = allFPs.map((fp, index) => {
            return (<option key={index} value={fp.fp_company_name}>{fp.fp_company_name}</option>);
        });
        const clientList = allClients.map((client, index) => {
            return (<option key={index} value={client.pk_id_dme_client}>{client.company_name}</option>);
        });

        return (
            <ReactstrapModal isOpen={isShowXLSModal} toggle={() => this.props.toggleXLSModal()} className="xls-modal">
                <ModalHeader toggle={() => this.props.toggleXLSModal()}>XLS Download</ModalHeader>
                <ModalBody>
                    <label>
                        <p>Report Type: </p>
                        <select
                            required 
                            name="report_type" 
                            onChange={(e) => this.onInputChange(e, 'report_type')}
                            value = {report_type} >
                            <option value="" selected disabled hidden>Select a Report Type</option>
                            <option value="booking">Booking Report</option>
                            <option value="booking_line">Booking Line Report</option>
                            <option value="booking_with_gaps">Booking w/gaps</option>
                            {clientname === 'dme' && <option value="dme_booking_with_gaps">DME Booking with GAPS report</option>}
                            <option value="whse">FP/Whse Report</option>
                            {clientname === 'dme' && <option value="pending_bookings">Pending Bookings report</option>}
                            {clientname === 'dme' && <option value="booked_bookings">Booked Bookings report</option>}
                            {clientname === 'dme' && <option value="picked_up_bookings">Picked up Bookings report</option>}
                            {clientname === 'dme' && <option value="box">Box Bookings report</option>}
                            {clientname === 'dme' && <option value="futile">Futile Bookings report</option>}
                            {clientname === 'dme' && <option value="goods_delivered">Goods Delivered report</option>}
                            {clientname === 'dme' && <option value="goods_sent">Goods Sent report</option>}
                            <option value="all">All</option>
                        </select>
                    </label>
                    {!useSelected &&
                        <label>
                            <p>Client: </p>
                            <select
                                required 
                                name="b_client_name" 
                                onChange={(e) => this.onInputChange(e, 'b_client_name')}
                                value = {b_client_name} >
                                <option value="" selected disabled hidden>Select a Client</option>
                                <option value="All">All</option>
                                {clientList}
                            </select>
                        </label>
                    }
                    {!useSelected &&
                        <label>
                            <p>Freight Provider: </p>
                            <select
                                required 
                                name="vx_freight_provider" 
                                onChange={(e) => this.onInputChange(e, 'vx_freight_provider')}
                                value = {vx_freight_provider} >
                                <option value="" selected disabled hidden>Select a FP</option>
                                <option value="All">All</option>
                                {fpList}
                            </select>
                        </label>
                    }
                    <label>
                        <p>Use selected: </p>
                        <input
                            type="checkbox"
                            name="useSelected"
                            className="checkbox"
                            checked={useSelected}
                            onChange={(e) => this.onInputChange(e, 'useSelected')}
                        />
                    </label>
                    {!useSelected &&
                        <label>
                            <p>Start Date: </p>
                            <DatePicker
                                selected={startDate}
                                onChange={(e) => this.onDateChange(e, 'startDate')}
                                dateFormat="dd MMM yyyy"
                                disabled={useSelected ? 'disabled' : null}
                            />
                        </label>
                    }
                    {!useSelected &&
                        <label>
                            <p>End Date: </p>
                            <DatePicker
                                selected={endDate}
                                onChange={(e) => this.onDateChange(e, 'endDate')}
                                dateFormat="dd MMM yyyy"
                                disabled={useSelected ? 'disabled' : null}
                            />
                        </label>
                    }
                    <label>
                        <p>Email address: </p>
                        <input type="text" placeholder="Email to send xls" name="emailAddr" value={emailAddr} onChange={(e) => this.onInputChange(e, 'email')} />
                    </label>
                    <label>
                        <p>Show Field Names: </p>
                        <input type="checkbox" name="showFieldName" className="checkbox" checked={showFieldName} onChange={(e) => this.onInputChange(e, 'showFieldName')} />
                    </label>
                    <p className="red">{errorMessage}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary left" onClick={() => this.props.toggleXLSModal()}>Cancel</Button>
                    <Button color="primary" disabled={!buttonStatus} onClick={() => this.onClickBuildAndSend()}>Build & Send</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default XLSModal;
