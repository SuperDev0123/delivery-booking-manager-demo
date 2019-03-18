import React from 'react';
import { Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';

class CommTooltipItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltipOpen: false
        };
    }

    static propTypes = {
        comm: PropTypes.object.isRequired,
        field: PropTypes.string.isRequired,
    };

    toggleTooltip() {
        this.setState({ tooltipOpen: !this.state.tooltipOpen });
    }

    render() {
        const { comm, field } = this.props;

        return (
            <div className="disp-inline-block">
                <Tooltip
                    placement='top'
                    isOpen={this.state.tooltipOpen}
                    target={'comm-' + field + '-tooltip-' + comm.id}
                    toggle={() => this.toggleTooltip()}
                    hideArrow={true}
                    className={'comm-tooltip'}>
                    {comm[field]}
                </Tooltip>
            </div>
        );
    }
}

export default CommTooltipItem;
