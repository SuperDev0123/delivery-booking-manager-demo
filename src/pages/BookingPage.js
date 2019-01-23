import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { verifyToken } from '../state/services/authService';
import { saveBooking } from '../state/services/bookingService';

import user from '../public/images/user.png';

class BookingPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowAddServiceAndOpt: false,
            isShowBookingCntAndTot: false,
            isShowPUDate: false,
            isShowDelDate: false,
            formInputs: {},
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        saveBooking: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');
        const currentRoute = this.props.location.pathname;

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        if (this.props.redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }
    }

    componentWillReceiveProps(newProps) {
        const { redirect } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }
    }

    onHandleInput(e) {
        let formInputs = this.state.formInputs;
        formInputs[e.target.name] = e.target.value;
        this.setState({ formInputs });
    }

    onSave() {
        this.props.saveBooking(this.state.formInputs);
    }

    render() {
        const {isShowBookingCntAndTot, isShowAddServiceAndOpt, isShowPUDate, isShowDelDate, formInputs} = this.state;

        return (
            <div>
                <div id="headr" className="col-md-12">
                    <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="/booking">Header</a></li>
                            <li><a href="/allbookings">All Bookings</a></li>
                            <li><a href="/bookinglines" className="none">Booking Lines</a></li>
                            <li><a href="/bookinglinedetails" className="none">Booking Line Datas</a></li>
                        </ul>
                    </div>
                    <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right">
                        <a href=""><i className="icon-plus" aria-hidden="true"></i></a>
                        <div className="popup">
                            <i className="icon-search3" aria-hidden="true"></i>
                        </div>
                        <div className="popup">
                            <i className="icon icon-th-list" aria-hidden="true"></i>
                        </div>
                        <a href=""><i className="icon-cog2" aria-hidden="true"></i></a>
                        <a href=""><i className="icon-calendar3" aria-hidden="true"></i></a>
                        <a href="">?</a>
                    </div>
                </div>

                <div className="user-header">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="text-left content">
                                    <a className="user-menu" href=""><i className="fas fa-bars"></i></a>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="user content">
                                    <ul>
                                        <li><img src={user} alt="" /></li>
                                        <li>Stephen Madeisky</li>
                                        <li><a href=""><i className="fas fa-caret-down text-black"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="booking">
                    <div className="container">
                        <div className="grid">
                            <div className="head">
                                <div className="row">
                                    <div className="col-sm-2">
                                        <p className="text-white">Edit Booking 78300</p>
                                    </div>
                                    <div className="col-sm-2">
                                        <p className="text-white text-center">Tempo <a href=""><i className="fas fa-file-alt text-white"></i></a></p>
                                    </div>
                                    <div className="col-sm-3">
                                        <p className="text-white text-right">AUS Mon 18:00 2018-02-04 <a href=""><i className="fas fa-location-arrow text-white"></i></a></p>
                                    </div>
                                    <div className="col-sm-5">
                                        <ul className="grid-head">
                                            <li><button className="btn btn-light btn-theme"><i className="fas fa-eye"></i> Preview</button></li>
                                            <li><button className="btn btn-light btn-theme">Email</button></li>
                                            <li><button className="btn btn-light btn-theme">Print PDF</button></li>
                                            <li><button className="btn btn-light btn-theme"><i className="fas fa-undo"></i> Undo</button></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="clearfix"></div>
                            </div>

                            <div className="inner-text">
                                <form action="">
                                    <div className="col-sm-2 form-group">
                                        <label className="" htmlFor="">Booking Contact</label>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <input className="form-control" type="text" placeholder="BioPAK" />
                                    </div>
                                </form>
                                <div className="clearfix"></div>
                            </div>

                            <div className="detail-tab">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="pickup-detail">
                                            <div className="head text-white">
                                                <ul>
                                                    <li>Pick Up Details</li>
                                                    <li><a href=""><i className="fas fa-calendar-alt"></i> 01 Mar 2018 12:31</a></li>
                                                </ul>
                                            </div>
                                            <form action="">
                                                <div className="progress">
                                                    <div className="progress-bar progress-bar-striped" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">
                                                        95%
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <input type="text" placeholder="Working Day*" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                                    <span className="input-group-addon"><a href=""><i className="fas fa-calendar-alt"></i></a></span>
                                                </div>
                                                <div className="row mt-2">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Pick Up Entity</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input placeholder="Tempo Pty Ltd" name="puCompany" type="text" value={formInputs['puCompany']} className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Street 1</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Address_Street_1" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Street 2</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Address_Street_2" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Postal Code</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Address_PostalCode" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Suburb</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Address_Suburb" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Country</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Address_Country" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Contact <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Contact_F_L_Name" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Tel</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Phone_Main" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Email</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Email" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Pickup Dates <a className="popup"><i className="fas fa-file-alt"></i></a></label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <div className="input-group">
                                                            <input type="text" placeholder="01-01-2020" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                                            <span className="input-group-addon"><a id="pick-date" onClick={() => this.setState({isShowPUDate: !isShowPUDate})}><i className="fas fa-calendar-alt"></i></a></span>
                                                        </div>
                                                    </div>
                                                    <div className={isShowPUDate ? 'col-sm-12 pick-dates mt-1' : 'col-sm-12 pick-dates mt-1 hidden'}>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="01-01-2020" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                                                    <span className="input-group-addon"><a id="pick-date" href=""><i className="fas fa-calendar-alt"></i></a></span>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="01-01-2020" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                                                    <span className="input-group-addon"><a id="pick-date" href=""><i className="fas fa-calendar-alt"></i></a></span>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="01-01-2020" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                                                    <span className="input-group-addon"><a id="pick-date" href=""><i className="fas fa-calendar-alt"></i></a></span>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="01-01-2020" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                                                    <span className="input-group-addon"><a id="pick-date" href=""><i className="fas fa-calendar-alt"></i></a></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-6">
                                                        <label className="" htmlFor="">Reference No <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label className="" htmlFor="">Pickup Instructions <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                    </div>
                                                </div>
                                                <div className="mt-1 additional-pickup-div">
                                                    <a id="additional-pickup" className="text-black pointer" onClick={() => this.setState({isShowAddServiceAndOpt: !isShowAddServiceAndOpt})}>
                                                        Additional Services & Options
                                                        <i className="fas fa-caret-down text-black"></i>
                                                    </a>
                                                </div>
                                                <div className={isShowAddServiceAndOpt ? 'additional-pickup' : 'additional-pickup hidden'}>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-12">
                                                            <div className="row">
                                                                <div className="col-sm-6">
                                                                    <label className="mt-0" htmlFor="">Freight Provider</label>
                                                                    <input placeholder="" type="text" className="form-control" />
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <label className="mt-0" htmlFor="">TNT</label>
                                                                    <input placeholder="" type="text" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-12">
                                                            <div className="row">
                                                                <div className="col-sm-6">
                                                                    <label className="mt-0" htmlFor="">Service</label>
                                                                    <input type="text" className="form-control" />
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <label className="mt-0" htmlFor="">Consignment No</label>
                                                                    <input placeholder="" type="text" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-12">
                                                            <div className="row">
                                                                <div className="col-sm-6">
                                                                    <label className="mt-0" htmlFor="">Booking Cutoff</label>
                                                                    <input placeholder="" type="text" className="form-control" />
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <label className="mt-0" htmlFor="">Road Freight Express</label>
                                                                    <input placeholder="" type="text" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-12">
                                                            <div className="row">
                                                                <div className="col-sm-6">
                                                                    <label className="mt-0" htmlFor="">Pickup / Manifest No</label>
                                                                    <input placeholder="" type="text" className="form-control" />
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <label className="mt-0" htmlFor="">Entered Date</label>
                                                                    <input placeholder="" type="text" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-12">
                                                            <div className="row">
                                                                <div className="col-sm-6">
                                                                    <label className="mt-0" htmlFor="">Quoted</label>
                                                                    <input placeholder="" type="text" className="form-control" />
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <label className="mt-0" htmlFor="">Booked Date</label>
                                                                    <input placeholder="" type="text" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-12">
                                                            <div className="row">
                                                                <div className="col-sm-6">
                                                                    <label className="mt-0" htmlFor="">Invoiced</label>
                                                                    <input placeholder="" type="text" className="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="clearfix"></div>
                                            </form>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="pickup-detail">
                                            <div className="head text-white">
                                                <ul>
                                                    <li>Delivery Details</li>
                                                    <li><a href=""><i className="fas fa-calendar-alt"></i> 01 Mar 2018 12:31</a></li>
                                                </ul>
                                            </div>
                                            <form action="">
                                                <div className="progress">
                                                    <div className="progress-bar progress-bar-striped" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">
                                                        50%
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <input type="text" placeholder="Working Day*" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                                    <span className="input-group-addon"><a href=""><i className="fas fa-calendar-alt"></i></a></span>
                                                </div>
                                                <div className="row mt-2">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Delivery Entity</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input placeholder="Tempo Pty Ltd" type="text" name="deToCompanyName" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Street 1</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_To_Address_Street_1" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Street 2</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_To_Address_Street_2" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Postal Code</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_To_Address_PostalCode" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Suburb</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_To_Address_Suburb" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Country</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_To_Address_Country" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Contact <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_to_Contact_F_LName" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Tel</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_to_Phone_Main" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Email</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_Email" className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Delivery Dates <a className="popup"><i className="fas fa-file-alt"></i></a></label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <div className="input-group">
                                                            <input type="text" placeholder="01-01-2020" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                                            <span className="input-group-addon"><a id="deliver-date" onClick={() => this.setState({isShowDelDate: !isShowDelDate})}><i className="fas fa-calendar-alt"></i></a></span>
                                                        </div>
                                                    </div>
                                                    <div className={isShowDelDate ? 'col-sm-12 deliver-date mt-1' : 'col-sm-12 deliver-date mt-1 hidden'}>
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="01-01-2020" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                                                    <span className="input-group-addon"><a id="pick-date" href=""><i className="fas fa-calendar-alt"></i></a></span>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="01-01-2020" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                                                    <span className="input-group-addon"><a id="pick-date" href=""><i className="fas fa-calendar-alt"></i></a></span>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="01-01-2020" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                                                    <span className="input-group-addon"><a id="pick-date" href=""><i className="fas fa-calendar-alt"></i></a></span>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="input-group">
                                                                    <input type="text" placeholder="01-01-2020" className="form-control" aria-label="Amount (to the nearest dollar)" />
                                                                    <span className="input-group-addon"><a id="pick-date" href=""><i className="fas fa-calendar-alt"></i></a></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-6">
                                                        <label className="" htmlFor="">Delivery Instructions <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                    </div>
                                                </div>
                                                <div className="mt-1 additional-delivery-div">
                                                    <a id="additional-delivery" className="text-black pointer" onClick={() => this.setState({isShowBookingCntAndTot: !isShowBookingCntAndTot})}>
                                                        Booking Counts & Totals
                                                        <i className="fas fa-caret-down text-black"></i>
                                                    </a>
                                                </div>
                                                <div className={isShowBookingCntAndTot ? 'additional-delivery' : 'additional-delivery hidden'}>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-12">
                                                            <label className="mt-0" htmlFor="">Total Pieces</label>
                                                            <input placeholder="3" type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-12">
                                                            <label className="mt-0" htmlFor="">Total Mass</label>
                                                            <input placeholder="100 KG" type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-12">
                                                            <label className="mt-0" htmlFor="">Total Cubic KG</label>
                                                            <input placeholder="150 KG" type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="pickup-detail">
                                            <div className="head">
                                                <a className="text-white">Control</a>
                                            </div>
                                            <div className="status-log">
                                                <h4>Status log</h4>
                                                <p>01 March Entered</p>
                                                <p>01 March Booked</p>
                                                <p>01 March Picked Up</p>
                                                <p>01 March Delivered</p>
                                                <p>01 March Entered</p>
                                                <p>01 March Booked</p>
                                                <p>01 March Picked Up</p>
                                                <p>01 March Delivered</p>
                                                <p>01 March Entered</p>
                                                <p>01 March Booked</p>
                                                <p>01 March Picked Up</p>
                                                <p>01 March Delivered</p>
                                            </div>
                                            <div className="buttons">
                                                <div className="text-center mt-2">
                                                    <button className="btn btn-theme custom-theme"><i className="fas fa-stopwatch"></i> Freight & Time Calculations</button>
                                                </div>
                                                <div className="text-center mt-2">
                                                    <button className="btn btn-theme custom-theme" onClick={() => this.onSave()}><i className="fas fa-clipboard-check"></i> Confirm Booking</button>
                                                </div>
                                                <div className="text-center mt-2">
                                                    <button className="btn btn-theme custom-theme"><i className="fas fa-undo-alt"></i> Amend Booking</button>
                                                </div>
                                                <div className="text-center mt-2">
                                                    <button className="btn btn-theme custom-theme"><i className="fas fa-backspace"></i> Cancel Request</button>
                                                </div>
                                                <div className="text-center mt-2">
                                                    <button className="btn btn-theme custom-theme"><i className="fas fa-copy"></i> Duplicate Booking</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="tabs">
                                    <div className="tab-button-outer">
                                        <ul id="tab-button">
                                            <li><a href="#tab01">Shipment Packages / Goods</a></li>
                                            <li><a href="#tab02">Freight Options</a></li>
                                            <li><a href="#tab03">Communication Log</a></li>
                                            <li><a href="#tab04">Attachments</a></li>
                                            <li><a href="#tab05">Action / Help</a></li>
                                        </ul>
                                    </div>
                                    <div className="tab-select-outer">
                                        <select id="tab-select">
                                            <option value="#tab01">Shipment Packages / Goods</option>
                                            <option value="#tab02">Freight Options</option>
                                            <option value="#tab03">Communication Log</option>
                                            <option value="#tab04">Attachments</option>
                                            <option value="#tab05">Action / Help</option>
                                        </select>
                                    </div>

                                    <div id="tab01" className="tab-contents">
                                        <div className="tab-inner">
                                            <table className="tab-table table table-bordered .table-striped">
                                                <thead>
                                                    <th>Line no</th>
                                                    <th>Packaging</th>
                                                    <th>UOM</th>
                                                    <th>Qty</th>
                                                    <th>Weight UOM</th>
                                                    <th>Weight (ea)</th>
                                                    <th>Total KGs</th>
                                                    <th>Dim UOM</th>
                                                    <th>Length</th>
                                                    <th>Width</th>
                                                    <th>Height</th>
                                                    <th>Cubic Meter</th>
                                                    <th>Del</th>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>Carton</td>
                                                        <td>5 Ca</td>
                                                        <td>5</td>
                                                        <td>10 KG</td>
                                                        <td>10</td>
                                                        <td>50</td>
                                                        <td>1 M</td>
                                                        <td>1</td>
                                                        <td>1</td>
                                                        <td>1</td>
                                                        <td>1</td>
                                                        <td><a href=""><i className="fas fa-times-circle"></i></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td>2</td>
                                                        <td>Carton</td>
                                                        <td>5 Ca</td>
                                                        <td>5</td>
                                                        <td>10 KG</td>
                                                        <td>10</td>
                                                        <td>50</td>
                                                        <td>1 M</td>
                                                        <td>1</td>
                                                        <td>1</td>
                                                        <td>1</td>
                                                        <td>1</td>
                                                        <td><a href=""><i className="fas fa-times-circle"></i></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Totals</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>15</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>150</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>15</td>
                                                        <td><a href=""><i className="fas fa-times-circle"></i></a></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div id="tab02" className="tab-contents">
                                        <div className="tab-inner">
                                            <table className="tab-table table table-bordered .table-striped">
                                                <thead>
                                                    <th>Provider</th>
                                                    <th>Service</th>
                                                    <th>ETD</th>
                                                    <th>Total Fee Ex (GST)</th>
                                                    <th>Booking Cutoff Time</th>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>TNT</td>
                                                        <td>Road Freight Express</td>
                                                        <td>3/2/2018</td>
                                                        <td>100 $</td>
                                                        <td>12:00:00 PM</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Allied</td>
                                                        <td>Road Freight Express</td>
                                                        <td>3/2/2018</td>
                                                        <td>100 $</td>
                                                        <td>12:00:00 PM</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div id="tab03" className="tab-contents">
                                        <div className="tab-inner">
                                            <table className="tab-table table table-bordered .table-striped">
                                                <thead>
                                                    <th>Comm No</th>
                                                    <th>Date</th>
                                                    <th>Type</th>
                                                    <th>Description</th>
                                                    <th>View</th>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>TNT</td>
                                                        <td>01 March 18</td>
                                                        <td>EMAIL</td>
                                                        <td>Booking confirmation and consignment note</td>
                                                        <td>21</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Allied</td>
                                                        <td>01 March 18</td>
                                                        <td>EMAIL</td>
                                                        <td>Proof of Delivery</td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div id="tab04" className="tab-contents">
                                        <div className="tab-inner">
                                            <table className="tab-table table table-bordered .table-striped">
                                                <thead>
                                                    <th>Attachment No</th>
                                                    <th>Description</th>
                                                    <th>FileName</th>
                                                    <th>Date Updated</th>
                                                    <th>Upload File</th>
                                                    <th>Del</th>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>Pictures of goods</td>
                                                        <td>pic.jpg</td>
                                                        <td>1 March 2018</td>
                                                        <td><input type="file" /></td>
                                                        <td><a href=""><i className="fas fa-times-circle"></i></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td>2</td>
                                                        <td>Pictures of goods</td>
                                                        <td>pic.jpg</td>
                                                        <td>1 March 2018</td>
                                                        <td><input type="file" /></td>
                                                        <td><a href=""><i className="fas fa-times-circle"></i></a></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div id="tab05" className="tab-contents">
                                        <div className="tab-inner">
                                            <table className="tab-table table table-bordered .table-striped">
                                                <thead>
                                                    <th>Comm No</th>
                                                    <th>Entry Date </th>
                                                    <th>Type</th>
                                                    <th>Description</th>
                                                    <th>Due Date</th>
                                                    <th>Status</th>
                                                    <th>View / Listen</th>
                                                    <th>Del</th>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>1 March 2018</td>
                                                        <td>Auto Email</td>
                                                        <td>Email to Fp to follow up when delivery</td>
                                                        <td>1 March 2018</td>
                                                        <td>Sent</td>
                                                        <td><i className="far fa-square"></i></td>
                                                        <td><a href=""><i className="fas fa-times-circle"></i></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td>2</td>
                                                        <td>1 March 2018</td>
                                                        <td>Manual Email</td>
                                                        <td>Email to Fp to follow up  delivery</td>
                                                        <td>1 March 2018</td>
                                                        <td>Sent</td>
                                                        <td><i className="far fa-square"></i></td>
                                                        <td><a href=""><i className="fas fa-times-circle"></i></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td>1 March 2018</td>
                                                        <td>Phone Call</td>
                                                        <td>Call to FP to follow up delivery</td>
                                                        <td>1 March 2018</td>
                                                        <td>Called</td>
                                                        <td><i className="far fa-square"></i></td>
                                                        <td><a href=""><i className="fas fa-times-circle"></i></a></td>
                                                    </tr>
                                                    <tr>
                                                        <td>4</td>
                                                        <td>1 March 2018</td>
                                                        <td>Action item</td>
                                                        <td>Find out from fb where goods are</td>
                                                        <td>1 March 2018</td>
                                                        <td>Open</td>
                                                        <td><i className="far fa-square"></i></td>
                                                        <td><a href=""><i className="fas fa-times-circle"></i></a></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        booking: state.booking.booking,
        redirect: state.auth.redirect,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        saveBooking: (booking) => dispatch(saveBooking(booking)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingPage);
