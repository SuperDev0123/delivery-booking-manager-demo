import React from 'react';
import PropTypes from 'prop-types';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

class ExtraCostSummarySlider extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired
    };

    render() {
        const { isOpen, toggleSlider } = this.props;

        return (
            <SlidingPane
                className='-slider'
                overlayClassName='lt-slider-overlay'
                isOpen={isOpen}
                title='Extra Cost Summary Slider'
                subtitle=''
                onRequestClose={toggleSlider}>
                <div className="slider-content">
                    <label>* Residential address: $32.00</label>
                </div>
            </SlidingPane>
        );
    }
}

export default ExtraCostSummarySlider;
