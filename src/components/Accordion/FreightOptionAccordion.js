import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FreightOptionAccordion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: true,
        };
    }

    static propTypes = {
        formInputs: PropTypes.object.isRequired,
        onHandleInput: PropTypes.func.isRequired,
    }

    onClickHeader = (e) => {
        e.preventDefault();
        if (e.target.type !== 'button') {
            this.setState({isOpen: !this.state.isOpen});
        }
    }

    render() {
        const {isOpen} = this.state;
        const {formInputs} = this.props;

        return (
            <section className="accordion freight-option-accordion">
                <div className="header" onClick={(e) => this.onClickHeader(e)}>
                    <p className="disp-inline-block">
                        {isOpen ? <i className="fa fa-minus"></i> : <i className="fa fa-plus"></i>} Freight Options:
                    </p>
                </div>
                {isOpen &&
                    <div className="body">
                        <div className="at-pu disp-inline-block">
                            <h4>At Pickup:</h4>
                            <label>
                                <p><strong>Address Type: </strong></p>
                                <select
                                    name="pu_Address_Type"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['pu_Address_Type'] ? formInputs['pu_Address_Type'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select address type ---</option>
                                    <option value='business'>Business</option>
                                    <option value='residential'>Residential</option>
                                </select>
                            </label>
                            <label>
                                <p><strong>Tail Lift Required?: </strong></p>
                                <input
                                    name="b_booking_tail_lift_pickup"
                                    type="checkbox"
                                    value={formInputs['b_booking_tail_lift_pickup'] ? true : false}
                                    onChange={(e) => this.props.onHandleInput(e)}
                                />
                            </label>
                            <label>
                                <p><strong>No of men to assist: </strong></p>
                                <select
                                    name="pu_no_of_assists"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['pu_no_of_assists'] ? formInputs['pu_no_of_assists'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select number of men to assist ---</option>
                                    <option value='0'>0</option>
                                    <option value='1'>1 & Customer will assist load</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                </select>
                            </label>
                            <label>
                                <p><strong>Pickup Location: </strong></p>
                                <select
                                    name="pu_location"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['pu_location'] ? formInputs['pu_location'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select pickup location ---</option>
                                    <option value="Pickup at Door / Warehouse Dock">Pickup at Door / Warehouse Dock</option>
                                    <option value='Drop in Door / Warehouse'>Drop in Door / Warehouse</option>
                                    <option value='Room of Choice'>Room of Choice</option>
                                </select>
                            </label>
                            <label>
                                <p><strong>Pickup Access: </strong></p>
                                <select
                                    name="pu_access"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['pu_access'] ? formInputs['pu_access'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select pickup access ---</option>
                                    <option value='Level Driveway'>Level Driveway</option>
                                    <option value='Steep Driveway'>Steep Driveway</option>
                                    <option value='Street'>Street</option>
                                    <option value='Street with Curb'>Street with Curb</option>
                                    <option value='Tree lined Street'>Tree lined Street</option>
                                </select>
                            </label>
                            <label>
                                <p><strong>Delivery Level: </strong></p>
                                <select
                                    name="pu_floor_number"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['pu_floor_number'] ? formInputs['pu_floor_number'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select delivery level ---</option>
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
                                <p><strong>Level Access: </strong></p>
                                <select
                                    name="pu_floor_access_by"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['pu_floor_access_by'] ? formInputs['pu_floor_access_by'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select level access ---</option>
                                    <option value='Elevator'>Elevator</option>
                                    <option value='Escalator'>Escalator</option>
                                    <option value='Stairs'>Stairs</option>
                                    <option value='Ramp'>Ramp</option>
                                    <option value='Folklift'>Folklift</option>
                                    <option value='NONE'>Not required</option>
                                </select>
                            </label>
                            <label>
                                <p><strong>Service: </strong></p>
                                <select
                                    name="pu_service"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['pu_service'] ? formInputs['pu_service'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select service ---</option>
                                    <option value='Unpack'>Unpack</option>
                                    <option value='Install'>Install</option>
                                    <option value='NONE'>Not required</option>
                                </select>
                            </label>
                        </div>
                        <div className="at-de disp-inline-block">
                            <h4>At Delivery:</h4>
                            <label>
                                <p><strong>Address Type: </strong></p>
                                <select
                                    name="de_To_AddressType"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['de_To_AddressType'] ? formInputs['de_To_AddressType'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select address type ---</option>
                                    <option value='business'>Business</option>
                                    <option value='residential'>Residential</option>
                                </select>
                            </label>
                            <label>
                                <p><strong>Tail Lift Required?: </strong></p>
                                <input
                                    name="b_booking_tail_lift_deliver"
                                    type="checkbox"
                                    value={formInputs['b_booking_tail_lift_deliver'] ? true : false}
                                    onChange={(e) => this.props.onHandleInput(e)}
                                />
                            </label>
                            <label>
                                <p><strong>No of men to assist: </strong></p>
                                <select
                                    name="de_no_of_assists"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['de_no_of_assists'] ? formInputs['de_no_of_assists'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select number of men to assist ---</option>
                                    <option value='0'>0</option>
                                    <option value='1000'>1 & Customer will assist load</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                </select>
                            </label>
                            <label>
                                <p><strong>Delivery Location: </strong></p>
                                <select
                                    name="de_to_location"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['de_to_location'] ? formInputs['de_to_location'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select delivery location ---</option>
                                    <option value='Drop at Door / Warehouse Dock'>Drop at Door / Warehouse Dock</option>
                                    <option value='Drop in Door / Warehouse'>Drop in Door / Warehouse</option>
                                    <option value='Room of Choice'>Room of Choice</option>
                                </select>
                            </label>
                            <label>
                                <p><strong>Delivery Access: </strong></p>
                                <select
                                    name="de_access"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['de_access'] ? formInputs['de_access'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select delivery access ---</option>
                                    <option value='Level Driveway'>Level Driveway</option>
                                    <option value='Steep Driveway'>Steep Driveway</option>
                                    <option value='Street'>Street</option>
                                    <option value='Street with Curb'>Street with Curb</option>
                                    <option value='Tree lined Street'>Tree lined Street</option>
                                </select>
                            </label>
                            <label>
                                <p><strong>Delivery Level: </strong></p>
                                <select
                                    name="de_floor_number"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['de_floor_number'] ? formInputs['de_floor_number'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select delivery level ---</option>
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
                                <p><strong>Level Access: </strong></p>
                                <select
                                    name="de_to_floor_access_by"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['de_to_floor_access_by'] ? formInputs['de_to_floor_access_by'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select level access ---</option>
                                    <option value='Elevator'>Elevator</option>
                                    <option value='Escalator'>Escalator</option>
                                    <option value='Stairs'>Stairs</option>
                                    <option value='Ramp'>Ramp</option>
                                    <option value='NONE'>Not required</option>
                                </select>
                            </label>
                            <label>
                                <p><strong>Service: </strong></p>
                                <select
                                    name="de_service"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['de_service'] ? formInputs['de_service'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select service ---</option>
                                    <option value='Unpack'>Unpack</option>
                                    <option value='Install'>Install</option>
                                    <option value='NONE'>Not required</option>
                                </select>
                            </label>
                        </div>
                    </div>
                }
            </section>
        );
    }
}

export default FreightOptionAccordion;
