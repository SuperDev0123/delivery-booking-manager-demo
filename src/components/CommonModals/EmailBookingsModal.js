import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { validateEmail } from '../../commons/validations';

class EmailBookingsModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            emailAddr: '',
            errorMessage: '',
        };
    }

    static propTypes = {
        isShow: PropTypes.bool,
        toggleShow: PropTypes.func,
        sendEmailBookings: PropTypes.func.isRequired,
        selectedBookingIds: PropTypes.array.isRequired,
    };


    static defaultProps = {
        isShow: false,
    };

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
        }
    }

    onClickOk() {
        this.props.sendEmailBookings(this.state.emailAddr, this.props.selectedBookingIds);
        this.props.toggleShow();
    }

    render() {
        const {isShow, selectedBookingIds} = this.props;
        const {emailAddr, errorMessage} = this.state;
        let buttonStatus = false;

        if (validateEmail(emailAddr) && selectedBookingIds.length > 0) {
            buttonStatus = true;
        }

        return (
            <ReactstrapModal isOpen={isShow} toggle={() => this.props.toggleShow()} className="ebi-modal xls-modal">
                <ModalHeader toggle={() => this.props.toggleShow()}>Email Bookings info</ModalHeader>
                <ModalBody>
                    <label>
                        <p>Email address: </p>
                        <input type="text" placeholder="Email to send xls" name="emailAddr" value={emailAddr} onChange={(e) => this.onInputChange(e, 'email')} />
                    </label>
                    <p className="red">{errorMessage}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary left" onClick={() => this.props.toggleShow()}>Cancel</Button>
                    <Button color="primary" disabled={!buttonStatus} onClick={() => this.onClickOk()}>Send Email</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default EmailBookingsModal;
