import React from 'react';
import { Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';

class BookingTooltipItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltipOpen: false
        };
    }

    static propTypes = {
        booking: PropTypes.object.isRequired,
        fields: PropTypes.array.isRequired,
    };

    toggleTooltip() {
        this.setState({ tooltipOpen: !this.state.tooltipOpen });
    }

    render() {
        const { booking, fields } = this.props;

        return (
            <Tooltip
                placement='top'
                isOpen={this.state.tooltipOpen}
                target={'booking-' + fields[0] + '-tooltip-' + booking.id}
                toggle={() => this.toggleTooltip()}
                hideArrow={true}
                className={'booking-tooltip'}>
                {
                    (fields.length === 2) ?
                        <label>
                            <small>{fields[0]}: {booking[fields[0]]}</small><br />
                            <small>{fields[1]}: {booking[fields[1]]}</small>
                        </label>
                        :
                        booking[fields[0]]
                }
            </Tooltip>
        );
    }
}

export default BookingTooltipItem;
