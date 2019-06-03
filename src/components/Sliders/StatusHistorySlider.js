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
            saveMode: 0, // 0: Create, 1: Update
            formInputs: {
                status_last: '',
            },
            event_time_stamp: new Date(),
            errorMessage: '',
            selectedStatusHistoryInd: -1,
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
        clientname: PropTypes.string.isRequired,
    };

    onClickPlus() {
        const {booking} = this.props;

        if (booking.z_lock_status) {
            alert('This booking is locked, so `update status` is not available.');
        } else {
            const formInputs = this.state.formInputs;
            formInputs['dme_notes'] = booking.dme_status_history_notes;
            this.setState({viewMode: 1, saveMode: 0, formInputs});
        }
    }

    onClickSave() {
        const {booking} = this.props;
        const {saveMode, selectedStatusHistoryInd} = this.state;
        let statusHistory = _.clone(this.state.formInputs);

        if (saveMode === 0) {        
            if (statusHistory['status_last'] === '') {
                this.setState({errorMessage: 'Please select a status'});
            } else {
                statusHistory['notes'] = booking.b_status + ' ---> ' + statusHistory['status_last'];
                statusHistory['fk_booking_id'] = booking.pk_booking_id;
                statusHistory['event_time_stamp'] = moment(this.state.event_time_stamp).format('YYYY-MM-DD hh:mm:ss');
                this.props.OnCreateStatusHistory(statusHistory);
                this.setState({
                    viewMode: 0, 
                    saveMode: 0,
                    formInputs: {
                        status_last: '',
                        dme_notes: '',
                    },
                });
            }
        } else if (saveMode === 1) {
            if (statusHistory['status_last'] === '') {
                this.setState({errorMessage: 'Please select a status'});
            } else {
                statusHistory['notes'] = booking.b_status + ' ---> ' + statusHistory['status_last'];
                statusHistory['fk_booking_id'] = booking.pk_booking_id;
                statusHistory['event_time_stamp'] = moment(this.state.event_time_stamp).format('YYYY-MM-DD hh:mm:ss');

                if (selectedStatusHistoryInd === 0) {
                    this.props.OnUpdateStatusHistory(statusHistory, true);
                } else {
                    this.props.OnUpdateStatusHistory(statusHistory, false);
                }

                this.setState({
                    viewMode: 0,
                    saveMode: 0, 
                    formInputs: {
                        status_last: '',
                        dme_notes: '',
                    },
                });
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

        const formInputs = this.state.formInputs;
        formInputs[name] = value;
        this.setState({formInputs, errorMessage: ''});
    }

    onChangeDate(date, fieldName) {
        if (fieldName === 'event_time_stamp') {
            this.setState({event_time_stamp: date});
        }
    }

    onClickEditButton(index) {
        const formInputs = _.clone(this.props.statusHistories[index]);

        formInputs['event_time_stamp'] = moment(formInputs['event_time_stamp']).toDate();
        this.setState({formInputs, viewMode: 1, saveMode: 1, selectedStatusHistoryInd: index});
    }

    render() {
        const { isOpen, statusHistories, allBookingStatus, clientname, booking } = this.props;
        const { viewMode, saveMode, formInputs, event_time_stamp, errorMessage } = this.state;

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
                                    <p>Status Detail</p>
                                    <input
                                        className="form-control"
                                        value={(saveMode === 0) ? booking.dme_status_detail : formInputs['dme_status_detail']}
                                        disabled='disabled'
                                    />
                                </label>
                                <label>
                                    <p>Status Action</p>
                                    <input
                                        className="form-control"
                                        value={(saveMode === 0) ? booking.dme_status_action : formInputs['dme_status_action']}
                                        disabled='disabled'
                                    />
                                </label>
                                <label>
                                    <p>Linked Reference</p>
                                    <input
                                        className="form-control"
                                        value={(saveMode === 0) ? booking.dme_status_linked_reference_from_fp : formInputs['dme_status_linked_reference_from_fp']}
                                        disabled='disabled'
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
                                    {saveMode === 0 ? 'Create' : 'Update'}
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
