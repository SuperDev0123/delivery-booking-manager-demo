import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { uniqBy } from 'lodash';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment-timezone';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button } from 'reactstrap';

import { getSummaryOfBookings } from '../../state/services/bookingService';
// Constants
import { timeDiff } from '../../commons/constants';

class ManifestSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            needTruck: false,
            manifest_timestamp: null
        };

        moment.tz.setDefault('Australia/Sydney');
        this.tzOffset = new Date().getTimezoneOffset() === 0 ? 0 : -1 * new Date().getTimezoneOffset() / 60;
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        onCreateOrder: PropTypes.func.isRequired,
        getSummaryOfBookings: PropTypes.func.isRequired,
        manifestSummary: PropTypes.object,
        selectedBookings: PropTypes.array,
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        if (!this.props.isOpen && newProps.isOpen) { // Every time Slider is opened
            const bookingIds = newProps.selectedBookings.map(booking => booking.id);
            this.props.getSummaryOfBookings(bookingIds, 'manifest');

            // Set initial manifest
            this.setState({manifest_timestamp: moment()});
        }
    }

    onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({needTruck: value});
    }

    onChangeDateTime(date, fieldName) {
        let conveted_date = moment(date).add(this.tzOffset, 'h');           // Current -> UTC
        conveted_date = conveted_date.add(timeDiff, 'h');                   // UTC -> Sydney

        if (fieldName === 'manifest_timestamp') {
            this.setState({manifest_timestamp: conveted_date});
        }
    }

    render() {
        const {isOpen, selectedBookings, manifestSummary} = this.props;
        const {needTruck, manifest_timestamp} = this.state;

        const puAvailFromDateCnt = uniqBy(selectedBookings, 'puPickUpAvailFrom_Date').length;
        const fpCnt = uniqBy(selectedBookings, 'vx_freight_provider').length;
        const bookingIds = selectedBookings.map(booking => booking.id);
        const summaryList = [];
        let firstFP = 0;

        if (bookingIds.length > 0)
            firstFP = selectedBookings[0].vx_freight_provider;

        if (manifestSummary) {
            let index = 0;
            for (const fp in manifestSummary.fps) {
                index += 1;

                summaryList.push(
                    <div>
                        <label>
                            <h5>#{index}</h5>
                            <strong>Freight Provider name:</strong> {fp}<br />
                            <strong>Order Count:</strong> {manifestSummary.fps[fp]['orderCnt']}<br />
                            <strong>Total Quantity:</strong> {manifestSummary.fps[fp]['totalQty']}<br />
                            <strong>Total KGs:</strong> {manifestSummary.fps[fp]['totalKgs'].toFixed(3)} (KG)<br />
                            <strong>Total Cubic Meter:</strong> {manifestSummary.fps[fp]['totalCubicMeter'].toFixed(3)} (m3)
                        </label>
                        <hr />
                    </div>
                );
            }
        }

        return (
            <SlidingPane
                className='manifest-slider'
                overlayClassName='manifest-slider-overlay'
                isOpen={isOpen}
                title='Manifest Slider'
                subtitle=''
                onRequestClose={() => this.props.toggleSlider()}
            >
                <h4>Please review info before creating an order.</h4>
                <hr />
                <label>
                    <span className={fpCnt > 1 ? 'red' : ''}>
                        # {fpCnt} `Freight Provider(s)`; {fpCnt !== 1 ? 'DME does not support multi-FP manifest' : ''}
                    </span><br />
                    <span className={puAvailFromDateCnt > 1 ? 'red' : ''}>
                        # There are {puAvailFromDateCnt} `Pick Up Available From Date`;
                    </span>
                </label>
                <hr />
                {summaryList}
                {firstFP === 'TNT' &&
                    <label>
                        <p className='need-truck'>Need Truck?</p>
                        <input
                            type="checkbox"
                            name="needTruck"
                            className="checkbox"
                            checked={needTruck}
                            onChange={(e) => this.onInputChange(e)}
                        />
                    </label>
                }
                {firstFP === 'TNT' && <hr />}
                <label>
                    <p className='manifest-timestamp'>Manifest datetime (Sydney time):</p>
                    <DateTimePicker
                        onChange={(date) => this.onChangeDateTime(date, 'manifest_timestamp')}
                        value={manifest_timestamp ? new Date(moment(manifest_timestamp).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'})) : null}
                        format={'dd/MM/yyyy HH:mm'}
                    />
                </label>
                <hr />
                <Button
                    color="primary"
                    disabled={fpCnt !== 1 ? 'disabled' : ''}
                    title={fpCnt !== 1 ? 'DME does not support multi-FP manifest' : 'Create manifest'}
                    onClick={() => this.props.onCreateOrder(bookingIds, firstFP, this.state.needTruck, manifest_timestamp)}
                >
                    Create Manifest
                </Button>
                <Button color="secondary" onClick={() => this.props.toggleSlider()}>Cancel</Button>
            </SlidingPane>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        manifestSummary: state.booking.manifestSummary,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getSummaryOfBookings: (bookingIds, from) => dispatch(getSummaryOfBookings(bookingIds, from)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManifestSlider));
