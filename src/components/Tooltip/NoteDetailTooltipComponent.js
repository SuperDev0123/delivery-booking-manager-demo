import React from 'react';
import { Tooltip } from 'reactstrap';
import EditorPreview from '../EditorPreview/EditorPreview';
import PropTypes from 'prop-types';

class NoteDetailTooltipItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltipOpen: false
        };
    }

    static propTypes = {
        note: PropTypes.object.isRequired,
    };

    toggleTooltip() {
        this.setState({ tooltipOpen: !this.state.tooltipOpen });
    }

    render() {
        const { note } = this.props;

        return (
            <div className="disp-inline-block">
                <Tooltip
                    placement='top'
                    isOpen={this.state.tooltipOpen}
                    target={'note-detail-tooltip-' + note.id}
                    toggle={() => this.toggleTooltip()}
                    hideArrow={true}
                    className='note-detail-tooltip'>
                    <EditorPreview data={note.dme_notes} />
                </Tooltip>
            </div>
        );
    }
}

export default NoteDetailTooltipItem;
