import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

class FPPricingSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleShowSlider: PropTypes.func.isRequired,
        pricingInfos: PropTypes.array.isRequired,
        onSelectPricing: PropTypes.func.isRequired,
        booking: PropTypes.object.isRequired,
        clientname: PropTypes.string.isRequired,
    };

    render() {
        const {isOpen, pricingInfos, booking, clientname} = this.props;

        const pricingList = pricingInfos.map((pricingInfo, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{pricingInfo.fk_freight_provider_id}({pricingInfo.account_code})</td>
                    <td>{pricingInfo.service_name}</td>
                    <td>{pricingInfo.etd}</td>
                    {
                        clientname === 'dme' ? <td>${pricingInfo.fee.toFixed(2)}</td> : null
                    }
                    {
                        clientname === 'dme' ? <td>{pricingInfo.mu_percentage_fuel_levy.toFixed(2)}%</td> : null
                    }
                    <td>${pricingInfo.client_mu_1_minimum_values.toFixed(2)}</td>
                    <td>{pricingInfo.tax_id_1}</td>
                    <td>{pricingInfo.tax_value_1 ? '$' + pricingInfo.tax_value_1 : null}</td>
                    <td>${(pricingInfo.client_mu_1_minimum_values + (pricingInfo.tax_value_1 ? pricingInfo.tax_value_1 : 0)).toFixed(2)}</td>
                    <td className="select">
                        <Button
                            color="primary"
                            disabled={booking.api_booking_quote === pricingInfo.id ? 'disabled': null}
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
                onRequestClose={this.props.toggleShowSlider}
            >
                <div className="slider-content">
                    <div className="table-view">
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <tr>
                                <th className="" scope="col" nowrap>
                                    <p>No</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Freight Provider</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Service</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Transport Days(working)</p>
                                </th>
                                {
                                    clientname === 'dme' ? <th className="" scope="col" nowrap><p>FP Cost</p></th> : null
                                }
                                {
                                    clientname === 'dme' ? <th className="" scope="col" nowrap><p>MU %</p></th> : null
                                }
                                <th className="" scope="col" nowrap>
                                    <p>Cost</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Tax ID</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Tax Value</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Total</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Action</p>
                                </th>
                            </tr>
                            { pricingList }
                        </table>
                    </div>
                </div>
            </SlidingPane>
        );
    }
}

export default FPPricingSlider;
