import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';

import { updateBok_1 } from '../../state/services/bokService';

class FreightOptionAccordion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: true,
            needToUpdate: false,
        };
    }

    static propTypes = {
        bok_1: PropTypes.array.isRequired,
        updateBok_1: PropTypes.func.isRequired,
        onClickAutoRepack: PropTypes.func.isRequired,
    }

    onClickHeader = (e) => {
        e.preventDefault();
        if (e.target.type !== 'button') {
            this.setState({isOpen: !this.state.isOpen});
        }
    }

    onInputChange(e) {
        const {bok_1} = this.props;

        if (
            e.target.name === 'b_072_b_pu_no_of_assists' ||
            e.target.name === 'b_079_b_pu_floor_number' ||
            e.target.name === 'b_073_b_del_no_of_assists' ||
            e.target.name === 'b_069_b_del_floor_number'
        ) {
            bok_1[e.target.name] = parseInt(e.target.value);
        } else if (
            e.target.name === 'b_019_b_pu_tail_lift' ||
            e.target.name === 'b_041_b_del_tail_lift' ||
            e.target.name === 'b_081_b_pu_auto_pack'
        ) {
            bok_1[e.target.name] = e.target.checked;
        } else {
            bok_1[e.target.name] = e.target.value;
        }

        this.setState({needToUpdate: true});

        if (e.target.name === 'b_081_b_pu_auto_pack') {
            this.props.onClickAutoRepack(e.target.checked);
        }
    }

    onClickSave(e) {
        e.preventDefault();
        const bok_1 = {...this.props.bok_1};

        delete bok_1.bok_2s;
        delete bok_1.pricings;

        this.props.updateBok_1(bok_1);
        this.setState({needToUpdate: false});
    }

    render() {
        const {isOpen, needToUpdate} = this.state;
        const {bok_1} = this.props;
        let carton_cnt = 0;
        let is_auto_pack_checked = false;

        bok_1.bok_2s.map(bok_2 => {
            if (bok_2['l_001_type_of_packaging'] && bok_2['l_001_type_of_packaging'].toLowerCase() === 'ctn') {
                carton_cnt += bok_2['l_002_qty'];
            }
        });

        if (bok_1['b_081_b_pu_auto_pack'] === null) {
            if (carton_cnt > 2)
                is_auto_pack_checked = true;
        } else {
            is_auto_pack_checked = bok_1['b_081_b_pu_auto_pack'];
        }

        return (
            <section className="accordion freight-option-accordion">
                <div className="header" onClick={(e) => this.onClickHeader(e)}>
                    <p className="disp-inline-block">
                        {isOpen ? <i className="fa fa-minus"></i> : <i className="fa fa-plus"></i>} Freight Options:
                    </p>
                    <Button
                        color="primary"
                        onClick={(e) => this.onClickSave(e)}
                        disabled={needToUpdate ? null : 'disabled'}
                    >
                        Save
                    </Button>
                </div>
                {isOpen &&
                    <div className="body">
                        <div className="at-pu disp-inline-block">
                            <h4>At Pickup:</h4>
                            <label>
                                <p>Auto repack:</p>
                                <input
                                    name="b_081_b_pu_auto_pack"
                                    type="checkbox"
                                    checked={is_auto_pack_checked}
                                    onChange={(e) => this.onInputChange(e)}
                                />
                            </label>
                            <label>
                                <p>Address Type:</p>
                                <select
                                    name="b_027_b_pu_address_type"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_027_b_pu_address_type']}
                                >
                                    <option value="" selected disabled hidden>--- Select address type ---</option>
                                    <option value='business'>Business</option>
                                    <option value='residential'>Residential</option>
                                </select>
                            </label>
                            <label>
                                <p>Tail Lift Required?:</p>
                                <input
                                    name="b_019_b_pu_tail_lift"
                                    type="checkbox"
                                    checked={bok_1['b_019_b_pu_tail_lift']}
                                    onChange={(e) => this.onInputChange(e)}
                                />
                            </label>
                            <label>
                                <p>No of men to assist:</p>
                                <select
                                    name="b_072_b_pu_no_of_assists"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_072_b_pu_no_of_assists']}
                                >
                                    <option value="" selected disabled hidden>--- Select number of men to assist ---</option>
                                    <option value='0'>0</option>
                                    <option value='1000'>1 & Customer will assist load</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                </select>
                            </label>
                            <label>
                                <p>Pickup Location:</p>
                                <select
                                    name="b_078_b_pu_location"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_078_b_pu_location']}
                                >
                                    <option value="" selected disabled hidden>--- Select pickup location ---</option>
                                    <option value="Pickup at Door / Warehouse Dock">Pickup at Door / Warehouse Dock</option>
                                    <option value='Drop in Door / Warehouse'>Drop in Door / Warehouse</option>
                                    <option value='Room of Choice'>Room of Choice</option>
                                </select>
                            </label>
                            <label>
                                <p>Pickup Access:</p>
                                <select
                                    name="b_074_b_pu_access"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_074_b_pu_access']}
                                >
                                    <option value="" selected disabled hidden>--- Select pickup access ---</option>
                                    <option value='Level Driveway'>Level Driveway</option>
                                    <option value='Steep Driveway'>Steep Driveway</option>
                                    <option value='Street'>Street</option>
                                    <option value='Street with Curb'>Street with Curb</option>
                                    <option value='Tree lined Street'>Tree lined Street</option>
                                </select>
                            </label>
                            <label>
                                <p>Delivery Level:</p>
                                <select
                                    name="b_079_b_pu_floor_number"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_079_b_pu_floor_number']}
                                >
                                    <option value="" selected disabled hidden>--- Select delivery level ---</option>
                                    <option value='-5'>-5</option>
                                    <option value='-4'>-4</option>
                                    <option value='-3'>-3</option>
                                    <option value='-2'>-2</option>
                                    <option value='-1'>-1</option>
                                    <option value='0'>Ground</option>
                                    <option value='1000'>Curb</option>
                                    <option value='1'>1</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                </select>
                            </label>
                            <label>
                                <p>Level Access:</p>
                                <select
                                    name="b_080_b_pu_floor_access_by"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_080_b_pu_floor_access_by']}
                                >
                                    <option value="" selected disabled hidden>--- Select level access ---</option>
                                    <option value='Elevator'>Elevator</option>
                                    <option value='Escalator'>Escalator</option>
                                    <option value='Stairs'>Stairs</option>
                                    <option value='Ramp'>Ramp</option>
                                    <option value='Folklift'>Folklift</option>
                                    <option value='NONE'>Not is required</option>
                                </select>
                            </label>
                            <label>
                                <p>Service:</p>
                                <select
                                    name="b_076_b_pu_service"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_076_b_pu_service']}
                                >
                                    <option value="" selected disabled hidden>--- Select service ---</option>
                                    <option value='Unpack'>Unpack</option>
                                    <option value='Install'>Install</option>
                                    <option value='NONE'>Not required</option>
                                </select>
                            </label>
                            <label>
                                <p>Handling Instruction:</p>
                                <textarea
                                    width="100%"
                                    name="b_014_b_pu_handling_instructions"
                                    rows="1"
                                    cols="9"
                                    value={bok_1['b_014_b_pu_handling_instructions']}
                                    onChange={(e) => this.onInputChange(e)}
                                />
                            </label>
                            <label>
                                <p>Pickup Instruction:</p>
                                <textarea
                                    width="100%"
                                    name="b_016_b_pu_instructions_address"
                                    rows="1"
                                    cols="9"
                                    value={bok_1['b_016_b_pu_instructions_address']}
                                    onChange={(e) => this.onInputChange(e)}
                                />
                            </label>
                        </div>
                        <div className="at-de disp-inline-block">
                            <h4>At Delivery:</h4>
                            <label>
                                <p>Address Type:</p>
                                <select
                                    name="b_053_b_del_address_type"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_053_b_del_address_type']}
                                >
                                    <option value="" selected disabled hidden>--- Select address type ---</option>
                                    <option value='business'>Business</option>
                                    <option value='residential'>Residential</option>
                                </select>
                            </label>
                            <label>
                                <p>Tail Lift Required?:</p>
                                <input
                                    name="b_041_b_del_tail_lift"
                                    type="checkbox"
                                    checked={bok_1['b_041_b_del_tail_lift']}
                                    onChange={(e) => this.onInputChange(e)}
                                />
                            </label>
                            <label>
                                <p>No of men to assist:</p>
                                <select
                                    name="b_073_b_del_no_of_assists"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_073_b_del_no_of_assists']}
                                >
                                    <option value="" selected disabled hidden>--- Select number of men to assist ---</option>
                                    <option value='0'>0</option>
                                    <option value='1000'>1 & Customer will assist load</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                </select>
                            </label>
                            <label>
                                <p>Delivery Location:</p>
                                <select
                                    name="b_068_b_del_location"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_068_b_del_location']}
                                >
                                    <option value="" selected disabled hidden>--- Select delivery location ---</option>
                                    <option value='Drop at Door / Warehouse Dock'>Drop at Door / Warehouse Dock</option>
                                    <option value='Drop in Door / Warehouse'>Drop in Door / Warehouse</option>
                                    <option value='Room of Choice'>Room of Choice</option>
                                </select>
                            </label>
                            <label>
                                <p>Delivery Access:</p>
                                <select
                                    name="b_075_b_del_access"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_075_b_del_access']}
                                >
                                    <option value="" selected disabled hidden>--- Select delivery access ---</option>
                                    <option value='Level Driveway'>Level Driveway</option>
                                    <option value='Steep Driveway'>Steep Driveway</option>
                                    <option value='Street'>Street</option>
                                    <option value='Street with Curb'>Street with Curb</option>
                                    <option value='Tree lined Street'>Tree lined Street</option>
                                </select>
                            </label>
                            <label>
                                <p>Delivery Level:</p>
                                <select
                                    name="b_069_b_del_floor_number"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_069_b_del_floor_number']}
                                >
                                    <option value="" selected disabled hidden>--- Select delivery level ---</option>
                                    <option value='-5'>-5</option>
                                    <option value='-4'>-4</option>
                                    <option value='-3'>-3</option>
                                    <option value='-2'>-2</option>
                                    <option value='-1'>-1</option>
                                    <option value='0'>Ground</option>
                                    <option value='1000'>Curb</option>
                                    <option value='1'>1</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                </select>
                            </label>
                            <label>
                                <p>Level Access:</p>
                                <select
                                    name="b_070_b_del_floor_access_by"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_070_b_del_floor_access_by']}
                                >
                                    <option value="" selected disabled hidden>--- Select level access ---</option>
                                    <option value='Elevator'>Elevator</option>
                                    <option value='Escalator'>Escalator</option>
                                    <option value='Stairs'>Stairs</option>
                                    <option value='Ramp'>Ramp</option>
                                    <option value='None - lifting is required'>None - lifting is required</option>
                                </select>
                            </label>
                            <label>
                                <p>Service:</p>
                                <select
                                    name="b_077_b_del_service"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={bok_1['b_077_b_del_service']}
                                >
                                    <option value="" selected disabled hidden>--- Select service ---</option>
                                    <option value='Unpack'>Unpack</option>
                                    <option value='Install'>Install</option>
                                </select>
                            </label>
                            <label>
                                <p>Delivery Instruction:</p>
                                <textarea
                                    width="100%"
                                    name="b_044_b_del_instructions_address"
                                    rows="1"
                                    cols="9"
                                    value={bok_1['b_044_b_del_instructions_address']}
                                    onChange={(e) => this.onInputChange(e)}
                                />
                            </label>
                        </div>
                    </div>
                }
            </section>
        );
    }
}

const mapStateToProps = () => {};

const mapDispatchToProps = (dispatch) => {
    return {
        updateBok_1: (bok_1) => dispatch(updateBok_1(bok_1)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FreightOptionAccordion);
