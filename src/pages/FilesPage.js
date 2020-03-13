import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import '../styles/pages/dmeapiinv.scss';
import { getFiles } from '../state/services/fileService';

class FilesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        };
    }
    static propTypes = {
        getFiles: PropTypes.func.isRequired, 
        cleanRedirectState: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.getFiles('import');
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {redirect, files} = newProps;

        if (redirect) {
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (files) {
            this.setState({files});
        }
    }

    render() {
        const { files } = this.state;

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
                text: 'note'
            }
        ];

        return (
            <section>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3>Files (Last 50s)</h3>
                                </div>
                                <div className="panel-body">
                                    <div className="table-responsive">
                                        <BootstrapTable
                                            keyField="id"
                                            data={ files }
                                            columns={ columns }
                                            bootstrap4={ true }
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
