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
            saveMode: 0, // 0: Create, 2: Update
            formInputs: {
                status_last: '',
                dme_status_detail: '',
                dme_status_action: '',
            },
            event_time_stamp: new Date(),
            errorMessage: '',
            selectedStatusHistoryInd: -1,
            isShowStatusDetailInput: false,
            isShowStatusActionInput: false,
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleStatusHistorySlider: PropTypes.func.isRequired,
        statusHistories: PropTypes.array.isRequired,
        booking: PropTypes.object.isRequired,
        allBookingStatus: PropTypes.array.isRequired,
        OnCreateStatusHistory: PropTypes.func.isRequired,
        OnUpdateStatusHistory: PropTypes.func.isRequired,
        statusDetails: PropTypes.array.isRequired,
        statusActions: PropTypes.array.isRequired,
        clientname: PropTypes.string.isRequired,
    };

    onClickPlus() {
        const {booking} = this.props;

        if (booking.z_lock_status) {
            alert('This booking is locked, so `update status` is not available.');
        } else {
            this.setState({viewMode: 1, saveMode: 0});
        }
    }

    onClickSave() {
        const {booking, statusDetails, statusActions} = this.props;
        const {saveMode, selectedStatusHistoryInd, isShowStatusActionInput, isShowStatusDetailInput} = this.state;
        let statusHistory = _.clone(this.state.formInputs);

        if (isShowStatusDetailInput && _.isEmpty(statusHistory['new_dme_status_detail'])) {
            alert('Please input new dme status detail');
        } else if (isShowStatusActionInput && _.isEmpty(statusHistory['new_dme_status_action'])) {
            alert('Please input new dme status action');
        } else {
            let canSubmit = true;

            if (isShowStatusDetailInput || isShowStatusActionInput) {
                if (isShowStatusDetailInput) {
                    for (let i = 0; i < statusDetails.length; i++) {
                        if (statusDetails[i].dme_status_detail === statusHistory['new_dme_status_detail']) {
                            canSubmit = false;
                        }
                    }
                }

                if (isShowStatusActionInput) {
                    for (let i = 0; i < statusActions.length; i++) {
                        if (statusActions[i].dme_status_action === statusHistory['new_dme_status_action']) {
                            canSubmit = false;
                        }
                    }
                }
            }

            if (!canSubmit) {
                alert('You input already exist value into Status Action or Status Detail.');
            } else {
                if (saveMode === 0) {        
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
                        this.props.OnCreateStatusHistory(statusHistory, isShowStatusDetailInput, isShowStatusActionInput);
                        this.setState({viewMode: 0, formInputs: {
                            status_last: '',
                            dme_status_detail: '',
                            dme_status_action: '',
                            isShowStatusActionInput: false,
                            isShowStatusDetailInput: false,
                        }});
                    }
                } else if (saveMode === 1) {
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

                        if (selectedStatusHistoryInd === 0) {
                            this.props.OnUpdateStatusHistory(statusHistory, true, isShowStatusDetailInput, isShowStatusActionInput);
                        } else {
                            this.props.OnUpdateStatusHistory(statusHistory, false, isShowStatusDetailInput, isShowStatusActionInput);
                        }

                        this.setState({viewMode: 0, formInputs: {
                            status_last: '',
                            dme_status_detail: '',
                            dme_status_action: '',
                            isShowStatusActionInput: false,
                            isShowStatusDetailInput: false,
                        }});
                    }
                }
            }
        }
    }

    onClickCancel() {
        this.setState({viewMode: 0});
    }

    onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (event.target.name === 'dme_status_detail' && event.target.value === 'other') {
            this.setState({isShowStatusDetailInput: true});
        } else if (event.target.name === 'dme_status_detail' && event.target.value !== 'other') {
            this.setState({isShowStatusDetailInput: false});
        } else if (event.target.name === 'dme_status_action' && event.target.value === 'other') {
            this.setState({isShowStatusActionInput: true});
        } else if (event.target.name === 'dme_status_action' && event.target.value === 'other') {
            this.setState({isShowStatusDetailInput: false});
        }

        let formInputs = this.state.formInputs;
        formInputs[name] = value;
        this.setState({formInputs, errorMessage: ''});
    }

    onChangeDate(date, fieldName) {
        if (fieldName === 'event_time_stamp') {
            this.setState({event_time_stamp: date});
        }
    }

    onClickEditButton(index) {
        const statusHistories = this.props.statusHistories;
        let formInputs = statusHistories[index];
        formInputs['event_time_stamp'] = moment(formInputs['event_time_stamp']).toDate();
        this.setState({formInputs, viewMode: 1, saveMode: 1, selectedStatusHistoryInd: index});
    }

    render() {
        const { isOpen, statusHistories, allBookingStatus, statusActions, statusDetails, clientname } = this.props;
        const { viewMode, saveMode, formInputs, event_time_stamp, errorMessage, isShowStatusDetailInput, isShowStatusActionInput } = this.state;

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
                    {
                        (clientname === 'dme') ?
                            <Button onClick={() => this.onClickEditButton(index)}><i className="icon icon-pencil"></i></Button>
                            :
                            null
                    }
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
                                    clientname === 'dme' ?
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
                                    <h1>{saveMode===0 ? 'New' : 'Edit'} Status History</h1>
                                </label>
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
                                        <option value={'other'}>Other</option>
                                    </select>
                                </label>
                                {
                                    (isShowStatusDetailInput) ?
                                        <label>
                                            <p>New Status Detail</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                placeholder=""
                                                name="new_dme_status_detail" 
                                                value = {formInputs['new_dme_status_detail']}
                                                onChange={(e) => this.onInputChange(e)} />    
                                        </label>
                                        :
                                        null
                                }
                                <label>
                                    <p>Status Action</p>
                                    <select
                                        name="dme_status_action"
                                        onChange={(e) => this.onInputChange(e)}
                                        value = {formInputs['dme_status_action']}
                                    >
                                        <option value="" selected disabled hidden>Select a status action</option>
                                        {statusActionOptions}
                                        <option value={'other'}>Other</option>
                                    </select>
                                </label>
                                {
                                    (isShowStatusActionInput) ?
                                        <label>
                                            <p>New Status Action</p>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                placeholder=""
                                                name="new_dme_status_action" 
                                                value = {formInputs['new_dme_status_action']}
                                                onChange={(e) => this.onInputChange(e)} />    
                                        </label>
                                        :
                                        null
                                }
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
                                    {saveMode===0 ? 'Create' : 'Update'}
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
