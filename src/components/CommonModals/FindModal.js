import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { intersection, map, filter, difference, concat, uniq } from 'lodash';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class FindModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // selectedFieldName: 'b_client_sales_inv_num',
            selectedFieldName: 'b_client_order_num',
            postalCodeMin: 0,
            postalCodeMax: 0,
            postalCode: null,
            valueSet: '',
            errorMessage: null,
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { bookings } = newProps;
        const { selectedFieldName } = this.state;

        if (bookings && bookings.length > 0 && this.state.valueSet.length > 0 && selectedFieldName !== 'postal_code') {
            let foundValueSet = [];
            let valueSet = this.state.valueSet.split('\n');

            if (selectedFieldName === 'clientRefNumber') {
                bookings.map(booking => {
                    foundValueSet = concat(foundValueSet, booking['clientRefNumbers'].split(', '));
                    return true;
                });
                foundValueSet = intersection(valueSet, foundValueSet);
            } else if (selectedFieldName === 'gap_ra') {
                bookings.map(booking => {
                    foundValueSet = concat(foundValueSet, booking['gap_ras'].split(', '));
                    return true;
                });
                foundValueSet = intersection(valueSet, foundValueSet);
            } else if (selectedFieldName) {
                foundValueSet = bookings.map(booking => {
                    if (booking[selectedFieldName]) {
                        return booking[selectedFieldName].toString();
                    }
                });
            }

            valueSet = filter(valueSet, (value) => {return value.length > 0;});
            const missedValueSet = difference(valueSet, foundValueSet);
            
            if (missedValueSet.length > 0) {
                const valueSet = concat(missedValueSet, [''], foundValueSet);
                this.setState({
                    valueSet: valueSet.join('\n'),
                    missedValueSet,
                    errorMessage: 'If something is not found from your list it will be shown above the blank line.'
                });
            }
        }
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleFindModal: PropTypes.func.isRequired,
        onFind: PropTypes.func.isRequired,
        bookings: PropTypes.array.isRequired,
    };

    static defaultProps = {
        isOpen: false,
        bookings: [],
    };

    onInputChange(e, type) {
        if (type === 'fieldName') {
            this.setState({selectedFieldName: e.target.value, errorMessage: ''});
        } else if (type === 'valueSet') {
            this.setState({valueSet: e.target.value, errorMessage: ''});
        } else if (type === 'postalCodeMin') {
            this.setState({postalCodeMin: e.target.value, errorMessage: ''});
        } else if (type === 'postalCodeMax') {
            this.setState({postalCodeMax: e.target.value, errorMessage: ''});
        } else if (type === 'postalCode') {
            this.setState({postalCode: e.target.value, errorMessage: ''});
        }
    }

    onSubmit() {
        const {selectedFieldName, postalCodeMin, postalCodeMax, postalCode} = this.state;
        let valueSet = this.state.valueSet;

        if (!valueSet && !postalCodeMin && !postalCodeMax && postalCode === 0) {
            this.setState({errorMessage: 'Please input search keywords!'});
        } else if (selectedFieldName !== 'postal_code_pair' && selectedFieldName !== 'postal_code_type') {
            // Replace ',' with '\n'
            valueSet = valueSet.replace(',', '\n');

            // Delete all empty lines and duplicated lines
            valueSet = valueSet.split('\n');

            // Trim spaces
            valueSet = map(valueSet, value => {return value.trim();});

            // Eliminate duplicated lines
            valueSet = uniq(filter(valueSet, value => {return value.length > 0;}));
            this.setState({valueSet: valueSet.join('\n'), errorMessage: ''});

            if (selectedFieldName === 'b_bookingID_Visual') {
                let nonIntegers = [];
                nonIntegers = filter(valueSet, value => isNaN(value));

                if (nonIntegers.length > 0) {
                    this.setState({errorMessage: 'DME Booking numbers should be integers.'});
                } else {
                    valueSet = valueSet.map(value => value.replace(/\s/g,'')).join(', ');
                    this.props.onFind(selectedFieldName, valueSet);
                }
            } else {
                valueSet = valueSet.map(value => value.replace(/\s/g,'')).join(', ');
                this.props.onFind(selectedFieldName, valueSet);
            }
        } else if (selectedFieldName === 'postal_code_pair') {
            if (postalCodeMin > postalCodeMax) {
                this.setState({errorMessage: 'Min postal code should be less than Max postal code.'});
            } else {
                this.props.onFind(selectedFieldName, postalCodeMin + ', ' + postalCodeMax);
            }
        } else if (selectedFieldName === 'postal_code_type') {
            if (!postalCode) {
                this.setState({errorMessage: 'Please select an option.'});
            } else {
                this.props.onFind(selectedFieldName, postalCode);
            }
        }
    }

    render() {
        const {isOpen} = this.props;
        const {errorMessage, selectedFieldName, postalCodeMin, postalCodeMax, postalCode} = this.state;

        return (
            <ReactstrapModal isOpen={isOpen} className="find-modal">
                <ModalHeader toggle={this.props.toggleFindModal}>Find (Multiple) Modal</ModalHeader>
                <ModalBody>
                    <label>
                        <p>Select field to be searched: </p>
                        <select value={selectedFieldName} onChange={(e) => this.onInputChange(e, 'fieldName')}>
                            <option value="b_client_order_num" selected="selected">Your Order Number</option>
                            <option value="b_client_sales_inv_num" selected="selected">Your Invoice Number</option>
                            <option value="clientRefNumber">Client Ref Number</option>
                            <option value="v_FPBookingNumber">Consignment Number</option>
                            <option value="b_bookingID_Visual">DME Booking Number</option>
                            <option value="fk_fp_pickup_id">FP Pickup ID</option>
                            <option value="gap_ra">GAP/RA</option>
                            <option value="postal_code_pair">Postal codes (From & To pair)</option>
                            <option value="postal_code_type">Postal codes (Metro & CBD)</option>
                        </select>
                    </label>
                    {selectedFieldName !== 'postal_code_pair' && selectedFieldName !== 'postal_code_type' &&
                        <label>
                            <p>Values list: </p>
                            <textarea 
                                rows="10" 
                                cols="30"
                                value={this.state.valueSet} 
                                onChange={(e) => this.onInputChange(e, 'valueSet')}
                            />
                        </label>
                    }
                    {selectedFieldName === 'postal_code_pair' &&
                        <label>
                            <p>Postal code range: </p>
                            <input type='number' value={postalCodeMin} onChange={(e) => this.onInputChange(e, 'postalCodeMin')} /> ~
                            <input type='number' value={postalCodeMax} onChange={(e) => this.onInputChange(e, 'postalCodeMax')} />
                        </label>
                    }
                    {selectedFieldName === 'postal_code_type' &&
                        <label>
                            <p>Available options: </p>
                            <select value={postalCode} onChange={(e) => this.onInputChange(e, 'postalCode')}>
                                <option value="" selected disabled hidden>--- Please select option ---</option>
                                <option value="" disabled>--- Metro options ---</option>
                                <option value="Canberra Metro">Canberra Metro (2600-2620, 2900-2914)</option>
                                <option value="Sydney Metro">Sydney Metro (1000-2249, 2760-2770)</option>
                                <option value="Darwin Metro">Darwin Metro (0800-0820, 0900-0910)</option>
                                <option value="Brisbane Metro">Brisbane Metro (4000-4207, 9000-9499)</option>
                                <option value="Adelaide Metro">Adelaide Metro (5000-5199, 5900-5999)</option>
                                <option value="Hobart Metro">Hobart Metro (7000-7010, 7249-7250)</option>
                                <option value="Melbourne Metro">Melbourne Metro (3000-3207, 8000-8499)</option>
                                <option value="Perth Metro">Perth Metro (6000-6199, 6800-6999)</option>
                                <option value="" disabled>--- CBD options ---</option>
                                <option value="Canberra CBD">Canberra CBD (2600, 2601, 2610)</option>
                                <option value="Sydney CBD">Sydney CBD (1100-1299, 2000, 2001, 2007, 2009)</option>
                                <option value="North Sydney CBD">North Sydney CBD (1545-1559, 2059-2060)</option>
                                <option value="Darwin CBD">Darwin CBD (0800, 0801, 0820, 0822)</option>
                                <option value="Brisbane CBD">Brisbane CBD (4000, 4001, 4003, 9000-9015)</option>
                                <option value="Adelaide CBD">Adelaide CBD (5000, 5001, 5004, 5005, 5810, 5839, 5880-5889)</option>
                                <option value="Hobart CBD">Hobart CBD (7000, 7001)</option>
                                <option value="Melbourne CBD">Melbourne CBD (3000-3006, 3205, 8000-8399)</option>
                                <option value="Perth CBD">Perth CBD (6000, 6001, 6004, 6827, 6830-6832, 6837-6849)</option>
                            </select>
                        </label>
                    }
                    <p className="red">{errorMessage}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.onSubmit()}>Find</Button>
                    <Button color="secondary" onClick={() => this.props.toggleFindModal()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default FindModal;
