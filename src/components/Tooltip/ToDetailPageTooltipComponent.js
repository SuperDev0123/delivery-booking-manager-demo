import React from 'react';
import { Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';

class ToDetailPageTooltipItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltipOpen: false
        };
    }

    static propTypes = {
        booking: PropTypes.array.isRequired,
    };

    toggleTooltip() {
        this.setState({ tooltipOpen: !this.state.tooltipOpen });
    }

    render() {
        const { booking } = this.props;

        return (
            <div className="disp-inline-block">
                <Tooltip
                    placement='right'
                    isOpen={this.state.tooltipOpen}
                    target={'detailpage-tooltip' + booking.id}
                    toggle={() => this.toggleTooltip()}
                    hideArrow={true}
                    className='tooltipitem'>
                    Click to see detail of this booking.
                </Tooltip>
            </div>
        );
    }
}

export default ToDetailPageTooltipItem;
