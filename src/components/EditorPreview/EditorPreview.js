import React, {Component} from 'react';
import PropTypes from 'prop-types';

class EditorPreview extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        data: PropTypes.string
    };

    static defaultProps = {
        data: ''
    };
    
    render() {
        return (
            <div className="editor-preview">
                <div dangerouslySetInnerHTML={ { __html: this.props.data } }></div>
            </div>
        );
    }
}

export default EditorPreview;
