import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import DropzoneComponent from 'react-dropzone-component';
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Services
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
// Constants
import { API_HOST, HTTP_PROTOCOL } from '../../../../config';

class Upload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploaded: false,
            selectedRuleType: null,
            ruleTypes: [
                {
                    'name': 'rule_type_01',
                    'calcType': 'Cost for Vehicle for Postal Code to Postal Code',
                    'chargeRule': 'Booking Qty of the Matching "Charge UOM" x "Per UOM Charge"'
                }, {
                    'name': 'rule_type_02',
                    'calcType': 'Cost from Postal Code to Postal Code for Pallet Dimensions',
                    'chargeRule': 'Booking Qty of the Matching "Charge UOM" x "Per UOM Charge"'
                }, {
                    'name': 'rule_type_03',
                    'calcType': 'Cost for greater of Mass KG or Cubic KG from Postal Code to Postal Code',
                    'chargeRule': 'Greater of "Basic Charge" + (Booking Qty of the matching "Charge UOM" x "Per UOM Charge") OR "Basic Charge" + ((Length in meters x width in meters x height in meters x "M3 to KG Factor") x "Per UOM Charge")'
                },
            ],

        };

        this.djsConfig = {
            addRemoveLinks: true,
            autoProcessQueue: false,
            parallelUploads: 10,
            timeout: 360000,
        };  

        this.componentConfig = {
            iconFiletypes: ['.xlsx'],
            showFiletypeIcon: true,
            postUrl: HTTP_PROTOCOL + '://' + API_HOST + '/upload/',
        };

        this.dropzone = null;
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin/');
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
    }

    notify = (text) => {
        toast(text);
    };

    handleUploadSuccess(file) {
        let uploadedFileName = file.xhr.responseText.substring(file.xhr.responseText.indexOf('"'));
        uploadedFileName = uploadedFileName.replace(/"/g,'');

        this.setState({uploadedFileName, uploaded: true});
    }

    handlePost(e) {
        e.preventDefault();

        if (!this.state.selectedRuleType) {
            this.notify('Please select rule type!');
        } else {
            this.dropzone.processQueue();
        }
    }

    handleFileSending(data, xhr, formData) {
        formData.append('username', this.state.username);
        formData.append('uploadOption', 'pricing-rule');
        formData.append('ruleType', this.state.selectedRuleType.name);
    }

    onSelected(e, src) {
        if (src === 'ruleType') {
            const filteredRuleTypes = _.filter(this.state.ruleTypes, (ruleType) => ruleType.name === e.target.value);

            if (filteredRuleTypes.length > 0) {
                this.setState({selectedRuleType: filteredRuleTypes[0]});
            }
        }
    }

    render() {
        const {ruleTypes, selectedRuleType} = this.state;

        this.djsConfig['headers'] = {'Authorization': 'JWT ' + localStorage.getItem('token')};
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            sending: this.handleFileSending.bind(this),
            success: this.handleUploadSuccess.bind(this),
        };


        const ruleTypeList = ruleTypes.map((rule, index) => {
            return (<option key={index} value={rule.name}>{rule.name}</option>);
        });

        return (
            <div className="pricing-only">
                <div className="pageheader">
                    <h1>Upload .xls sheet</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a></li>
                            <li><a href="/pricing-only">Pricing Rules</a></li>
                            <li className="active">Upload</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">Upload</h3>
                            <div className="actions pull-right">
                            </div>
                        </div>
                        <div className="panel-body">
                            <form onSubmit={(e) => this.handlePost(e)}>
                                <label className="right-10px">
                                    Rule type:
                                    <select
                                        required
                                        className="left-10px"
                                        onChange={(e) => this.onSelected(e, 'ruleType')}
                                        value={selectedRuleType ? selectedRuleType.name : null}>
                                        <option value="" selected disabled hidden>Select a Rule type</option>
                                        { ruleTypeList }
                                    </select>
                                </label>
                                {selectedRuleType &&
                                    <div>
                                        <p><strong>Calc Type:</strong> {selectedRuleType.calcType}</p>
                                        <p><strong>Charge Rule:</strong> {selectedRuleType.chargeRule}</p>
                                    </div>
                                }
                                <DropzoneComponent 
                                    config={config}
                                    eventHandlers={eventHandlers}
                                    djsConfig={djsConfig}
                                />
                                <button className="btn btn-primary" type="submit">Upload</button>
                            </form>
                        </div>
                    </div>
                </section>

                <ToastContainer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        username: state.auth.username,
        clientname: state.auth.clientname,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Upload));
