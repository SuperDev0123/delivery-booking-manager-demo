import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import DropzoneComponent from 'react-dropzone-component';
import { successGetDMEClientProducts } from '../../../../state/actions/extraActions';
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { API_HOST, HTTP_PROTOCOL } from '../../../../config';

class Upload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploaded: false,
            uploadResult: '',
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
        setClientProducts: PropTypes.func.isRequired,
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

    handleUploadSuccess(file) {
        let data = JSON.parse(file.xhr.responseText);
        this.props.setClientProducts(data.created_products);
        let msg = [
            <h3 key='1' style={{color: 'red'}}>
                Errors
            </h3>
        ];
        if (data.import_status.failure_rows.empty_field_error.length) {
            msg.push(
                <div key='2'>
                    <h4 style={{ color: 'red'}}>- These fields should not be empty: parent_model_number, child_model_number, description, qty.</h4>
                    <div style={{color: 'black', marginLeft: 10, display: 'flex', marginBottom: 10}}>
                        <p style={{margin: 0}}>row numbers:&nbsp;</p>
                        <p style={{margin: 0}}>{data.import_status.failure_rows.empty_field_error.join(', ')}</p>
                    </div>
                </div>
            );
        }
        if (data.import_status.failure_rows.wrong_type_error.length) {
            msg.push(
                <div key='3'>
                    <h4 style={{color: 'red'}}>- There are some rows with wrong type fields.</h4>
                    <div style={{marginLeft: 10}}>
                        <p style={{margin: 0}}><b>Positive Integer: qty</b></p>
                        <p style={{margin: 0}}><b>Float: e_dimLength, e_dimWidth, e_dimHeight, e_weightPerEach</b></p>
                        <p style={{margin: 0}}><b>String: rest</b></p>
                        <div style={{color: 'black', display: 'flex'}}>
                            <p style={{width: 96, minWidth: 96, margin: 0}}>row numbers: </p>
                            <p style={{margin: 0}}>{data.import_status.failure_rows.wrong_type_error.join(', ')}</p>
                        </div>
                    </div>
                </div>
            );
        } 
        if (!data.import_status.failure_count) {
            msg = [<h3 key='1' style={{color: 'green'}}>Client products imported successfully!</h3>];
        }
        this.setState({
            uploadedFileName: data.file_name,
            uploaded: true,
            uploadResult: msg
        });
    }

    handlePost(e) {
        e.preventDefault();
        this.setState({uploadResult: ''});
        this.dropzone.processQueue();
    }

    handleFileSending(data, xhr, formData) {
        const {username} = this.state;
        formData.append('username', username);
        formData.append('uploadOption', 'client-products');
    }

    render() {
        this.djsConfig['headers'] = {'Authorization': 'JWT ' + localStorage.getItem('token')};
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            sending: this.handleFileSending.bind(this),
            success: this.handleUploadSuccess.bind(this),
        };

        return (
            <div className="client-products">
                <div className="pageheader">
                    <h1>Upload sheet</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a></li>
                            <li><a href="/clientproducts">Client Products</a></li>
                            <li className="active">Import</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">Import</h3>
                            <div className="actions pull-right">
                            </div>
                        </div>
                        <div className="panel-body">
                            <form onSubmit={(e) => this.handlePost(e)}>
                                <DropzoneComponent 
                                    config={config}
                                    eventHandlers={eventHandlers}
                                    djsConfig={djsConfig}
                                />
                                <button className="btn btn-primary" type="submit">Upload</button>
                                <button className="btn btn-secondary" onClick={() => this.props.history.push('/customerdashboard/clientproducts')}>
                                    Cancel
                                </button>
                            </form>
                            <div>
                                <br/>
                                {this.state.uploadResult}
                                <br/>
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
        username: state.auth.username,
        clientname: state.auth.clientname,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        setClientProducts: (data) => dispatch(successGetDMEClientProducts(data))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Upload));
