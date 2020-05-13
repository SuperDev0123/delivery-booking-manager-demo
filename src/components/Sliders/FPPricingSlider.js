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
    };

    calcTotalValue(pricingInfo) {
        return (pricingInfo.client_mu_1_minimum_values + (pricingInfo.tax_value_1 ? pricingInfo.tax_value_1 : 0)).toFixed(2);
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

    render() {
        const {isOpen, booking, clientname, isBooked} = this.props;
        const {pricingInfos} = this.props;

        pricingInfos.sort((a, b) =>  this.calcTotalValue(a) - this.calcTotalValue(b));

        const pricingList = pricingInfos.map((pricingInfo, index) => {
            return (
                <tr key={index} className={booking.api_booking_quote === pricingInfo.id && 'selected'}>
                    <td>{index + 1}</td>
                    <td>{pricingInfo.fk_freight_provider_id}({pricingInfo.account_code})</td>
                    <td>{pricingInfo.service_name}</td>
                    <td>{pricingInfo.etd}</td>
                    {clientname === 'dme' && <td className="text-right">${pricingInfo.fee.toFixed(2)}</td>}
                    {clientname === 'dme' && <td className="text-right">{pricingInfo.mu_percentage_fuel_levy.toFixed(2)}%</td>}
                    <td className="text-right">${pricingInfo.client_mu_1_minimum_values.toFixed(2)}</td>
                    <td>{pricingInfo.tax_id_1}</td>
                    <td>{pricingInfo.tax_value_1 ? '$' + pricingInfo.tax_value_1 : null}</td>
                    <td className="text-right">${this.calcTotalValue(pricingInfo)}</td>
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

        return(
            <SlidingPane
                className='fp-pricing-pan'
                isOpen={isOpen}
                title='Freight Provider Pricing Panel'
                subtitle='List View'
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
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
                            <Button
                                className="lowest"
                                color="primary"
                                disabled={(pricingInfos.length === 0 || isBooked) && 'disabled'}
                                onClick={() => this.onSelectLowest('lowest')}
                            >
                                Select lowest price
                            </Button>
                            <Button
                                className="fastest"
                                color="primary"
                                disabled={(pricingInfos.length === 0 || isBooked) && 'disabled'}
                                onClick={() => this.onSelectFastest('fastest')}
                            >
                                Select fastest price
                            </Button>
                            <table className="table table-hover table-bordered sortable fixed_headers">
                                <tr>
                                    <th className="" scope="col" nowrap><p>No</p></th>
                                    <th className="" scope="col" nowrap><p>Transporter</p></th>
                                    <th className="" scope="col" nowrap><p>Service</p></th>
                                    <th className="" scope="col" nowrap><p>Transport Days(working)</p></th>
                                    {clientname === 'dme' && <th className="" scope="col" nowrap><p>FP Cost</p></th>}
                                    {clientname === 'dme' && <th className="" scope="col" nowrap><p>Fuel Levy %</p></th>}
                                    <th className="" scope="col" nowrap><p>Cost</p></th>
                                    <th className="" scope="col" nowrap><p>Tax ID</p></th>
                                    <th className="" scope="col" nowrap><p>Tax Value</p></th>
                                    <th className="" scope="col" nowrap><p>Total</p></th>
                                    <th className="" scope="col" nowrap><p>ETA DE</p></th>
                                    <th className="" scope="col" nowrap><p>Action</p></th>
                                </tr>
                                { pricingList }
                            </table>
                        </LoadingOverlay>
                    </div>
                </div>
            </SlidingPane>
        );
    }
}

export default FPPricingSlider;
