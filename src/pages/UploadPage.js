import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import DropzoneComponent from 'react-dropzone-component';

import { verifyToken, cleanRedirectState } from '../state/services/authService';

import { API_HOST, HTTP_PROTOCOL } from '../config';

class UploadPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploadedFileName: '',
            uploaded: false,
            uploadStatus: 0,
            intervalId: '',
            xlsxErrors: [],
            formInputs: {
                uploader: '',
            },
            username: '',
            clientname: '',
        };

        this.djsConfig = {
            addRemoveLinks: true,
            autoProcessQueue: false,
            parallelUploads: 10,
            params: { filename: 'file' },
            timeout: 360000,
        };

        this.componentConfig = {
            iconFiletypes: ['.xlsx'],
            showFiletypeIcon: true,
            postUrl: HTTP_PROTOCOL + '://' + API_HOST + '/upload/import/',
        };

        this.dropzone = null;
        this.interval = null;
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, username, clientname } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (username) {
            this.setState({username});
        }

        if (clientname) {
            this.setState({clientname});
        }
    }

    handleUploadSuccess(file) {
        let uploadedFileName = file.xhr.responseText.substring(file.xhr.responseText.indexOf('"'));
        uploadedFileName = uploadedFileName.replace(/"/g,'');
        this.interval = setInterval(() => this.myTimer(), 2000);

        this.setState({
            uploadedFileName,
            uploaded: true,
        });
    }

    myTimer() {
        let that = this;

        axios({
            url: HTTP_PROTOCOL + '://' + API_HOST + '/upload/status/', // Dev
            method: 'get',
            params: { filename: this.state.uploadedFileName.substring(this.state.uploadedFileName.indexOf('_') + 1) },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + localStorage.getItem('token')
            }
        })
            .then(function (response) {
                if (response.data.status_code === 1) {
                    that.setState({uploadStatus: 1});
                    clearInterval(that.interval);
                } else if (response.data.status_code === 2) {
                    that.setState({uploadStatus: 2, xlsxErrors: response.data.errors});
                    clearInterval(that.interval);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handlePost(e) {
        e.preventDefault();

        if (this.state.formInputs.uploader === '' && this.state.clientname === 'dme') {
            alert('Please select a uploader');
        } else {
            this.dropzone.processQueue();
        }
    }

    onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let formInputs = this.state.formInputs;
        formInputs[name] = value;
        this.setState({formInputs});
    }

    handleFileSending(data, xhr, formData) {
        const {clientname, formInputs, username} = this.state;
        formData.append('username', username);
        formData.append('uploadOption', 'import');

        if (clientname === 'dme') {
            formData.append('uploader', formInputs['uploader']);            
        }
    }

    render() {
        const { uploadedFileName, uploaded, uploadStatus, xlsxErrors, formInputs, clientname } = this.state;
        let xlsx_errors_list = [];
        let statusText = '';

        if (uploaded && uploadStatus === 0)
            statusText = 'Uploaded file.';
        else if (uploaded && uploadStatus === 1)
            statusText = 'Uploaded file and checked out! No errors!';
        else if (uploaded && uploadStatus === 2)
            statusText = 'Uploaded file has some errors, please fix them out and upload again.';
        else if (!uploaded)
            statusText = 'Pleaes upload a file.';

        if (xlsxErrors) {
            if (xlsxErrors.length > 0) {
                xlsx_errors_list = xlsxErrors.map((xlsxError, index) => {
                    return (
                        <li key={index}>{xlsxError}</li>
                    );
                });
            }
        }

        // DropzoneComponent config
        this.djsConfig['headers'] = {'Authorization': 'JWT ' + localStorage.getItem('token')};
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            sending: this.handleFileSending.bind(this),
            success: this.handleUploadSuccess.bind(this),
        };

        return (
            <div className="container h-100vh upload">
                <div className="row justify-content-md-center mt-5 mb-5">
                    <div className="col-12">
                        <form onSubmit={(e) => this.handlePost(e)}>
                            <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
                            {
                                (clientname === 'dme') ?
                                    <select
                                        className="uploader"
                                        name="uploader"
                                        onChange={(e) => this.onInputChange(e)}
                                        value = {formInputs['uploader']}
                                    >
                                        <option value="" selected disabled hidden>Select Uploader</option>
                                        <option value='Jason L'>Jason L</option>
                                        <option value='Seaway'>Seaway-Tempo</option>
                                        <option value='Seaway-Hanalt'>Seaway-Hanalt</option>
                                        <option value='Seaway-Tempo-Aldi'>Seaway-Tempo-Aldi</option>
                                        <option value='Seaway-Bunnings'>Seaway-Bunnings</option>
                                        <option value='Tempo'>Tempo</option>
                                    </select>
                                    :
                                    null
                            }
                            <button id="submit-upload" type="submit">upload</button>
                        </form>
                    </div>
                    <div className="col-12">
                        <p id="upload-status">{statusText}</p>
                        {
                            uploaded &&
                            <p id="upload-filename">Uploaded file name: {uploadedFileName}</p>
                        }
                        {
                            (xlsxErrors && xlsxErrors.length > 0) &&
                            <div>
                                <p>Errors: </p>
                                {xlsx_errors_list}
                            </div>
                        }
                    </div>
                </div>
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
        cleanRedirectState: () => dispatch(cleanRedirectState()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadPage);
