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
        pricingInfos: PropTypes.array.isRequired,
        onSelectPricing: PropTypes.func.isRequired,
        clientname: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isBooked: PropTypes.bool.isRequired,
        onLoadPricingErrors: PropTypes.func.isRequired,
        errors: PropTypes.array.isRequired,
        x_manual_booked_flag: PropTypes.bool,
        api_booking_quote_id: PropTypes.number,
    };

    notify = (text) => toast(text);

    UNSAFE_componentWillReceiveProps(newProps) {
        const {isOpen} = newProps;

        if (!isOpen) {
            this.setState({onLoadedError: false});
        }
    }

    onSelectLowest() {
        const {pricingInfos, x_manual_booked_flag} = this.props;

        if (x_manual_booked_flag) {
            this.notify('Cannot select a FC, this booking is manually booked');
        } else {
            const sortedPricingInfos = sortBy(pricingInfos, ['mu_percentage_fuel_levy']);
            this.props.onSelectPricing(sortedPricingInfos[0]);
        }
    }

    onSelectFastest() {
        const {pricingInfos, x_manual_booked_flag} = this.props;

        if (x_manual_booked_flag) {
            this.notify('Cannot select a FC, this booking is manually booked');
        } else {
            const sortedPricingInfos = sortBy(pricingInfos, [function(o) { return o.eta_de_by; }]);
            this.props.onSelectPricing(sortedPricingInfos[0]);
        }
    }

    onClickSelect(pricingInfo) {
        const {x_manual_booked_flag} = this.props;

        if (x_manual_booked_flag) {
            this.notify('Cannot select a FC, this booking is manually booked');
        } else {
            this.props.onSelectPricing(pricingInfo);
        }
    }

    onSelectTab(value) {
        this.setState({currentTab:value});

        if (value === 1 && !this.state.onLoadedError) {
            this.props.onLoadPricingErrors();
            this.setState({onLoadedError: true});
        }
    }

    onClickSurcharge(pricingInfo) {
        this.setState({currentTab: 2, selectedSurcharge: pricingInfo.surcharges});
    }

    render() {
        const {isOpen, clientname, isBooked, api_booking_quote_id} = this.props;
        const {pricingInfos, errors} = this.props;
        const { currentTab, selectedSurcharge} = this.state;
        let surchargeList = null;
        pricingInfos.sort((a, b) =>  a.client_mu_1_minimum_values - b.client_mu_1_minimum_values);
        let pricingTables = [];

        for (let packed_status of ['original', 'auto', 'manual', 'scanned']) {
            const pricingList = pricingInfos
                .filter(pricingInfo => pricingInfo.packed_status === packed_status)
                .map((pricingInfo, index) => {
                    return (
                        <tr key={index} className={api_booking_quote_id === pricingInfo.id && 'selected'}>
                            <td>{index + 1}</td>
                            <td>{pricingInfo.freight_provider}({pricingInfo.account_code})</td>
                            <td>{pricingInfo.vehicle_name ? `${pricingInfo.service_name} (${pricingInfo.vehicle_name})` : pricingInfo.service_name}</td>
                            <td>{pricingInfo.etd}</td>
                            {clientname === 'dme' && <td className="text-right">${pricingInfo.fee.toFixed(2)}</td>}
                            {clientname === 'dme' && <td className="text-right">${pricingInfo.surcharge_total.toFixed(2)}</td>}
                            {clientname === 'dme' && <td className="text-right">{(pricingInfo.mu_percentage_fuel_levy * 100).toFixed(2)}%</td>}
                            {clientname === 'dme' && <td className="text-right">${pricingInfo.fuel_levy_base.toFixed(2)}</td>}
                            {clientname === 'dme' &&<td className="text-right">${(pricingInfo.fee + pricingInfo.fuel_levy_base + pricingInfo.surcharge_total).toFixed(2)}</td>}
                            {clientname === 'dme' && <td className="text-right">{(pricingInfo.client_mark_up_percent * 100).toFixed(2)}%</td>}
                            <td className="text-right">${pricingInfo.cost_dollar.toFixed(2)}</td>
                            <td className="text-right">{(pricingInfo.mu_percentage_fuel_levy * 100).toFixed(2)}%</td>
                            <td className="text-right">${pricingInfo.fuel_levy_base_cl.toFixed(2)}</td>
                            <td className="text-right nowrap">
                                {pricingInfo.surcharge_total_cl ? '$' + (pricingInfo.surcharge_total_cl * (1 + pricingInfo.client_customer_mark_up)).toFixed(2) : null}
                                &nbsp;&nbsp;&nbsp;
                                {pricingInfo.surcharge_total_cl ? <i className="fa fa-dollar-sign" onClick={() => this.onClickSurcharge(pricingInfo)}></i> : null}
                            </td>
                            <td className="text-right">${pricingInfo.client_mu_1_minimum_values.toFixed(2)}</td>
                            <td className="text-right">{(pricingInfo.client_customer_mark_up * 100).toFixed(2)}%</td>
                            <td className="text-right">${(pricingInfo.client_mu_1_minimum_values  * (1 + pricingInfo.client_customer_mark_up)).toFixed(2)}</td>
                            <td className={pricingInfo.is_deliverable ? 'text-right bg-lightgreen' : 'text-right'}>
                                {pricingInfo && pricingInfo.eta_de_by ? moment(pricingInfo.eta_de_by).format('DD/MM/YYYY') : ''}
                            </td>
                            <td className="select">
                                <Button
                                    color="primary"
                                    disabled={(api_booking_quote_id === pricingInfo.id || isBooked) && 'disabled'}
                                    onClick={() => this.onClickSelect(pricingInfo)}
                                >
                                    Select
                                </Button>
                            </td>
                        </tr>
                    );
                });
            const pricingTable = pricingList.length > 0 ? (
                <table className="table table-hover table-bordered sortable fixed_headers">
                    <tr>
                        <th className="nowrap" scope="col" nowrap><p>No</p></th>
                        <th className="nowrap" scope="col" nowrap><p>Transporter</p></th>
                        <th className="nowrap" scope="col" nowrap><p>Service (Vehicle)</p></th>
                        <th className="nowrap" scope="col" nowrap><p>Transport Days (working)</p></th>
                        {clientname === 'dme' && <th className="nowrap" scope="col" nowrap><p>FP Cost (Ex GST)</p></th>}
                        {clientname === 'dme' && <th className="nowrap" scope="col" nowrap><p>FP Extra`s (Ex GST)</p></th>}
                        {clientname === 'dme' && <th className="nowrap" scope="col" nowrap><p>FP Fuel Levy %</p></th>}
                        {clientname === 'dme' && <th className="nowrap" scope="col" nowrap><p>FP Fuel Levy Amount</p></th>}
                        {clientname === 'dme' && <th className="nowrap" scope="col" nowrap><p>FP Total Cost (Ex GST)</p></th>}
                        {clientname === 'dme' && <th className="nowrap" scope="col" nowrap><p>DME Client Markup %</p></th>}
                        <th className="nowrap" scope="col" nowrap><p>Cost $</p></th>
                        <th className="nowrap" scope="col" nowrap><p>FP Fuel Levy %</p></th>
                        <th className="nowrap" scope="col" nowrap><p>FP Fuel Levy Amount</p></th>
                        <th className="nowrap" scope="col" nowrap><p>Extra $</p></th>
                        <th className="nowrap" scope="col" nowrap><p>Total $ (Ex. GST)</p></th>
                        <th className="nowrap" scope="col" nowrap><p>Client Customer Markup %</p></th>
                        <th className="nowrap" scope="col" nowrap><p>Sell $</p></th>
                        <th className="nowrap" scope="col" nowrap><p>ETA</p></th>
                        <th className="nowrap" scope="col" nowrap><p>Action</p></th>
                    </tr>
                    { pricingList }
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
            surchargeList = selectedSurcharge.map((surcharge, index) => {
                if (parseInt(surcharge['qty']) === 0)
                    return (
                        <p className="surcharge" key={index}>
                            <strong>Name:</strong> {surcharge['name']}<br />
                            <strong>Description:</strong> {surcharge['description']}<br />
                            <strong>Amount:</strong> {surcharge['amount']}<br />
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
                                    <a onClick={(e) => this.onSelectTab(0, e)}>All Pricing</a>
                                </li>
                                <li className={currentTab == 1 ? 'active' : ''}>
                                    <a onClick={(e) => this.onSelectTab(1, e)}>Errors</a>
                                </li>
                                <li className={currentTab == 2 ? 'active' : ''}>
                                    <a onClick={(e) => this.onSelectTab(2, e)}>Surcharges</a>
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
                                    disabled={(pricingInfos.length === 0 || isBooked) && 'disabled'}
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
                                    disabled={(pricingInfos.length === 0 || isBooked) && 'disabled'}
                                    onClick={() => this.onSelectFastest('fastest')}
                                >
                                    Select fastest price
                                </Button>
                                :
                                null
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
                                <table className="table table-hover table-bordered sortable fixed_headers">
                                    <tr>
                                        <th className="" scope="col" nowrap><p>No</p></th>
                                        <th className="" scope="col" nowrap><p>Freight Provider</p></th>
                                        <th className="" scope="col" nowrap><p>Account Code</p></th>
                                        <th className="" scope="col" nowrap><p>Error Code</p></th>
                                        <th className="" scope="col" nowrap><p>Error Description</p></th>
                                    </tr>
                                    { errorsList }
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
