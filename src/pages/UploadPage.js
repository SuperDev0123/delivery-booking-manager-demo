import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getWarehouses } from '../state/services/warehouseService';

class UploadPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
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

    render() {
        const { warehouses } = this.state;
        let warehouses_list = [];
        if (warehouses)
            warehouses_list = warehouses.map((warehouse, index) => {
                return (
                    <option key={index} value={warehouse.pk_id_client_warehouse}>{warehouse.warehousename}</option>
                );
            });

        return (
            <div className="container h-100vh">
                <div className="row justify-content-md-center mt-5 mb-5">
                    <div className="col-12">
                        <form onSubmit={() => this.onUpload()} className="dropzone" id="uploadDropzone">
                            <select id="warehouse" required>
                                <option value="">Select a warehouse</option>
                                { warehouses_list }
                            </select>
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