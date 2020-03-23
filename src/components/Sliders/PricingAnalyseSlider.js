import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

class PriceAnalyseSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        pricingAnalyses: PropTypes.array.isRequired,
        onSelectPricing: PropTypes.func.isRequired,
        booking: PropTypes.object.isRequired,
        clientname: PropTypes.string.isRequired,
    };

    render() {
        const {isOpen, pricingAnalyses, booking, clientname} = this.props;

        const analysesList = pricingAnalyses.map((pricingInfo, index) => {
            return (
                <tr key={index} className={booking.api_booking_quote === pricingInfo.id && 'selected'}>
                    <td>{index + 1}</td>
                    <td>{pricingInfo.fk_freight_provider_id}({pricingInfo.account_code})</td>
                    <td>{pricingInfo.service_name}</td>
                    <td>{pricingInfo.etd}</td>
                    {
                        clientname === 'dme' ? <td className="text-right">${pricingInfo.fee.toFixed(2)}</td> : null
                    }
                    {
                        clientname === 'dme' ? <td className="text-right">{pricingInfo.mu_percentage_fuel_levy.toFixed(2)}%</td> : null
                    }
                    <td className="text-right">${pricingInfo.client_mu_1_minimum_values.toFixed(2)}</td>
                    <td>{pricingInfo.tax_id_1}</td>
                    <td>{pricingInfo.tax_value_1 ? '$' + pricingInfo.tax_value_1 : null}</td>
                    <td className="text-right">${(pricingInfo.client_mu_1_minimum_values + (pricingInfo.tax_value_1 ? pricingInfo.tax_value_1 : 0)).toFixed(2)}</td>
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
                title='Pricing Analyses Panel'
                subtitle='List View'
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
                    <div className="table-view">
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <tr>
                                <th className="" scope="col" nowrap>
                                    <p>No</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Count</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Freight Provider</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Low Price</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>High Price</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Average Price</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Etd</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Service Name</p>
                                </th>
                            </tr>
                            { analysesList }
                        </table>
                    </div>
                </div>
            </SlidingPane>
        );
    }
}

export default PriceAnalyseSlider;
