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
        selectedPrice: PropTypes.object,
        bok_2s: PropTypes.array,
    };

    render() {
        const { isOpen, toggleSlider, selectedPrice, bok_2s } = this.props;
        const surchargeList = (selectedPrice.surcharges || []).map((surcharge, index) => {
            if (surcharge['qty'])
                return;

            let lines = null;
            let surcharge_with_qty = null;
            selectedPrice.surcharges.map(surcharge_01 => {
                if (surcharge_01['qty'] && surcharge_01['name'] === surcharge['name'])
                    surcharge_with_qty = surcharge_01;
            });

            if (surcharge_with_qty)
                lines = bok_2s.map((bok_2, index01) => {
                    if (bok_2['pk_lines_id'] === parseInt(surcharge_with_qty['line_id']))
                        return (
                            <p key={index01}>
                                <strong>*Lines*</strong> <br />
                                <strong>Item:</strong> {bok_2.l_003_item} <br />
                                <strong>Amount:</strong> {surcharge_with_qty.amount_cl.toFixed(2)} <br />
                                <strong>Quantity:</strong> {surcharge_with_qty.qty}
                            </p>
                        );
                });

            return (
                <p className="surcharge" key={index}>
                    <strong>Name:</strong> {surcharge['name']}<br />
                    <strong>Amount:</strong> {surcharge['amount']}<br />
                    {lines ? lines : null}
                    <hr />
                </p>
            );
        });

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
