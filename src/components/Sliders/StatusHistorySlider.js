import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import { Button } from 'reactstrap';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
// import LoadingOverlay from 'react-loading-overlay';

class StatusHistorySlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 0, // 0: List, 1: Form
            formInputs: {
                status_last: 'Entered',
            },
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleStatusHistorySlider: PropTypes.func.isRequired,
        statusHistories: PropTypes.array.isRequired,
        booking: PropTypes.object.isRequired,
        allBookingStatus: PropTypes.array.isRequired,
        username: PropTypes.string.isRequired,
        OnSaveStatusHistory: PropTypes.func.isRequired,
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
        let statusHistory = this.state.formInputs;
        statusHistory['notes'] = booking.b_status + ' ---> ' + statusHistory['status_last'];
        statusHistory['fk_booking_id'] = booking.pk_booking_id;
        this.props.OnSaveStatusHistory(statusHistory);
        this.setState({viewMode: 0});
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

    render() {
        const { isOpen, statusHistories, allBookingStatus, username } = this.props;
        const { viewMode, formInputs } = this.state;

        const statusHistoryItems = statusHistories.map((statusHistory, index) => {
            return (
                <div className="item" id={index} key={index}>
                    <small><b>{statusHistory.status_last}</b>{statusHistory.notes_type}</small><br/>
                    <p className="note">{statusHistory.notes}</p>
                    <p className="text">{statusHistory.dme_notes}</p>
                    <small> Event Time: {statusHistory.event_time_stamp ? moment(statusHistory.event_time_stamp).format('DD/MM/YYYY hh:mm:ss') : ''} </small><br/>
                    <small> Create Time: {statusHistory.z_CreatedTimestamp ? moment(statusHistory.z_CreatedTimestamp).format('DD/MM/YYYY hh:mm:ss') : ''} </small>
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
