import React, {Component} from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class XLSModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: '', 
            endDate: '',
            emailAddr: '',
            vx_freight_provider: '',
            report_type: '',
            errorMessage: '',
            showFieldName: false,
        };
    }

    static propTypes = {
        isShowXLSModal: PropTypes.bool,
        toggleShowXLSModal: PropTypes.func,
        generateXLS: PropTypes.func.isRequired,
        allFPs: PropTypes.array.isRequired,
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
            if (_.isNull(date)) {
                startDate = moment().tz('Australia/Sydney').toDate();
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
            if (_.isNull(date)) {
                endDate = moment().tz('Australia/Sydney').toDate();
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
            if (this.validateEmail(e.target.value)) {
                let errorMessage = '';

                if (this.state.vx_freight_provider === '') {
                    errorMessage = 'Please select Freight Provider.';
                } else if (this.state.report_type === '') {
                    errorMessage = 'Please select Report Type.';
                }

                this.setState({emailAddr: e.target.value, errorMessage});
            } else {
                this.setState({emailAddr: e.target.value, errorMessage: 'Please input correct email address.'});
            }
        } else if (type === 'fp') {
            this.setState({vx_freight_provider: e.target.value, errorMessage: ''});
        } else if (type === 'report_type') {
            this.setState({report_type: e.target.value, errorMessage: ''});
        } else if (type === 'showFieldName') {
            this.setState({showFieldName: e.target.checked, errorMessage: ''});
        }
    }

    validateEmail(email) {
        let lastAtPos = email.lastIndexOf('@');
        let lastDotPos = email.lastIndexOf('.');
        let formIsValid = true;

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
            formIsValid = false;
        }

        return formIsValid;
    }

    onClickBuildAndSend() {
        const {startDate, endDate, emailAddr, vx_freight_provider, report_type, showFieldName} = this.state;
        this.props.generateXLS(moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'), emailAddr, vx_freight_provider, report_type, showFieldName);
        this.setState({startDate: '', endDate: '', emailAddr: '', vx_freight_provider: '', showFieldName: false, report_type: ''});
        this.props.toggleShowXLSModal();
    }

    render() {
        const {isShowXLSModal, allFPs} = this.props;
        const {startDate, endDate, emailAddr, errorMessage, vx_freight_provider, report_type, showFieldName} = this.state;
        let buttonStatus = false;

        if (this.validateEmail(emailAddr) && vx_freight_provider !== '' && report_type !== '') {
            buttonStatus = true;
        }

        const fpList = allFPs.map((fp, index) => {
            return (<option key={index} value={fp.fp_company_name}>{fp.fp_company_name}</option>);
        });

        return (
            <ReactstrapModal isOpen={isShowXLSModal} toggle={() => this.props.toggleShowXLSModal()} className="xls-modal">
                <ModalHeader toggle={() => this.props.toggleShowXLSModal()}>XLS Download</ModalHeader>
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
                            <option value="whse">FP/Whse Report</option>
                            <option value="all">All</option>
                        </select>
                    </label>
                    <label>
                        <p>Freight Provider: </p>
                        <select
                            required 
                            name="vx_freight_provider" 
                            onChange={(e) => this.onInputChange(e, 'fp')}
                            value = {vx_freight_provider} >
                            <option value="" selected disabled hidden>Select a FP</option>
                            <option value="All">All</option>
                            {fpList}
                        </select>
                    </label>
                    <label>
                        <p>Start Date: </p>
                        <DatePicker
                            selected={startDate}
                            onChange={(e) => this.onDateChange(e, 'startDate')}
                            dateFormat="dd MMM yyyy"
                        />
                    </label>
                    <label>
                        <p>End Date: </p>
                        <DatePicker
                            selected={endDate}
                            onChange={(e) => this.onDateChange(e, 'endDate')}
                            dateFormat="dd MMM yyyy"
                        />
                    </label>
                    <label>
                        <p>Email address: </p>
                        <input type="text" placeholder="Email to send xls" name="emailAddr" value={emailAddr} onChange={(e) => this.onInputChange(e, 'email')} />
                    </label>
                    <label>
                        <p>Show Field Names: </p>
                        <input type="checkbox" name="showFieldName" className="checkbox" value={showFieldName} onChange={(e) => this.onInputChange(e, 'showFieldName')} />
                    </label>
                    <p className="red">{errorMessage}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" disabled={!buttonStatus} onClick={() => this.onClickBuildAndSend()}>Build & Send</Button>
                    <Button color="secondary" onClick={() => this.props.toggleShowXLSModal()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default XLSModal;
