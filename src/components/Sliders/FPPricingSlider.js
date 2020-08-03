import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import moment from 'moment';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import LoadingOverlay from 'react-loading-overlay';
import {sortBy} from 'lodash';

class FPPricingSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTab: 0,
            onLoadedError: false
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        pricingInfos: PropTypes.array.isRequired,
        onSelectPricing: PropTypes.func.isRequired,
        booking: PropTypes.object.isRequired,
        clientname: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isBooked: PropTypes.bool.isRequired,
        onLoadPricingErrors: PropTypes.func.isRequired,
        errors: PropTypes.array.isRequired,
    };

    calcTotalValue(pricingInfo) {
        return (pricingInfo.client_mu_1_minimum_values + (pricingInfo.tax_value_1 ? pricingInfo.tax_value_1 : 0)).toFixed(3);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {isOpen} = newProps;

        if (!isOpen) {
            this.setState({onLoadedError: false});
        }
    }

    onSelectLowest() {
        const {pricingInfos} = this.props;
        const sortedPricingInfos = sortBy(pricingInfos, ['mu_percentage_fuel_levy']);
        this.props.onSelectPricing(sortedPricingInfos[0]);
    }

    onSelectFastest() {
        const {pricingInfos} = this.props;
        const sortedPricingInfos = sortBy(pricingInfos, [function(o) { return o.eta_de_by; }]);
        this.props.onSelectPricing(sortedPricingInfos[0]);
    }

    onSelectTab(value) {
        this.setState({currentTab:value});

        if (value === 1 && !this.state.onLoadedError) {
            this.props.onLoadPricingErrors();
            this.setState({onLoadedError: true});
        }
    }

    render() {
        const {isOpen, booking, clientname, isBooked} = this.props;
        const {pricingInfos, errors} = this.props;
        const { currentTab} = this.state;
        pricingInfos.sort((a, b) =>  this.calcTotalValue(a) - this.calcTotalValue(b));

        const pricingList = pricingInfos.map((pricingInfo, index) => {
            return (
                <tr key={index} className={booking.api_booking_quote === pricingInfo.id && 'selected'}>
                    <td>{index + 1}</td>
                    <td>{pricingInfo.fk_freight_provider_id}({pricingInfo.account_code})</td>
                    <td>{pricingInfo.service_name}</td>
                    <td>{pricingInfo.etd}</td>
                    {clientname === 'dme' && <td className="text-right">${pricingInfo.fee.toFixed(3)}</td>}
                    {clientname === 'dme' && <td className="text-right">{pricingInfo.mu_percentage_fuel_levy.toFixed(3)}%</td>}
                    {clientname === 'dme' &&
                        <td className="text-right">
                            ${(parseFloat(pricingInfo.fee) * (1 + parseFloat(pricingInfo.mu_percentage_fuel_levy))).toFixed(3)}
                        </td>
                    }
                    <td className="text-right">${pricingInfo.client_mu_1_minimum_values.toFixed(3)}</td>
                    <td>{pricingInfo.tax_id_1}</td>
                    <td>{pricingInfo.tax_value_1 ? '$' + pricingInfo.tax_value_1 : null}</td>
                    <td className="text-right none">${this.calcTotalValue(pricingInfo)}</td>
                    <td className={pricingInfo.is_deliverable ? 'text-right bg-lightgreen' : 'text-right'}>
                        {pricingInfo && pricingInfo.eta_de_by ? moment(pricingInfo.eta_de_by).format('DD/MM/YYYY') : ''}
                    </td>
                    <td className="select">
                        <Button
                            color="primary"
                            disabled={(booking.api_booking_quote === pricingInfo.id || isBooked) && 'disabled'}
                            onClick={() => this.props.onSelectPricing(pricingInfo)}
                        >
                            Select
                        </Button>
                    </td>
                </tr>
            );
        });

        (errors || []).sort((a, b) =>  {
            if (a.fp_name > b.fp_name)
                return 1;
            else if (a.fp_name < b.fp_name)
                return -1;
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

        return(
            <SlidingPane
                className='fp-pricing-pan'
                isOpen={isOpen}
                title='Freight Provider Pricing Panel'
                subtitle='List View'
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
                    <div id="headr" className="col-md-12 mb-5 qbootstrap-nav">
                        <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12">
                            <ul className="nav nav-tabs">
                                <li className={currentTab == 0 ? 'active' : ''}>
                                    <a onClick={(e) => this.onSelectTab(0, e)}>All Pricings</a>
                                </li>
                                <li className={currentTab == 1 ? 'active' : ''}>
                                    <a onClick={(e) => this.onSelectTab(1, e)}>Errors</a>
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
                            {currentTab === 0 ?
                                <table className="table table-hover table-bordered sortable fixed_headers">
                                    <tr>
                                        <th className="" scope="col" nowrap><p>No</p></th>
                                        <th className="" scope="col" nowrap><p>Transporter</p></th>
                                        <th className="" scope="col" nowrap><p>Service</p></th>
                                        <th className="" scope="col" nowrap><p>Transport Days(working)</p></th>
                                        {clientname === 'dme' && <th className="" scope="col" nowrap><p>FP Cost</p></th>}
                                        {clientname === 'dme' && <th className="" scope="col" nowrap><p>Fuel Levy %</p></th>}
                                        {clientname === 'dme' && <th className="" scope="col" nowrap><p>Quoted Cost</p></th>}
                                        <th className="" scope="col" nowrap><p>Quoted $</p></th>
                                        <th className="" scope="col" nowrap><p>Tax ID</p></th>
                                        <th className="" scope="col" nowrap><p>Tax Value</p></th>
                                        <th className="none" scope="col" nowrap><p>Total</p></th>
                                        <th className="" scope="col" nowrap><p>ETA DE</p></th>
                                        <th className="" scope="col" nowrap><p>Action</p></th>
                                    </tr>
                                    { pricingList }
                                </table>
                                :
                                null
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
                        </LoadingOverlay>
                    </div>
                </div>
            </SlidingPane>
        );
    }
}

export default FPPricingSlider;
