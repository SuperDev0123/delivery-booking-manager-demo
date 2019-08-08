import React from 'react';
import { Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';

class SimpleTooltipComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltipOpen: false
        };
    }

    static propTypes = {
        text: PropTypes.string.isRequired,
    };

    toggleTooltip() {
        this.setState({ tooltipOpen: !this.state.tooltipOpen });
    }

    render() {
        const { text } = this.props;

        return (
            <Tooltip
                placement='top'
                isOpen={this.state.tooltipOpen}
                target={'booking-column-header-tooltip-' + text}
                toggle={() => this.toggleTooltip()}
                hideArrow={true}
                className={'booking-column-header-tooltip'}>
                {
                    text
                }
            </Tooltip>
        );
    }
}

export default SimpleTooltipComponent;
