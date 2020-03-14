import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import moment from 'moment-timezone';
import LoadingOverlay from 'react-loading-overlay';
import { verifyToken, cleanRedirectState } from '../../../../state/services/adminAuthService';
import { getFiles } from '../../../../state/services/fileService';

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            files: [],
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getFiles: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const token = localStorage.getItem('admin_token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isAdminLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin/');
        }

        this.refresh();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, files } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isAdminLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (files) {
            this.setState({ files, loading: false });
        }
    }

    refresh() {
        this.setState({ loading: true });
        this.props.getFiles('pricing-only');
    }

    render() {
        const { loading, files } = this.state;

        const fileList = files.map((file, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{file.file_name}</td>
                    <td>{file.file_path}</td>
                    <td>{moment(file.z_createdTimestamp).format('DD/MM/YYYY HH:mm')}</td>
                    <td>{file.z_createdByAccount}</td>
                    <td>{file.note}</td>
                    <td><button className="btn btn-success" onClick={() => this.refresh()}>Download</button></td>
                    <td><button className="btn btn-danger" onClick={() => this.refresh()}>Delete</button></td>
                </tr>
            );
        });

        return (
            <div className="pricing-only">
                <div className="pageheader">
                    <h1>List</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a>
                            </li>
                            <li><a href="/pricing-only">Pricing Only</a></li>
                            <li className="active">List</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    {loading ? (
                        <LoadingOverlay
                            active={loading}
                            spinner
                            text='Loading...'
                        />
                    )
                        :
                        (
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title"></h3>
                                </div>
                                <div className="panel-body">
                                    <button className="btn btn-success" onClick={() => this.refresh()}>Refresh</button>
                                    <table className="table table-hover table-bordered sortable fixed_headers">
                                        <thead>
                                            <th>No</th>
                                            <th>File Name</th>
                                            <th>File Path</th>
                                            <th>Created At</th>
                                            <th>Created By</th>
                                            <th>Note</th>
                                            <th>Download</th>
                                            <th>Delete</th>
                                        </thead>
                                        <tbody>
                                            {fileList}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.adminAuth.redirect,
        username: state.adminAuth.username,
        files: state.files.files,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getFiles: (fileType) => dispatch(getFiles(fileType)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(List));
