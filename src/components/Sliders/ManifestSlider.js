import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button } from 'reactstrap';

import { getManifestSummary } from '../../state/services/bookingService';

class ManifestSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookingIds: []
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        onCreateOrder: PropTypes.func.isRequired,
        getManifestSummary: PropTypes.func.isRequired,
        bookings: PropTypes.array.isRequired,
        clientname: PropTypes.string,
        manifestSummary: PropTypes.object,
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        if (!this.props.isOpen && newProps.isOpen) { // After Slider is opened
            const bookingIds = newProps.bookings.map(booking => booking.id);
            this.props.getManifestSummary(bookingIds);
            this.setState({bookingIds});
        }
    }

    render() {
        const {isOpen, bookings, clientname, manifestSummary} = this.props;
        const puAvailFromDateCnt = _.uniqBy(bookings, 'puPickUpAvailFrom_Date').length;
        let bookedCnt = bookings.filter(booking => booking.b_status==='Booked').length;
        let notBookedCnt = bookings.length - bookedCnt;
        const fpCnt = _.uniqBy(bookings, 'vx_freight_provider').length;
        const summaryList = [];

        if (clientname === 'Jason L') {
            notBookedCnt = 0;
            bookedCnt = bookings.length;
        }

        if (manifestSummary) {
            let index = 0;
            for (const fpSummary in manifestSummary) {
                index += 1;

                summaryList.push(
                    <div>
                        <label>
                            <h5>#{index}</h5>
                            <strong>Freight Provider name:</strong> {fpSummary}<br />
                            <strong>Order Count:</strong> {manifestSummary[fpSummary]['orderCnt']}<br />
                            <strong>Total Quantity:</strong> {manifestSummary[fpSummary]['totalQty']}<br />
                            <strong>Total KGs:</strong> {manifestSummary[fpSummary]['totalKgs']} (KG)<br />
                            <strong>Total Cubic Meter:</strong> {manifestSummary[fpSummary]['totalCubicMeter'].toFixed(2)} (m3)
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
                    </span><br />
                    {clientname !== 'Jason L' &&
                        <span className={notBookedCnt > 0 ? 'red' : ''}>
                            # Not booked Count: {notBookedCnt}
                        </span>
                    }
                </label>
                <hr />
                {summaryList}
                <Button
                    color="primary"
                    onClick={() => this.props.onCreateOrder(this.state.bookingIds)}
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
        getManifestSummary: (bookingIds) => dispatch(getManifestSummary(bookingIds)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManifestSlider));
