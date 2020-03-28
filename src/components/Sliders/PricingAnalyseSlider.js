import React from 'react';
import PropTypes from 'prop-types';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

class PricingAnalyseSlider extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        pricingAnalyses: PropTypes.array.isRequired,
    };

    render() {
        const {isOpen, pricingAnalyses} = this.props;

        const analysesList = pricingAnalyses.map((analysis, index) => {
            return (
                <tr key={index} style= {{ backgroundColor: analysis.service_name == '*' ? '#919191' : 'white' }}>
                    <td>{index + 1}</td>
                    <td>{analysis.fp_name}</td>
                    <td>{analysis.service_name}</td>
                    <td>{analysis.account_code}</td>
                    <td>{analysis.count}</td>
                    <td>{Number(analysis.min_price).toFixed(2)}</td>
                    <td>{Number(analysis.avg_price).toFixed(2)}</td>
                    <td>{Number(analysis.max_price).toFixed(2)}</td>
                </tr>
            );
        });

        return(
            <SlidingPane
                className='fp-pricing-pan'
                isOpen={isOpen}
                title='Price Analysis Summary'
                subtitle='List View'
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
                    <div className="table-view">
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <tr>
                                <th className="" scope="col" nowrap>
                                    <p>No</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Freight Provider</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Service Name</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Account Code</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Count</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Low cost</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Avg cost</p>
                                </th>
                                <th className="" scope="col" nowrap>
                                    <p>Max cost</p>
                                </th>
                            </tr>
                            { analysesList }
                        </table>
                    </div>
                </div>
            </SlidingPane>
        );
    }
}

export default PricingAnalyseSlider;
