import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import { Button } from 'reactstrap';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
// import { Button } from 'reactstrap';
// import LoadingOverlay from 'react-loading-overlay';

class StatusHistorySlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 0, // 0: List, 1: Form
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleStatusHistorySlider: PropTypes.func.isRequired,
        statusHistories: PropTypes.array.isRequired,
        booking: PropTypes.object.isRequired,
        allBookingStatus: PropTypes.array.isRequired,
    };

    onClickPlus() {
        this.setState({viewMode: 1});
    }

    onClickSave() {
        this.setState({viewMode: 0});
    }

    onClickCancel() {
        this.setState({viewMode: 0});
    }

    render() {
        const { isOpen, statusHistories, allBookingStatus } = this.props;
        const { viewMode } = this.state;

        const statusHistoryItems = statusHistories.map((statusHistory, index) => {
            return (
                <div className="item" id={index} key={index}>
                    <small><b>{statusHistory.status_last}</b>{statusHistory.notes_type}</small><br/>
                    <p className="note">{statusHistory.notes}</p>
                    <p className="text">{statusHistory.dme_notes}</p>
                    <small> Event Time: {statusHistory.event_time_stamp ? moment(statusHistory.event_time_stamp).format('DD/MM/YYYY hh:mm:ss') : ''} </small><br/>
                    <small> Create Time: {statusHistory.api_status_time_stamp ? moment(statusHistory.api_status_time_stamp).format('DD/MM/YYYY hh:mm:ss') : ''} </small>
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
                                <Button color="primary" onClick={() => this.onClickPlus()}>
                                    +
                                </Button>
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
                                    >
                                        {statusOptions}
                                    </select>
                                </label>
                                <label>
                                    <p>Note</p>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        name="notes"
                                    />
                                </label>
                                <label>
                                    <p>DME note</p>
                                    <textarea
                                        name="dme_notes"
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
