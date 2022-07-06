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

    displayNoOptionsMessage() {
        if (this.state.isBookedBooking == true) {
            return 'No Editable';
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
                        <div className="at-pu col-sm-12 col-lg-6">
                            <h4>At Pickup:</h4>
                            <div className="d-flex">
                                <p><strong>Address Type: </strong></p>
                                <select
                                    className="form-control"
                                    name="pu_Address_Type"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['pu_Address_Type'] ? formInputs['pu_Address_Type'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select address type ---</option>
                                    <option value='business'>Business</option>
                                    <option value='residential'>Residential</option>
                                </select>
                                {/* <Select
                                    value={formInputs['pu_Address_Type'] ? formInputs['pu_Address_Type'] : ''}
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    options={
                                        [
                                            {value: 'business', label: 'Business'},
                                            {value: 'residential', label: 'Residential'},
                                        ]
                                    }
                                    placeholder='--- Select address type ---'
                                    noOptionsMessage={() => this.displayNoOptionsMessage()}
                                /> */}
                            </div>
                            <div className="d-flex">
                                <p><strong>Tail Lift Required?: </strong></p>
                                <input
                                    name="b_booking_tail_lift_pickup"
                                    type="checkbox"
                                    value={formInputs['b_booking_tail_lift_pickup']}
                                    onChange={(e) => this.props.onHandleInput(e)}
                                />
                            </div>
                            <div className="d-flex">
                                <p><strong>No of men to assist: </strong></p>
                                <select
                                    className="form-control"
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
                            </div>
                            <div className="d-flex">
                                <p><strong>Pickup Location: </strong></p>
                                <select
                                    className="form-control"
                                    name="pu_location"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['pu_location'] ? formInputs['pu_location'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select pickup location ---</option>
                                    <option value="Pickup at Door / Warehouse Dock">Pickup at Door / Warehouse Dock</option>
                                    <option value='Drop in Door / Warehouse'>Drop in Door / Warehouse</option>
                                    <option value='Room of Choice'>Room of Choice</option>
                                </select>
                            </div>
                            <div className="d-flex">
                                <p><strong>Pickup Access: </strong></p>
                                <select
                                    className="form-control"
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
                            </div>
                            <div className="d-flex">
                                <p><strong>Delivery Level: </strong></p>
                                <select
                                    className="form-control"
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
                            </div>
                            <div className="d-flex">
                                <p><strong>Level Access: </strong></p>
                                <select
                                    className="form-control"
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
                            </div>
                            <div className="d-flex">
                                <p><strong>Service: </strong></p>
                                <select
                                    className="form-control"
                                    name="pu_service"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['pu_service'] ? formInputs['pu_service'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select service ---</option>
                                    <option value='Unpack'>Unpack</option>
                                    <option value='Install'>Install</option>
                                    <option value='NONE'>Not required</option>
                                </select>
                            </div>
                        </div>
                        <div className="at-de col-sm-12 col-lg-6">
                            <h4>At Delivery:</h4>
                            <div className="d-flex">
                                <p><strong>Address Type: </strong></p>
                                <select
                                    className="form-control"
                                    name="de_To_AddressType"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['de_To_AddressType'] ? formInputs['de_To_AddressType'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select address type ---</option>
                                    <option value='business'>Business</option>
                                    <option value='residential'>Residential</option>
                                </select>
                            </div>
                            <div className="d-flex">
                                <p><strong>Tail Lift Required?: </strong></p>
                                <input
                                    name="b_booking_tail_lift_deliver"
                                    type="checkbox"
                                    value={formInputs['b_booking_tail_lift_deliver']}
                                    onChange={(e) => this.props.onHandleInput(e)}
                                />
                            </div>
                            <div className="d-flex">
                                <p><strong>No of men to assist: </strong></p>
                                <select
                                    className="form-control"
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
                            </div>
                            <div className="d-flex">
                                <p><strong>Delivery Location: </strong></p>
                                <select
                                    className="form-control"
                                    name="de_to_location"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['de_to_location'] ? formInputs['de_to_location'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select delivery location ---</option>
                                    <option value='Drop at Door / Warehouse Dock'>Drop at Door / Warehouse Dock</option>
                                    <option value='Drop in Door / Warehouse'>Drop in Door / Warehouse</option>
                                    <option value='Room of Choice'>Room of Choice</option>
                                </select>
                            </div>
                            <div className="d-flex">
                                <p><strong>Delivery Access: </strong></p>
                                <select
                                    className="form-control"
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
                            </div>
                            <div className="d-flex">
                                <p><strong>Delivery Level: </strong></p>
                                <select
                                    className="form-control"
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
                            </div>
                            <div className="d-flex">
                                <p><strong>Level Access: </strong></p>
                                <select
                                    className="form-control"
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
                            </div>
                            <div className="d-flex">
                                <p><strong>Service: </strong></p>
                                <select
                                    className="form-control"
                                    name="de_service"
                                    onChange={(e) => this.props.onHandleInput(e)}
                                    value={formInputs['de_service'] ? formInputs['de_service'] : ''}
                                >
                                    <option value="" disabled hidden>--- Select service ---</option>
                                    <option value='Unpack'>Unpack</option>
                                    <option value='Install'>Install</option>
                                    <option value='NONE'>Not required</option>
                                </select>
                            </div>
                        </div>
                    </div>
                }
            </section>
        );
    }
}

export default FreightOptionAccordion;
