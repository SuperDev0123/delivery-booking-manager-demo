import React from 'react';
import { Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';

class TooltipItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltipOpen: false
        };
    }

    static propTypes = {
        object: PropTypes.object.isRequired,
        fields: PropTypes.array.isRequired,
        name: PropTypes.string,
        placement: PropTypes.string,
        hideArrow: PropTypes.bool,
    };

    toggleTooltip() {
        this.setState({ tooltipOpen: !this.state.tooltipOpen });
    }

    render() {
        const { object, fields, name, placement, hideArrow } = this.props;
        let initialName = 'booking';
        let initialPlacement = 'left';
        let initialHideArrow = true;

        return (
            <Tooltip
                placement={placement ? placement : initialPlacement}
                isOpen={this.state.tooltipOpen}
                target={`${name ? name : initialName}-${fields[0]}-tooltip-${object.id}`}
                toggle={() => this.toggleTooltip()}
                hideArrow={hideArrow ? hideArrow : initialHideArrow}
                className={'object-tooltip'}>
                {(fields.length === 2) ?
                    <label>
                        <small>{fields[0]}: {object[fields[0]]}</small><br />
                        <small>{fields[1]}: {object[fields[1]]}</small>
                    </label>
                    :
                    object[fields[0]]
                }
            </Tooltip>
        );
    }
}

export default TooltipItem;
