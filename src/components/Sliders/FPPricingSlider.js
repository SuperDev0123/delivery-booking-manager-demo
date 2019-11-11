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
    };

    render() {
        const {isOpen, pricingInfos} = this.props;

        const pricingList = pricingInfos.map((pricingInfo, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{pricingInfo.fk_freight_provider_id}({pricingInfo.account_code})</td>
                    <td>{pricingInfo.service_name}</td>
                    <td>{pricingInfo.fee}</td>
                    <td>{pricingInfo.etd}</td>
                    <td>{pricingInfo.tax_id_1}</td>
                    <td>{pricingInfo.tax_value_1}</td>
                    <td className="select">
                        <Button color="primary" onClick={() => this.props.onSelectPricing(pricingInfo)}>Select</Button>
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
                                    <p>Service Name</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Fee</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>ETD</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Tax ID</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Tax Value</p>
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