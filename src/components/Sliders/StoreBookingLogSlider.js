import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import moment from 'moment-timezone';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

class StoreBookingLogSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        storeBookingLogs: PropTypes.array.isRequired,
    };

    render() {
        const { isOpen, storeBookingLogs } = this.props;

        const storeBookingLogList = storeBookingLogs.map((storeBookingLog, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{storeBookingLog.v_FPBookingNumber}</td>
                    <td>{(storeBookingLog.fp_store_scheduled_date && !_.isEmpty(storeBookingLog.fp_store_scheduled_date)) ? moment(storeBookingLog.fp_store_scheduled_date).format('DD MMM YYYY') : null}</td>
                    <td>{(storeBookingLog.fp_store_event_date && !_.isEmpty(storeBookingLog.fp_store_event_date)) ? moment(storeBookingLog.fp_store_event_date).format('DD MMM YYYY') : null}</td>
                    <td>{(storeBookingLog.fp_store_event_time && !_.isEmpty(storeBookingLog.fp_store_event_time)) ? storeBookingLog.fp_store_event_time : null}</td>
                    <td>{(storeBookingLog.z_createdTimeStamp && !_.isEmpty(storeBookingLog.z_createdTimeStamp)) ? moment(storeBookingLog.z_createdTimeStamp).format('DD MMM YYYY HH:MM:SS') : null}</td>
                </tr>
            );
        });

        return (
            <SlidingPane
                className='sbl-slider'
                overlayClassName='sbl-slider-overlay'
                isOpen={isOpen}
                title='Store Booking Log Slider'
                onRequestClose={this.props.toggle}>
                <div className="slider-content">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <tr>
                                <th className="" scope="col" nowrap>
                                    <p>No</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Consignment No</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>FP Store Scheduled Date</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>FP Store Event Date</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>FP Store Event Time</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Created At</p>
                                </th>
                            </tr>
                            { storeBookingLogList }
                        </table>
                    </div>
                </div>
            </SlidingPane>
        );
    }
}

export default StoreBookingLogSlider;
