import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import { getDeliveryStatus } from '../../state/services/bokService';

import processingImg from '../../public/images/statusPage/processing.png';
import bookedImg from '../../public/images/statusPage/booked.png';
import inTransitImg from '../../public/images/statusPage/intransit.png';
import deliveredImg from '../../public/images/statusPage/delivered.png';
import futileImg from '../../public/images/statusPage/futile.png';
import dashImg from '../../public/images/statusPage/dash.png';
import dashDoneImg from '../../public/images/statusPage/dash-done.png';



class BokStatusPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            identifier: null,
            errorMessage: null,
        };
    }

    static propTypes = {
        getDeliveryStatus: PropTypes.func.isRequired,
        bokWithPricings: PropTypes.object,
        step: PropTypes.number,
        status: PropTypes.string,
        quote: PropTypes.object,
        booking: PropTypes.object,
        match: PropTypes.object,
    };

    componentDidMount() {
        const identifier = this.props.match.params.id;

        if (identifier && identifier.length > 32) {
            this.props.getDeliveryStatus(identifier);
            this.setState({identifier});
        } else {
            this.setState({errorMessage: 'Wrong id.'});
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {errorMessage} = newProps;

        if (errorMessage) {
            this.setState({errorMessage});
        }
    }

    render() {
        const {status, step, quote, booking} = this.props;

        return (
            <section className="status">
                {this.state.errorMessage ?
                    <p className="error">{this.state.errorMessage}</p>
                    :
                    <div className="status-chart">
                        <div className="status-chart-item disp-inline-block">
                            <div className={step > 0 ? 'status-chart-item-wrapper disp-inline-block bg-dme done' : 'status-chart-item-wrapper disp-inline-block'}>
                                <img className="" src={processingImg} />
                            </div>
                            <div className="status-chart-item-wrapper disp-inline-block">
                                <img className="" src={step > 0 ? dashDoneImg: dashImg } />
                            </div>
                            <p>Processing</p>
                        </div>
                        <div className="status-chart-item disp-inline-block">
                            <div className={step > 1 ? 'status-chart-item-wrapper disp-inline-block bg-dme done' : 'status-chart-item-wrapper disp-inline-block'}>
                                <img className="" src={bookedImg} />
                            </div>
                            <div className="status-chart-item-wrapper disp-inline-block">
                                <img className="" src={step > 1 ? dashDoneImg: dashImg } />
                            </div>
                            <p>Booked</p>
                        </div>
                        <div className="status-chart-item disp-inline-block">
                            <div className={step > 2 ? 'status-chart-item-wrapper disp-inline-block bg-dme done' : 'status-chart-item-wrapper disp-inline-block'}>
                                <img className="" src={inTransitImg} />
                            </div>
                            <div className="status-chart-item-wrapper disp-inline-block">
                                <img className="" src={step > 2 ? dashDoneImg: dashImg } />
                            </div>
                            <p>In Transit</p>
                        </div>
                        {step !== 5 &&
                            <div className="status-chart-item disp-inline-block">
                                <div className={step > 3 ? 'status-chart-item-wrapper disp-inline-block bg-dme done' : 'status-chart-item-wrapper disp-inline-block'}>
                                    <img className="" src={deliveredImg} />
                                </div>
                                <p>Delivered</p>
                            </div>
                        }
                        {step === 5 &&
                            <div className="status-chart-item disp-inline-block">
                                <div className={step > 4 ? 'status-chart-item-wrapper disp-inline-block bg-dme done' : 'status-chart-item-wrapper disp-inline-block'}>
                                    <img className="" src={futileImg} />
                                </div>
                                <p>Futile</p>
                            </div>
                        }
                        <div className="status-chart-button disp-inline-block">
                            <Button color="primary" onClick={() => this.props.getDeliveryStatus(this.state.identifier)}>Up To Date</Button>
                        </div>
                        <div className="status-chart-detail">
                            {booking && booking.hasOwnProperty('b_bookingID_Visual') && <p><strong>DME Booking Number: </strong>{booking.b_bookingID_Visual}</p>}
                            {booking && booking.hasOwnProperty('b_client_order_num') && <p><strong>Client Order Number: </strong>{booking.b_client_order_num}</p>}
                            {booking && booking.hasOwnProperty('b_client_sales_inv_num') && <p><strong>Client Sales Invoice Number: </strong>{booking.b_client_sales_inv_num}</p>}
                            {!status && <p><strong>Status</strong>: Not available</p>}
                            {status && <p><strong>Status</strong>: {status}</p>}
                            {!quote && <p><strong>Quote</strong>: Not selected</p>}
                            {quote && quote.hasOwnProperty('cost') && <p><strong>Shipping Cost</strong>: ${quote.cost}</p>}
                            {quote && quote.hasOwnProperty('eta') && <p><strong>ETA</strong>: {quote.eta}</p>}
                            {quote && quote.hasOwnProperty('fp_name') && <p><strong>Freight Provider</strong>: {quote.fp_name}</p>}
                            {quote && quote.hasOwnProperty('service_name') && <p><strong>Service Name</strong>: {quote.service_name}</p>}
                        </div>
                    </div>
                }
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.bok.errorMessage,
        status: state.bok.deliveryStatus,
        step: state.bok.deliveryStep,
        quote: state.bok.quote,
        booking: state.bok.booking,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDeliveryStatus: (identifier) => dispatch(getDeliveryStatus(identifier)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BokStatusPage);
