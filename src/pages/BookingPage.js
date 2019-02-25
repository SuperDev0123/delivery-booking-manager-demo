import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Clock from 'react-live-clock';
import lodash from 'lodash';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment-timezone';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import LoadingOverlay from 'react-loading-overlay';

import user from '../public/images/user.png';
import { verifyToken, cleanRedirectState } from '../state/services/authService';
import { getBookingWithFilter, getAttachmentHistory, getSuburbStrings, getDeliverySuburbStrings, alliedBooking, stBooking, saveBooking, updateBooking } from '../state/services/bookingService';
import { getBookingLines } from '../state/services/bookingLinesService';
import { getBookingLineDetails } from '../state/services/bookingLineDetailsService';
import { API_HOST, STATIC_HOST, HTTP_PROTOCOL } from '../config';
import DropzoneComponent from 'react-dropzone-component';

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
            loading: false,
            products: [],
            bookingLinesListProduct: [],
            bookingLinesListDetailProduct: [],
            deletedBookingLine: -1,
            bBooking: null,
            mainDate: '',
            selectedBookingIds: [],
            isGoing: false,
            checkBoxStatus: [],
            selectedOption: null,
            selectedOptionPostal: null,
            selectedOptionSuburb: null,
            stateStrings: [],
            postalCode: [],
            suburbStrings: [],
            loadedPostal: false,
            loadedSuburb: false,
            deSelectedOptionState: null,
            deSelectedOptionPostal: null,
            deSelectedOptionSuburb: null,
            deStateStrings: [],
            dePostalCode: [],
            deSuburbStrings: [],
            deLoadedPostal: false,
            deLoadedSuburb: false,
            bAllComboboxViewOnlyonBooking: false,
            puTimeZone: null,
            deTimeZone: null,
            attachmentsHistory: [],
        };

        this.djsConfig = {
            addRemoveLinks: true,
            autoProcessQueue: false,
            params: { filename: 'file' }
        };

        this.componentConfig = {
            iconFiletypes: ['.xlsx'],
            showFiletypeIcon: true,
            postUrl: HTTP_PROTOCOL + '://' + API_HOST + '/share/attachments/filename',
        };

        this.dropzone = null;
        this.handleOnSelectLineRow = this.handleOnSelectLineRow.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        saveBooking: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        getBookingWithFilter: PropTypes.func.isRequired,
        getSuburbStrings: PropTypes.func.isRequired,
        getDeliverySuburbStrings: PropTypes.func.isRequired,
        getBookingLines: PropTypes.func.isRequired,
        getBookingLineDetails: PropTypes.func.isRequired,
        alliedBooking: PropTypes.func.isRequired,
        stBooking: PropTypes.func.isRequired,
        updateBooking: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getAttachmentHistory: PropTypes.func.isRequired,
    };

    // getTimeZone(cityName) {
    //     const AU_TIME_ZONE = [
    //         'ACT':
    //     ];
    // }

    componentDidMount() {
        const token = localStorage.getItem('token');
        var urlParams = new URLSearchParams(window.location.search);
        var bookingId = urlParams.get('bookingid');
        if (bookingId != null) {
            this.props.getBookingWithFilter(bookingId, 'id');
            // this.setState({bAllComboboxViewOnlyonBooking: true });
        } else {
            this.props.getSuburbStrings('state', undefined);
            this.props.getDeliverySuburbStrings('state', undefined);
        }

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }

        let mainDate = '';
        // let dateParam = '';
        const today = localStorage.getItem('today');
        if (today) {
            mainDate = moment(today, 'DD MMM YYYY').toDate();
            // dateParam = moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD');
        } else {
            mainDate = moment().tz('Australia/Sydney').toDate();
            // dateParam = moment().tz('Australia/Sydney').format('YYYY-MM-DD');
        }
        console.log('@main data----', mainDate);
        this.setState({ mainDate: moment(mainDate).format('YYYY-MM-DD') });
    }

    getTime(country, city) {
        const timeZoneTable =
        {
            'Australia':
            {
                'ACT': 'Australia/Currie',
                'NT': 'Australia/Darwin',
                'SA': 'Australia/Adelaide',
                'WA': 'Australia/Perth',
                'NSW': 'Australia/Sydney',
                'QLD': 'Australia/Brisbane',
                'VIC': 'Australia/Melbourne',
                'TAS': 'Australia/Hobart',
            },
            'AU':
            {
                'ACT': 'Australia/Currie',
                'NT': 'Australia/Darwin',
                'SA': 'Australia/Adelaide',
                'WA': 'Australia/Perth',
                'NSW': 'Australia/Sydney',
                'QLD': 'Australia/Brisbane',
                'VIC': 'Australia/Melbourne',
                'TAS': 'Australia/Hobart',
            }
        };
        if (timeZoneTable[country] == undefined || timeZoneTable[country] == 'undefined'  || timeZoneTable[country][city] == 'undefined' || timeZoneTable[country][city] == undefined) {
            return 'Australia/Currie';
        } else {
            return timeZoneTable[country][city];
        }
    }

    componentWillReceiveProps(newProps) {
        const { attachments, suburbStrings, postalCode, stateStrings, bAllComboboxViewOnlyonBooking, deSuburbStrings, dePostalCode, deStateStrings, redirect, booking ,bookingLines, bookingLineDetails, bBooking, nextBookingId, prevBookingId } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (attachments && attachments.length > 0) {
            const tempAttachments = attachments;
            const bookingLinesListDetailProduct = tempAttachments.map((attach) => {
                let result = [];
                result.no = attach.pk_id_attachment;
                result.description = attach.fk_id_dme_booking;
                result.filename = attach.fileName;
                result.uploadfile = attach.linkurl;
                result.dateupdated = attach.upload_Date;
                return result;
            });

            this.setState({attachmentsHistory: bookingLinesListDetailProduct});
        }
        if (bookingLineDetails && bookingLineDetails.length > 0) {
            const tempBookings = bookingLineDetails;
            const bookingLinesListDetailProduct = tempBookings.map((bookingLine) => {
                let result = [];
                result.modelNumber = bookingLine.modelNumber;
                result.itemDescription = bookingLine.itemDescription;
                result.quantity = bookingLine.quantity;
                result.itemFaultDescription = bookingLine.itemFaultDescription;
                result.insuranceValueEach = bookingLine.insuranceValueEach;
                result.gap_ra = bookingLine.gap_ra;
                result.clientRefNumber = bookingLine.clientRefNumber;

                return result;
            });

            this.setState({bookingLinesListDetailProduct: bookingLinesListDetailProduct, bookingLineDetails});
        }

        if (!bAllComboboxViewOnlyonBooking) {
            if (stateStrings && stateStrings.length > 0) {
                if ( !this.state.loadedPostal ) {
                    if (postalCode == '' || postalCode == null)
                        this.props.getSuburbStrings('postalcode', stateStrings[0].label);
                }

                if (booking && booking.pu_Address_State) {
                    let addedPostalCode = lodash.clone(stateStrings);
                    let bHas = false;
                    for (let i = 0; i < addedPostalCode.length; i++ ){
                        if (addedPostalCode[i].label == booking.pu_Address_State) {
                            bHas = true;
                            break;
                        }
                    }
                    if (bHas == false)
                        addedPostalCode.push({'value':booking.pu_Address_State, 'label': booking.pu_Address_State});
                    this.setState({stateStrings: addedPostalCode});        
                } else {
                    this.setState({stateStrings});             
                }

                this.setState({stateStrings, loadedPostal: true});
            }
            else {
                this.props.getSuburbStrings('state', undefined);
            }

            if (postalCode && postalCode.length > 0) {
                if (booking && booking.pu_Address_PostalCode) {
                    let addedPostalCode = lodash.clone(postalCode);
                    let bHas = false;
                    for (let i = 0; i < addedPostalCode.length; i++ ){
                        if (addedPostalCode[i].label == booking.pu_Address_PostalCode) {
                            bHas = true;
                            break;
                        }
                    }
                    if (bHas == false)
                        addedPostalCode.push({'value':booking.pu_Address_PostalCode, 'label': booking.pu_Address_PostalCode});
                    this.setState({postalCode: addedPostalCode});        
                } else {
                    this.setState({postalCode});                    
                }
            }

            if (suburbStrings && suburbStrings.length > 0) {
                if (suburbStrings.length == 1) {
                    this.setState({selectedOptionSuburb: suburbStrings[0]});
                } else if (suburbStrings.length > 1) {
                    if (booking && booking.pu_Address_Suburb) {
                        let addedPostalCode = lodash.clone(suburbStrings);
                        let bHas = false;
                        for (let i = 0; i < addedPostalCode.length; i++ ){
                            if (addedPostalCode[i].label == booking.pu_Address_Suburb) {
                                bHas = true;
                                break;
                            }
                        }
                        if (bHas == false)
                            addedPostalCode.push({'value':booking.pu_Address_Suburb, 'label': booking.pu_Address_Suburb});
                        this.setState({suburbStrings: addedPostalCode});        
                    } else {
                        this.setState({suburbStrings});                    
                    }
    
                    this.setState({selectedOptionSuburb: null});
                }
                this.setState({suburbStrings});
            }

            if (deStateStrings && deStateStrings.length > 0) {
                if ( !this.state.deLoadedPostal ) {
                    this.props.getDeliverySuburbStrings('postalcode', deStateStrings[0].label);
                }

                if (booking && booking.de_To_Address_State) {
                    let addedPostalCode = lodash.clone(deStateStrings);
                    let bHas = false;
                    for (let i = 0; i < addedPostalCode.length; i++ ){
                        if (addedPostalCode[i].label == booking.de_To_Address_State) {
                            bHas = true;
                            break;
                        }
                    }
                    if (bHas == false)
                        addedPostalCode.push({'value':booking.de_To_Address_State, 'label': booking.de_To_Address_State});
                    this.setState({deStateStrings: addedPostalCode});        
                } else {
                    this.setState({deStateStrings});                    
                }

                this.setState({deStateStrings, deLoadedPostal: true});
            } else {
                this.props.getDeliverySuburbStrings('state', undefined);
            }

            if (dePostalCode && dePostalCode.length > 0) {
                if (booking && booking.de_To_Address_PostalCode) {
                    let addedPostalCode = lodash.clone(dePostalCode);
                    let bHas = false;
                    for (let i = 0; i < addedPostalCode.length; i++ ){
                        if (addedPostalCode[i].label == booking.de_To_Address_PostalCode) {
                            bHas = true;
                            break;
                        }
                    }
                    if (bHas == false)
                        addedPostalCode.push({'value':booking.de_To_Address_PostalCode, 'label': booking.de_To_Address_PostalCode});
                    this.setState({dePostalCode: addedPostalCode});        
                } else {
                    this.setState({dePostalCode});             
                }
            }

            if (deSuburbStrings && deSuburbStrings.length > 0) {
                if (deSuburbStrings.length == 1) {
                    this.setState({deSelectedOptionSuburb: deSuburbStrings[0]});
                } else if (deSuburbStrings.length > 1) {
                    if (booking && booking.de_To_Address_State) {
                        let addedPostalCode = lodash.clone(deSuburbStrings);
                        let bHas = false;
                        for (let i = 0; i < addedPostalCode.length; i++ ){
                            if (addedPostalCode[i].label == booking.de_To_Address_State) {
                                bHas = true;
                                break;
                            }
                        }
                        if (bHas == false)
                            addedPostalCode.push({'value':booking.de_To_Address_State, 'label': booking.de_To_Address_State});
                        this.setState({deSuburbStrings: addedPostalCode});        
                    } else {
                        this.setState({deSuburbStrings});             
                    }
                    this.setState({deSelectedOptionSuburb: null});
                }
                this.setState({deSuburbStrings});
            }
        }

        if (bookingLines && bookingLines.length > 0) {
            const bookingLines1 = this.calcBookingLine(bookingLines);
            //this.setState({bookingLines: this.calcBookingLine(bookingLines)});
            this.setState({bookingLines: bookingLines1});
            const bookingLinesListProduct = bookingLines1.map((bookingLine) => {
                let result = [];
                result.pk_auto_id_lines = bookingLine.pk_lines_id;
                result.e_type_of_packaging = bookingLine.e_type_of_packaging;
                result.e_item = bookingLine.e_item;
                result.e_qty = bookingLine.e_qty;
                result.e_weightUOM = bookingLine.e_weightUOM;
                result.e_weightPerEach = bookingLine.e_weightPerEach;
                result.total_kgs = bookingLine.total_kgs;
                result.e_dimUOM = bookingLine.e_dimUOM;
                result.e_dimLength = bookingLine.e_dimLength;
                result.e_dimWidth = bookingLine.e_dimWidth;
                result.e_dimHeight = bookingLine.e_dimHeight;
                result.cubic_meter = bookingLine.cubic_meter;
                return result;
            });
            this.setState({products: bookingLinesListProduct, bookingLinesListProduct: bookingLinesListProduct});
        }

        if ( bBooking ) {
            if ( bBooking == false ) {
                alert('There is no such booking with that DME`/CON` number.');
                // console.log('@booking Data' + bBooking);
                this.setState({bBooking: null});
            }
        }

        if ( booking && !bAllComboboxViewOnlyonBooking) {
            // console.log(booking.puCompany , booking.deToCompanyName , booking.de_Email , booking.pu_Email);
            if ( booking.puCompany || booking.deToCompanyName || booking.de_Email || booking.pu_Email) {
                let formInputs = this.state.formInputs;
                console.log('@booking dme', booking.de_To_Address_Street_2);
                if (booking.puCompany != null) formInputs['puCompany'] = booking.puCompany;
                else formInputs['puCompany'] = '';
                if (booking.pu_Address_Street_1 != null) formInputs['pu_Address_Street_1'] = booking.pu_Address_Street_1;
                else formInputs['pu_Address_Street_1'] = '';
                if (booking.pu_Address_Street_2 != null) formInputs['pu_Address_Street_2'] = booking.pu_Address_street_2;
                else formInputs['pu_Address_Street_2'] = '';
                if (booking.pu_Address_PostalCode != null) formInputs['pu_Address_PostalCode'] = booking.pu_Address_PostalCode;
                else formInputs['pu_Address_PostalCode'] = '';
                if (booking.pu_Address_Suburb != null) formInputs['pu_Address_Suburb'] = booking.pu_Address_Suburb;
                else formInputs['pu_Address_Suburb'] = '';
                if (booking.pu_Address_Country != null) formInputs['pu_Address_Country'] = booking.pu_Address_Country;
                else formInputs['pu_Address_Country'] = '';
                if (booking.pu_Contact_F_L_Name != null) formInputs['pu_Contact_F_L_Name'] = booking.pu_Contact_F_L_Name;
                else formInputs['pu_Contact_F_L_Name'] = '';
                if (booking.pu_Phone_Main != null) formInputs['pu_Phone_Main'] = booking.pu_Phone_Main;
                else formInputs['pu_Phone_Main'] = '';
                if (booking.pu_Email != null) formInputs['pu_Email'] = booking.pu_Email;
                else formInputs['pu_Email'] = '';
                if (booking.de_To_Address_Street_1 != null) formInputs['de_To_Address_Street_1'] = booking.de_To_Address_Street_1;
                else formInputs['de_To_Address_Street_1'] = '';
                if (booking.de_To_Address_Street_2 != null) {formInputs['de_To_Address_Street_2'] = booking.de_To_Address_Street_2;}
                else formInputs['de_To_Address_Street_2'] = '';
                if (booking.de_To_Address_PostalCode != null) formInputs['de_To_Address_PostalCode'] = booking.de_To_Address_PostalCode;
                else formInputs['de_To_Address_PostalCode'] = '';
                if (booking.de_To_Address_Suburb != null) formInputs['de_To_Address_Suburb'] = booking.de_To_Address_Suburb;
                else formInputs['de_To_Address_Suburb'] = '';
                if (booking.de_To_Address_Country != null) formInputs['de_To_Address_Country'] = booking.de_To_Address_Country;
                else formInputs['de_To_Address_Country'] = '';
                if (booking.de_to_Contact_F_LName != null) formInputs['de_to_Contact_F_LName'] = booking.de_to_Contact_F_LName;
                else formInputs['de_to_Contact_F_LName'] = '';
                if (booking.de_to_Phone_Main != null) formInputs['de_to_Phone_Main'] = booking.de_to_Phone_Main;
                else formInputs['de_to_Phone_Main'] = '';
                if (booking.de_Email != null) formInputs['de_Email'] = booking.de_Email;
                else formInputs['de_Email'] = '';
                if (booking.deToCompanyName != null) formInputs['deToCompanyName'] = booking.deToCompanyName;
                else formInputs['deToCompanyName'] = '';
                if (booking.pu_Address_State != null) formInputs['pu_Address_State'] = booking.pu_Address_State;
                else formInputs['pu_Address_State'] = '';
                if (booking.de_To_Address_State != null) formInputs['de_To_Address_State'] = booking.de_To_Address_State;
                else formInputs['de_To_Address_State'] = '';

                if (booking.pu_Address_Country != undefined && booking.pu_Address_State != undefined) {
                    this.setState({puTimeZone: this.getTime(booking.pu_Address_Country, booking.pu_Address_State)});
                }

                if (booking.de_To_Address_Country != undefined && booking.de_To_Address_State != undefined) {
                    this.setState({deTimeZone: this.getTime(booking.de_To_Address_Country, booking.de_To_Address_State)});
                }
                
                this.setState({
                    selectedOptionPostal: {'value': booking.pu_Address_PostalCode ? booking.pu_Address_PostalCode : null,'label': booking.pu_Address_PostalCode ? booking.pu_Address_PostalCode : null},
                    selectedOptionSuburb: {'value': booking.pu_Address_Suburb ? booking.pu_Address_Suburb : null,'label': booking.pu_Address_Suburb ? booking.pu_Address_Suburb : null},
                    selectedOptionState: {'value': booking.pu_Address_State ? booking.pu_Address_State : null,'label': booking.pu_Address_State ? booking.pu_Address_State : null},
                    deSelectedOptionPostal: {'value': booking.de_To_Address_PostalCode ? booking.de_To_Address_PostalCode : null,'label': booking.de_To_Address_PostalCode ? booking.de_To_Address_PostalCode : null},
                    deSelectedOptionSuburb: {'value': booking.de_To_Address_Suburb ? booking.de_To_Address_Suburb : null,'label': booking.de_To_Address_Suburb ? booking.de_To_Address_Suburb : null},
                    deSelectedOptionState: {'value': booking.de_To_Address_State ? booking.de_To_Address_State : null,'label': booking.de_To_Address_State ? booking.de_To_Address_State : null},
                });

                if ( (booking.b_dateBookedDate !== null) && (booking.b_dateBookedDate !== undefined)) {
                    // console.log('@booking data is on.');
                    this.setState({bAllComboboxViewOnlyonBooking: true});
                } else {
                    // console.log('@booking data is off.');
                    this.setState({bAllComboboxViewOnlyonBooking: false});
                }

                if (this.state.loading) {
                    this.props.getBookingLines(booking.pk_booking_id);
                    this.props.getBookingLineDetails(booking.pk_booking_id);
                }

                this.setState({ formInputs, booking, nextBookingId, prevBookingId, loading: false });
            } else {
                this.setState({ formInputs: {}, loading: false });
                alert('There is no such booking with that DME/CON number.');
            }
        }
    }

    onChangeState(e) {
        console.log(e);
    }

    onHandleInput(e) {
        
        if ( this.state.bAllComboboxViewOnlyonBooking === false) {
            let formInputs = this.state.formInputs;
            let booking = this.state.booking;
            formInputs[e.target.name] = e.target.value;
            booking[e.target.name] = e.target.value;
            this.setState({ formInputs });
            this.setState({ booking });
        } else {
            let formInputs = this.state.formInputs;
            let booking = this.state.booking;
            // console.log('@here', e.target.value, booking[e.target.name]);
            if (booking[e.target.name] == null) {
                formInputs[e.target.name] = '';
            } else {
                formInputs[e.target.name] = booking[e.target.name];
            }
            this.setState({ formInputs });
        }
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

        this.setState({loading: true});
    }

    onClickPrinter(booking) {
        const st_name = 'startrack';
        const allied_name = 'allied';

        if (booking.z_label_url && booking.z_label_url.length > 0) {
            if (booking.vx_freight_provider.toLowerCase() === st_name) {
                const win = window.open(booking.z_label_url);
                win.focus();
            } else if (booking.vx_freight_provider.toLowerCase() === allied_name) {
                const win = window.open(HTTP_PROTOCOL + '://' + STATIC_HOST + '/pdfs/' + booking.z_label_url, '_blank');
                win.focus();
            }
            booking.is_printed = true;
            booking.z_downloaded_shipping_label_timestamp = new Date();
            this.props.updateBooking(booking.id, booking);
        } else {
            alert('This booking has no label');
        }
    }

    onClickNext(e){
        e.preventDefault();
        const {nextBookingId} = this.state;

        if (nextBookingId && nextBookingId > -1) {
            this.props.getBookingWithFilter(nextBookingId, 'id');
        }

        this.setState({loading: true});
    }

    onSave() {
        if (this.state.bAllComboboxViewOnlyonBooking == false) {
            let bookingToUpdate = this.state.booking;
            delete bookingToUpdate.pu_Address_Street_2;
            bookingToUpdate.pu_Address_street_2 = this.state.booking.pu_Address_Street_2;
            //const mainDate = moment(new Date(), 'DD MMM YYYY').toDate();
            // bookingToUpdate.b_dateBookedDate = mainDate;
            this.props.updateBooking(this.state.booking.id, bookingToUpdate);
        } else {
            console.log ('@confir booking---');
        }
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

    onCheckLine(e, row) {
        // if (!e.target.checked) {
        //     this.setState({selectedBookingIds: lodash.difference(this.state.selectedBookingIds, [row.pk_auto_id_lines])});
        // } else {
        //     this.setState({selectedBookingIds: lodash.union(this.state.selectedBookingIds, [row.pk_auto_id_lines])});

        // }
        const { products } = this.state;
        let clonedProducts = lodash.clone(products);
        clonedProducts = lodash.difference(clonedProducts, [row]);
        this.setState({products: clonedProducts});
    }

    onCheckLine1(e, row) {
        const { bookingLinesListDetailProduct } = this.state;
        let clonedProducts = lodash.clone(bookingLinesListDetailProduct);
        clonedProducts = lodash.difference(clonedProducts, [row]);
        this.setState({bookingLinesListDetailProduct: clonedProducts});
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

    deleteRow() {
        // const {deletedBookingLine, bookingLinesListProduct} = this.state;
        const { selectedBookingIds, products } = this.state;

        if (selectedBookingIds.length == 0) {
            alert('No delete booking id');
            return;
        }
        let clonedProducts = lodash.clone(products);
        for (let i = 0; i < selectedBookingIds.length; i++) {
            for (let j = 0; j < products.length; j++) {
                if ( products[j].pk_auto_id_lines === selectedBookingIds[i] ) {
                    clonedProducts = lodash.difference(clonedProducts, [products[j]]);
                    break;
                }
            }
        }

        this.setState({products: clonedProducts});
        this.setState({selectedBookingIds: []});
    }

    onPickUpDateChange(date) {
        if (this.state.bAllComboboxViewOnlyonBooking == false) {        
            const mainDate = moment(date).format('YYYY-MM-DD');
            localStorage.setItem('today', mainDate);
            this.setState({ mainDate, sortField: 'id', sortDirection: 1, filterInputs: {} });
        }
    }

    deleteRowDetails() {
        const {deletedBookingLine, bookingLinesListDetailProduct} = this.state;
        let tempBooking = bookingLinesListDetailProduct;
        tempBooking.splice(deletedBookingLine, 1);
        this.setState({bookingLinesListDetailProduct: tempBooking, deletedBookingLine: -1});
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
            this.setState({loading: true});
        }

        this.setState({typed});
    }

    handleOnSelectLineRow(row, isSelect) {
        if (isSelect) {
            const {bookingLinesListProduct} = this.state;
            var a = bookingLinesListProduct.indexOf(row);
            // console.log('@a value' + a);
            this.setState({deletedBookingLine: a});
        }
    }

    onChangeText(e) {
        this.setState({typed: e.target.value});
        // console.log(e.target.value);
    }

    handleChangeState = (selectedOption) => {
        if ( this.state.bAllComboboxViewOnlyonBooking == false) {
            this.setState({ selectedOption });
            // console.log('Option selected:', selectedOption);
            this.props.getSuburbStrings('postalcode', selectedOption.label);
            this.setState({selectedOptionPostal: null});
            this.setState({selectedOptionSuburb: null});
        }
    };

    handleChangePostalcode = (selectedOptionPostal) => {
        if ( this.state.bAllComboboxViewOnlyonBooking == false) {
            this.props.getSuburbStrings('suburb', selectedOptionPostal.label);
            this.setState({ selectedOptionPostal });
            // console.log('postalcode selected:', selectedOptionPostal);
            this.setState({selectedOptionSuburb: null});
        }
    };

    handleChangeSuburb = (selectedOptionSuburb) => {
        if ( this.state.bAllComboboxViewOnlyonBooking == false) {
            this.setState({ selectedOptionSuburb });
            // console.log('suburb selected:', selectedOptionSuburb);
        }
    };

    handleChangeStateDelivery = (deSelectedOptionState) => {
        if ( this.state.bAllComboboxViewOnlyonBooking == false) {
            this.setState({ deSelectedOptionState });
            this.props.getDeliverySuburbStrings('postalcode', deSelectedOptionState.label);
            // console.log('Option selected:', deSelectedOptionState);
            this.setState({deSelectedOptionPostal: null});
            this.setState({deSelectedOptionSuburb: null});
        }
    };

    handleChangePostalcodeDelivery = (deSelectedOptionPostal) => {
        if ( this.state.bAllComboboxViewOnlyonBooking == false) {
            this.props.getDeliverySuburbStrings('suburb', deSelectedOptionPostal.label);
            this.setState({ deSelectedOptionPostal });
            console.log('postalcode selected:', deSelectedOptionPostal);
            this.setState({deSelectedOptionSuburb: null});
        }
    };

    handleChangeSuburbDelivery = (deSelectedOptionSuburb) => {
        if ( this.state.bAllComboboxViewOnlyonBooking == false) {
            this.setState({ deSelectedOptionSuburb });
            console.log('suburb selected:', deSelectedOptionSuburb);
        }
    };

    handlePost(e) {
        e.preventDefault();
        const {booking} = this.state;
        if ( booking != null && booking.id != null) {
            this.dropzone.processQueue();
        } else {
            alert('There is no booking data.');
        }
    }

    displayNoOptionsMessage() {
        if (this.state.bAllComboboxViewOnlyonBooking == true) {
            return 'No Editable';
        }
    }

    handleFileSending(data, xhr, formData) {
        formData.append('warehouse_id', this.state.booking.id);
    }

    handleUploadSuccess(file) {
        let uploadedFileName = file.xhr.responseText.substring(file.xhr.responseText.indexOf('"'));
        uploadedFileName = uploadedFileName.replace(/"/g,'');
        this.interval = setInterval(() => this.myTimer(), 2000);

        this.setState({
            uploadedFileName,
            uploaded: true,
        });
    }

    handleUploadFinish() {
        this.props.getAttachmentHistory(this.state.booking.id);
    }

    render() {
        const {bAllComboboxViewOnlyonBooking, attachmentsHistory,isShowBookingCntAndTot, booking, selectedOptionState, selectedOptionPostal, selectedOptionSuburb, deSelectedOptionState, deSelectedOptionPostal, deSelectedOptionSuburb, mainDate, products, bookingLinesListDetailProduct, isShowAddServiceAndOpt, isShowPUDate, isShowDelDate, formInputs} = this.state;
        const iconCheck = (cell, row) => {
            return (
                // <input type="button" classname ="icon-remove" onClick={(e) => this.onCheckLine(e, row)}></input>
                <button className="btn btn-light btn-theme" onClick={(e) => {if (window.confirm('Are you sure you wish to delete this item?'))this.onCheckLine(e, row);}}><i className="icon icon-trash"></i></button>
            );
        };

        const iconCheck1 = (cell, row) => {
            return (
                // <input type="button" classname ="icon-remove" onClick={(e) => this.onCheckLine(e, row)}></input>
                <button className="btn btn-light btn-theme" onClick={(e) => {if (window.confirm('Are you sure you wish to delete this item?'))this.onCheckLine1(e, row);}}><i className="icon icon-trash"></i></button>
            );
        };

        const columns = [
            {
                dataField: 'pk_auto_id_lines',
                text: '',
                formatter: iconCheck,
                editable: false
            }, {
                dataField: 'e_type_of_packaging',
                text: 'Packaging'
            }, {
                dataField: 'e_item',
                text: 'Item Description'
            }, {
                dataField: 'e_qty',
                text: 'Qty'
            }, {
                dataField: 'e_weightUOM',
                text: 'Wgt UOM'
            }, {
                dataField: 'e_weightPerEach',
                text: 'Wgt Each'
            }, {
                dataField: 'total_kgs',
                text: 'Total Kgs'
            }, {
                dataField: 'e_dimUOM',
                text: 'Dim UOM'
            }, {
                dataField: 'e_dimLength',
                text: 'Length'
            }, {
                dataField: 'e_dimWidth',
                text: 'Width'
            }, {
                dataField: 'e_dimHeight',
                text: 'Hegiht'
            }, {
                dataField: 'cubic_meter',
                text: 'Cubic Meter'
            },
        ];

        const columnDetails = [
            {
                text: '',
                formatter: iconCheck1,
                editable: false
            }, {
                dataField: 'modelNumber',
                text: 'Model'
            }, {
                dataField: 'itemDescription',
                text: 'Item Description'
            }, {
                dataField: 'quantity',
                text: 'Qty'
            }, {
                dataField: 'itemFaultDescription',
                text: 'Fault Description'
            }, {
                dataField: 'insuranceValueEach',
                text: 'Insurance Value'
            }, {
                dataField: 'gap_ra',
                text: 'Gap/ RA'
            }, {
                dataField: 'clientRefNumber',
                text: 'Client Reference #'
            },
        ];

        const columnFreight = [
            {
                dataField: 'provider',
                text: 'Provider'
            }, {
                dataField: 'service',
                text: 'Service'
            }, {
                dataField: 'etd',
                text: 'ETD'
            }, {
                dataField: 'totalFeeEx',
                text: 'Total Fee Ex(GST)'
            }, {
                dataField: 'bookingCutoffTime',
                text: 'Booking Cutoff Time'
            },
        ];

        const columnCommunication = [
            {
                dataField: 'no',
                text: 'Comm No'
            }, {
                dataField: 'date',
                text: 'Date'
            }, {
                dataField: 'type',
                text: 'Type'
            }, {
                dataField: 'description',
                text: 'Description'
            }, {
                dataField: 'view',
                text: 'View'
            },
        ];

        const columnAttachments = [
            {
                dataField: 'no',
                text: 'Attachment No'
            }, {
                dataField: 'description',
                text: 'Description'
            }, {
                dataField: 'filename',
                text: 'FileName'
            }, {
                dataField: 'dateupdated',
                text: 'Date Updated'
            }, {
                dataField: 'uploadfile',
                text: 'Upload File'
            }
        ];

        const columnAdditionalServices = [
            {
                dataField: 'freightprovider',
                text: 'Freight Provider'
            }, {
                dataField: 'tnt',
                text: 'TNT'
            }, {
                dataField: 'service',
                text: 'Service'
            }, {
                dataField: 'consignmentNo',
                text: 'Consignment No'
            }, {
                dataField: 'bookingCutoff',
                text: 'Booking Cutoff'
            }, {
                dataField: 'RoadFreightExpress',
                text: 'Road Freight Express'
            }, {
                dataField: 'pickupManifestNo',
                text: 'Pickup / Manifest No'
            }, {
                dataField: 'EnteredDate',
                text: 'Entered Date'
            }, {
                dataField: 'Quoted',
                text: 'Quoted'
            }, {
                dataField: 'BookedDate',
                text: 'Booked Date'
            }, {
                dataField: 'Invoiced',
                text: 'Invoiced'
            },
        ];

        const columnBookingCounts = [
            {
                dataField: 'TotalPieces',
                text: 'Total Pieces'
            }, {
                dataField: 'TotalMass',
                text: 'Total Mass'
            }, {
                dataField: 'TotalCubicKG',
                text: 'Total Cubic KG'
            },
        ];
        // DropzoneComponent config
        this.djsConfig['headers'] = {'Authorization': 'JWT ' + localStorage.getItem('token')};
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            sending: this.handleFileSending.bind(this),
            success: this.handleUploadSuccess.bind(this),
            queuecomplete: this.handleUploadFinish.bind(this),
        };

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

                <LoadingOverlay
                    active={this.state.loading}
                    spinner
                    text='Loading...'
                >
                    <section className="booking">
                        <div className="container">
                            <div className="grid">
                                <div className="userclock">
                                    <Clock format={'DD MMM YYYY h:mm:ss A'} disabled={true} ticking={true} timezone={'Australia/Sydney'} />
                                </div>
                                <div className="head">
                                    <div className="row">
                                        <div className="col-sm-2">
                                            <p className="text-white">Edit Booking {this.state.booking.b_bookingID_Visual}</p>
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
                                                        <li className="peclock"><Clock format={'DD MMM YYYY h:mm:ss A'} ticking={true} timezone={this.state.puTimeZone} /></li>
                                                    </ul>
                                                </div>
                                                <form action="">
                                                    <div className="progress">
                                                        <div className="progress-bar progress-bar-striped" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">
                                                            95%
                                                        </div>
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
                                                            <label className="" htmlFor="">State</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <Select
                                                                value={selectedOptionState}
                                                                onChange={this.handleChangeState}
                                                                options={this.state.stateStrings}
                                                                placeholder='select your state'
                                                                noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                                openMenuOnClick = {bAllComboboxViewOnlyonBooking ? false : true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Postal Code</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <Select
                                                                value={selectedOptionPostal}
                                                                onChange={this.handleChangePostalcode}
                                                                options={this.state.postalCode}
                                                                placeholder='select your postal code'
                                                                openMenuOnClick = {bAllComboboxViewOnlyonBooking ? false : true}
                                                                noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Suburb</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <Select
                                                                value={selectedOptionSuburb}
                                                                onChange={this.handleChangeSuburb}
                                                                options={this.state.suburbStrings}
                                                                placeholder='select your suburb'
                                                                openMenuOnClick = {bAllComboboxViewOnlyonBooking ? false : true}
                                                                noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                            />
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
                                                                <DatePicker
                                                                    selected={mainDate}
                                                                    onChange={(e) => this.onPickUpDateChange(e)}
                                                                    dateFormat="DD MMM YYYY"
                                                                    disabled={bAllComboboxViewOnlyonBooking ? true : false}
                                                                />
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
                                                        <li className="peclock" >
                                                            <Clock format={'DD MMM YYYY h:mm:ss A'} ticking={true} timezone={this.state.deTimeZone} />
                                                        </li>
                                                    </ul>
                                                </div>
                                                <form action="">
                                                    <div className="progress">
                                                        <div className="progress-bar progress-bar-striped" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">
                                                            50%
                                                        </div>
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
                                                            <label className="" htmlFor="">State</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <Select
                                                                value={deSelectedOptionState}
                                                                onChange={this.handleChangeStateDelivery}
                                                                options={this.state.deStateStrings}
                                                                placeholder='select your state'
                                                                noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                                openMenuOnClick = {bAllComboboxViewOnlyonBooking ? false : true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Postal Code</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <Select
                                                                value={deSelectedOptionPostal}
                                                                onChange={this.handleChangePostalcodeDelivery}
                                                                options={this.state.dePostalCode}
                                                                placeholder='select your postal code'
                                                                noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                                openMenuOnClick = {bAllComboboxViewOnlyonBooking ? false : true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mt-1">
                                                        <div className="col-sm-4">
                                                            <label className="" htmlFor="">Suburb</label>
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <Select
                                                                value={deSelectedOptionSuburb}
                                                                onChange={this.handleChangeSuburbDelivery}
                                                                options={this.state.deSuburbStrings}
                                                                placeholder='select your suburb'
                                                                noOptionsMessage={() => this.displayNoOptionsMessage()}
                                                                openMenuOnClick = {bAllComboboxViewOnlyonBooking ? false : true}
                                                            />
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
                                                                <DatePicker
                                                                    selected={mainDate}
                                                                    onChange={(e) => this.onPickUpDateChange(e)}
                                                                    dateFormat="DD MMM YYYY"
                                                                    disabled={bAllComboboxViewOnlyonBooking ? true : false}
                                                                />
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
                                                    <div className="text-center mt-2">
                                                        <button className="btn btn-theme custom-theme" onClick={() => this.onClickPrinter(booking)}><i className="icon icon-printer"></i> Print</button>
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
                                                <li><a href="#tab02">Additional Services & Options</a></li>
                                                <li><a href="#tab03">Freight Options</a></li>
                                                <li><a href="#tab04">Communication Log</a></li>
                                                <li><a href="#tab05">Attachments</a></li>
                                            </ul>
                                        </div>
                                        <div className="tab-select-outer">
                                            <select id="tab-select">
                                                <option value="#tab01">Shipment Packages / Goods</option>
                                                <option value="#tab02">Additional Services & Options</option>
                                                <option value="#tab03">Freight Options</option>
                                                <option value="#tab04">Communication Log</option>
                                                <option value="#tab05">Attachments</option>
                                            </select>
                                        </div>
                                        <div id="tab01" className="tab-contents">
                                            <div className="tab-inner">
                                                <BootstrapTable
                                                    keyField='pk_auto_id_lines'
                                                    data={ products }
                                                    columns={ columns }
                                                    cellEdit={ cellEditFactory({ mode: 'click',blurToSave: true }) }
                                                    bootstrap4={ true }
                                                />
                                                <BootstrapTable
                                                    keyField="modelNumber"
                                                    data={ bookingLinesListDetailProduct }
                                                    columns={ columnDetails }
                                                    cellEdit={ cellEditFactory({ mode: 'click',blurToSave: true }) }
                                                    bootstrap4={ true }
                                                />
                                            </div>
                                        </div>
                                        <div id="tab02" className="tab-contents">
                                            <div className="tab-inner">
                                                <BootstrapTable
                                                    keyField='pk_auto_id_lines'
                                                    data={ products }
                                                    columns={ columnAdditionalServices }
                                                    cellEdit={ cellEditFactory({ mode: 'click',blurToSave: true }) }
                                                    bootstrap4={ true }
                                                />
                                                <BootstrapTable
                                                    keyField="modelNumber"
                                                    data={ bookingLinesListDetailProduct }
                                                    columns={ columnBookingCounts }
                                                    cellEdit={ cellEditFactory({ mode: 'click',blurToSave: true }) }
                                                    bootstrap4={ true }
                                                />
                                            </div>
                                        </div>
                                        <div id="tab03" className="tab-contents">
                                            <div className="tab-inner">
                                                <BootstrapTable
                                                    keyField="modelNumber"
                                                    data={ bookingLinesListDetailProduct }
                                                    columns={ columnFreight }
                                                    cellEdit={ cellEditFactory({ mode: 'click',blurToSave: true }) }
                                                    bootstrap4={ true }
                                                />
                                            </div>
                                        </div>
                                        <div id="tab04" className="tab-contents">
                                            <div className="tab-inner">
                                                <BootstrapTable
                                                    keyField="modelNumber"
                                                    data={ bookingLinesListDetailProduct }
                                                    columns={ columnCommunication }
                                                    cellEdit={ cellEditFactory({ mode: 'click',blurToSave: true }) }
                                                    bootstrap4={ true }
                                                />
                                            </div>
                                        </div>
                                        <div id="tab05" className="tab-contents">
                                            <div className="col-12">
                                                <form onSubmit={(e) => this.handlePost(e)}>
                                                    <DropzoneComponent id="myDropzone" config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
                                                    <button id="submit-upload" type="submit">upload</button>
                                                </form>
                                            </div>
                                            <div className="tab-inner">
                                                <BootstrapTable
                                                    keyField="modelNumber"
                                                    data={ attachmentsHistory }
                                                    columns={ columnAttachments }
                                                    cellEdit={ cellEditFactory({ mode: 'click',blurToSave: true }) }
                                                    bootstrap4={ true }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </LoadingOverlay>
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
        bBooking: state.booking.bBooking,
        stateStrings: state.booking.stateStrings,
        postalCode: state.booking.postalCode,
        suburbStrings: state.booking.suburbStrings,
        deStateStrings: state.booking.deStateStrings,
        dePostalCode: state.booking.dePostalCode,
        deSuburbStrings: state.booking.deSuburbStrings,
        attachments: state.booking.attachments,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        saveBooking: (booking) => dispatch(saveBooking(booking)),
        getBookingWithFilter: (id, filter) => dispatch(getBookingWithFilter(id, filter)),
        getSuburbStrings: (type, name) => dispatch(getSuburbStrings(type, name)),
        getAttachmentHistory: (id) => dispatch(getAttachmentHistory(id)),
        getDeliverySuburbStrings: (type, name) => dispatch(getDeliverySuburbStrings(type, name)),
        getBookingLines: (bookingId) => dispatch(getBookingLines(bookingId)),
        getBookingLineDetails: (bookingId) => dispatch(getBookingLineDetails(bookingId)),
        alliedBooking: (bookingId) => dispatch(alliedBooking(bookingId)),
        stBooking: (bookingId) => dispatch(stBooking(bookingId)),
        updateBooking: (id, booking) => dispatch(updateBooking(id, booking)),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingPage);
