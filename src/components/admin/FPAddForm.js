import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';

import { createFpDetail, getFPDetails, updateFpDetail } from '../../state/services/fpService';

class FPAddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0, 
            fp_company_name: '', 
            fp_address_country: 'AU', 
            fp_markupfuel_levy_percent: '', 
            hex_color_code: '#36c',
        };
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        getFPDetails: PropTypes.func.isRequired,
        componentType: PropTypes.string.isRequired,
        fpDetails: PropTypes.object.isRequired,
        createFpDetail: PropTypes.func.isRequired,
        updateFpDetail: PropTypes.func.isRequired
    }

    componentDidMount() {
        const { componentType } = this.props;
        if (componentType == 'edit') {
            const fp_id = this.state.id;
            this.props.getFPDetails(fp_id);
        } 
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { componentType, fpDetails } = newProps;
        console.log(fpDetails);
        if (componentType == 'edit') {
            this.setState({
                id: fpDetails.id,
                fp_company_name: fpDetails.fp_company_name,
                fp_address_country: fpDetails.fp_address_country,
                fp_markupfuel_levy_percent: fpDetails.fp_markupfuel_levy_percent,
                hex_color_code: fpDetails.hex_color_code,
            });
        }
    }

    onSubmit(event) {
        this.setState({ loading: true });
        const { componentType } = this.props;
        const {id, fp_company_name, fp_address_country, fp_markupfuel_levy_percent, hex_color_code } = this.state;
        if (componentType == 'edit') {
            this.props.updateFpDetail({
                id, fp_company_name, fp_address_country, fp_markupfuel_levy_percent, hex_color_code
            });
        } else if (componentType == 'add') {
            this.props.createFpDetail({ 
                fp_company_name, 
                fp_address_country, 
                fp_markupfuel_levy_percent,
                hex_color_code
            });
        }
        this.setState({ loading: false });
        this.props.history.push('/admin/providers');
        event.preventDefault();
    }
    render() {
        return (
            <div className="panel-body">
                <form onSubmit={(e) => this.onSubmit(e)} role="form">
                    <div className="form-group">
                        <label htmlFor="fp_company_name">Company Name</label>
                        <input name="fp_company_name" type="text" className="form-control" id="fp_company_name" placeholder="Enter Company Name" value={this.state.fp_company_name} onChange={(e) => this.onInputChange(e)} />
                        <input name="id" type="hidden" value={this.state.id} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fp_address_country">Country</label>
                        <select name="fp_address_country" className="form-control" id="fp_address_country" value={this.state.fp_address_country} onChange={(e) => this.onInputChange(e)} >
                            <option value="AUS">Australia</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="fp_markupfuel_levy_percent ">Fuel Levy Percent</label>
                        <input name="fp_markupfuel_levy_percent" type="text" className="form-control" id="fp_markupfuel_levy_percent" placeholder="Fuel Levy Percent" value={this.state.fp_markupfuel_levy_percent} onChange={(e) => this.onInputChange(e)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hex_color_code ">Hex Color Code</label>
                        <div className='d-flex mr-0-1'>
                            <input name="hex_color_code" type="text" className="form-control mr-n2 pr-2" id="hex_color_code " placeholder="Hex Color Code" value={this.state.hex_color_code}/>
                            <ColorPicker
                                className="fp-color-picker"
                                animation="slide-up"
                                color={this.state.hex_color_code}
                                onChange={(colors) => this.onChangeColor(colors)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fpDetails: state.fp.fpDetails,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getFPDetails: (fp_id) => dispatch(getFPDetails(fp_id)),
        createFpDetail: (fpDetail) => dispatch(createFpDetail(fpDetail)),
        updateFpDetail: (fpDetail) => dispatch(updateFpDetail(fpDetail)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FPAddForm));