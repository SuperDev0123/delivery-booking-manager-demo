import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

class BulkUpdateSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedValue: null,
            selectedField: null,
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        allBookingStatus: PropTypes.array.isRequired,
        selectedBookingIds: PropTypes.array.isRequired,
        onUpdate: PropTypes.func.isRequired,
    };

    onClickCancel() {
        this.setState({selectedField: null, selectedValue: null});
        this.props.toggleSlider();
    }

    onClickUpdateBtn() {
        const {selectedValue, selectedField} = this.state;
        const {selectedBookingIds} = this.props;
        this.props.onUpdate(selectedField, selectedValue, selectedBookingIds);
    }

    onSelected(e, src) {
        if (src === 'value') {
            this.setState({selectedValue: e.target.value});
        } else if (src === 'field') {
            this.setState({selectedField: e.target.value, selectedValue: null});
        }
    }

    render() {
        const { isOpen, allBookingStatus } = this.props;
        const { selectedField, selectedValue } = this.state;
        const bookingStatusList = allBookingStatus.map((bookingStatus, index) => {
            return (<option key={index} value={bookingStatus.dme_delivery_status}>{bookingStatus.dme_delivery_status}</option>);
        });

        return (
            <SlidingPane
                className='bbu-slider'
                overlayClassName='bbu-slider-overlay'
                isOpen={isOpen}
                title='Bulk Booking Update Slider'
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
                    <label className='right-10px'>Field: </label>
                    <select
                        required
                        onChange={(e) => this.onSelected(e, 'field')} 
                    >
                        <option value="" selected disabled hidden>Select a field</option>
                        <option value="flag">Flag</option>
                        <option value="status">Booking status</option>
                        <option value="client_name" disabled>Client Name</option>
                        <option value="sub_client" disabled>Sub Client</option>
                        <option value="status_detail" disabled>Status Detail</option>
                        <option value="status_action" disabled>Status Action</option>
                        <option value="status_history_note" disabled>Status History Note</option>
                        <option value="status_history_note" disabled>Invoice Billing Status Note</option>
                        <option value="status_history_note" disabled>Pickup Entity</option>
                        <option value="status_history_note" disabled>Pickup Street 1</option>
                        <option value="status_history_note" disabled>Project Name</option>
                        <option value="status_history_note" disabled>Project Due Date</option>
                    </select>
                    <br />
                    {
                        selectedField ? <label className='right-10px'>Value: </label> : null
                    }
                    {
                        selectedField === 'flag' ?
                            <select onChange={(e) => this.onSelected(e, 'value')}>
                                <option value="" disabled>-------------     Flags    -------------</option>
                                <option value="flag_add_on_services">Flag - add on services</option>
                                <option value="unflag_add_on_services">Unflag - add on services</option>
                            </select>
                            : null
                    }
                    {
                        selectedField === 'status' ?
                            <select onChange={(e) => this.onSelected(e, 'value')}>
                                <option value="" disabled>-------------     Booking Status    -------------</option>
                                { bookingStatusList }
                            </select>
                            : null
                    }
                    <br />
                    <Button
                        color="primary"
                        disabled={!selectedField || !selectedValue ? 'disabled' : ''}
                        onClick={() => this.onClickUpdateBtn()}
                    >
                        Update
                    </Button>
                    <Button color="secondary" onClick={() => this.onClickCancel()}>Cancel</Button>
                </div>
            </SlidingPane>
        );
    }
}

export default BulkUpdateSlider;
