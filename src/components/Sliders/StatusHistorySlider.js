import React from 'react';
import PropTypes from 'prop-types';

import { sortBy, isEmpty, clone } from 'lodash';
import moment from 'moment-timezone';
import { Button } from 'reactstrap';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import DateTimePicker from 'react-datetime-picker';
import LoadingOverlay from 'react-loading-overlay';
// Constants
import { timeDiff } from '../../commons/constants';

class StatusHistorySlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 0, // 0: List, 1: Form
            saveMode: 0, // 0: Create, 1: Update
            formInputs: {
                status_last: '',
            },
            event_time_stamp: null,
            errorMessage: '',
        };

        moment.tz.setDefault('Australia/Sydney');
        this.tzOffset = new Date().getTimezoneOffset() === 0 ? 0 : -1 * new Date().getTimezoneOffset() / 60;
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
        isLoading: PropTypes.bool.isRequired,
    };

    onClickNewBtn() {
        const {booking} = this.props;

        if (booking.z_lock_status) {
            alert('This booking is locked, so `update status` is not available.');
        } else {
            const formInputs = this.state.formInputs;
            formInputs['dme_notes'] = booking.dme_status_history_notes;
            this.setState({viewMode: 1, saveMode: 0, formInputs});
        }
    }

    onClickSave(e) {
        e.preventDefault();
        
        const {booking} = this.props;
        const {saveMode, event_time_stamp} = this.state;
        let statusHistory = clone(this.state.formInputs);

        if (saveMode === 0) {
            if (statusHistory['status_last'] === '') {
                this.setState({errorMessage: 'Please select a status'});
            } else {
                statusHistory['notes'] = booking.b_status + ' ---> ' + statusHistory['status_last'];
                statusHistory['fk_booking_id'] = booking.pk_booking_id;
                statusHistory['event_time_stamp'] = event_time_stamp ? moment(event_time_stamp).format('YYYY-MM-DD HH:mmZ') : null;
                this.props.OnCreateStatusHistory(statusHistory);
                this.setState({
                    viewMode: 0, 
                    saveMode: 0,
                    formInputs: {
                        status_last: '',
                        dme_notes: '',
                    },
                    event_time_stamp: null,
                });
            }
        } else if (saveMode === 1) {
            if (statusHistory['status_last'] === '') {
                this.setState({errorMessage: 'Please select a status'});
            } else {
                statusHistory['notes'] = statusHistory['status_old'] + ' ---> ' + statusHistory['status_last'];
                statusHistory['fk_booking_id'] = booking.pk_booking_id;
                statusHistory['event_time_stamp'] = event_time_stamp ? moment(event_time_stamp).format('YYYY-MM-DD HH:mmZ') : null;
                this.props.OnUpdateStatusHistory(statusHistory);
                this.setState({
                    viewMode: 0,
                    saveMode: 0, 
                    formInputs: {
                        status_last: '',
                        dme_notes: '',
                    },
                    event_time_stamp: null,
                });
            }
        }
    }

    onClickCancel() {
        this.setState({viewMode: 0, event_time_stamp: null});
    }

    onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const formInputs = this.state.formInputs;
        formInputs[name] = value;
        this.setState({formInputs, errorMessage: ''});
    }

    onChangeDateTime(date, fieldName) {
        let conveted_date = moment(date).add(this.tzOffset, 'h');           // Current -> UTC
        conveted_date = conveted_date.add(timeDiff, 'h');                   // UTC -> Sydney

        if (fieldName === 'event_time_stamp') {
            this.setState({event_time_stamp: conveted_date});
        }
    }

    onClickEditButton(index) {
        const formInputs = clone(this.props.statusHistories[index]);
        const event_time_stamp = formInputs['event_time_stamp'] ? moment(formInputs['event_time_stamp']).toDate() : null;
        this.setState({formInputs, event_time_stamp, viewMode: 1, saveMode: 1});
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
                    <small> Event Time: {statusHistory.event_time_stamp ? moment(statusHistory.event_time_stamp).format('DD/MM/YYYY HH:mm') : ''} </small><br/>
                    <small> Create Time: {statusHistory.z_createdTimeStamp ? moment(statusHistory.z_createdTimeStamp).format('DD/MM/YYYY HH:mm') : ''} </small>
                    {(clientname === 'dme') &&
                        <Button onClick={() => this.onClickEditButton(index)}><i className="icon icon-pencil"></i></Button>
                    }
                </div>
            );
        });

        const statusOptions = sortBy(allBookingStatus, ['sort_order']).map((bookingStatus, key) => {
            if (bookingStatus.dme_delivery_status === 'On Hold') {
                return [
                    (<option key={key + 10} value="" disabled>********************************************************</option>),
                    (<option key={key} value={bookingStatus.dme_delivery_status}>{bookingStatus.dme_delivery_status}</option>)
                ];
            } else {
                return (<option key={key} value={bookingStatus.dme_delivery_status}>{bookingStatus.dme_delivery_status}</option>);
            }
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
                    <LoadingOverlay
                        active={this.props.isLoading}
                        spinner
                        text='Loading...'
                        styles={{
                            spinner: (base) => ({
                                ...base,
                                '& svg circle': {
                                    stroke: '#048abb'
                                }
                            })
                        }}
                    >
                        {viewMode === 0 ?
                            <div className="list-view">
                                {
                                    clientname === 'dme' ?
                                        <Button color="primary" onClick={() => this.onClickNewBtn()}>
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
                                <form onSubmit={(e) => this.onClickSave(e)}>
                                    <label>
                                        <h1>{saveMode===0 ? 'New' : 'Edit'} Status History</h1>
                                    </label>
                                    <label>
                                        <p>Status</p>
                                        <select
                                            name="status_last"
                                            onChange={(e) => this.onInputChange(e)}
                                            value = {formInputs['status_last'] ? formInputs['status_last'] : ''}
                                            required
                                        >
                                            <option value="" disabled hidden>Select a status</option>
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
                                            onChange={(date) => this.onChangeDateTime(date, 'event_time_stamp')}
                                            value={event_time_stamp ? new Date(moment(event_time_stamp).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'})) : null}
                                            format={'dd/MM/yyyy HH:mm'}
                                        />
                                    </label>
                                    <label>
                                        <p>Status Detail</p>
                                        <input
                                            className="form-control"
                                            value={(saveMode === 0) ? booking.dme_status_detail || '' : formInputs['dme_status_detail'] || ''}
                                            disabled='disabled'
                                            required
                                        />
                                    </label>
                                    <label>
                                        <p>Status Action</p>
                                        <input
                                            className="form-control"
                                            value={(saveMode === 0) ? booking.dme_status_action || '' : formInputs['dme_status_action'] || ''}
                                            disabled='disabled'
                                            required
                                        />
                                    </label>
                                    <label>
                                        <p>Linked Reference</p>
                                        <input
                                            className="form-control"
                                            value={(saveMode === 0) ? booking.dme_status_linked_reference_from_fp || '' : formInputs['dme_status_linked_reference_from_fp'] || ''}
                                            disabled='disabled'
                                            required
                                        />
                                    </label>
                                    {isEmpty(errorMessage) ?
                                        <label></label>
                                        :
                                        <label>
                                            <p className='red'>{errorMessage}</p>
                                        </label>
                                    }
                                    <Button
                                        type='submit'
                                        color='primary'
                                    >
                                        {saveMode === 0 ? 'Create' : 'Update'}
                                    </Button>
                                    <Button color="danger" onClick={() => this.onClickCancel()}>
                                        Cancel
                                    </Button>
                                </form>
                            </div>
                        }
                    </LoadingOverlay>
                </div>
            </SlidingPane>
        );
    }
}

export default StatusHistorySlider;
