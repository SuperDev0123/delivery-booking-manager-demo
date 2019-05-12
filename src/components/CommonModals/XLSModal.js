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
            errorMessage: '',
        };
    }

    static propTypes = {
        isShowXLSModal: PropTypes.bool,
        toggleShowXLSModal: PropTypes.func,
        generateXLS: PropTypes.func.isRequired,
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
                }

                this.setState({emailAddr: e.target.value, errorMessage});
            } else {
                this.setState({emailAddr: e.target.value, errorMessage: 'Please input correct email address.'});
            }
        } else if (type === 'fp') {
            let errorMessage = '';

            if (!this.validateEmail(this.state.emailAddr) && this.state.emailAddr.length > 0) {
                errorMessage = 'Please input correct email address.';
            }

            this.setState({vx_freight_provider: e.target.value, errorMessage});
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
        const {startDate, endDate, emailAddr, vx_freight_provider} = this.state;
        this.props.generateXLS(startDate, endDate, emailAddr, vx_freight_provider);
        this.props.toggleShowXLSModal();
    }

    render() {
        const {isShowXLSModal} = this.props;
        const {startDate, endDate, emailAddr, errorMessage, vx_freight_provider} = this.state;
        let buttonStatus = false;

        if (this.validateEmail(emailAddr) && vx_freight_provider !== '') {
            buttonStatus = true;
        }

        return (
            <ReactstrapModal isOpen={isShowXLSModal} toggle={() => this.props.toggleShowXLSModal()} className="xls-modal">
                <ModalHeader toggle={() => this.props.toggleShowXLSModal()}>XLS Download</ModalHeader>
                <ModalBody>
                    <label>
                        <p>Freight Provider: </p>
                        <select
                            required 
                            name="vx_freight_provider" 
                            onChange={(e) => this.onInputChange(e, 'fp')}
                            value = {vx_freight_provider} >
                            <option value="" selected disabled hidden>Select a FP</option>
                            <option value="allied">Allied</option>
                            <option value="cope">Cope</option>
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
