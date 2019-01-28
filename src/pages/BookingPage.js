import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import user from '../public/images/user.png';
import { verifyToken } from '../state/services/authService';
import { getBookingWithFilter, alliedBooking, stBooking, saveBooking } from '../state/services/bookingService';
import { getBookingLines } from '../state/services/bookingLinesService';
import { getBookingLineDetails } from '../state/services/bookingLineDetailsService';

class BookingPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowAddServiceAndOpt: false,
            isShowBookingCntAndTot: false,
            isShowPUDate: false,
            isShowDelDate: false,
            formInputs: {},
            selected: 'dme',
            booking: {},
            bookingLines: [],
            bookingLineDetails: [],
            nextBookingId: 0,
            prevBookingId: 0,
            loadedLineAndLineDetail: false,
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        saveBooking: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        getBookingWithFilter: PropTypes.func.isRequired,
        getBookingLines: PropTypes.func.isRequired,
        getBookingLineDetails: PropTypes.func.isRequired,
        alliedBooking: PropTypes.func.isRequired,
        stBooking: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');
        // const bBookingable = this.state;
        //const { bookingid } = this.props.match.params;
        var urlParams = new URLSearchParams(window.location.search);
        var bookingId = urlParams.get('bookingid');

        if (bookingId != null) {
            this.props.getBookingWithFilter(bookingId, 'id');
        }

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

        // if (bBookingable == false) {
        //     this.disablePrevAndNextButton(true, true);
        // }
    }

 

    componentWillReceiveProps(newProps) {
        const { redirect, booking ,bookingLines, bookingLineDetails, nextBookingId, prevBookingId } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        if (bookingLineDetails) {
            this.setState({bookingLineDetails});
        }

        if (bookingLines) {
            this.setState({bookingLines: this.calcBookingLine(bookingLines)});
        }

        if (booking) {
            let formInputs = this.state.formInputs;

            formInputs['puCompany'] = booking.puCompany;
            formInputs['pu_Address_Street_1'] = booking.pu_Address_Street_1;
            formInputs['pu_Address_Street_2'] = booking.pu_Address_street_2;
            formInputs['pu_Address_PostalCode'] = booking.pu_Address_PostalCode;
            formInputs['pu_Address_Suburb'] = booking.pu_Address_Suburb;
            formInputs['pu_Address_Country'] = booking.pu_Address_Country;
            formInputs['pu_Contact_F_L_Name'] = booking.pu_Contact_F_L_Name;
            formInputs['pu_Phone_Main'] = booking.pu_Phone_Main;
            formInputs['pu_Email'] = booking.pu_Email;
            formInputs['de_To_Address_Street_1'] = booking.de_To_Address_Street_1;
            formInputs['de_To_Address_Street_2'] = booking.de_To_Address_Street_2;
            formInputs['de_To_Address_PostalCode'] = booking.de_To_Address_PostalCode;
            formInputs['de_To_Address_Suburb'] = booking.de_To_Address_Suburb;
            formInputs['de_To_Address_Country'] = booking.de_To_Address_Country;
            formInputs['de_to_Contact_F_LName'] = booking.de_to_Contact_F_LName;
            formInputs['de_to_Phone_Main'] = booking.de_to_Phone_Main;
            formInputs['de_Email'] = booking.de_Email;
            formInputs['deToCompanyName'] = booking.deToCompanyName;

            if (!this.state.loadedLineAndLineDetail) {
                this.props.getBookingLines(booking.pk_booking_id);
                this.props.getBookingLineDetails(booking.pk_booking_id);
            }

            this.setState({ formInputs, booking, nextBookingId, prevBookingId, loadedLineAndLineDetail: true });
        }
    }

    onHandleInput(e) {
        let formInputs = this.state.formInputs;
        formInputs[e.target.name] = e.target.value;
        this.setState({ formInputs });
    }

    getRadioValue(event) {
        console.log(event.target.value);
    }

    onClickPrev(e){
        e.preventDefault();
        const {prevBookingId} = this.state;

        if (prevBookingId && prevBookingId > -1) {
            this.props.getBookingWithFilter(prevBookingId, 'id');
        }

        this.setState({loadedLineAndLineDetail: false});
    }

    onClickNext(e){
        e.preventDefault();
        const {nextBookingId} = this.state;

        if (nextBookingId && nextBookingId > -1) {
            this.props.getBookingWithFilter(nextBookingId, 'id');
        }

        this.setState({loadedLineAndLineDetail: false});
    }

    onSave() {
        this.props.saveBooking(this.state.formInputs);
    }

    getInitialState() {
        return {typed: ''};
    }

    calcBookingLine(bookingLines) {
        let bookingLinesQtyTotal = 0;

        let newBookingLines = bookingLines.map((bookingLine) => {
            if (bookingLine.e_weightUOM === 'Gram' || bookingLine.e_weightUOM === 'Grams')
                bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach / 1000;
            else if (bookingLine.e_weightUOM === 'Kilogram' || bookingLine.e_weightUOM === 'Kilograms')
                bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;
            else if (bookingLine.e_weightUOM === 'Kg' || bookingLine.e_weightUOM === 'Kgs')
                bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;
            else if (bookingLine.e_weightUOM === 'Ton' || bookingLine.e_weightUOM === 'Tons')
                bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;
            else
                bookingLine['total_kgs'] = bookingLine.e_qty * bookingLine.e_weightPerEach;

            if (bookingLine.e_dimUOM === 'CM')
                bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight / 1000000;
            else if (bookingLine.e_dimUOM === 'Meter')
                bookingLine['cubic_meter'] = bookingLine.e_qty * bookingLine.e_dimLength * bookingLine.e_dimWidth * bookingLine.e_dimHeight / 1000000000;

            bookingLinesQtyTotal += bookingLine.e_qty;

            return bookingLine;
        });

        this.setState({ bookingLinesQtyTotal });
        return newBookingLines;
    }
    onClickBook() {
        const {booking } = this.state;
        const st_name = 'startrack';
        const allied_name = 'allied';
        if (booking.id && (booking.id != undefined)) {
            if (booking.vx_freight_provider && booking.vx_freight_provider.toLowerCase() === st_name) {
                this.props.stBooking(booking.id);
            } else if (booking.vx_freight_provider && booking.vx_freight_provider.toLowerCase() === allied_name) {
                this.props.alliedBooking(booking.id);
            }
        } else {
            alert('Please Find any booking and then click this!');
        }
    }

    onKeyPress(e) {
        const {selected} = this.state;
        const typed = e.target.value;

        if (e.key === 'Enter') {
            e.preventDefault();
            if((selected == undefined) || (selected == '')){
                alert('id value is empty');
                return;
            }
            if((typed == undefined) || (typed == '')){
                alert('id value is empty');
                return;
            }
            this.props.getBookingWithFilter(typed, selected);
        }

        this.setState({typed, loadedLineAndLineDetail: false});
    }

    onChangeText(e) {
        this.setState({typed: e.target.value});
        console.log(e.target.value);
    }

    render() {
        const {isShowBookingCntAndTot, bookingLines, bookingLineDetails, isShowAddServiceAndOpt, isShowPUDate, isShowDelDate, formInputs} = this.state;

        const bookingLineDetailsList = bookingLineDetails.map((bookingLineDetail, index) => {
            return (
                <tr key={index}>
                    <td>{bookingLineDetail.modelNumber}</td>
                    <td>{bookingLineDetail.itemDescription}</td>
                    <td className="qty">{bookingLineDetail.quantity}</td>
                    <td>{bookingLineDetail.itemFaultDescription}</td>
                    <td>{bookingLineDetail.insuranceValueEach}</td>
                    <td>{bookingLineDetail.gap_ra}</td>
                    <td>{bookingLineDetail.clientRefNumber}</td>
                </tr>
            );
        });

        const bookingLinesList = bookingLines.map((bookingLine, index) => {
            return (
                <tr key={index} onClick={() => this.onClickBookingLine(bookingLine.pk_auto_id_lines)}>
                    <td>{bookingLine.pk_auto_id_lines}</td>
                    <td>{bookingLine.e_type_of_packaging}</td>
                    <td>{bookingLine.e_item}</td>
                    <td className="qty">{bookingLine.e_qty}</td>
                    <td>{bookingLine.e_weightUOM}</td>
                    <td>{bookingLine.e_weightPerEach}</td>
                    <td>{bookingLine.total_kgs}</td>
                    <td>{bookingLine.e_dimUOM}</td>
                    <td>{bookingLine.e_dimLength}</td>
                    <td>{bookingLine.e_dimWidth}</td>
                    <td>{bookingLine.e_dimHeight}</td>
                    <td>{bookingLine.cubic_meter}</td>
                </tr>
            );
        });

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
                                        <p className="text-white">Edit Booking {this.state.booking.id}</p>
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

                                    <div className="container">
                                        <div className="row">
                                            <div className="col-sm-2" onChange={this.getRadioValue.bind(this)}>
                                                <input type="radio" value="dme" name="gender" checked={this.state.selected === 'dme'} onChange={(e) => this.setState({ selected: e.target.value })} /> DME #
                                                <input type="radio" value="con" name="gender" checked={this.state.selected === 'con'} onChange={(e) => this.setState({ selected: e.target.value })}/> CON #
                                            </div>
                                            <div className="col-sm-6 form-group">
                                                <input className="form-control" type="text" onChange={this.onChangeText.bind(this)} onKeyPress={(e) => this.onKeyPress(e)} placeholder="Enter Number(Enter)" />
                                            </div>
                                            <div className="col-sm-4">
                                                <button onClick={(e) => this.onClickPrev(e)} disabled={this.state.prevBookingId == 0} className="btn success btn-theme prev-btn">Prev</button>
                                                <button onClick={(e) => this.onClickNext(e)} disabled={this.state.nextBookingId == 0}  className="btn btn-theme next-btn">Next</button>
                                                <button type="submit" className="btn btn-theme submit none">Submit</button>
                                            </div>
                                        </div>

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
                                                        <input type="text" name="pu_Address_Street_1" className="form-control" value = {formInputs['pu_Address_Street_1']} onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Street 2</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Address_Street_2" className="form-control" value = {formInputs['pu_Address_Street_2']} onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Postal Code</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Address_PostalCode" className="form-control" value = {formInputs['pu_Address_PostalCode']} onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Suburb</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Address_Suburb" className="form-control" value = {formInputs['pu_Address_Suburb']} onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Country</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Address_Country" className="form-control" value = {formInputs['pu_Address_Country']} onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Contact <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Contact_F_L_Name" className="form-control" value = {formInputs['pu_Contact_F_L_Name']} onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Tel</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Phone_Main" className="form-control" value = {formInputs['pu_Phone_Main']} onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Email</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="pu_Email" className="form-control" value = {formInputs['pu_Email']} onChange={(e) => this.onHandleInput(e)} />
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
                                                        <input placeholder="Tempo Pty Ltd" type="text" name="deToCompanyName" value = {formInputs['deToCompanyName']} className="form-control" onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Street 1</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_To_Address_Street_1" className="form-control" value = {formInputs['de_To_Address_Street_1']}  onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Street 2</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_To_Address_Street_2" className="form-control" value = {formInputs['de_To_Address_Street_2']}  onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Postal Code</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_To_Address_PostalCode" className="form-control" value = {formInputs['de_To_Address_PostalCode']} onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Suburb</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_To_Address_Suburb" className="form-control" value = {formInputs['de_To_Address_Suburb']} onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Country</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_To_Address_Country" className="form-control" value = {formInputs['de_To_Address_Country']} onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Contact <a className="popup" href=""><i className="fas fa-file-alt"></i></a></label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_to_Contact_F_LName" className="form-control" value = {formInputs['de_to_Contact_F_LName']} onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Tel</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_to_Phone_Main" className="form-control" value = {formInputs['de_to_Phone_Main']} onChange={(e) => this.onHandleInput(e)} />
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-sm-4">
                                                        <label className="" htmlFor="">Email</label>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <input type="text" name="de_Email" className="form-control" value = {formInputs['de_Email']} onChange={(e) => this.onHandleInput(e)} />
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
                                                <div className="text-center mt-2">
                                                    <button className="btn btn-theme custom-theme" onClick={() => this.onClickBook()}><i ></i> Book</button>
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
                                        </ul>
                                    </div>
                                    <div className="tab-select-outer">
                                        <select id="tab-select">
                                            <option value="#tab01">Shipment Packages / Goods</option>
                                            <option value="#tab02">Freight Options</option>
                                        </select>
                                    </div>

                                    <div id="tab01" className="tab-contents">
                                        <div className="tab-inner">
                                            <table className="tab-table table table-bordered .table-striped">
                                                <thead>
                                                    <th>ID</th>
                                                    <th>Packaging</th>
                                                    <th>Item Description</th>
                                                    <th>Qty</th>
                                                    <th>Wgt UOM</th>
                                                    <th>Wgt Each</th>
                                                    <th>Total Kgs</th>
                                                    <th>Dim UOM</th>
                                                    <th>Length</th>
                                                    <th>Width</th>
                                                    <th>Height</th>
                                                    <th>Cubic Meter</th>
                                                </thead>
                                                <tbody>
                                                    { bookingLinesList }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div id="tab02" className="tab-contents">
                                        <div className="tab-inner">
                                            <table className="tab-table table table-bordered .table-striped">
                                                <thead>
                                                    <th>Model</th>
                                                    <th>Item Description</th>
                                                    <th>Qty</th>
                                                    <th>Fault Description</th>
                                                    <th>Insurance Value</th>
                                                    <th>Gap/ RA</th>
                                                    <th>Client Reference #</th>
                                                </thead>
                                                <tbody>
                                                    { bookingLineDetailsList }
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
        nextBookingId: state.booking.nextBookingId,
        prevBookingId: state.booking.prevBookingId,
        redirect: state.auth.redirect,
        bookingLines: state.bookingLine.bookingLines,
        bookingLineDetails: state.bookingLineDetail.bookingLineDetails,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        saveBooking: (booking) => dispatch(saveBooking(booking)),
        getBookingWithFilter: (id, filter) => dispatch(getBookingWithFilter(id, filter)),
        getBookingLines: (bookingId) => dispatch(getBookingLines(bookingId)),
        getBookingLineDetails: (bookingId) => dispatch(getBookingLineDetails(bookingId)),
        alliedBooking: (bookingId) => dispatch(alliedBooking(bookingId)),
        stBooking: (bookingId) => dispatch(stBooking(bookingId)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingPage);
