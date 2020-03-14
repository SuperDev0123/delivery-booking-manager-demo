import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import DropzoneComponent from 'react-dropzone-component';
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { API_HOST, HTTP_PROTOCOL } from '../../../../config';

class Upload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploaded: false,
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
            postUrl: HTTP_PROTOCOL + '://' + API_HOST + '/upload/pricing-only/',
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

    handleUploadSuccess(file) {
        let uploadedFileName = file.xhr.responseText.substring(file.xhr.responseText.indexOf('"'));
        uploadedFileName = uploadedFileName.replace(/"/g,'');

        this.setState({
            uploadedFileName,
            uploaded: true,
        });
    }

    handlePost(e) {
        e.preventDefault();
        this.dropzone.processQueue();
    }

    handleFileSending(data, xhr, formData) {
        const {username} = this.state;
        formData.append('username', username);
        formData.append('uploadOption', 'pricing-only');
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
            <div className="pricing-only">
                <div className="pageheader">
                    <h1>Upload sheet</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a></li>
                            <li><a href="/pricing-only">Pricing Only</a></li>
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
