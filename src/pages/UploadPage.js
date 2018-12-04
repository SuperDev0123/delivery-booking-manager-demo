import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DropzoneComponent from 'react-dropzone-component';

import { getWarehouses } from '../state/services/warehouseService';

class UploadPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            warehouses: [],
            warehouse_id: '',
        };

        this.djsConfig = {
            addRemoveLinks: true,
            acceptedFiles: 'image/jpeg,image/png,image/gif',
            autoProcessQueue: false,
            params: {
                filename: 'file',
            }
        };

        this.componentConfig = {
            iconFiletypes: ['.xlsx', '.png', '.css'],
            showFiletypeIcon: true,
            postUrl: 'http://localhost:8000/api/share/upload/filename',
        };

        this.dropzone = null;
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

    handleFileAdded(file) {
        console.log('Added file: ', file);
    }

    handleFileSending(data, xhr, formData) {
        formData.append('warehouse_id', this.state.warehouse_id);
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
        const { warehouses, warehouse_id } = this.state;
        let warehouses_list = [];
        if (warehouses)
            warehouses_list = warehouses.map((warehouse, index) => {
                return (
                    <option key={index} value={warehouse.pk_id_client_warehouse}>{warehouse.warehousename}</option>
                );
            });

        this.djsConfig['headers'] = {'Authorization': 'JWT ' + localStorage.getItem('token')};
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            addedfile: this.handleFileAdded.bind(this),
            sending: this.handleFileSending.bind(this),
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
                            <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
                            <button id="submit-upload" type="submit">upload</button>
                        </form>
                    </div>
                    <div className="col-12">
                        <p id="upload-status"></p>
                        <p id="upload-filename"></p>
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