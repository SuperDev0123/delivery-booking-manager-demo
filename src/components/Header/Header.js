import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import LoadingOverlay from 'react-loading-overlay';
import { join } from 'lodash';
import moment from 'moment-timezone';

import { getUser, logout } from '../../state/services/authService';
import { getStatusPageUrl } from '../../state/services/bookingService';
// import { openTab } from '../../commons/browser';

import logo from '../../public/images/logo-2.png';
import { Popover, PopoverBody } from 'reactstrap';
import { getAddressesWithPrefix } from '../../state/services/elasticsearchService';
import { getQuickPricing } from '../../state/services/extraService';
import { debounce } from '../../commons/browser';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            findKeyword: '',
            isOpenQuickQuote: false,
            isGettingQuickQuote: false,
            activeTabInd: 1,
            puSuburb: {value: ''},
            deToSuburb: {value: ''},
            formInputs: {
                pu_Address_State: '',
                pu_Address_PostalCode: '',
                pu_Address_Suburb: '',
                de_To_Address_State: '',
                de_To_Address_PostalCode: '',
                de_To_Address_Suburb: '',
            },
            lines: [
                {
                    e_qty: '',
                    e_dimUOM: 'm',
                    e_dimLength: '',
                    e_dimWidth: '',
                    e_dimHeight: '',
                    e_e_weightUOM: 'kg',
                    e_weightPerEach: '',
                    e_type_of_packaging: 'Carton',
                }
            ],
        };
    }

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        clientname: PropTypes.string,
        puAddresses: PropTypes.array,
        deToAddresses: PropTypes.array,
        quickPricings: PropTypes.array,

        // Functions
        getUser: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        getStatusPageUrl: PropTypes.func.isRequired,
        getAddressesWithPrefix: PropTypes.func.isRequired,
        getQuickPricing: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const token = localStorage.getItem('token');

        if (isLoggedIn && token && token.length > 0)
            this.props.getUser(token);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { username, clientname, isLoggedIn, quickPricings } = newProps;

        if (username)
            this.setState({username});

        if (clientname)
            this.setState({clientname});

        if (quickPricings)
            this.setState({isGettingQuickQuote: false});

        // if (statusPageUrl) {
        //     console.log('@1 - ', statusPageUrl);
        //     if (statusPageUrl === 'not_found')
        //         this.notify('Not found with "' + this.state.findKeyword + '"');
        //     else
        //         openTab(statusPageUrl);

        //     this.setState({isFindingBooking: false});
        // }

        this.setState({isLoggedIn});
    }

    notify = (text) => toast(text);

    logout() {
        this.props.logout();
        this.props.history.push('/');
    }

    onChangeText(e) {
        this.setState({findKeyword: e.target.value});
    }

    onKeyPress(e) {
        const findKeyword = e.target.value;

        if (e.key === 'Enter' && !this.state.loading) {
            e.preventDefault();

            if ((findKeyword == undefined) || (findKeyword == '')) {
                this.notify('Value is required!');
                return;
            }

            this.props.getStatusPageUrl(findKeyword);
            this.setState({isFindingBooking: true});
        }

        this.setState({findKeyword});
    }

    onInputChange(e, index, field) {
        const { lines } = this.state;
        const newlines = [...lines];
        newlines[index][field] = e.target.value;
        this.setState({lines: newlines});
    }

    /*
     * @param {array<object>} addresses - address array from es(elasticsearch)
     * @param {string} mixedAddress - mixed address
     * @return {object} address - found address object
     */
    _findAddress = (addresses, mixedAddress) => {
        return addresses.find(address => {
            const fullAddress = `${address._source.suburb} ${address._source.postal_code} ${address._source.state}`;
            return fullAddress === mixedAddress;
        });
    };

    handleChangeSuburb = (selectedOption, src) => {
        const {formInputs} = this.state;
        const {puAddresses, deToAddresses} = this.props;

        if (src === 'puSuburb') {
            const address = this._findAddress(puAddresses, selectedOption.value);
            formInputs['pu_Address_State'] = address._source.state;
            formInputs['pu_Address_PostalCode'] = address._source.postal_code;
            formInputs['pu_Address_Suburb'] = address._source.suburb;
            const puSuburb = {label: address._source.suburb, value:address._source.suburb};
            this.setState({ puSuburb, formInputs });
        } else if (src === 'deToSuburb') {
            const address = this._findAddress(deToAddresses, selectedOption.value);
            formInputs['de_To_Address_State'] = address._source.state;
            formInputs['de_To_Address_PostalCode'] = address._source.postal_code;
            formInputs['de_To_Address_Suburb'] = address._source.suburb;
            const deToSuburb = {label: address._source.suburb, value:address._source.suburb};
            this.setState({ deToSuburb, formInputs });
        }
    };

    handleInputChangeSuburb = (query, src) => {
        let postalCodePrefix = null;
        let suburbPrefixes = [];
        const iters = query.split(' ');
        iters.map((iter) => {
            if (!isNaN(iter))
                postalCodePrefix = iter;
            else
                suburbPrefixes.push(iter);
        });

        if (postalCodePrefix || suburbPrefixes.length > 0) {
            if (src === 'puSuburb') {
                this.props.getAddressesWithPrefix(
                    'puAddress',
                    join(suburbPrefixes, ' '),
                    postalCodePrefix
                );
            } else if (src === 'deToSuburb') {
                this.props.getAddressesWithPrefix(
                    'deToAddress',
                    join(suburbPrefixes, ' '),
                    postalCodePrefix
                );
            }

            this.setState({suburbPrefix: join(suburbPrefixes, ' '), postalCodePrefix});
        }
    };

    handleFocusSuburb = (src) => {
        const {formInputs} = this.state;

        if (src === 'puSuburb') {
            this.props.getAddressesWithPrefix(
                'puAddress',
                formInputs['pu_Address_Suburb'] || 'syd',
                null
            );
        } else if (src === 'deToSuburb') {
            this.props.getAddressesWithPrefix(
                'deToAddress',
                formInputs['de_To_Address_Suburb'] || 'syd',
                null
            );
        }
    };

    onOpenQuickQuote() {
        this.setState({isOpenQuickQuote: !this.state.isOpenQuickQuote});
    }

    onCloseQuickQuote() {
        this.setState({isOpenQuickQuote: false});
    }

    onClickAddPackage() {
        const { lines } = this.state;
        const newlines = [...lines];
        newlines.unshift({
            e_qty: '',
            e_dimUOM: 'm',
            e_dimLength: '',
            e_dimWidth: '',
            e_dimHeight: '',
            e_e_weightUOM: 'kg',
            e_weightPerEach: '',
            e_type_of_packaging: 'Carton',
        });
        this.setState({lines: newlines});
    }

    onCancel(index) {
        const { lines } = this.state;
        const newlines = [...lines];
        newlines.splice(index, 1);
        this.setState({lines: newlines});
    }

    onClickGetQuote(e) {
        e.preventDefault();

        if (!this.state.formInputs.pu_Address_Suburb) {
            this.notify('Please select Pickup address.');
            return;
        } else if (!this.state.formInputs.de_To_Address_Suburb) {
            this.notify('Please select Delivery address.');
            return;
        }

        this.props.getQuickPricing({
            'booking': this.state.formInputs,
            'booking_lines': this.state.lines
        });
        this.setState({isGettingQuickQuote: true });
    }

    copyToClipBoard = async text => {
        try {
            await navigator.clipboard.writeText(text);
            this.notify('Copied!');
        } catch (err) {
            this.notify('Failed to copy!');
        }
    };

    onSwitchTab(e, activeTabInd) {
        e.preventDefault();
        this.setState({activeTabInd});
    }

    render() {
        const { username, puSuburb, deToSuburb, formInputs, activeTabInd } = this.state;
        const { quickPricings, clientname } = this.props;
        const currentRoute = this.props.location.pathname;
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (currentRoute.indexOf('admin') > -1 || currentRoute.indexOf('customerdashboard') > -1 || currentRoute.indexOf('status') > -1) 
            return null;
        
        // Populate puAddresses and deToAddresses
        let puAddressOptions = [];
        let deToAddressOptions = [];
        if (formInputs['pu_Address_Suburb'] && this.props.puAddresses.length === 0) {
            const value = `${formInputs['pu_Address_Suburb']}`;
            puAddressOptions = [{value: value, label: value}];
        } else if (this.props.puAddresses.length > 0) {
            puAddressOptions = this.props.puAddresses.map(address => {
                const value = `${address._source.suburb} ${address._source.postal_code} ${address._source.state}`;
                return {value: value, label: value};
            });
        }
        if (formInputs['de_To_Address_Suburb'] && this.props.deToAddresses.length === 0) {
            const value = `${formInputs['de_To_Address_Suburb']}`;
            deToAddressOptions = [{value: value, label: value}];
        } else if (this.props.deToAddresses.length > 0) {
            deToAddressOptions = this.props.deToAddresses.map(address => {
                const value = `${address._source.suburb} ${address._source.postal_code} ${address._source.state}`;
                return {value: value, label: value};
            });
        }

        // Build pricing table
        const originalPricings = quickPricings
            .filter((price) => price.packed_status === 'original')
            .map((price, index) => {
                return (
                    <tr key={index}>
                        <td>{price['fp_name']}</td>
                        <td>{price['vehicle_name'] ? `${price['service_name']} (${price['vehicle_name']})` : price['service_name']}</td>
                        <td>
                            ${price['cost_dollar'].toFixed(2)}
                            &nbsp;&nbsp;&nbsp;
                            <i className="fa fa-copy" onClick={() => this.copyToClipBoard(price['cost_dollar'].toFixed(2))}></i>
                        </td>
                        <td>{(price['mu_percentage_fuel_levy'] * 100).toFixed(2)}%</td>
                        <td>${price['fuel_levy_base_cl'].toFixed(2)}</td>
                        <td>
                            ${price['surcharge_total_cl'].toFixed(2)} {price['surcharge_total_cl'].toFixed(2) > 0
                                ? <i className="fa fa-dollar-sign" onClick={() => this.onClickSurcharge(price)}></i>
                                : ''}
                        </td>
                        <td>
                            ${price['client_mu_1_minimum_values'].toFixed(2)}
                            &nbsp;&nbsp;&nbsp;
                            <i className="fa fa-copy" onClick={() => this.copyToClipBoard(price['client_mu_1_minimum_values'].toFixed(2))}></i>
                        </td>
                        <td>{moment().add(Math.ceil(price['eta_in_hour'] / 24), 'd').format('YYYY-MM-DD')} ({price['eta']})</td>
                    </tr>
                );
            });
    

        const autoPricings = quickPricings
            .filter(pricing => pricing.packed_status === 'auto')
            .map((price, index) => {
                return (
                    <tr key={index}>
                        <td>{price['fp_name']}</td>
                        <td>{price['vehicle_name'] ? `${price['service_name']} (${price['vehicle_name']})` : price['service_name']}</td>
                        <td>
                            ${price['cost_dollar'].toFixed(2)}
                            &nbsp;&nbsp;&nbsp;
                            <i className="fa fa-copy" onClick={() => this.copyToClipBoard(price['cost_dollar'].toFixed(2))}></i>
                        </td>
                        <td>{(price['mu_percentage_fuel_levy'] * 100).toFixed(2)}%</td>
                        <td>${price['fuel_levy_base_cl'].toFixed(2)}</td>
                        <td>
                            ${price['surcharge_total_cl'].toFixed(2)} {price['surcharge_total_cl'].toFixed(2) > 0
                                ? <i className="fa fa-dollar-sign" onClick={() => this.onClickSurcharge(price)}></i>
                                : ''}
                        </td>
                        <td>
                            ${price['client_mu_1_minimum_values'].toFixed(2)}
                            &nbsp;&nbsp;&nbsp;
                            <i className="fa fa-copy" onClick={() => this.copyToClipBoard(price['client_mu_1_minimum_values'].toFixed(2))}></i>
                        </td>
                        <td>{moment().add(Math.ceil(price['eta_in_hour'] / 24), 'd').format('YYYY-MM-DD')} ({price['eta']})</td>
                    </tr>
                );
            });
        return (
            <header>
                {currentRoute === '/booking' ||
                currentRoute === '/allbookings' ||
                currentRoute === '/bookingsets' ||
                currentRoute === '/bookinglines' ||
                currentRoute === '/bookinglinedetails' ||
                currentRoute === '/pods' ||
                currentRoute === '/zoho' ||
                currentRoute === '/reports' ?
                    <nav className="qbootstrap-nav" role="navigation">
                        <div className="col-md-12" id="headr">
                            <div className="top">
                                <div className="row">
                                    <div className="col-md-8 col-sm-12 col-lg-8 col-xs-12 col-md-push-1 ">
                                        <h3 className="label_hel"><a href="/">Company: {clientname ? clientname : '---'}    User: {username ? username : '---'}</a></h3>
                                        <h3 className="label_hel"></h3>
                                    </div>
                                    <div className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right col-lg-pull-1">
                                        <a href="" className="none">Login Info Client</a>
                                        <span className="none">|</span>
                                        <a href="" className="none">Accounts</a>
                                        <span className="none">|</span>
                                        <a href="" className="none">Client Mode</a>
                                        <span className="none">|</span>
                                        <a href="/">Home</a>
                                    </div>
                                </div>
                                <div className="line"></div>
                            </div>
                        </div>
                    </nav>
                    :
                    <nav className="navbar navbar-expand bg-nav pl-md-5 ml-md-0">
                        <div className="col-sm-6">
                            <a href="/" className="navbar-brand mr-sm-0">
                                <img src={logo} className="head-logo" alt="logo" />
                            </a>
                            <h5 style={{fontWeight: 'bold'}}>Tel: (02) 8311 1500</h5>
                        </div>
                        <div className="col-sm-6 d-flex justify-content-between" >
                            <a id="Popover" className="btn btn-outline-light my-2 my-lg-0 login" onClick={() => this.onOpenQuickQuote()}>Quick Quote</a>
                            <Popover
                                className="quick-quote"
                                isOpen={this.state.isOpenQuickQuote}
                                target="Popover"
                                placement="bottom"
                                hideArrow={false} >
                                <PopoverBody>
                                    <LoadingOverlay
                                        active={this.state.isGettingQuickQuote}
                                        spinner
                                        text='Loading...'
                                    >
                                        <form className="quick-quote-form" onSubmit={(e) => this.onClickGetQuote(e)}>
                                            <div className="popover-close" onClick={() => this.onOpenQuickQuote()}>
                                                <i className="fa fa-times-circle p-2"></i>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label><b>Pickup address </b></label>
                                                    <Select
                                                        value={puSuburb}
                                                        onChange={(e) => this.handleChangeSuburb(e, 'puSuburb')}
                                                        onInputChange={debounce((e) => this.handleInputChangeSuburb(e, 'puSuburb'), 500)}
                                                        onFocus={() => this.handleFocusSuburb('puSuburb')}
                                                        options={puAddressOptions}
                                                        placeholder='select your suburb'
                                                        openMenuOnClick = {true}
                                                        filterOption={(options) => {
                                                            // Do no filtering, just return all options
                                                            return options;
                                                        }}
                                                        required="required"
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    {formInputs['pu_Address_PostalCode'] ?
                                                        <div>
                                                            <label className="additional-addr-info">Postal Code: {formInputs['pu_Address_PostalCode']}</label><br />
                                                            <label>State: {formInputs['pu_Address_State']}</label>
                                                        </div> : null
                                                    }
                                                </div>
                                                <div className="col-md-4">
                                                    <label><b>Delivery address</b></label>
                                                    <Select
                                                        value={deToSuburb}
                                                        onChange={(e) => this.handleChangeSuburb(e, 'deToSuburb')}
                                                        onInputChange={debounce((e) => this.handleInputChangeSuburb(e, 'deToSuburb'), 500)}
                                                        focus={() => this.handleFocusSuburb('deToSuburb')}
                                                        options={deToAddressOptions}
                                                        placeholder='select your suburb'
                                                        openMenuOnClick = {true}
                                                        filterOption={(options) => {
                                                            // Do no filtering, just return all options
                                                            return options;
                                                        }}
                                                        required="required"
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    {formInputs['de_To_Address_PostalCode'] ?
                                                        <div>
                                                            <label className="additional-addr-info">Postal Code: {formInputs['de_To_Address_PostalCode']}</label><br />
                                                            <label>State: {formInputs['de_To_Address_State']}</label>
                                                        </div> : null
                                                    }
                                                </div>
                                            </div>

                                            <hr />
                                            <div className="row quote-detail-infos overflow-auto">
                                                <div className=" form-group px-1">
                                                    <label htmlFor="e_type_of_packaging">
                                                        <p>Type of Package</p>
                                                        {
                                                            this.state.lines.map((line, index) => (
                                                                <div className='row p-1' key={'e_type_of_packaging' + index}>
                                                                    <select
                                                                        name={'e_type_of_packaging' + index}
                                                                        onChange={(e) => this.onInputChange(e, index, 'e_type_of_packaging')}
                                                                        value={line.e_type_of_packaging}
                                                                        key={'e_type_of_packaging' + index}
                                                                        required="required"
                                                                    >
                                                                        <option>Carton</option>
                                                                        <option>Pallet</option>
                                                                    </select>                                                                    
                                                                </div>
                                                            ))
                                                        }
                                                    </label>
                                                </div>
                                                <div className="form-group px-1">
                                                    <label htmlFor="e_qty">
                                                        <p>Quantity</p>
                                                        {
                                                            this.state.lines.map((line, index) => (
                                                                <div className="row p-1" key={'e_qty' + index}>
                                                                    <input
                                                                        name={'e_qty' + index}
                                                                        type="text"
                                                                        id={'e_qty' + index }
                                                                        value={line.e_qty}
                                                                        key={'e_qty' + index}
                                                                        onChange={(e) => this.onInputChange(e, index, 'e_qty')}
                                                                        required
                                                                    />
                                                                </div>
                                                            ))
                                                        }
                                                    </label>
                                                </div>
                                                <div className=" form-group px-1">
                                                    <label htmlFor="e_dimUOM">
                                                        <p>DimUOM</p>
                                                        {
                                                            this.state.lines.map((line, index) => (
                                                                <div className="row p-1" key={'e_dimUOM' + index}>
                                                                    <select
                                                                        name={'e_dimUOM' + index}
                                                                        onChange={(e) => this.onInputChange(e, index, 'e_dimUOM')}
                                                                        value={line.e_dimUOM}
                                                                        key={'e_dimUOM' + index}
                                                                        required
                                                                    >
                                                                        <option>m</option>
                                                                        <option>cm</option>
                                                                        <option>mm</option>
                                                                    </select>
                                                                </div>                                                            
                                                            ))
                                                        }
                                                    </label>
                                                </div>
                                                <div className=" form-group px-1">
                                                    <label htmlFor="e_dimLength">
                                                        <p>length</p>
                                                        {
                                                            this.state.lines.map((line, index) => (
                                                                <div className="row p-1" key={'e_dimLength' + index}>
                                                                    <input name={'e_dimLength' + index} type="text" id={'e_dimLength' + index } placeholder="" value={line.e_dimLength} key={'e_dimLength' + index} onChange={(e) => this.onInputChange(e, index, 'e_dimLength')} required />
                                                                </div>
                                                            ))
                                                        }
                                                    </label>
                                                </div>
                                                <div className=" form-group px-1">
                                                    <label htmlFor="e_dimWidth">
                                                        <p>width</p>
                                                        {
                                                            this.state.lines.map((line, index) => (
                                                                <div className="row p-1" key={'e_dimWidth' + index}>
                                                                    <input name={'e_dimWidth' + index} type="text" id={'e_dimWidth' + index } placeholder="" value={line.e_dimWidth} key={'e_dimWidth' + index} onChange={(e) => this.onInputChange(e, index, 'e_dimWidth')} required />
                                                                </div>
                                                            ))
                                                        }
                                                    </label>
                                                </div>
                                                <div className="form-group px-1">
                                                    <label htmlFor="e_dimHeight">
                                                        <p>e_dimHeight</p>
                                                        {
                                                            this.state.lines.map((line, index) => (
                                                                <div className="row p-1" key={'e_dimHeight' + index}>
                                                                    <input name={'e_dimHeight' + index} type="text" id={'e_dimHeight' + index } placeholder="" value={line.e_dimHeight} key={'e_dimHeight' + index} onChange={(e) => this.onInputChange(e, index, 'e_dimHeight')} required />
                                                                </div>
                                                            ))
                                                        }
                                                    </label>
                                                </div>
                                                <div className=" form-group px-1">
                                                    <label htmlFor="e_weightUOM">
                                                        <p>e_weightUOM</p>
                                                        {
                                                            this.state.lines.map((line, index) => (
                                                                <div className="row p-1" key={'e_weightUOM' + index}>
                                                                    <select
                                                                        name={'e_weightUOM' + index}
                                                                        onChange={(e) => this.onInputChange(e, index, 'e_weightUOM')}
                                                                        value={line.e_weightUOM}
                                                                        key={'e_weightUOM' + index}
                                                                        required
                                                                    >
                                                                        <option>kg</option>
                                                                        <option>gram</option>
                                                                    </select>                                                                    
                                                                </div>
                                                            ))
                                                        }
                                                    </label>
                                                </div>
                                                <div className=" form-group px-1">
                                                    <label htmlFor="e_weightPerEach">
                                                        <p>Weight</p>
                                                        {
                                                            this.state.lines.map((line, index) => (
                                                                <div className="row p-1" key={'e_weightPerEach' + index}>
                                                                    <input name={'e_weightPerEach' + index} type="text" id={'e_weightPerEach' + index } placeholder="" value={line.e_weightPerEach} key={'e_weightPerEach' + index} onChange={(e) => this.onInputChange(e, index, 'e_weightPerEach')} required />
                                                                </div>
                                                            ))
                                                        }
                                                    </label>
                                                </div>
                                                <div className="deselect">
                                                    {
                                                        this.state.lines.map((line, index) => {
                                                            if (index == 0) {
                                                                return (
                                                                    <div className="row invisible" key={'cancel' + index}>
                                                                        <i className="fa fa-times-circle p-2"></i>
                                                                    </div>
                                                                );
                                                            } else {
                                                                return (
                                                                    <div onClick={() => this.onCancel(index)} key={'cancel' + index}>
                                                                        <i className="fa fa-times-circle p-2"></i>
                                                                    </div>
                                                                );
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="row m-2">
                                                <button className="btn btn-success btn-xs" type="button" onClick={() => this.onClickAddPackage()}>
                                                    +Add Package
                                                </button>
                                            </div>

                                            {quickPricings.length > 0 ?
                                                <section>
                                                    <div className="">
                                                        <div className="row">
                                                            <div className="col-sm-12">
                                                                <div className="tabs">
                                                                    <div className="tab-button-outer">
                                                                        <ul id="tab-button">
                                                                            <li className={activeTabInd === 0 ? 'selected' : ''}><a onClick={(e) => this.onSwitchTab(e, 0)}>Send As Is</a></li>
                                                                            <li className={activeTabInd === 1 ? 'selected' : ''}><a onClick={(e) => this.onSwitchTab(e, 1)}>Auto Repack</a></li>
                                                                        </ul>
                                                                    </div>
                                                                    {/* <div className="tab-select-outer none">
                                                                        <select id="tab-select">
                                                                            <option value="#tab01">Original</option>
                                                                            <option value="#tab02">Auto Repack</option>
                                                                        </select>
                                                                    </div> */}
                                                                    <div id="tab01" className={activeTabInd === 0 ? 'tab-contents selected' : 'tab-contents none'}>
                                                                        <div className="row quote-result">
                                                                            <table className="table table-hover table-bordered sortable fixed_headers">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>Freight Provider</th>
                                                                                        <th>Service (Vehicle)</th>
                                                                                        <th>Cost $</th>
                                                                                        <th>Fuel Levy %</th>
                                                                                        <th>Fuel Levy $</th>
                                                                                        <th>Extra $</th>
                                                                                        <th>Total $</th>
                                                                                        <th onClick={() => this.onClickColumn('fastest')}>ETA (click & sort)</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {originalPricings}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                    <div id="tab02" className={activeTabInd === 1 ? 'tab-contents selected' : 'tab-contents none'}>
                                                                        <div className="row quote-result">
                                                                            <table className="table table-hover table-bordered sortable fixed_headers">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>Freight Provider</th>
                                                                                        <th>Service (Vehicle)</th>
                                                                                        <th>Cost $</th>
                                                                                        <th>Fuel Levy %</th>
                                                                                        <th>Fuel Levy $</th>
                                                                                        <th>Extra $</th>
                                                                                        <th>Total $</th>
                                                                                        <th onClick={() => this.onClickColumn('fastest')}>ETA (click & sort)</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {autoPricings}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                </section>
                                                : null
                                            }

                                            <div className="row my-2 float-r">
                                                <button className="btn btn-primary btn-sm" type="submit">
                                                    Get Quote
                                                </button>
                                            </div>
                                        </form>
                                    </LoadingOverlay>
                                </PopoverBody>
                            </Popover>
                            <ul className="navbar-nav flex-row ml-auto d-md-flex">
                                {clientname && isLoggedIn === 'true' ?
                                    <li className="nav-item dropdown show">
                                        <a className="nav-item nav-link dropdown-toggle mr-md-2" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <i className="fa fa-user" aria-hidden="true"></i>
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="bd-versions">
                                            <a className="dropdown-item cut-user-name">
                                                <i>Logged in as {username}</i>
                                            </a>
                                            {clientname === 'dme' && <div className='dropdown-divider'></div>}
                                            {clientname === 'dme' && <a className='dropdown-item' href="/admin">DME Admin</a>}
                                            {clientname != 'dme' && <a className='dropdown-item' href="/customerdashboard">Admin</a>}
                                            {clientname === 'dme' && <div className="dropdown-divider"></div>}
                                            {clientname === 'dme' && <a className="dropdown-item" href="/upload">Upload Files</a>}
                                            {(clientname === 'dme' || clientname === 'Tempo Pty Ltd') && <div className="dropdown-divider"></div>}
                                            {(clientname === 'dme' || clientname === 'Tempo Pty Ltd') && <a className="dropdown-item" href="/files">Files</a>}
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item" href="/bok">Find Order</a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item" href="/booking">Booking</a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item" href="/allbookings">All Bookings</a>
                                            {clientname === 'dme' && <div className='dropdown-divider'></div>}
                                            {clientname === 'dme' && <a className='dropdown-item' href="/reports">Reports</a>}
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item" href="/" onClick={() => this.logout()}>Logout</a>
                                        </div>
                                    </li>
                                    :
                                    <li className="nav-item">
                                        {currentRoute.indexOf('/price/') === 0 || currentRoute.indexOf('/status/') === 0 || currentRoute.indexOf('/label/') === 0 ?
                                            null
                                            :
                                            <a href="/login" className="btn btn-outline-light my-2 my-lg-0 login">Login</a>
                                        }
                                    </li>
                                }
                            </ul>
                        </div>
                    </nav>
                }
                <ToastContainer />
            </header>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        clientname: state.auth.clientname,
        isLoggedIn: state.auth.isLoggedIn,
        statusPageUrl: state.booking.statusPageUrl,
        puAddresses: state.elasticsearch.puAddresses,
        deToAddresses: state.elasticsearch.deToAddresses,
        quickPricings: state.extra.quickPricings,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (token) => dispatch(getUser(token)),
        logout: () => dispatch(logout()),
        getStatusPageUrl: (findKeyword) => dispatch(getStatusPageUrl(findKeyword)),
        getAddressesWithPrefix: (src, suburbPrefix, postalCodePrefix) => dispatch(getAddressesWithPrefix(src, suburbPrefix, postalCodePrefix)),
        getQuickPricing: (data) => dispatch(getQuickPricing(data)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
