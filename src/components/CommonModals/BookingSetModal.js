import React, {Component} from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class BookingSetModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            note: null,
            actionType: 'create',
            selectedBookingSet: null,
            auto_select_type: true,
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        notify: PropTypes.func.isRequired,
        createBookingSet: PropTypes.func.isRequired,
        updateBookingSet: PropTypes.func.isRequired,
        bookingIds: PropTypes.array.isRequired,
        bookingsets: PropTypes.array.isRequired,
    };

    static defaultProps = {
        isOpen: false,
        bookingsets: [],
    };

    handleInputChange(e) {
        const {bookingsets} = this.props;

        if (e.target.name === 'name') {
            this.setState({name: e.target.value});
        } else if (e.target.name === 'note') {
            this.setState({note: e.target.value});
        } else if (e.target.name === 'actionType') {
            this.setState({actionType: e.target.value});
        } else if (e.target.name === 'addTo') {
            this.setState({selectedBookingSet: bookingsets.filter(set => 
                parseInt(set.id) === parseInt(e.target.value))[0]});
        }
    }

    onClickOkBtn() {
        const {name, note, actionType, selectedBookingSet, auto_select_type} = this.state;

        if (actionType === 'create') {
            if (!name) {
                this.props.notify('Name is required!');
            } else if (!note) {
                this.props.notify('Note is required');
            } else {
                this.props.createBookingSet(this.props.bookingIds, name, note, auto_select_type);
                this.props.toggle();
            }
        } else {
            if (!selectedBookingSet) {
                this.props.notify('Please select a BookingSet to add selected bookings');
            } else {
                const exitingBookingIds = selectedBookingSet.booking_ids.split(', ');
                const union = _.union(exitingBookingIds, this.props.bookingIds.map(id => id.toString()));
                const joinStr = _.join(union, ', ');
                selectedBookingSet.booking_ids = joinStr;

                this.props.updateBookingSet(selectedBookingSet.id, selectedBookingSet);
                this.props.toggle();
            }
        }
    }

    onClickRadio(type) {
        const {selectedBookingSet} = this.state;

        if (selectedBookingSet) {
            selectedBookingSet['auto_select_type'] = type === 'lowest';
            this.setState({selectedBookingSet});
        } else {
            this.setState({auto_select_type: type === 'lowest'});
        }
    }

    render() {
        const {isOpen, bookingsets} = this.props;
        const {name, note, actionType, selectedBookingSet, auto_select_type} = this.state;

        const bookingsetsList = (bookingsets || []).map(bookingset => {
            return (
                <option
                    key={bookingset.id}
                    value={bookingset.id}
                    selected={selectedBookingSet && selectedBookingSet.id === bookingset.id ? 'selected' : ''}
                >
                    {bookingset.name}
                </option>
            );
        });

        return (
            <ReactstrapModal isOpen={isOpen} className="bookingset-modal">
                <ModalHeader toggle={this.props.toggle}>BookingSet Modal</ModalHeader>
                <ModalBody>
                    <p>{this.props.bookingIds.length} Bookings are selected</p>
                    <label>
                        <p>Action Type:</p>
                        <select value={actionType} name="actionType" onChange={(e) => this.handleInputChange(e)}>
                            <option value="create" selected="selected">Create</option>
                            <option value="add">Add</option>
                        </select>
                    </label><br />
                    <label>
                        <p>Add to:</p>
                        <select
                            value={selectedBookingSet && selectedBookingSet.id}
                            name="addTo"
                            onChange={(e) => this.handleInputChange(e)}
                            disabled={actionType === 'add' ? '' : 'disabled'}
                        >
                            <option value="" selected disabled hidden>Select a BookingSet</option>
                            {bookingsetsList}
                        </select>
                    </label><br />
                    <label>
                        <p>Auto Select type:</p>
                        <input type="radio"
                            id="auto-select-lowest"
                            checked={selectedBookingSet ? selectedBookingSet.auto_select_type : auto_select_type}
                            onChange={() => this.onClickRadio('lowest')}
                        />
                        <label htmlFor="auto-select-lowest">Lowest</label>
                        <input type="radio"
                            id="auto-select-fastest"
                            checked={selectedBookingSet ? !selectedBookingSet.auto_select_type : !auto_select_type}
                            onChange={() => this.onClickRadio('fastest')}
                        />
                        <label htmlFor="auto-select-fastest">Fastest</label>
                    </label><br />
                    <label>
                        <p>Name:</p>
                        <input
                            className="form-control"
                            name="name"
                            value={name}
                            onChange={(e) => this.handleInputChange(e)}
                            disabled={actionType === 'add' ? 'disabled': ''}
                        />
                    </label><br />
                    <label>
                        <p>Note:</p>
                        <textarea
                            className="form-control"
                            name="note"
                            value={note}
                            onChange={(e) => this.handleInputChange(e)}
                            disabled={actionType === 'add' ? 'disabled': ''}
                            col="40"
                            rows="4"
                        />
                    </label>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={() => this.onClickOkBtn()}
                        color="primary"
                    >
                        {actionType === 'create' ? 'Create' : 'Add'}
                    </Button>
                    <Button color="secondary" onClick={() => this.props.toggle()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default BookingSetModal;
