import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import moment from 'moment';
import {sortBy} from 'lodash';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from 'react-loading-overlay';
import { numberWithCommas } from '../../commons/helpers';

class FPPricingSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTab: 0, // 0: All Pricing, 1: Errors, 2: Surcharges
            onLoadedError: false,
            selectedSurcharge: null
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        pricings: PropTypes.array.isRequired,
        onSelectPricing: PropTypes.func.isRequired,
        clientname: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isBooked: PropTypes.bool.isRequired,
        onLoadPricingErrors: PropTypes.func.isRequired,
        errors: PropTypes.array.isRequired,
        x_manual_booked_flag: PropTypes.bool,
        api_booking_quote_id: PropTypes.number,
        clientSalesTotal: PropTypes.number,
        is_quote_locked: PropTypes.bool,
    };

    notify = (text) => toast(text);

    UNSAFE_componentWillReceiveProps(newProps) {
        const {isOpen} = newProps;

        if (!isOpen) {
            this.setState({onLoadedError: false});
        }
    }

    onSelectLowest() {
        const {pricings, x_manual_booked_flag} = this.props;

        if (x_manual_booked_flag) {
            this.notify('Cannot select a FC, this booking is manually booked');
        } else {
            const sortedpricings = sortBy(pricings, ['mu_percentage_fuel_levy']);
            this.props.onSelectPricing(sortedpricings[0], this.props.is_quote_locked);
        }
    }

    onSelectFastest() {
        const {pricings, x_manual_booked_flag} = this.props;

        if (x_manual_booked_flag) {
            this.notify('Cannot select a FC, this booking is manually booked');
        } else {
            const sortedpricings = sortBy(pricings, [function(o) { return o.eta_de_by; }]);
            this.props.onSelectPricing(sortedpricings[0], this.props.is_quote_locked);
        }
    }

    onClickSelect(pricing, isLocking) {
        const {x_manual_booked_flag, clientname} = this.props;

        if (x_manual_booked_flag && clientname !== 'dme') {
            this.notify('Cannot select a FC, this booking is manually booked');
        } else {
            this.props.onSelectPricing(pricing, isLocking);
        }
    }

    onLockPricing(pricing, api_booking_quote_id, is_quote_locked) {
        if (!is_quote_locked) {
            this.onClickSelect(pricing, true);
        } else {
            if (pricing.id === api_booking_quote_id) {
                this.onClickSelect(pricing, !is_quote_locked);
            } else {
                this.onClickSelect(pricing, is_quote_locked);
            }
        }
    }

    onSelectTab(value) {
        this.setState({currentTab: value});

        if (value === 1 && !this.state.onLoadedError) {
            this.props.onLoadPricingErrors();
            this.setState({onLoadedError: true});
        }
    }

    onClickSurcharge(pricing) {
        this.setState({currentTab: 2, selectedSurcharge: pricing.surcharges});
    }

    render() {
        const {isOpen, clientname, isBooked, api_booking_quote_id, clientSalesTotal, is_quote_locked} = this.props;
        const {pricings, errors} = this.props;
        const { currentTab, selectedSurcharge} = this.state;
        let surchargeList = null;
        pricings.sort((a, b) =>  a.client_mu_1_minimum_values - b.client_mu_1_minimum_values);
        let pricingTables = [];

        for (let packed_status of ['original', 'auto', 'manual', 'scanned']) {
            const pricingList = pricings
                .filter(pricing => pricing.packed_status === packed_status)
                .map((pricing, index) => {
                    let clientSalesTotal5Percent = 0;

                    if (clientSalesTotal)
                        clientSalesTotal5Percent = clientSalesTotal * 0.05;

                    let clientCustomerMarkup = (pricing.client_customer_mark_up * 100).toFixed(2);
                    let clientCustomerPrice = (pricing.client_mu_1_minimum_values  * (1 + pricing.client_customer_mark_up)).toFixed(2);

                    if (clientCustomerPrice < clientSalesTotal5Percent) {
                        clientCustomerMarkup = 0;
                        clientCustomerPrice = clientSalesTotal5Percent;
                    }

                    return (
                        <tr key={index} className={api_booking_quote_id === pricing.id ? 'selected' : '' }>
                            <td>{index + 1}</td>
                            <td>{pricing.freight_provider}({pricing.account_code})</td>
                            <td>{pricing.vehicle_name ? `${pricing.service_desc} (${pricing.vehicle_name})` : pricing.service_desc}</td>
                            <td>{pricing.etd}</td>
                            {clientname === 'dme' && <td className="text-right">${numberWithCommas(pricing.fee, 2)}</td>}
                            {clientname === 'dme' && <td className="text-right">${numberWithCommas(pricing.surcharge_total,2)}</td>}
                            {clientname === 'dme' && <td className="text-right">{(pricing.mu_percentage_fuel_levy * 100).toFixed(2)}%</td>}
                            {clientname === 'dme' && <td className="text-right">${numberWithCommas(pricing.fuel_levy_base, 2)}</td>}
                            {clientname === 'dme' &&<td className="text-right">${numberWithCommas(pricing.fee + pricing.fuel_levy_base + pricing.surcharge_total, 2)}</td>}
                            {clientname === 'dme' && <td className="text-right">{(pricing.client_mark_up_percent * 100).toFixed(2)}%</td>}
                            <td className="text-right">${numberWithCommas(pricing.cost_dollar, 2)}</td>
                            <td className="text-right">{(pricing.mu_percentage_fuel_levy * 100).toFixed(2)}%</td>
                            <td className="text-right">${numberWithCommas(pricing.fuel_levy_base_cl, 2)}</td>
                            <td className="text-right nowrap">
                                {pricing.surcharge_total_cl ? ('$' + numberWithCommas(pricing.surcharge_total_cl, 2)) : null}
                                &nbsp;&nbsp;&nbsp;
                                {pricing.surcharge_total_cl ? <i className="fa fa-dollar-sign" onClick={() => this.onClickSurcharge(pricing)}></i> : null}
                            </td>
                            <td className="text-right">${numberWithCommas(pricing.client_mu_1_minimum_values, 2)}</td>
                            <td className="text-right">{numberWithCommas(clientCustomerMarkup, 2)}%</td>
                            <td className="text-right">${numberWithCommas(clientCustomerPrice, 2)}</td>
                            <td className={pricing.is_deliverable ? 'text-right bg-lightgreen' : 'text-right'}>
                                {pricing && pricing.eta_de_by ? moment(pricing.eta_de_by).format('DD/MM/YYYY') : ''}
                            </td>
                            <td className="select">
                                <Button
                                    color="primary"
                                    disabled={(api_booking_quote_id === pricing.id || (isBooked && clientname !== 'dme'))}
                                    onClick={() => this.onClickSelect(pricing)}
                                >
                                    Select
                                </Button>
                            </td>
                            <td>
                                <input
                                    type='checkbox'
                                    color={api_booking_quote_id === pricing.id ? 'success' : 'primary'}
                                    checked={api_booking_quote_id === pricing.id && is_quote_locked}
                                    onClick={() => this.onLockPricing(pricing, api_booking_quote_id, is_quote_locked)}
                                />
                            </td>
                        </tr>
                    );
                });
            const pricingTable = pricingList.length > 0 ? (
                <table className="table table-hover table-bordered table-striped sortable fixed_headers">
                    <thead>
                        <tr>
                            <th className="nowrap" scope="col" nowrap="true"><p>No</p></th>
                            <th className="nowrap" scope="col" nowrap="true"><p>Transporter</p></th>
                            <th className="nowrap" scope="col" nowrap="true"><p>Service (Vehicle)</p></th>
                            <th className="nowrap" scope="col" nowrap="true"><p>Transport Days (working)</p></th>
                            {clientname === 'dme' && <th className="nowrap" scope="col" nowrap="true"><p>FP Cost (Ex GST)</p></th>}
                            {clientname === 'dme' && <th className="nowrap" scope="col" nowrap="true"><p>FP Extra`s (Ex GST)</p></th>}
                            {clientname === 'dme' && <th className="nowrap" scope="col" nowrap="true"><p>FP Fuel Levy %</p></th>}
                            {clientname === 'dme' && <th className="nowrap" scope="col" nowrap="true"><p>FP Fuel Levy Amount</p></th>}
                            {clientname === 'dme' && <th className="nowrap" scope="col" nowrap="true"><p>FP Total Cost (Ex GST)</p></th>}
                            {clientname === 'dme' && <th className="nowrap" scope="col" nowrap="true"><p>DME Client Markup %</p></th>}
                            <th className="nowrap" scope="col" nowrap="true"><p>Cust Cost $</p></th>
                            <th className="nowrap" scope="col" nowrap="true"><p>FP Fuel Levy %</p></th>
                            <th className="nowrap" scope="col" nowrap="true"><p>FP Fuel Levy Amount</p></th>
                            <th className="nowrap" scope="col" nowrap="true"><p>Extra $</p></th>
                            <th className="nowrap" scope="col" nowrap="true"><p>Total $ (Ex. GST)</p></th>
                            <th className="nowrap" scope="col" nowrap="true"><p>Client Customer Markup %</p></th>
                            <th className="nowrap" scope="col" nowrap="true"><p>Cust Sell $</p></th>
                            <th className="nowrap" scope="col" nowrap="true"><p>ETA</p></th>
                            <th className="nowrap" scope="col" nowrap="true"><p>Action</p></th>
                            <th className="nowrap" scope="col" nowrap="true"><p>Lock</p></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pricingList }
                    </tbody>
                </table>
            ) : 'No results';
            pricingTables.push(pricingTable);
        }

        (errors || []).sort((a, b) =>  {
            if (a.fp_name > b.fp_name) return 1;
            else if (a.fp_name < b.fp_name) return -1;
            else return 0;
        });

        const errorsList = (errors || []).map((error, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{error.fp_name}</td>
                    <td>{error.accountCode}</td>
                    <td>{error.error_code}</td>
                    <td>{error.error_description}</td>
                </tr>
            );
        });

        if (selectedSurcharge) {
            surchargeList = selectedSurcharge
                .filter(surcharge => clientname === 'dme' || surcharge.visible)
                .map((surcharge, index) => {
                    return (
                        <p className="surcharge" key={index}>
                            <strong>Name:</strong> {surcharge['name']}<br />
                            <strong>Description:</strong> {surcharge['description']}<br />
                            <strong>Amount:</strong> {surcharge['amount']}<br />
                            <strong>Qty:</strong> {surcharge['qty'] || 1}<br />
                            <strong>Manually added?:</strong> {surcharge['is_manually_entered'] ? 'Yes' : 'No'}<br />
                            <hr />
                        </p>
                    );
                });
        }

        return(
            <SlidingPane
                className='fp-pricing-pan'
                isOpen={isOpen}
                title='Freight Provider Pricing Panel'
                subtitle='List View'
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
                    <div id="headr" className="col-md-12 mb-5">
                        <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12">
                            <ul className="nav nav-tabs">
                                <li className={currentTab == 0 ? 'active' : ''}>
                                    <a onClick={() => this.onSelectTab(0)}>All Pricing</a>
                                </li>
                                <li className={currentTab == 1 ? 'active' : ''}>
                                    <a onClick={() => this.onSelectTab(1)}>Errors</a>
                                </li>
                                <li className={currentTab == 2 ? 'active' : ''}>
                                    <a onClick={() => this.onSelectTab(2)}>Surcharges</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="table-view">
                        <LoadingOverlay
                            active={this.props.isLoading}
                            spinner
                            text='Loading...'
                            styles={{
                                spinner: (base) => ({
                                    ...base,
                                    '& svg circle': {
                                        stroke: '#048abb'
                                    }
                                })
                            }}
                        >
                            {currentTab === 0 ?
                                <Button
                                    className="lowest"
                                    color="primary"
                                    disabled={(pricings.length === 0 || isBooked)}
                                    onClick={() => this.onSelectLowest('lowest')}
                                >
                                    Select lowest price
                                </Button>
                                :
                                null
                            }
                            {currentTab === 0 ?
                                <Button
                                    className="fastest"
                                    color="primary"
                                    disabled={(pricings.length === 0 || isBooked)}
                                    onClick={() => this.onSelectFastest('fastest')}
                                >
                                    Select fastest price
                                </Button>
                                :
                                null
                            }
                            {currentTab === 0 && clientSalesTotal &&
                                <h3><strong>Sales Total Value:</strong> {clientSalesTotal}</h3>
                            }
                            {currentTab === 0 &&
                                pricingTables.map((pricingTable, i) =>
                                    <div key={i} className="pricing-table">
                                        { i === 0 && <h3>Send As</h3> }
                                        { i === 1 && <h3>Auto Repacked</h3> }
                                        { i === 2 && <h3>Manual Repacked</h3> }
                                        { i === 3 && <h3>Actual Packed / Packing Scans</h3> }
                                        <div className="table-wrapper">{pricingTable}</div>
                                    </div>
                                )
                            }
                            {currentTab === 1 ?
                                <table className="table table-hover table-bordered table-striped sortable fixed_headers">
                                    <thead>
                                        <tr>
                                            <th className="" scope="col" nowrap="true"><p>No</p></th>
                                            <th className="" scope="col" nowrap="true"><p>Freight Provider</p></th>
                                            <th className="" scope="col" nowrap="true"><p>Account Code</p></th>
                                            <th className="" scope="col" nowrap="true"><p>Error Code</p></th>
                                            <th className="" scope="col" nowrap="true"><p>Error Description</p></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { errorsList }
                                    </tbody>
                                </table>
                                :
                                null
                            }
                            {currentTab === 2 ?
                                surchargeList ?
                                    <div>{surchargeList}</div>
                                    :
                                    <p>Please select surcharge $ sign on [ALL PRICING] tab.</p>
                                : null
                            }
                        </LoadingOverlay>
                    </div>
                </div>
                <ToastContainer />
            </SlidingPane>
        );
    }
}

export default FPPricingSlider;
