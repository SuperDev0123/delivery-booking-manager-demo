import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Popover, PopoverBody,} from 'reactstrap';

class EditablePopover extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formInputs: {},
            selectedDate: null,
        };

        moment.tz.setDefault('Australia/Sydney');
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        booking: PropTypes.object.isRequired,
        onCancel: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        inputType: PropTypes.string.isRequired,
        fieldName: PropTypes.string.isRequired,
    };

    static defaultProps = {
        isOpen: false,
    };

    componentDidMount() {
        const { inputType, fieldName, booking } = this.props;

        if (inputType === 'datepicker') {
            this.setState({selectedDate: booking[fieldName]});
        }
    }

    onClickChange() {
        const { inputType, fieldName } = this.props;
        const { selectedDate } = this.state;
        let booking = this.props.booking;

        if (inputType === 'datepicker') {
            booking[fieldName] = selectedDate;
        }

        this.props.onChange(booking.id, booking);
        this.props.onCancel();
    }

    onClickCancel() {
        this.props.onCancel();
    }

    onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let formInputs = this.state.formInputs;
        formInputs[name] = value;
        this.setState({formInputs});
    }

    onDateChange(date) {
        let selectedDate = null;

        if (_.isNull(date)) {
            selectedDate = moment().tz('Australia/Sydney').format('YYYY-MM-DD');
            this.setState({selectedDate});
        } else {
            selectedDate = moment(date).format('YYYY-MM-DD');
            this.setState({selectedDate});
        }
    }

    render() {
        const { isOpen, booking, inputType } = this.props;
        const { selectedDate } = this.state;

        return (
            <Popover
                isOpen={isOpen}
                target={'edit-cell-popover-' + booking.id}
                placement="right"
                hideArrow={true}
                className='edit-cell-popover'
            >
                <PopoverBody>
                    {(inputType === 'datepicker' && !_.isNull(selectedDate)) &&
                        <DatePicker
                            selected={new Date(selectedDate)}
                            onChange={(e) => this.onDateChange(e)}
                            dateFormat="dd MMM yyyy"
                        />
                    }
                    <Button color="primary" onClick={() => this.onClickChange()}>Change</Button>
                    <Button color="secondary" onClick={() => this.onClickCancel()}>Cancel</Button>
                </PopoverBody>
            </Popover>
        );
    }
}

export default EditablePopover;
