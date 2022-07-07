import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { join } from 'lodash';

import { getUser, logout } from '../../state/services/authService';
import { getStatusPageUrl } from '../../state/services/bookingService';
// import { openTab } from '../../commons/browser';

import logo from '../../public/images/logo-2.png';
import { Popover, PopoverBody } from 'reactstrap';
import { API_HOST, HTTP_PROTOCOL } from '../../config';
import axios from 'axios';
import { getAddressesWithPrefix } from '../../state/services/elasticsearchService';
import { debounce } from '../../commons/browser';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            clientname: '',
            findKeyword: '',
            isOpenQuickQuote: false,
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
                    quantity: '',
                    dimUOM: '',
                    length: '',
                    width: '',
                    height: '',
                    weightUOM: '',
                    weight: '',
                    packType: '',
                }
            ],
        };
    }

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        puAddresses: PropTypes.array,
        deToAddresses: PropTypes.array,

        // Functions
        getUser: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        getStatusPageUrl: PropTypes.func.isRequired,
        getAddressesWithPrefix: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const token = localStorage.getItem('token');

        if (isLoggedIn && token && token.length > 0)
            this.props.getUser(token);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { username, clientname, isLoggedIn } = newProps;

        if (username)
            this.setState({username});

        if (clientname)
            this.setState({clientname});

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

    addPackage() {
        const { lines } = this.state;
        const newlines = [...lines];
        newlines.push({
            quantity: '',
            dimUOM: '',
            length: '',
            width: '',
            height: '',
            weightUOM: '',
            weight: '',
            packType: '',
        });
        this.setState({lines: newlines});
    }

    onCancel(index) {
        const { lines } = this.state;
        const newlines = [...lines];
        newlines.splice(index, 1);
        this.setState({lines: newlines});
    }

    getQuote(e) {
        console.log(e);
        // e.preventDefault();
        // const { }
        // this.props.getAddressesWithPrefix()
        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/get-quick-pricing/',
            data: {
                'booking': {

                },
                'booking_lines': this.state.lines
            },
        };

        axios(options).then((response) => {
            console.log(response);
        });
    }

    render() {
        const { username, clientname, puSuburb, deToSuburb, formInputs } = this.state;
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
                                    <form className="quick-quote-form">
                                        <div className="popover-close" onClick={() => this.onOpenQuickQuote()}>
                                            <i className="fa fa-times-circle p-2"></i>
                                        </div>

                                        <div className="d-flex justify-content-around">
                                            <div className="m-2">
                                                <span>Pickup suburb or postal code: </span>
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
                                                />
                                            </div>
                                            <div className="m-2">
                                                <span>Delivery suburb or postal code: </span>
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
                                                />
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row quote-detail-infos overflow-auto">
                                            <div className=" form-group px-1">
                                                <label htmlFor="packType">
                                                    <p>Type of Package</p>
                                                    {
                                                        this.state.lines.map((line, index) => (
                                                            <div className='row p-1' key={'packType' + index}>
                                                                <select
                                                                    name={'packType' + index}
                                                                    onChange={(e) => this.onInputChange(e, index, 'packType')}
                                                                    value={line.packType}
                                                                    key={'packType' + index}
                                                                    required
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
                                                <label htmlFor="quantity">
                                                    <p>Quantity</p>
                                                    {
                                                        this.state.lines.map((line, index) => (
                                                            <div className="row p-1" key={'quantity' + index}>
                                                                <input name={'quantity' + index} type="text" id={'quantity' + index } placeholder="" value={line.quantity} key={'quantity' + index} onChange={(e) => this.onInputChange(e, index, 'quantity')} required />
                                                            </div>
                                                        ))
                                                    }
                                                </label>
                                            </div>
                                            <div className=" form-group px-1">
                                                <label htmlFor="dimUOM">
                                                    <p>DimUOM</p>
                                                    {
                                                        this.state.lines.map((line, index) => (
                                                            <div className="row p-1" key={'dimUOM' + index}>
                                                                <select
                                                                    name={'dimUOM' + index}
                                                                    onChange={(e) => this.onInputChange(e, index, 'dimUOM')}
                                                                    value={line.dimUOM}
                                                                    key={'dimUOM' + index}
                                                                    required
                                                                >
                                                                    <option>M</option>
                                                                    <option>mm</option>
                                                                </select>
                                                            </div>                                                            
                                                        ))
                                                    }
                                                </label>
                                            </div>
                                            <div className=" form-group px-1">
                                                <label htmlFor="length">
                                                    <p>length</p>
                                                    {
                                                        this.state.lines.map((line, index) => (
                                                            <div className="row p-1" key={'length' + index}>
                                                                <input name={'length' + index} type="text" id={'length' + index } placeholder="" value={line.length} key={'length' + index} onChange={(e) => this.onInputChange(e, index, 'length')} required />
                                                            </div>
                                                        ))
                                                    }
                                                </label>
                                            </div>
                                            <div className=" form-group px-1">
                                                <label htmlFor="width">
                                                    <p>width</p>
                                                    {
                                                        this.state.lines.map((line, index) => (
                                                            <div className="row p-1" key={'width' + index}>
                                                                <input name={'width' + index} type="text" id={'width' + index } placeholder="" value={line.width} key={'width' + index} onChange={(e) => this.onInputChange(e, index, 'width')} required />
                                                            </div>
                                                        ))
                                                    }
                                                </label>
                                            </div>
                                            <div className="form-group px-1">
                                                <label htmlFor="height">
                                                    <p>height</p>
                                                    {
                                                        this.state.lines.map((line, index) => (
                                                            <div className="row p-1" key={'height' + index}>
                                                                <input name={'height' + index} type="text" id={'height' + index } placeholder="" value={line.height} key={'height' + index} onChange={(e) => this.onInputChange(e, index, 'height')} required />
                                                            </div>
                                                        ))
                                                    }
                                                </label>
                                            </div>
                                            <div className=" form-group px-1">
                                                <label htmlFor="weightUOM">
                                                    <p>WeightUOM</p>
                                                    {
                                                        this.state.lines.map((line, index) => (
                                                            <div className="row p-1" key={'weightUOM' + index}>
                                                                <select
                                                                    name={'weightUOM' + index}
                                                                    onChange={(e) => this.onInputChange(e, index, 'weightUOM')}
                                                                    value={line.weightUOM}
                                                                    key={'weightUOM' + index}
                                                                    required
                                                                >
                                                                    <option>M</option>
                                                                    <option>mm</option>
                                                                </select>                                                                    
                                                            </div>
                                                        ))
                                                    }
                                                </label>
                                            </div>
                                            <div className=" form-group px-1">
                                                <label htmlFor="weight">
                                                    <p>Weight</p>
                                                    {
                                                        this.state.lines.map((line, index) => (
                                                            <div className="row p-1" key={'weight' + index}>
                                                                <input name={'weight' + index} type="text" id={'weight' + index } placeholder="" value={line.weight} key={'weight' + index} onChange={(e) => this.onInputChange(e, index, 'weight')} required />
                                                            </div>
                                                        ))
                                                    }
                                                </label>
                                            </div>
                                            <div className="deselect">
                                                {
                                                    this.state.lines.map((line, index) => (
                                                        <div onClick={() => this.onCancel(index)} key={'cancel' + index}>
                                                            <i className="fa fa-times-circle p-2"></i>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div className="row m-2">
                                            <button className="btn btn-success btn-xs" type="button" onClick={() => this.addPackage()}>+Add Package</button>
                                        </div>

                                        <div className="row m-2 float-r">
                                            <button className="btn btn-primary btn-sm" type="submit" onClick={(e) => this.getQuote(e)}>Get Quote</button>
                                        </div>
                                    </form>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (token) => dispatch(getUser(token)),
        logout: () => dispatch(logout()),
        getStatusPageUrl: (findKeyword) => dispatch(getStatusPageUrl(findKeyword)),
        getAddressesWithPrefix: (src, suburbPrefix, postalCodePrefix) => dispatch(getAddressesWithPrefix(src, suburbPrefix, postalCodePrefix)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
