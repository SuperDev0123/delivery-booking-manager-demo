import React from 'react';
import PropTypes from 'prop-types';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button } from 'reactstrap';

import { getCubicMeter, getWeight } from '../../commons/helpers';

class ProductSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formInputs: {},
        };

        this.submitHandler = this.submitHandler.bind(this);
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        line: PropTypes.object.isRequired,
        onUpdateProduct: PropTypes.func.isRequired,
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { isOpen, line } = nextProps;

        if (!this.props.isOpen && isOpen && line) {
            const formInputs = {
                'e_item_type': line['e_item_type'],
                'e_item': line['l_003_item'].indexOf('(ZERO Dims') > -1 ? line['l_003_item'].substring(0, line['l_003_item'].indexOf('(ZERO Dims')) : line['l_003_item'],
                'e_weightUOM': line['l_008_weight_UOM'].toUpperCase(),
                'e_weightPerEach': line['l_009_weight_per_each'],
                'e_dimUOM': line['l_004_dim_UOM'].toUpperCase(),
                'e_dimLength': line['l_005_dim_length'],
                'e_dimWidth': line['l_006_dim_width'],
                'e_dimHeight': line['l_007_dim_height'],
                'is_ignored': line['l_003_item'].indexOf('(ZERO Dims') > -1
            };

            this.setState({formInputs});
        }
    }

    onInputChange(event) {
        const { formInputs } = this.state;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        formInputs[name] = value;
        this.setState({formInputs});
    }

    submitHandler(e) {
        e.preventDefault();
        const { formInputs } = this.state;

        this.props.onUpdateProduct(formInputs);
    }

    render() {
        const { isOpen, toggleSlider } = this.props;
        const { formInputs } = this.state;

        const e_1_Total_dimCubicMeter = getCubicMeter(1, formInputs['e_dimUOM'], formInputs['e_dimLength'], formInputs['e_dimWidth'], formInputs['e_dimHeight']);
        const e_Total_KG_weight = getWeight(1, formInputs['e_weightUOM'], formInputs['e_weightPerEach']);
        const total_2_cubic_mass_factor_calc = (Number.parseFloat(e_1_Total_dimCubicMeter).toFixed(4) * 250).toFixed(2);

        return (
            <SlidingPane
                className='product-slider'
                overlayClassName='product-slider-overlay'
                isOpen={isOpen}
                title='Product Slider'
                subtitle='Form View'
                onRequestClose={toggleSlider}>
                <div className="slider-content">
                    <ul>
                        <li>This is Product slider. You can create/edit Product.</li>
                    </ul>
                    <form onSubmit={this.submitHandler}>
                        <label>
                            <p>Item No.</p>
                            <input
                                className="form-control"
                                type="text"
                                name="e_item_type"
                                disabled="disabled"
                                value={formInputs['e_item_type']}
                            />
                        </label>
                        <label>
                            <p>Item Description</p>
                            <input
                                className="form-control"
                                type="text"
                                name="e_item"
                                value={formInputs['e_item']}
                                onChange={(e) => this.onInputChange(e)}
                                required
                            />
                        </label>
                        <label>
                            <p>Wgt UOM</p>
                            <select
                                name="e_weightUOM"
                                onChange={(e) => this.onInputChange(e)}
                                value = {formInputs['e_weightUOM']}
                                required
                            >
                                <option value="Gram">Gram</option>
                                <option value="KG" selected='selected'>Kilogram</option>
                                <option value="Ton">Ton</option>
                            </select>
                        </label>
                        <label>
                            <p>Wgt Each</p>
                            <input
                                className="form-control"
                                type="text"
                                name="e_weightPerEach"
                                value={formInputs['e_weightPerEach']}
                                onChange={(e) => this.onInputChange(e)}
                                required
                            />
                        </label>
                        <label>
                            <p>Total Kgs</p>
                            <input 
                                className="form-control"
                                type="text"
                                disabled="disabled"
                                name="e_Total_KG_weight"
                                value={e_Total_KG_weight}
                            />
                        </label>
                        <label>
                            <p>Dim UOM</p>
                            <select
                                name="e_dimUOM"
                                onChange={(e) => this.onInputChange(e)}
                                value = {formInputs['e_dimUOM']}
                                required
                            >
                                <option value="MM">MM</option>
                                <option value="CM">CM</option>
                                <option value="M">METER</option>
                            </select>
                        </label>
                        <label>
                            <p>Length</p>
                            <input 
                                className="form-control"
                                required
                                type="number"
                                name="e_dimLength"
                                value={formInputs['e_dimLength']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label>
                        <label>
                            <p>Width</p>
                            <input 
                                className="form-control"
                                required
                                type="number"
                                name="e_dimWidth"
                                value={formInputs['e_dimWidth']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label>
                        <label>
                            <p>Height</p>
                            <input 
                                className="form-control"
                                required
                                type="number"
                                name="e_dimHeight"
                                value={formInputs['e_dimHeight']}
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label>
                        <label>
                            <p>Cubic Meter</p>
                            <input
                                className="form-control"
                                type="text"
                                disabled="disabled"
                                name="e_1_Total_dimCubicMeter"
                                value={e_1_Total_dimCubicMeter}
                            />
                        </label>
                        <label>
                            <p>Cubic KG</p>
                            <input
                                className="form-control"
                                type="text"
                                disabled="disabled"
                                name="total_2_cubic_mass_factor_calc"
                                value={total_2_cubic_mass_factor_calc}
                            />
                        </label>
                        <label>
                            <p>Is ignored?</p>
                            <input type="checkbox" name="is_ignored" className="checkbox" checked={formInputs['is_ignored']} onChange={(e) => this.onInputChange(e)} />
                        </label>
                        <label>
                            <Button type="submit primary" color="primary">Submit</Button>
                            <Button color="danger" onClick={toggleSlider}>Cancel</Button>
                        </label>
                    </form>
                </div>
            </SlidingPane>
        );
    }
}

export default ProductSlider;
