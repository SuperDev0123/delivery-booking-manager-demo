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
        booking: PropTypes.object.isRequired,
    };

    render() {
        const { isOpen, storeBookingLogs } = this.props;

        const storeBookingLogList = storeBookingLogs.map((storeBookingLog, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{(storeBookingLog.delivery_booking && !_.isEmpty(storeBookingLog.delivery_booking)) ? moment(storeBookingLog.delivery_booking).format('DD MMM YYYY') : null}</td>
                    <td>{(storeBookingLog.fp_store_event_date && !_.isEmpty(storeBookingLog.fp_store_event_date)) ? moment(storeBookingLog.fp_store_event_date).format('DD MMM YYYY') : null}</td>
                    <td>{(storeBookingLog.fp_store_event_time && !_.isEmpty(storeBookingLog.fp_store_event_time)) ? storeBookingLog.fp_store_event_time : null}</td>
                    <td></td>
                </tr>
            );
        });
        const title = `Delivery Booking Log Slider - Consignment No: ${booking.v_FPBookingNumber}`;

        return (
            <SlidingPane
                className='sbl-slider'
                overlayClassName='sbl-slider-overlay'
                isOpen={isOpen}
                title=title
                onRequestClose={this.props.toggle}>
                <div className="slider-content">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <tr>
                                <th className="" scope="col" nowrap>
                                    <p>No</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Delivery Booking</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Logged Date</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Logged Time</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Activity Description</p>
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
