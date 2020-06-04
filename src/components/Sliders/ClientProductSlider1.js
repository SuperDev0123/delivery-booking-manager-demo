import React from 'react';
import PropTypes from 'prop-types';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import LoadingOverlay from 'react-loading-overlay';

class ClientProductSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        clientProducts: PropTypes.array.isRequired,
        isLoading: PropTypes.bool.isRequired,
    };

    render() {
        const {isOpen} = this.props;
        const {clientProducts} = this.props;

        const pricingList = clientProducts.map((clientProduct, index) => {
            return (
                <tr key={index}>
                    <td>{clientProduct.id}</td>
                    <td>{clientProduct.modelNumber}</td>
                    <td>{clientProduct.e_dimUOM}</td>
                    <td>{clientProduct.e_dimLength}</td>
                    <td>{clientProduct.e_dimWidth}</td>
                    <td>{clientProduct.e_dimHeight}</td>
                    <td>{clientProduct.e_weightUOM}</td>
                    <td>{clientProduct.e_weightPerEach}</td>
                </tr>
            );
        });

        return(
            <SlidingPane
                className='fp-pricing-pan'
                isOpen={isOpen}
                title='Freight Provider Pricing Panel'
                subtitle='List View'
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
                    <div className="table-view">
                        <LoadingOverlay
                            active={this.props.isLoading}
                            spinner
                            text='Loading...'
                            styles={{
                                spinner: (base) => ({
                                    ...base,
                                    '& svg circle': {
                                        stroke: '#048abb'
                                    }
                                })
                            }}
                        >
                            <table className="table table-hover table-bordered sortable fixed_headers">
                                <tr>
                                    <th className="" scope="col" nowrap><p>No</p></th>
                                    <th className="" scope="col" nowrap><p>Model Number</p></th>
                                    <th className="" scope="col" nowrap><p>Dim UOM</p></th>
                                    <th className="" scope="col" nowrap><p>L</p></th>
                                    <th className="" scope="col" nowrap><p>W</p></th>
                                    <th className="" scope="col" nowrap><p>H</p></th>
                                    <th className="" scope="col" nowrap><p>Wgt UOM</p></th>
                                    <th className="" scope="col" nowrap><p>Wgt Each</p></th>
                                </tr>
                                { pricingList }
                            </table>
                        </LoadingOverlay>
                    </div>
                </div>
            </SlidingPane>
        );
    }
}

export default ClientProductSlider;
