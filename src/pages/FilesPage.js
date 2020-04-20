import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import '../styles/pages/dmeapiinv.scss';
import { getFiles } from '../state/services/fileService';

import paginationFactory from 'react-bootstrap-table2-paginator';

class FilesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            filteredFiles:[],
            simpleSearchKeyword: ''
        };
    }
    static propTypes = {
        getFiles: PropTypes.func.isRequired, 
        cleanRedirectState: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.getFiles('xls import');
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {redirect, files} = newProps;

        if (redirect) {
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (files) {
            this.setState({files});
            this.setState({filteredFiles: files});
        }
    }

    onInputChange(e) {
        this.setState({simpleSearchKeyword: e.target.value});
    }

    noteFormatter(cell, row) {
        if (row.b_bookingID_Visual) {
            const url = `/booking?bookingId=${row.booking_id}`;
            return (
                <span>
                    <a href={url}> { cell }</a>
                </span>
            );
        }
      
        return (
            <span></span>
        );
    }

    onClickDownload (file_name) {
        console.log('file_name', file_name);
    }

    buttonFormatter(cell, row) {
        console.log('cell', cell);
        console.log('row', row);
        return (
            <button
                className="btn btn-primary"
                onClick={() => {
                    
                }}
            >
                Download
            </button>
        );
    }

    onSimpleSearch(e) {
        e.preventDefault();
        const {simpleSearchKeyword, files} = this.state;

        const filteredFiles = files.filter((file) => file.file_name.indexOf(simpleSearchKeyword)>-1);
        this.setState({filteredFiles});
    }

    render() {
        const { filteredFiles, simpleSearchKeyword } = this.state;

        const columns = [
            {
                dataField: 'file_name',
                text: 'file_name'
            }, {
                dataField: 'z_createdTimeStamp',
                text: 'z_createdTimeStamp'
            }, {
                dataField: 'z_createdByAccount',
                text: 'z_createdByAccount'
            }, {
                dataField: 'file_type',
                text: 'file_type'
            }, {
                dataField: 'file_extension',
                text: 'file_extension'
            }, {
                dataField: 'note',
                text: 'note',
            }, {
                dataField: 'b_bookingID_Visual',
                text:'Booking Visual ID',
                formatter: this.noteFormatter
            }, {
                dataField: 'Actions',
                text: 'Actions',
                formatter: this.buttonFormatter
            }
        ];

        return (
            <section>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3>Files</h3>
                                    <div>
                                        <form onSubmit={(e) => this.onSimpleSearch(e)}>
                                            <input className="popuptext" type="text" placeholder="Search.." name="search" value={simpleSearchKeyword} onChange={(e) => this.onInputChange(e)} />
                                        </form>
                                    </div>
                                </div>

                                <div className="panel-body">
                                    <div className="table-responsive">
                                        <BootstrapTable
                                            keyField="id"
                                            data={ filteredFiles }
                                            columns={ columns }
                                            bootstrap4={ true }
                                            pagination={ paginationFactory() }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        errorMessage: state.auth.errorMessage,
        redirect: state.auth.redirect,
        files: state.files.files,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getFiles: (fileType) => dispatch(getFiles(fileType)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesPage);
