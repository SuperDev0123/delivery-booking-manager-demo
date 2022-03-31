import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { uniqBy } from 'lodash';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button } from 'reactstrap';

import { getSummaryOfBookings } from '../../state/services/bookingService';

class ManifestSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        onCreateOrder: PropTypes.func.isRequired,
        getSummaryOfBookings: PropTypes.func.isRequired,
        manifestSummary: PropTypes.object,
        selectedBookings: PropTypes.array,
        bookingIds: PropTypes.array,
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        if (!this.props.isOpen && newProps.isOpen) { // Every time Slider is opened
            const bookingIds = newProps.selectedBookings.map(booking => booking.id);
            this.props.getSummaryOfBookings(bookingIds, 'manifest');
        }
    }

    render() {
        const {isOpen, selectedBookings, manifestSummary} = this.props;
        const puAvailFromDateCnt = uniqBy(selectedBookings, 'puPickUpAvailFrom_Date').length;
        const fpCnt = uniqBy(selectedBookings, 'vx_freight_provider').length;
        const summaryList = [];

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
                        # {fpCnt} `Freight Provider(s)`;
                    </span><br />
                    <span className={puAvailFromDateCnt > 1 ? 'red' : ''}>
                        # There are {puAvailFromDateCnt} `Pick Up Available From Date`;
                    </span>
                </label>
                <hr />
                {summaryList}
                <Button
                    color="primary"
                    onClick={() => this.props.onCreateOrder(this.props.bookingIds)}
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
