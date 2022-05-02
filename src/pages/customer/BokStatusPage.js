import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDeliveryStatus } from '../../state/services/bokService';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import BootstrapTable from 'react-bootstrap-table-next';

import { STATIC_HOST, HTTP_PROTOCOL } from '../../config';
import dmeLogo from '../../public/images/logos/dme.png';
import Step from './Step';
import LoadingOverlay from 'react-loading-overlay';

class BokStatusPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            identifier: null,
            errorMessage: null,
            showScans: false,
            showShips: false,
            showOrders: false,
        };

        moment.tz.setDefault('Australia/Sydney');
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
        originalLines: PropTypes.array,
        packedLines: PropTypes.array,
        scans: PropTypes.array,
        etaDate: PropTypes.string,
        lastMilestone: PropTypes.string,
        timestamps: PropTypes.array,
        clientLogoUrl: PropTypes.string,
        match: PropTypes.object,
    }

    componentDidMount() {
        const identifier = this.props.match.params.id;

        if (identifier && identifier.length > 32) {
            this.props.getDeliveryStatus(identifier);
            this.setState({identifier});
        } else {
            this.setState({errorMessage: 'We\'re sorry, the tracking number seems to be incorrect. Please contact our support via the chat option during normal business hours.'});
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {errorMessage, booking } = newProps;
        if (booking) {
            this.setState({isLoading: false});
        }
        if (errorMessage) {
            this.setState({errorMessage});
            this.setState({isLoading: false});
        }
    }

    onToggle(stateName) {
        this.setState({[stateName]: !this.state[stateName]});
    }

    onClickPOD(pod_url) {
        const win = window.open(HTTP_PROTOCOL + '://' + STATIC_HOST + '/imgs/' + pod_url, '_blank');
        win.focus();
    }

    render() {
        const {scans, originalLines, packedLines, step, status, booking, etaDate, lastUpdated } = this.props;
        const { showScans, showShips, showOrders, isLoading } = this.state;
        let pod_url = null;
        if (booking) {
            if (booking.z_pod_signed_url) {
                pod_url = booking.z_pod_signed_url;
            } else if (booking.z_pod_url) {
                pod_url = booking.z_pod_url;
            }
        }
        
        const step_no = step;
        const steps = [
            {className: 'collect', statusName: 'processing'},
            {className: 'intransit', statusName: 'in transit'}, 
            {className: 'delivering', statusName: 'Out for Delivery'},
            {className: 'delivered', statusName: 'delivered'}
        ];

        const misDeliveries = [
            'Lost In Transit',
            'Damaged',
            'Returning',
            'Returned',
            'Closed',
            'Cancelled',
            'On Hold',
            'Cancel Requested',
        ];
        
        let stepEl = [];
        if (!misDeliveries.includes(status)) {
            stepEl = steps.map((step, index) => {
                if (index < step_no) {
                    return <Step statusClass="passed" statusName={step.statusName} />;
                } else if (index == step_no) {
                    return <Step statusClass={step.className} statusName={step.statusName} />;
                } else {
                    return <Step statusClass="pending" statusName={step.statusName} />;
                }
            });
        }

        let dateOfETA;
        
        if (!misDeliveries.includes(status)) {
            dateOfETA = `${etaDate ? moment(etaDate).format('DD MMM YYYY hh:mm a') : ''}`;
        }
        else {
            dateOfETA = 'N/A';
        }

        const scansColumns = [
            {
                dataField: 'event_timestamp',
                text: 'Scan Date',
                formatter: (cell) => {
                    return moment(cell).format('DD/MM/YYYY HH:mm:SS');
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
        
        const packedLineColumns = [
            {
                dataField: 'e_type_of_packaging',
                text: 'Packaging Unit'
            },{
                dataField: 'e_item',
                text: 'Item Description',
                style: {
                    paddingRight: '5px'
                }
            },
            {
                dataField: 'e_qty',
                text: 'Quantity',
                style: {
                    paddingRight: '5px'
                }
            }, {
                dataField: 'e_dimUOM',
                text: 'DIMS unit of Measure',
                style: {
                    paddingRight: '5px'
                }
            }, {
                dataField: 'e_dimLength',
                text: 'Length(ea)'
            },
            {
                dataField: 'e_dimWidth',
                text: 'Width(ea)'
            },
            {
                dataField: 'e_dimHeight',
                text: 'Height(ea)'
            },
            {
                dataField: 'e_Total_KG_weight',
                text: 'Mass KG(ea)'
            }
        ];

        const originalLineColumns = [
            {
                dataField: 'product',
                text: 'Product'
            },
            {
                dataField: 'e_type_of_packaging',
                text: 'Item Number',
                style: {
                    paddingRight: '5px'
                }
            }, {
                dataField: 'e_item',
                text: 'Item Description',
                style: {
                    paddingRight: '5px'
                }
            }, {
                dataField: 'e_qty',
                text: 'Quantity'
            }
        ];

        return (
            <LoadingOverlay
                active={isLoading}
                spinner
                text='Get Delivery Status...'
            >
                <section className="status-page">
                    <div className="border border-1 my-5 py-2">
                        <div className="status-main d-flex justify-content-around border-bottom">
                            <div className="left-side mt-4">
                                <div className="row">
                                    <img src={dmeLogo} alt="logo" />
                                    <h5 className="tel-number">Tel: (02) 8311 1500</h5>
                                </div>
                                <div className="status-stepper text-center align-content-center mt-3 pt-5">
                                    {misDeliveries.includes(status) ? 
                                        <h2 className="title-fail mt-4 pt-5" style={{color: 'blue'}}>Booking {status}</h2> :
                                        <ul className="status-stepper d-flex justify-content-around">
                                            {stepEl}
                                        </ul>
                                    }
                                </div>
                            </div>
                            <div className="status-info-right border-left">
                                <table className="table table-bordered table-hover table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Freight Provider</td>
                                            <td>{booking ? booking.vx_freight_provider : ''}</td>
                                        </tr>
                                        <tr>
                                            <td>Consignment</td>
                                            <td>{booking ? booking.b_000_3_consignment_number : '' }</td>
                                        </tr>
                                        <tr>
                                            <td>Your Sales Order</td>
                                            <td>{booking ? booking.b_client_sales_inv_num : ''}</td>
                                        </tr>
                                        <tr>
                                            <td>Delivery ETA</td>
                                            <td>{moment(dateOfETA).format('DD MMM YYYY h:mm:ss A')}</td>
                                        </tr>
                                        <tr>
                                            <td>Updated ETA</td>
                                            <td>{booking && booking.s_06_Latest_Delivery_Date_Time_Override ? moment(booking.s_06_Latest_Delivery_Date_Time_Override).format('DD MMM YYYY hh:mm a') : ''}</td>
                                        </tr>
                                        <tr>
                                            <td>Delivering To</td>
                                            <td>{booking ? `${booking.b_057_b_del_address_state} ${booking.b_059_b_del_address_postalcode}` : ''}</td>
                                        </tr>
                                        <tr>
                                            <td>Service</td>
                                            <td>{booking ? booking.vx_serviceName : ''}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {pod_url && <a href="#" onClick={() => this.onClickPOD(pod_url)}>Proof Of Delivery</a>}
                                <br/>
                                <br/>
                                <div className="date">
                                    Updated: {lastUpdated}
                                </div>
                            </div>
                        </div>
                        <div className="status-detail pt-3 px-5 border-bottom pb-3">
                            <h5 className="ml-4">View details:</h5>
                            <div className="detail-content ps-2">
                                <div className="accordion" id="accordion">
                                    <div className="card">
                                        <div className="card-header p-0">
                                            <a className="btn text-white d-block text-left" data-toggle="collapse" href="#collapseOne" onClick={() => this.onToggle('showScans')}>
                                                &nbsp;<i className={showScans ? 'fa fa-minus' : 'fa fa-plus'} ></i>
                                                &nbsp; View Tracking History
                                            </a>
                                        </div>
                                        <div id="collapseOne" className="collapse">
                                            <div className="card-body">
                                                {(scans && scans.length != 0)  ? <BootstrapTable
                                                    keyField="id"
                                                    data={ scans }
                                                    columns={ scansColumns }
                                                    bootstrap4={ true }
                                                    bordered={ false }
                                                /> : 'No item information was provided to report here'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header p-0">
                                            <a className="collapsed btn text-white d-block text-left" data-toggle="collapse" href="#collapseTwo" onClick={() => this.onToggle('showShips')}>
                                                &nbsp;<i className={showShips ? 'fa fa-minus' : 'fa fa-plus'} ></i>
                                                &nbsp; View Packages Shipped
                                            </a>
                                        </div>
                                        <div id="collapseTwo" className="collapse">
                                            <div className="card-body">
                                                {packedLines && packedLines.length != 0 ? <BootstrapTable
                                                    keyField="pk_lines_id"
                                                    data={ packedLines }
                                                    columns={ packedLineColumns }
                                                    bootstrap4={ true }
                                                    bordered={ false }
                                                /> : 'No item information was provided to report here'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header p-0">
                                            <a className="collapsed btn text-white d-block text-left" data-toggle="collapse" href="#collapseThree" onClick={() => this.onToggle('showOrders')}>
                                                &nbsp;<i className={showOrders ? 'fa fa-minus' : 'fa fa-plus'} ></i>
                                                &nbsp; View a list of items in your packages
                                            </a>
                                        </div>
                                        <div id="collapseThree" className="collapse">
                                            <div className="card-body">
                                                {(originalLines && originalLines.length != 0) ? <BootstrapTable
                                                    keyField="pk_lines_id"
                                                    data={ originalLines }
                                                    columns={ originalLineColumns }
                                                    bootstrap4={ true }
                                                    bordered={ false }
                                                /> : 'No item information was provided to report here'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="status-footer row ps-4 pt-2">
                            <a className="col-12 text-center" data-toggle="modal" data-target="#myModal" style={{color: 'red'}} href="#">Important Information re Freight Delays</a>
                            <div className="modal" id="myModal">
                                <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h4 className="modal-title text-left">Freight Delivery and Potential Delay Updates</h4>
                                            <button type="button" className="close px-2 py-0" data-dismiss="modal">&times;</button>
                                        </div>
                                
                                        <div className="modal-body">
                                            <p>Dear Customer, please note that freight providers are experiencing significant delivery delays beyond standard service levels. There is a high chance that this will impact the estimated `deliver by date`.</p>
                                            <p>To keep you up to date a SMS and email will be sent out no later than the ‘deliver by date’ of an impending delay. We understand the frustration with the potential delays and having to call customer care for updates. To save you that time, we will provide ALL information via SMS or email as and when updates are possible.</p>
                                            <p className="blurb-text">
                                                Please note that your order may arrive in multiple deliveries due to the way that &apos;big and bulky&apos; items are sorted and scanned. Rest assured that the rest of your order will arrive soon.
                                            </p>
                                            <p className="blurb-text">
                                                If the order status says &apos;Delivered&apos; and there are still undelivered items in your order, you may submit an inquiry in the chat window on this page. Our Customer Service team will check with our delivery partner and get back to you as soon as possible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </LoadingOverlay>
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
        originalLines: state.bok.originalLines,
        packedLines: state.bok.packedLines,
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