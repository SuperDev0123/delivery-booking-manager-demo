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
        field: PropTypes.string.isRequired,
    };

    toggleTooltip() {
        this.setState({ tooltipOpen: !this.state.tooltipOpen });
    }

    render() {
        const { booking, field } = this.props;

        return (
            <div className="disp-inline-block">
                <Tooltip
                    placement='top'
                    isOpen={this.state.tooltipOpen}
                    target={'booking-' + field + '-tooltip-' + booking.id}
                    toggle={() => this.toggleTooltip()}
                    hideArrow={true}
                    className={'booking-tooltip'}>
                    {booking[field]}
                </Tooltip>
            </div>
        );
    }
}

export default BookingTooltipItem;
