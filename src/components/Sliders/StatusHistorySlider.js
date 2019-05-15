import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import moment from 'moment';
import { Button } from 'reactstrap';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import DateTimePicker from 'react-datetime-picker';
// import LoadingOverlay from 'react-loading-overlay';

class StatusHistorySlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 0, // 0: List, 1: Form
            formInputs: {
                status_last: '',
                dme_status_detail: '',
                dme_status_action: '',
            },
            event_time_stamp: new Date(),
            errorMessage: '',
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleStatusHistorySlider: PropTypes.func.isRequired,
        statusHistories: PropTypes.array.isRequired,
        booking: PropTypes.object.isRequired,
        allBookingStatus: PropTypes.array.isRequired,
        username: PropTypes.string.isRequired,
        OnCreateStatusHistory: PropTypes.func.isRequired,
        statusDetails: PropTypes.array.isRequired,
        statusActions: PropTypes.array.isRequired,
    };

    onClickPlus() {
        const {booking} = this.props;

        if (booking.z_lock_status) {
            alert('This booking is locked, so `update status` is not available.');
        } else {
            this.setState({viewMode: 1});
        }
    }

    onClickSave() {
        const {booking} = this.props;
        let statusHistory = _.clone(this.state.formInputs);

        if (statusHistory['status_last'] === '') {
            this.setState({errorMessage: 'Please select a status'});
        } else if (statusHistory['dme_status_action'] === '') {
            this.setState({errorMessage: 'Please select a status action'});
        } else if (statusHistory['dme_status_detail'] === '') {
            this.setState({errorMessage: 'Please select a status detail'});
        } else {
            statusHistory['notes'] = booking.b_status + ' ---> ' + statusHistory['status_last'];
            statusHistory['fk_booking_id'] = booking.pk_booking_id;
            statusHistory['event_time_stamp'] = moment(this.state.event_time_stamp).format('YYYY-MM-DD hh:mm:ss');
            this.props.OnCreateStatusHistory(statusHistory);
            this.setState({viewMode: 0, formInputs: {
                status_last: '',
                dme_status_detail: '',
                dme_status_action: '',
            }});
        }
    }

    onClickCancel() {
        this.setState({viewMode: 0});
    }

    onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let formInputs = this.state.formInputs;
        formInputs[name] = value;
        this.setState({formInputs});
    }

    onChangeDate(date, fieldName) {
        if (fieldName === 'event_time_stamp') {
            this.setState({event_time_stamp: date});
        }
    }

    render() {
        const { isOpen, statusHistories, allBookingStatus, username, statusActions, statusDetails } = this.props;
        const { viewMode, formInputs, event_time_stamp, errorMessage } = this.state;

        const statusHistoryItems = statusHistories.map((statusHistory, index) => {
            return (
                <div className="item" id={index} key={index}>
                    <small><b>{statusHistory.status_last}</b>{statusHistory.notes_type}</small><br/>
                    <p className="note">{statusHistory.notes}</p>
                    <p className="text">{statusHistory.dme_notes}</p>
                    <small> Status Detail: {statusHistory.dme_status_detail} </small><br/>
                    <small> Status Action: {statusHistory.dme_status_action} </small><br/>
                    <small> Linked Reference: {statusHistory.dme_status_linked_reference_from_fp} </small><br/>
                    <small> Event Time: {statusHistory.event_time_stamp ? moment(statusHistory.event_time_stamp).format('DD/MM/YYYY hh:mm:ss') : ''} </small><br/>
                    <small> Create Time: {statusHistory.z_createdTimeStamp ? moment(statusHistory.z_createdTimeStamp).format('DD/MM/YYYY hh:mm:ss') : ''} </small>
                </div>
            );
        });

        const statusOptions = allBookingStatus.map((bookingStatus, key) => {
            return (<option key={key} value={bookingStatus.dme_delivery_status}>{bookingStatus.dme_delivery_status}</option>);
        });

        const statusActionOptions = statusActions.map((statusAction, key) => {
            return (<option key={key} value={statusAction.dme_status_action}>{statusAction.dme_status_action}</option>);
        });

        const statusDetailOptions = statusDetails.map((statusDetail, key) => {
            return (<option key={key} value={statusDetail.dme_status_detail}>{statusDetail.dme_status_detail}</option>);
        });

        return (
            <SlidingPane
                className='sh-slider'
                overlayClassName='sh-slider-overlay'
                isOpen={isOpen}
                title='Status History Slider'
                subtitle={viewMode === 0 ? 'List View' : 'Form View'}
                onRequestClose={this.props.toggleStatusHistorySlider}>
                <div className="slider-content">
                    {
                        viewMode === 0 ?
                            <div className="list-view">
                                {
                                    username === 'dme' ?
                                        <Button color="primary" onClick={() => this.onClickPlus()}>
                                            +
                                        </Button>
                                        :
                                        null
                                }
                                <div className="list">
                                    {statusHistoryItems}
                                </div>
                            </div>
                            :
                            <div className="form-view">
                                <label>
                                    <p>Status</p>
                                    <select
                                        name="status_last"
                                        onChange={(e) => this.onInputChange(e)}
                                        value = {formInputs['status_last']}
                                    >
                                        <option value="" selected disabled hidden>Select a status</option>
                                        {statusOptions}
                                    </select>
                                </label>
                                <label>
                                    <p>DME note</p>
                                    <textarea
                                        name="dme_notes"
                                        value={formInputs['dme_notes']} 
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label>
                                <label>
                                    <p>Event time</p>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeDate(date, 'event_time_stamp')}
                                        value={event_time_stamp}
                                    />
                                </label>
                                <label>
                                    <p>Status detail</p>
                                    <select
                                        name="dme_status_detail"
                                        onChange={(e) => this.onInputChange(e)}
                                        value = {formInputs['dme_status_detail']}
                                    >
                                        <option value="" selected disabled hidden>Select a status detail</option>
                                        {statusDetailOptions}
                                    </select>
                                </label>
                                <label>
                                    <p>Status Action</p>
                                    <select
                                        name="dme_status_action"
                                        onChange={(e) => this.onInputChange(e)}
                                        value = {formInputs['dme_status_action']}
                                    >
                                        <option value="" selected disabled hidden>Select a status action</option>
                                        {statusActionOptions}
                                    </select>
                                </label>
                                <label>
                                    <p>Linked reference</p>
                                    <input
                                        name="dme_status_linked_reference_from_fp"
                                        value={formInputs['dme_status_linked_reference_from_fp']} 
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label>
                                {
                                    (errorMessage === '') ?
                                        <label></label>
                                        :
                                        <label>
                                            <p className='red'>{errorMessage}</p>
                                        </label>
                                }
                                <Button color="primary" onClick={() => this.onClickSave()}>
                                    Save
                                </Button>
                                <Button color="primary" onClick={() => this.onClickCancel()}>
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
