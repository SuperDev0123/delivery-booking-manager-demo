import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getBokWithPricings } from '../../state/services/bokService';

class BokPricePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
        };
    }

    static propTypes = {
        getBokWithPricings: PropTypes.func.isRequired,
        bokWithPricings: PropTypes.object,
        match: PropTypes.object,
    };

    componentDidMount() {
        const identifier = this.props.match.params.id;

        if (identifier && identifier.length === 64) {
            this.props.getBokWithPricings(identifier);
        } else {
            this.setState({errorMessage: 'Wrong id.'});
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {errorMessage} = newProps;

        if (errorMessage) {
            this.setState({errorMessage});
        }
    }

    render() {
        let bok_1, bok_2s, pricings;

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
                <tr key={index}>
                    <td>${price['cost']}</td>
                    <td>{price['fee'] ? `$${price['fee']}` : ''}</td>
                    <td>{price['eta']}</td>
                </tr>
            ));
        }

        return (
            <section>
                {this.state.errorMessage || !bok_1 ?
                    <h1>{this.state.errorMessage}</h1>
                    :
                    <div>
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Pickup From</th>
                                    <th>Deliver To</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Company</td>
                                    <td>{bok_1['b_028_b_pu_company']}</td>
                                    <td>{bok_1['b_054_b_del_company']}</td>
                                </tr>
                                <tr>
                                    <td>Street 1</td>
                                    <td>{bok_1['b_029_b_pu_address_street_1']}</td>
                                    <td>{bok_1['b_055_b_del_address_street_1']}</td>
                                </tr>
                                <tr>
                                    <td>Street 2</td>
                                    <td>{bok_1['b_030_b_pu_address_street_2']}</td>
                                    <td>{bok_1['b_056_b_del_address_street_2']}</td>
                                </tr>
                                <tr>
                                    <td>State</td>
                                    <td>{bok_1['b_031_b_pu_address_state']}</td>
                                    <td>{bok_1['b_057_b_del_address_state']}</td>
                                </tr>
                                <tr>
                                    <td>Postal Code</td>
                                    <td>{bok_1['b_033_b_pu_address_postalcode']}</td>
                                    <td>{bok_1['b_059_b_del_address_postalcode']}</td>
                                </tr>
                                <tr>
                                    <td>Suburb</td>
                                    <td>{bok_1['b_032_b_pu_address_suburb']}</td>
                                    <td>{bok_1['b_058_b_del_address_suburb']}</td>
                                </tr>
                                <tr>
                                    <td>Country</td>
                                    <td>{bok_1['b_034_b_pu_address_country']}</td>
                                    <td>{bok_1['b_060_b_del_address_country']}</td>
                                </tr>
                                <tr>
                                    <td>Contact</td>
                                    <td>{bok_1['b_035_b_pu_contact_full_name']}</td>
                                    <td>{bok_1['b_061_b_del_contact_full_name']}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{bok_1['b_037_b_pu_email']}</td>
                                    <td>{bok_1['b_063_b_del_email']}</td>
                                </tr>
                                <tr>
                                    <td>Phone</td>
                                    <td>{bok_1['b_038_b_pu_phone_main']}</td>
                                    <td>{bok_1['b_064_b_del_phone_main']}</td>
                                </tr>
                            </tbody>
                        </table>
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
                                    <th>Cost</th>
                                    <th>Fee</th>
                                    <th>ETA</th>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getBokWithPricings: (identifier) => dispatch(getBokWithPricings(identifier)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BokPricePage);
