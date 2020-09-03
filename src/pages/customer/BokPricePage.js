import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';
import { getBokWithPricings, onSelectPricing } from '../../state/services/bokService';

class BokPricePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
        };
    }

    static propTypes = {
        getBokWithPricings: PropTypes.func.isRequired,
        onSelectPricing: PropTypes.func.isRequired,
        bokWithPricings: PropTypes.object,
        match: PropTypes.object,
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
        const {errorMessage, needToUpdatePricings} = newProps;

        if (errorMessage) {
            this.setState({errorMessage});
        }

        if (needToUpdatePricings) {
            const identifier = this.props.match.params.id;
            this.props.getBokWithPricings(identifier);
        }
    }

    render() {
        let bok_1, bok_2s, pricings;
        let isPricingPage = false;

        if (window.location.href.indexOf('/price/partial/') !== -1) {
            isPricingPage = true;
        }

        if (this.props.bokWithPricings) {
            bok_1 = this.props.bokWithPricings;
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
            pricings = bok_1['pricings'].map((price, index) => (
                <tr key={index} className={bok_1.quote_id ===  price.cost_id && 'selected'}>
                    <td>{price['service_name']}</td>
                    <td>${price['cost'].toFixed(2)}</td>
                    <td>{price['eta']}</td>
                    {!isPricingPage &&
                        <td>
                            <Button
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
                        <div className="main-info">
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
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <thead>
                                <tr>
                                    <th>Service Name</th>
                                    <th>Quoted $</th>
                                    <th>ETA</th>
                                    {!isPricingPage && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {pricings}
                            </tbody>
                        </table>
                    </div>
                }
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.bok.errorMessage,
        bokWithPricings: state.bok.BOK_with_pricings,
        needToUpdatePricings: state.bok.needToUpdatePricings,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getBokWithPricings: (identifier) => dispatch(getBokWithPricings(identifier)),
        onSelectPricing: (costId, identifier) => dispatch(onSelectPricing(costId, identifier)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BokPricePage);
