import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import BootstrapTable from 'react-bootstrap-table-next';
import { getDeliveryStatus } from '../../state/services/bokService';

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
        lastUpdated: PropTypes.string,
        quote: PropTypes.object,
        booking: PropTypes.object,
        lines: PropTypes.array,
        etaDate: PropTypes.string,
        lastMilestone: PropTypes.string,
        timestamps: PropTypes.array,
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
        const {status, step, lastUpdated, quote, booking, lines, lastMilestone, timestamps, etaDate} = this.props;
        const steps = [
            'Processing',
            'Ready for Dispatch',
            'Picked up by Delivery Partner',
            'Out for Delivery',
            lastMilestone ? lastMilestone : 'Delivered'
        ];
        const details = [
            {
                title: 'CUSTOMER DETAILS',
                content: [
                    {
                        subtitle: 'Customer name',
                        subdesc: booking ? booking.b_061_b_del_contact_full_name : ''
                    },
                    {
                        subtitle: 'Order number',
                        subdesc: booking ? booking.b_client_order_num : ''
                    }
                ]
            },
            {
                title: 'DELIVERY DETAILS',
                content: [
                    {
                        subtitle: 'Tracking Number',
                        subdesc: booking ? booking.b_000_3_consignment_number : ''
                    },
                    {
                        subtitle: 'DME Number',
                        subdesc: booking ? booking.b_bookingID_Visual : ''
                    },
                    {
                        subtitle: 'Delivery ETA',
                        subdesc: quote ? `${etaDate}(${quote.eta})` : ''
                    }
                ]
            }
        ];

        const bookingLineDetailsColumns = [
            {
                dataField: 'e_item_type',
                text: 'Item Number',
                // hidden: true,
            }, {
                dataField: 'l_003_item',
                text: 'Item Description'
            }, {
                dataField: 'l_002_qty',
                text: 'Quantity'
            }
        ];

        return (
            <section className="status">
                {this.state.errorMessage ?
                    <p className="error">{this.state.errorMessage}</p>
                    : <Fragment>
                        {booking && <div className="status-content">
                            <div className="status-summary row">
                                <div className="col-md-3 col-sm-12">
                                    <p className="status-summary-title">
                                        STATUS
                                    </p>
                                    <p className="status-summary-desc">
                                        {status}
                                    </p>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <p className="status-summary-title">
                                        DELIVERY PARTNER
                                    </p>
                                    <p className="status-summary-desc">
                                        {(booking && booking['vx_freight_provider']) ? booking['vx_freight_provider'] : ''}
                                    </p>
                                </div>
                                <div className="col-md-5 col-sm-12">
                                    <p className="status-summary-title">
                                        SHIP TO
                                    </p>
                                    <p className="status-summary-desc">
                                        {booking.b_061_b_del_contact_full_name}
                                        <br />
                                        {booking.b_055_b_del_address_street_1}&nbsp;
                                        {booking.b_055_b_del_address_street_2 && `${booking.b_055_b_del_address_street_2} `}
                                        {booking.b_058_b_del_address_suburb}&nbsp;
                                        {booking.b_057_b_del_address_state}&nbsp;
                                        {booking.b_060_b_del_address_country}&nbsp;
                                        {booking.b_059_b_del_address_postalcode}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <span className="status-summary-title">Updated: </span>
                                <span className="status-summary-updated">{lastUpdated}</span>
                            </div>
                            <div className="status-chart">
                                <div className="status-chart-bar">
                                    {[0, 1, 2, 3, 4].map((index) => (
                                        <React.Fragment key={index}>
                                            <input type="checkbox" checked={index < step} readOnly></input>
                                            {index !== 4 && <div className="status-chart-bar-bar"></div>}
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="status-chart-desc">
                                    {steps.map((step, index) => (
                                        <div className="status-chart-desc-item" key={index}>
                                            <div className="status-chart-desc-item-title">
                                                {step}
                                            </div>
                                            {timestamps && <div className="status-chart-desc-item-desc">
                                                {timestamps[index]}
                                            </div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="status-chart-sm">
                                {[0, 1, 2, 3, 4].map((index) => (
                                    <div className="status-chart-item-sm" key={index}>
                                        <input type="checkbox" checked={index < step} readOnly></input>
                                        <div className="status-chart-desc-item-title">
                                            {steps[index]}
                                        </div>
                                        {timestamps && <div className="status-chart-desc-item-desc">
                                            {timestamps[index]}
                                        </div>}
                                    </div>
                                ))}
                            </div>
                            <div className="status-details row">
                                {details.map((item, index) => (
                                    <div className="status-details-item col-md-6 col-sm-12" key={index}>
                                        <div className="status-details-item-title">
                                            {item.title}
                                        </div>
                                        {item.content.map((itm, idx) => (
                                            <React.Fragment key={idx}>
                                                <span className="status-details-item-subtitle">
                                                    {itm.subtitle}:&nbsp; 
                                                </span>
                                                <span className="status-details-item-subdesc">
                                                    {itm.subdesc}
                                                </span>
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="order-details row">
                                <div className="order-details-title">
                                    ORDER DETAILS
                                </div>
                                {lines && <BootstrapTable
                                    keyField="pk_lines_id"
                                    data={ lines }
                                    columns={ bookingLineDetailsColumns }
                                    bootstrap4={ true }
                                    bordered={ false }
                                />}
                            </div>
                        </div>}
                    </Fragment>
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
        lines: state.bok.lines,
        etaDate: state.bok.etaDate,
        lastUpdated: state.bok.lastUpdated,
        lastMilestone: state.bok.lastMilestone,
        timestamps: state.bok.timestamps
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDeliveryStatus: (identifier) => dispatch(getDeliveryStatus(identifier)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BokStatusPage);
