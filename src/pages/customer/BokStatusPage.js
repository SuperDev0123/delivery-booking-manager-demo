import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import BootstrapTable from 'react-bootstrap-table-next';
import { getDeliveryStatus } from '../../state/services/bokService';
import dmeLogo from '../../public/images/logos/dme.png';

class BokStatusPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            identifier: null,
            errorMessage: null,
            showScans: true
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
        scans: PropTypes.array,
        etaDate: PropTypes.string,
        lastMilestone: PropTypes.string,
        timestamps: PropTypes.array,
        clientLogoUrl: PropTypes.string,
        match: PropTypes.object,
    };

    componentDidMount() {
        const identifier = this.props.match.params.id;

        if (identifier && (
            identifier.length > 32 ||
            identifier.length === 6 ||
            identifier.length === 7
        )) {
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

    onScans() {
        this.setState({showScans: !this.state.showScans});
    }

    render() {
        const { showScans } = this.state;
        const {status, step, lastUpdated, quote, booking, lines, scans, lastMilestone, timestamps, etaDate, clientLogoUrl} = this.props;
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

        const scansColumns = [
            {
                dataField: 'event_timestamp',
                text: 'Scan Date',
                formatter: (cell) => {
                    return moment(cell).format('DD/MM/YYYY');
                },
                style: {
                    paddingRight: '5px'
                }
            }, {
                dataField: 'status',
                text: 'Status',
                style: {
                    paddingRight: '5px',
                    minWidth: '50px'
                }
            }, {
                dataField: 'desc',
                text: 'Description'
            }
        ];

        const bookingLineDetailsColumns = [
            {
                dataField: 'product',
                text: 'Product'
            },
            {
                dataField: 'e_item_type',
                text: 'Item Number',
                // hidden: true,
                style: {
                    paddingRight: '5px'
                }
            }, {
                dataField: 'l_003_item',
                text: 'Item Description',
                style: {
                    paddingRight: '5px'
                }
            }, {
                dataField: 'l_002_qty',
                text: 'Quantity'
            }
        ];

        return (
            <section className="status">
                <nav className="status-head mt-md-5">
                    <a href="/" className="navbar-brand mr-sm-0">
                        <img src={dmeLogo} className="head-logo" alt="logo" />
                        <span className="logo-desc">Your shipment powered by Deliver Me</span>
                    </a>
                    {clientLogoUrl && <a href="#" className="navbar-brand mr-sm-0 pull-right">
                        <img src={require(`../../public/images/logos/${clientLogoUrl}`)} className="head-logo" alt="logo" />
                    </a>}
                </nav>
                {this.state.errorMessage ?
                    <p className="error">{this.state.errorMessage}</p>
                    : lastUpdated !== '' ? <Fragment>
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
                            {!(step === 5 && status === 'Delivered') && <div className='c-red'>
                                <p>Dear Customer, please note that freight providers are experiencing significant delivery delays beyond standard service levels. There is a high chance that this will impact the estimated `deliver by date`.</p>
                                <p>To keep you up to date a SMS and email will be sent out no later than the ‘deliver by date’ of an impending delay. We understand the frustration with the potential delays and having to call customer care for updates. To save you that time, we will provide ALL information via SMS or email as and when updates are possible.</p>
                            </div>}
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
                            <div className="row blurb">
                                <p className="blurb-text">
                                    Please note that your order may arrive in multiple deliveries due to the way that &apos;big and bulky&apos; items are sorted and scanned. Rest assured that the rest of your order will arrive soon.
                                </p>
                                <p className="blurb-text">
                                    If the order status says &apos;Delivered&apos; and there are still undelivered items in your order, you may submit an inquiry in the chat window on this page. Our Customer Service team will check with our delivery partner and get back to you as soon as possible.
                                </p>
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
                            <div className="scans-details row">
                                <div className="scans-details-title" onClick={() => this.onScans()}>
                                    <span>
                                        &nbsp;<i className={showScans ? 'fa fa-minus' : 'fa fa-plus'} ></i>
                                        &nbsp;FREIGHT PROVIDER SCANS
                                    </span>
                                </div>
                                {scans && showScans && <BootstrapTable
                                    keyField="id"
                                    data={ scans }
                                    columns={ scansColumns }
                                    bootstrap4={ true }
                                    bordered={ false }
                                />}
                            </div>
                            <div className="order-details row">
                                <div className="order-details-title">
                                    ORDER DETAILS
                                </div>
                                <div className="lines-data">
                                    {lines && <BootstrapTable
                                        keyField="pk_lines_id"
                                        data={ lines }
                                        columns={ bookingLineDetailsColumns }
                                        bootstrap4={ true }
                                        bordered={ false }
                                    />}
                                </div>
                            </div>
                        </div>}
                    </Fragment> : (<div className="no-status">
                        Your order has been received and is currently being processed.
                        <br />
                        <br />
                        Once you receive a Shipping Confirmation email, please check back to see the delivery status.
                    </div>)
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
        scans: state.bok.scans,
        etaDate: state.bok.etaDate,
        lastUpdated: state.bok.lastUpdated,
        lastMilestone: state.bok.lastMilestone,
        timestamps: state.bok.timestamps,
        clientLogoUrl: state.bok.clientLogoUrl
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDeliveryStatus: (identifier) => dispatch(getDeliveryStatus(identifier)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BokStatusPage);