import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getQuickPricing } from '../../state/services/extraService';
import { debounce } from '../../commons/browser';
import LoadingOverlay from 'react-loading-overlay';
import Select from 'react-select';
import { join } from 'lodash';
import moment from 'moment-timezone';
import { getAddressesWithPrefix } from '../../state/services/elasticsearchService';

import 'react-datepicker/dist/react-datepicker.css';
import { Popover, PopoverBody } from 'reactstrap';

class QuickQuotePopover extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            findKeyword: '',
            isOpenQuickQuote: false,
            isGettingQuickQuote: false,
            activeTabInd: 0,
            customer: { value: '' },
            puSuburb: { value: '' },
            deToSuburb: { value: '' },
            formInputs: {
                pu_Address_State: '',
                pu_Address_PostalCode: '',
                pu_Address_Suburb: '',
                de_To_Address_State: '',
                de_To_Address_PostalCode: '',
                de_To_Address_Suburb: '',
                customer_id: '',
            },
            lines: [
                {
                    e_qty: '',
                    e_dimUOM: 'm',
                    e_dimLength: '',
                    e_dimWidth: '',
                    e_dimHeight: '',
                    e_weightUOM: 'kg',
                    e_weightPerEach: '',
                    e_type_of_packaging: 'Carton',
                }
            ],
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        setIsOpen: PropTypes.func.isRequired,
        clientname: PropTypes.string,
        dmeClients: PropTypes.array,
        quickPricings: PropTypes.array,
        puAddresses: PropTypes.array,
        deToAddresses: PropTypes.array,

        getAddressesWithPrefix: PropTypes.func.isRequired,
        getQuickPricing: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isOpen: false,
    };

    UNSAFE_componentWillReceiveProps(newProps) {
        const { isOpen, clientname, dmeClients, quickPricings } = newProps;
        if (isOpen) {
            const { clientname, dmeClients } = this.props;
            const { customer } = this.state;
            if (dmeClients.length > 0 && clientname !== 'dme') {
                if (customer.value !== dmeClients[0].pk_id_dme_client) {
                    this.handleChangeCustomer({ value: dmeClients[0].pk_id_dme_client });
                }
            }
        }

        if (quickPricings.length > 0)
            this.setState({ isGettingQuickQuote: false });

        if (clientname)
            this.setState({ clientname });
        if (dmeClients && dmeClients.length === 1) // When logged in with the Client
            this.setState({ clientPK: dmeClients[0].pk_id_dme_client });
    }

    onInputChange(e, index, field) {
        const { lines } = this.state;
        const newlines = [...lines];
        newlines[index][field] = e.target.value;

        if (e.target.type === 'number') newlines[index][field] = parseFloat(newlines[index][field]);

        this.setState({ lines: newlines });
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

    _findCustomer = (customers, value) => {
        return customers.find(customer => {
            return customer.pk_id_dme_client === value;
        });
    };

    onSwitchTab(e, activeTabInd) {
        e.preventDefault();
        this.setState({ activeTabInd });
    }

    handleChangeCustomer = (selectedOption) => {
        const { formInputs } = this.state;
        const { dmeClients } = this.props;

        const customerInfo = this._findCustomer(dmeClients, selectedOption.value);
        formInputs['customer_id'] = customerInfo.pk_id_dme_client;
        const customer = { label: customerInfo.company_name, value: customerInfo.pk_id_dme_client };
        this.setState({ customer, formInputs });
    };

    handleChangeSuburb = (selectedOption, src) => {
        const { formInputs } = this.state;
        const { puAddresses, deToAddresses } = this.props;

        if (src === 'puSuburb') {
            const address = this._findAddress(puAddresses, selectedOption.value);
            formInputs['pu_Address_State'] = address._source.state;
            formInputs['pu_Address_PostalCode'] = address._source.postal_code;
            formInputs['pu_Address_Suburb'] = address._source.suburb;
            const puSuburb = { label: address._source.suburb, value: address._source.suburb };
            this.setState({ puSuburb, formInputs });
        } else if (src === 'deToSuburb') {
            const address = this._findAddress(deToAddresses, selectedOption.value);
            formInputs['de_To_Address_State'] = address._source.state;
            formInputs['de_To_Address_PostalCode'] = address._source.postal_code;
            formInputs['de_To_Address_Suburb'] = address._source.suburb;
            const deToSuburb = { label: address._source.suburb, value: address._source.suburb };
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

            this.setState({ suburbPrefix: join(suburbPrefixes, ' '), postalCodePrefix });
        }
    };

    handleFocusSuburb = (src) => {
        const { formInputs } = this.state;

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

    onClickAddPackage() {
        const { lines } = this.state;
        const newlines = [...lines];
        newlines.unshift({
            e_qty: '',
            e_dimUOM: 'm',
            e_dimLength: '',
            e_dimWidth: '',
            e_dimHeight: '',
            e_weightUOM: 'kg',
            e_weightPerEach: '',
            e_type_of_packaging: 'Carton',
        });
        this.setState({ lines: newlines });
    }

    onCancel(index) {
        const { lines } = this.state;
        const newlines = [...lines];
        newlines.splice(index, 1);
        this.setState({ lines: newlines });
    }

    onClickGetQuote(e) {
        e.preventDefault();

        if (!this.state.formInputs.customer_id) {
            this.notify('Please select Customer.');
            return;
        } else if (!this.state.formInputs.pu_Address_Suburb) {
            this.notify('Please select Pickup address.');
            return;
        } else if (!this.state.formInputs.de_To_Address_Suburb) {
            this.notify('Please select Delivery address.');
            return;
        } else if (this.state.formInputs.pu_Address_Suburb == this.state.formInputs.de_To_Address_Suburb) {
            this.notify('Pickup address and Delivery address are same!');
            return;
        }

        this.props.getQuickPricing({
            'booking': this.state.formInputs,
            'booking_lines': this.state.lines,
            'clientId': this.state.customer.value,
        });
        this.setState({ isGettingQuickQuote: true });
    }

    copyToClipBoard = async text => {
        try {
            await navigator.clipboard.writeText(text);
            this.notify('Copied!');
        } catch (err) {
            this.notify('Failed to copy!');
        }
    };

    render() {
        const { isOpen, setIsOpen, dmeClients, quickPricings, clientname } = this.props;
        const { puSuburb, deToSuburb, formInputs, activeTabInd, lines, customer, isGettingQuickQuote } = this.state;

        const clientOptionsList = dmeClients
            .map((client) => { return { label: client.company_name, value: client.pk_id_dme_client }; });

        // Populate puAddresses and deToAddresses
        let puAddressOptions = [];
        let deToAddressOptions = [];
        if (formInputs['pu_Address_Suburb'] && this.props.puAddresses.length === 0) {
            const value = `${formInputs['pu_Address_Suburb']}`;
            puAddressOptions = [{ value: value, label: value }];
        } else if (this.props.puAddresses.length > 0) {
            puAddressOptions = this.props.puAddresses.map(address => {
                const value = `${address._source.suburb} ${address._source.postal_code} ${address._source.state}`;
                return { value: value, label: value };
            });
        }
        if (formInputs['de_To_Address_Suburb'] && this.props.deToAddresses.length === 0) {
            const value = `${formInputs['de_To_Address_Suburb']}`;
            deToAddressOptions = [{ value: value, label: value }];
        } else if (this.props.deToAddresses.length > 0) {
            deToAddressOptions = this.props.deToAddresses.map(address => {
                const value = `${address._source.suburb} ${address._source.postal_code} ${address._source.state}`;
                return { value: value, label: value };
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
            <Popover
                className="quick-quote"
                isOpen={isOpen}
                target="Popover"
                placement="bottom"
                hideArrow={false}
                onToggle={() => { setIsOpen(false); }}>
                <PopoverBody>
                    <LoadingOverlay
                        active={isGettingQuickQuote}
                        spinner
                        text='Loading...'
                    >
                        <div className="popover-close" onClick={() => setIsOpen(false)}>
                            <i className="fa fa-times-circle p-2"></i>
                        </div>
                        <form className="quick-quote-form" onSubmit={(e) => this.onClickGetQuote(e)}>

                            <div className="row">
                                <div className="col-md-4">
                                    <label><b>Customer </b></label>
                                    <Select
                                        value={customer}
                                        onChange={(e) => this.handleChangeCustomer(e, 'customer')}
                                        options={clientOptionsList}
                                        placeholder='select your customer'
                                        openMenuOnClick={true}
                                        filterOption={(options) => {
                                            // Do no filtering, just return all options
                                            return options;
                                        }}
                                        required="required"
                                        tabIndex='1'
                                        isDisabled={clientname !== 'dme'}
                                    />
                                </div>
                            </div>
                            <hr />
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
                                        openMenuOnClick={true}
                                        filterOption={(options) => {
                                            // Do no filtering, just return all options
                                            return options;
                                        }}
                                        required="required"
                                        tabIndex='1'
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
                                        openMenuOnClick={true}
                                        filterOption={(options) => {
                                            // Do no filtering, just return all options
                                            return options;
                                        }}
                                        required="required"
                                        tabIndex='2'
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
                                            lines.map((line, index) => (
                                                <div className='row p-1' key={'e_type_of_packaging' + index}>
                                                    <select
                                                        name={'e_type_of_packaging' + index}
                                                        onChange={(e) => this.onInputChange(e, index, 'e_type_of_packaging')}
                                                        value={line.e_type_of_packaging}
                                                        key={'e_type_of_packaging' + index}
                                                        required="required"
                                                        tabIndex={10 + index * 10 + 0}
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
                                            lines.map((line, index) => (
                                                <div className="row p-1" key={'e_qty' + index}>
                                                    <input
                                                        name={'e_qty' + index}
                                                        id={'e_qty' + index}
                                                        value={line.e_qty}
                                                        key={'e_qty' + index}
                                                        onChange={(e) => this.onInputChange(e, index, 'e_qty')}
                                                        required
                                                        type='number'
                                                        tabIndex={10 + index * 10 + 1}
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
                                            lines.map((line, index) => (
                                                <div className="row p-1" key={'e_dimUOM' + index}>
                                                    <select
                                                        name={'e_dimUOM' + index}
                                                        onChange={(e) => this.onInputChange(e, index, 'e_dimUOM')}
                                                        value={line.e_dimUOM}
                                                        key={'e_dimUOM' + index}
                                                        required
                                                        tabIndex={10 + index * 10 + 2}
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
                                        <p>Length</p>
                                        {
                                            lines.map((line, index) => (
                                                <div className="row p-1" key={'e_dimLength' + index}>
                                                    <input
                                                        name={'e_dimLength' + index}
                                                        id={'e_dimLength' + index}
                                                        placeholder="" value={line.e_dimLength}
                                                        key={'e_dimLength' + index}
                                                        onChange={(e) => this.onInputChange(e, index, 'e_dimLength')}
                                                        required
                                                        type='number'
                                                        step='0.01'
                                                        tabIndex={10 + index * 10 + 3}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </label>
                                </div>
                                <div className=" form-group px-1">
                                    <label htmlFor="e_dimWidth">
                                        <p>Width</p>
                                        {
                                            lines.map((line, index) => (
                                                <div className="row p-1" key={'e_dimWidth' + index}>
                                                    <input
                                                        name={'e_dimWidth' + index}
                                                        id={'e_dimWidth' + index}
                                                        placeholder=""
                                                        value={line.e_dimWidth}
                                                        key={'e_dimWidth' + index}
                                                        onChange={(e) => this.onInputChange(e, index, 'e_dimWidth')}
                                                        required
                                                        type='number'
                                                        step='0.01'
                                                        tabIndex={10 + index * 10 + 4}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </label>
                                </div>
                                <div className="form-group px-1">
                                    <label htmlFor="e_dimHeight">
                                        <p>Height</p>
                                        {
                                            lines.map((line, index) => (
                                                <div className="row p-1" key={'e_dimHeight' + index}>
                                                    <input
                                                        name={'e_dimHeight' + index}
                                                        id={'e_dimHeight' + index}
                                                        placeholder=""
                                                        value={line.e_dimHeight}
                                                        key={'e_dimHeight' + index}
                                                        onChange={(e) => this.onInputChange(e, index, 'e_dimHeight')}
                                                        required
                                                        type='number'
                                                        step='0.01'
                                                        tabIndex={10 + index * 10 + 5}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </label>
                                </div>
                                <div className=" form-group px-1">
                                    <label htmlFor="e_weightUOM">
                                        <p>WeightUOM</p>
                                        {
                                            lines.map((line, index) => (
                                                <div className="row p-1" key={'e_weightUOM' + index}>
                                                    <select
                                                        name={'e_weightUOM' + index}
                                                        onChange={(e) => this.onInputChange(e, index, 'e_weightUOM')}
                                                        value={line.e_weightUOM}
                                                        key={'e_weightUOM' + index}
                                                        required
                                                        tabIndex={10 + index * 10 + 6}
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
                                            lines.map((line, index) => (
                                                <div className="row p-1" key={'e_weightPerEach' + index}>
                                                    <input
                                                        name={'e_weightPerEach' + index}
                                                        id={'e_weightPerEach' + index}
                                                        placeholder="" value={line.e_weightPerEach}
                                                        key={'e_weightPerEach' + index}
                                                        onChange={(e) => this.onInputChange(e, index, 'e_weightPerEach')}
                                                        required
                                                        type='number'
                                                        step='0.01'
                                                        tabIndex={10 + index * 10 + 7}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </label>
                                </div>
                                <div className="deselect">
                                    {
                                        lines.map((line, index) => {
                                            if (index == 0) {
                                                return (
                                                    <div className="row invisible" key={'cancel' + index} tabIndex={10 + index * 10 + 8}>
                                                        <i className="fa fa-times-circle p-2"></i>
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <div onClick={() => this.onCancel(index)} key={'cancel' + index} tabIndex={10 + index * 10 + 8}>
                                                        <i className="fa fa-times-circle p-2"></i>
                                                    </div>
                                                );
                                            }
                                        })
                                    }
                                </div>
                            </div>
                            <div className="row m-2">
                                <button className="btn btn-success btn-xs" type="button" onClick={() => this.onClickAddPackage()} tabIndex={10 + lines.length * 10 + 9}>
                                    +Add Package
                                </button>
                            </div>

                            {quickPricings.length > 0 ?
                                <section>
                                    <div className="quick-quote-tabs">
                                        <div className="row">
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
                                                <div id="tab01" className={activeTabInd === 0 ? 'selected' : 'none'}>
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
                                                <div id="tab02" className={activeTabInd === 1 ? 'selected' : 'none'}>
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

                                </section>
                                : null
                            }

                            <div className="row my-2">
                                <button className="btn btn-primary btn-sm submit" type="submit" tabIndex={10 + lines.length * 10 + 10}>
                                    Get Quote
                                </button>
                            </div>
                        </form>
                    </LoadingOverlay>
                </PopoverBody>
            </Popover>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        clientname: state.auth.clientname,
        quickPricings: state.extra.quickPricings,
        puAddresses: state.elasticsearch.puAddresses,
        deToAddresses: state.elasticsearch.deToAddresses,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAddressesWithPrefix: (src, suburbPrefix, postalCodePrefix) => dispatch(getAddressesWithPrefix(src, suburbPrefix, postalCodePrefix)),
        getQuickPricing: (data) => dispatch(getQuickPricing(data)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(QuickQuotePopover));
