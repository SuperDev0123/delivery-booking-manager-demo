import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import DropzoneComponent from 'react-dropzone-component';

import { getWarehouses } from '../state/services/warehouseService';

class UploadPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            warehouses: [],
            warehouse_id: '',
            uploadedFileName: '',
            uploaded: false,
            uploadStatus: 0,
            intervalId: '',
            xlsxErrors: [],
        };

        this.djsConfig = {
            addRemoveLinks: true,
            autoProcessQueue: false,
            params: { filename: 'file' }
        };

        this.componentConfig = {
            iconFiletypes: ['.xlsx'],
            showFiletypeIcon: true,
            postUrl: 'http://localhost:8000/api/share/upload/filename',
        };

        this.dropzone = null;
        this.interval = null;
    }

    static propTypes = {
        getWarehouses: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.getWarehouses();
    }

    componentWillReceiveProps(newProps) {
        const { warehouses } = newProps;

        if (warehouses)
            this.setState({warehouses});
    }

    handleFileSending(data, xhr, formData) {
        formData.append('warehouse_id', this.state.warehouse_id);
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
            url: 'http://localhost:8000/api/share/upload-status/',
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
        this.dropzone.processQueue();
    }

    onSelectChange(e) {
        this.setState({ warehouse_id: e.target.value });
        this.djsConfig['params'] = {'warehouse_id': e.target.value};
    }

    render() {
        const { warehouses, warehouse_id, uploadedFileName, uploaded, uploadStatus, xlsxErrors } = this.state;
        let warehouses_list = [];
        let xlsx_errors_list = [];
        let statusText = '';

        if (uploaded && uploadStatus === 0)
            statusText = 'Uploaded file and checking now.';
        else if (uploaded && uploadStatus === 1)
            statusText = 'Uploaded file and checked out! No errors!';
        else if (uploaded && uploadStatus === 2)
            statusText = 'Uploaded file has some errors, please fix them out and upload again.';
        else if (!uploaded)
            statusText = 'Select a warehouse and upload a file.';

        if (warehouses)
            warehouses_list = warehouses.map((warehouse, index) => {
                return (
                    <option key={index} value={warehouse.pk_id_client_warehouse}>{warehouse.warehousename}</option>
                );
            });

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
            <div className="container h-100vh">
                <div className="row justify-content-md-center mt-5 mb-5">
                    <div className="col-12">
                        <form onSubmit={(e) => this.handlePost(e)}>
                            <select id="warehouse" required onChange={(e) => this.onSelectChange(e)} value={warehouse_id}>
                                <option value="">Select a warehouse</option>
                                { warehouses_list }
                            </select>
                            <button id="submit-upload" type="submit">upload</button>
                            <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
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
        warehouses: state.warehouse.warehouses,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getWarehouses: () => dispatch(getWarehouses()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadPage);