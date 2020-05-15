import React, {Component} from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class FindModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFieldName: 'b_client_sales_inv_num',
            valueSet: '',
            errorMessage: null,
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { bookings } = newProps;

        if (bookings && bookings.length > 0 && this.state.valueSet.length > 0) {
            const foundValueSet = bookings.map(booking => booking[this.state.selectedFieldName]);
            const missedValueSet = _.difference(this.state.valueSet.split('\n'), foundValueSet);
            
            if (missedValueSet.length > 0) {
                const valueSet = _.concat(missedValueSet, [''], foundValueSet);
                this.setState({
                    valueSet: valueSet.join('\n'),
                    errorMessage: 'You can see empty line on textarea, keys above it are not found, below are found'
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
        }
    }

    onSubmit() {
        const {selectedFieldName} = this.state;
        let valueSet = this.state.valueSet;

        if (!this.state.valueSet) {
            this.setState({errorMessage: 'Please input keys with newline!'});
        } else {
            this.setState({errorMessage: null});

            // Delete all empty lines first
            valueSet = valueSet.split('\n');
            valueSet = _.filter(valueSet, (value) => {return value.length > 0;});
            this.setState({valueSet: valueSet.join('\n')});

            valueSet = valueSet.map(value => value.replace(/\s/g,'')).join(', ');
            this.props.onFind(selectedFieldName, valueSet);
        }
    }

    render() {
        const {isOpen} = this.props;
        const {errorMessage} = this.state;

        return (
            <ReactstrapModal isOpen={isOpen} className="find-modal">
                <ModalHeader toggle={this.props.toggleFindModal}>Find (Multiple) Modal</ModalHeader>
                <ModalBody>
                    <label>
                        <p>Select field to be searched: </p>
                        <select value={this.state.selectedFieldName} onChange={(e) => this.onInputChange(e, 'fieldName')}>
                            <option value="b_client_sales_inv_num" selected="selected">SINV Number</option>
                            <option value="v_FPBookingNumber">Consignment Number</option>
                            <option value="b_bookingID_Visual">DME Booking Number</option>
                            <option value="fk_fp_pickup_id">FP Pickup ID</option>
                            <option value="gap_ra">GAP/RA</option>
                            <option value="clientRefNumber">Client Ref Number</option>
                        </select>
                    </label>
                    <label>
                        <p>Values list: </p>
                        <textarea 
                            value={this.state.valueSet} 
                            onChange={(e) => this.onInputChange(e, 'valueSet')}
                            rows="10" 
                            cols="30"
                        />
                    </label>
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
