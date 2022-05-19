import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import '../styles/pages/dmeapiinv.scss';
import { getFiles } from '../state/services/fileService';
import { API_HOST, HTTP_PROTOCOL } from '../config';

class FilesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            filteredFiles:[],
            loadingFiles: false,
            simpleSearchKeyword: ''
        };
    }
    static propTypes = {
        getFiles: PropTypes.func.isRequired, 
        cleanRedirectState: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        loadingFiles: PropTypes.bool.isRequired,
    };

    componentDidMount() {
        this.props.getFiles('xls import');
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {redirect, files, loadingFiles} = newProps;

        if (redirect) {
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (files) {
            this.setState({files});
            this.setState({filteredFiles: files});
        }

        if ( this.props.loadingFiles != loadingFiles) {
            this.setState({loadingFiles});
        }
    }

    onInputChange(e) {
        this.setState({simpleSearchKeyword: e.target.value});
    }

    // noteFormatter(cell, row) {
    //     if (row.b_bookingID_Visual) {
    //         const url = `/booking?bookingId=${row.booking_id}`;
    //         return (
    //             <span>
    //                 <a href={url}>{ cell }</a>
    //             </span>
    //         );
    //     }
      
    //     return (
    //         <span></span>
    //     );
    // }

    datetimeFormatter(cell, row) {
        if (row.z_createdTimeStamp)
            return (<span>{moment(row.z_createdTimeStamp).format('DD/MM/YYYY HH:mm')}</span>);

        return (<span></span>);
    }

    buttonFormatter(cell, row) {
        return (
            <button
                className="btn btn-primary"
                onClick={() => {
                    const token = localStorage.getItem('token');
            
                    const options = {
                        method: 'post',
                        url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
                        headers: {'Authorization': 'JWT ' + token},
                        data: {fileName:row.file_name + cell,  downloadOption: 'xls import',},
                        responseType: 'blob', // important
                    };
            
                    axios(options).then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', row.file_name + '.zip');
                        document.body.appendChild(link);
                        link.click();
                    });
                }}
            >
                Download
            </button>
        );
    }

    onSimpleSearch(e) {
        e.preventDefault();
        const {simpleSearchKeyword, files} = this.state;

        const filteredFiles = files.filter(file =>
            file.file_name.indexOf(simpleSearchKeyword) >- 1 || (
                file.b_bookingID_Visual &&
                String(file.b_bookingID_Visual).indexOf(simpleSearchKeyword)> -1
            )
        );

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
                text: 'z_createdTimeStamp',
                formatter: this.datetimeFormatter,
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

                                <LoadingOverlay
                                    active={this.state.loadingFiles}
                                    spinner
                                    text='Loading...'
                                >
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
                                </LoadingOverlay>
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
        loadingFiles: state.files.loadingFiles,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getFiles: (fileType) => dispatch(getFiles(fileType)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesPage);
