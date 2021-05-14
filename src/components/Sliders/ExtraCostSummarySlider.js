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
        toggleSlider: PropTypes.func.isRequired,
        selectedPrice: PropTypes.object
    };

    render() {
        const { isOpen, toggleSlider, selectedPrice } = this.props;
        const surchargeList = (selectedPrice.surcharges || []).map((surcharge, index) => (
            <p className="surcharge" key={index}>
                <strong>Name:</strong> {surcharge['name']}<br />
                <strong>Description:</strong> {surcharge['description']}<br />
                <strong>Amount:</strong> {surcharge['value']}<br />
                <hr />
            </p>
        ));

        return (
            <SlidingPane
                className='esc-slider'
                overlayClassName='ecs-slider-overlay'
                isOpen={isOpen}
                title='Extra Cost Summary Slider'
                subtitle=''
                onRequestClose={toggleSlider}
            >
                <div className="slider-content">
                    <h4>Applied Surcharges:</h4>
                    {surchargeList}
                </div>
            </SlidingPane>
        );
    }
}

export default ExtraCostSummarySlider;
