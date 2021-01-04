import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'reactstrap';

import { getBokWithPricings, onSelectPricing, bookFreight, cancelFreight } from '../../state/services/bokService';

class BokPricePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isCanceled: null,
            isBooked: null,
            sortedBy: 'lowest',
        };
    }

    static propTypes = {
        getBokWithPricings: PropTypes.func.isRequired,
        onSelectPricing: PropTypes.func.isRequired,
        onBookFreight: PropTypes.func.isRequired,
        onCancelFreight: PropTypes.func.isRequired,
        bokWithPricings: PropTypes.object,
        match: PropTypes.object,
        canceledSuccess: PropTypes.bool,
        bookedSuccess: PropTypes.bool,
    };

    componentDidMount() {
        const identifier = this.props.match.params.id;

        if (identifier && identifier.length > 32) {
            this.props.getBokWithPricings(identifier);
        } else {
            this.setState({errorMessage: 'Wrong id.'});
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {errorMessage, needToUpdatePricings, bookedSuccess, canceledSuccess} = newProps;

        if (errorMessage) {
            this.setState({errorMessage});
        }

        if (needToUpdatePricings) {
            const identifier = this.props.match.params.id;
            this.props.getBokWithPricings(identifier);
        }

        if (bookedSuccess) {
            this.notify('Freight is booked successfully');
            this.setState({isBooked: true});
        }

        if (canceledSuccess) {
            this.notify('Freight is canceled successfully');
            this.setState({isCanceled: true});
            this.notify('Broser tab will be closed in 3 seconds');

            setTimeout(() => {
                open(location, '_self').close();
            }, 3000);
        }
    }

    notify = (text) => {
        toast(text);
    };

    copyToClipBoard = async text => {
        try {
            await navigator.clipboard.writeText(text);
            this.notify('Copied!');
        } catch (err) {
            this.notify('Failed to copy!');
        }
    };

    onClickColumn = (arg) => {
        this.setState({sortedBy: arg});
    }

    render() {
        const {sortedBy, isBooked, isCanceled} = this.state;
        const {bokWithPricings} = this.props;

        let bok_1, bok_2s, pricings;
        let isPricingPage = true;
        let canBeChanged = true;
        let sortedPricings = [];
        let isSalesQuote = false;

        if (isBooked || isCanceled) {
            canBeChanged = false;
        }

        if (bokWithPricings && bokWithPricings['b_client_order_num'][0] === 'Q' && bokWithPricings['b_client_order_num'][1] === '_') {
            isSalesQuote = true;
        }

        if (bokWithPricings && sortedBy === 'lowest') {
            sortedPricings = _.sortBy(bokWithPricings['pricings'], ['cost']);
        } else if (bokWithPricings && sortedBy === 'fastest') {
            sortedPricings = _.sortBy(bokWithPricings['pricings'], ['eta_in_hour']);
        }

        // if (window.location.href.indexOf('/price/') === -1) {
        //     isPricingPage = false;
        // }

        if (bokWithPricings) {
            bok_1 = bokWithPricings;
            bok_2s = bok_1['bok_2s'].map((bok_2, index) => (
                <tr key={index}>
                    <td>{bok_2['l_001_type_of_packaging']}</td>
                    <td>{bok_2['l_002_qty']}</td>
                    <td>{bok_2['l_003_item']}</td>
                    <td>{bok_2['l_004_dim_UOM']}</td>
                    <td>{bok_2['l_005_dim_length']}</td>
                    <td>{bok_2['l_006_dim_width']}</td>
                    <td>{bok_2['l_007_dim_height']}</td>
                    <td>{bok_2['l_008_weight_UOM']}</td>
                    <td>{bok_2['l_009_weight_per_each']}</td>
                </tr>
            ));
            pricings = sortedPricings.map((price, index) => (
                <tr key={index} className={bok_1.quote_id ===  price.cost_id && 'selected'}>
                    <td>{price['fp_name']}</td>
                    <td>{price['service_name']}</td>
                    <td>
                        ${price['cost'].toFixed(2)}
                        &nbsp;&nbsp;&nbsp;
                        <i
                            className="fa fa-copy"
                            onClick={() => this.copyToClipBoard(price['cost'].toFixed(2))}
                        ></i>
                    </td>
                    <td>
                        ${(price['cost'].toFixed(2) * (1 + bok_1['client_customer_mark_up'])).toFixed(2)}
                        &nbsp;&nbsp;&nbsp;
                        <i
                            className="fa fa-copy"
                            onClick={() => this.copyToClipBoard((price['cost'].toFixed(2) * (1 + bok_1['client_customer_mark_up'])).toFixed(2))}
                        ></i>
                    </td>
                    <td>{price['eta']}</td>
                    {isPricingPage && !isSalesQuote &&
                        <td>
                            <Button
                                disabled={canBeChanged ? null : 'disabled'}
                                color="primary"
                                onClick={() => this.props.onSelectPricing(price.cost_id, this.props.match.params.id)}
                            >
                                Select
                            </Button>
                        </td>
                    }
                </tr>
            ));
        }

        return (
            <section className="bok-price">
                {this.state.errorMessage || !bok_1 ?
                    <h1>{this.state.errorMessage}</h1>
                    :
                    <div>
                        <p>Main Info:</p>
                        <div className="main-info">
                            <div className="">
                                <strong>Client Order Number: </strong><span>{bok_1['b_client_order_num']}</span><br />
                                <strong>Client Sales Invoice Number: </strong><span>{bok_1['b_client_sales_inv_num']}</span>
                            </div>
                            <div className="pu-info disp-inline-block">
                                <label>Pickup From</label><br />
                                <span>{bok_1['b_028_b_pu_company']}</span><br />
                                <span>{bok_1['b_029_b_pu_address_street_1']}</span><br />
                                <span>{bok_1['b_030_b_pu_address_street_2']}</span><br />
                                <span>{bok_1['b_031_b_pu_address_state'].toUpperCase()}</span><br />
                                <span>{bok_1['b_033_b_pu_address_postalcode']}</span><br />
                                <span>{bok_1['b_032_b_pu_address_suburb']}</span><br />
                                <span>{bok_1['b_034_b_pu_address_country']}</span><br />
                                <span>{bok_1['b_035_b_pu_contact_full_name']}</span><br />
                                <span>{bok_1['b_037_b_pu_email']}</span><br />
                                <span>{bok_1['b_038_b_pu_phone_main']}</span><br />
                            </div>
                            <div className="de-info disp-inline-block">
                                <label>Deliver To</label><br />
                                <span>{bok_1['b_054_b_del_company']}</span><br />
                                <span>{bok_1['b_055_b_del_address_street_1']}</span><br />
                                <span>{bok_1['b_056_b_del_address_street_2']}</span><br />
                                <span>{bok_1['b_057_b_del_address_state'].toUpperCase()}</span><br />
                                <span>{bok_1['b_059_b_del_address_postalcode']}</span><br />
                                <span>{bok_1['b_058_b_del_address_suburb']}</span><br />
                                <span>{bok_1['b_060_b_del_address_country']}</span><br />
                                <span>{bok_1['b_061_b_del_contact_full_name']}</span><br />
                                <span>{bok_1['b_063_b_del_email']}</span><br />
                                <span>{bok_1['b_064_b_del_phone_main']}</span><br />  
                            </div>
                        </div>
                        <p>Lines:</p>
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <thead>
                                <tr>
                                    <th>Type Of Packaging</th>
                                    <th>Quantity</th>
                                    <th>Item</th>
                                    <th>Dim UOM</th>
                                    <th>Lenght</th>
                                    <th>Width</th>
                                    <th>Height</th>
                                    <th>Weight UOM</th>
                                    <th>Weight Per Each</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bok_2s}
                            </tbody>
                        </table>
                        <p>Freight Rates:</p>
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <thead>
                                <tr>
                                    <th style={{width: '15%'}}>Freight Provider</th>
                                    <th style={{width: '15%'}}>Service Name</th>
                                    <th style={{width: '10%'}} onClick={() => this.onClickColumn('lowest')}>Quoted $ (click & sort)</th>
                                    <th style={{width: '10%'}}>Customer Sell</th>
                                    <th style={{width: '15%'}} onClick={() => this.onClickColumn('fastest')}>ETA (click & sort)</th>
                                    {isPricingPage && !isSalesQuote && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {pricings}
                            </tbody>
                        </table>
                        <div className="decision">
                            {!isSalesQuote &&
                                <Button
                                    disabled={canBeChanged ? null : 'disabled'}
                                    color="primary"
                                    onClick={() => this.props.onBookFreight(this.props.match.params.id)}
                                >
                                    {this.props.bookedSuccess ? 'Booked' : 'Book'}
                                </Button>
                            }
                            <Button
                                disabled={canBeChanged ? null : 'disabled'}
                                color="danger"
                                onClick={() => this.props.onCancelFreight(this.props.match.params.id)}
                            >
                                {this.props.canceledSuccess ? 'Quote Canceled' : 'Cancel Quote'}
                            </Button>
                        </div>
                    </div>
                }
                <ToastContainer />
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.bok.errorMessage,
        bokWithPricings: state.bok.BOK_with_pricings,
        needToUpdatePricings: state.bok.needToUpdatePricings,
        bookedSuccess: state.bok.bookedSuccess,
        canceledSuccess: state.bok.canceledSuccess,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getBokWithPricings: (identifier) => dispatch(getBokWithPricings(identifier)),
        onSelectPricing: (costId, identifier) => dispatch(onSelectPricing(costId, identifier)),
        onBookFreight: (identifier) => dispatch(bookFreight(identifier)),
        onCancelFreight: (identifier) => dispatch(cancelFreight(identifier)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BokPricePage);
