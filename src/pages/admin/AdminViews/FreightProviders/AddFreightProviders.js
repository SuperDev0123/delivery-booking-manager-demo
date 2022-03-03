import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { createFpDetail } from '../../../../state/services/fpService';
import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';

class AddFreightProviders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fp_company_name: '',
            fp_address_country: 'AU',
            loading: false,
            fp_markupfuel_levy_percent: '',
            hex_color_code: '#36c',
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        createFpDetail: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, fp_company_name, fp_address_country } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
        if (fp_company_name) {
            this.setState({ fp_company_name: fp_company_name });
        }
        if (fp_address_country) {
            this.setState({ fp_address_country: fp_address_country });
        }
    }

    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        this.setState({ loading: true });
        const { fp_company_name, fp_address_country, fp_markupfuel_levy_percent, hex_color_code } = this.state;
        this.props.createFpDetail({ 
            fp_company_name, 
            fp_address_country, 
            fp_markupfuel_levy_percent,
            hex_color_code
        });
        this.setState({ loading: false });
        this.props.history.push('/admin/providers');
        event.preventDefault();
    }

    onChangeColor(colors) {
        this.setState({ hex_color_code: colors.color} );
    }

    render() {
        return (
            <div>
                <div className="pageheader">
                    <h1>Add Freight Providers</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li><a href="/admin/providers">Freight Providers</a></li>
                            <li className="active">Add New</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    />
                    <div className="row">
                        <div className="col-md-6">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Add New</h3>
                                    <div className="actions pull-right">

                                    </div>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => this.onSubmit(e)} role="form">
                                        <div className="form-group">
                                            <label htmlFor="fp_company_name">Company Name</label>
                                            <input name="fp_company_name" type="text" className="form-control" id="fp_company_name" placeholder="Enter Company Name" value={this.state.fp_company_name} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="fp_address_country">Country</label>
                                            <select name="fp_address_country" className="form-control" id="fp_address_country" onChange={(e) => this.onInputChange(e)}>
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
                                                                                                                        
                                        <button type="submit" className="btn btn-primary  mt-5 mb-2">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        fp_company_name: state.fp.fp_company_name,
        fp_address_country: state.fp.fp_address_country,
        username: state.auth.username,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        createFpDetail: (fpDetail) => dispatch(createFpDetail(fpDetail))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddFreightProviders));
