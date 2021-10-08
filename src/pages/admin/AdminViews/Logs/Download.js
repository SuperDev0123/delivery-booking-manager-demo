import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { API_HOST, HTTP_PROTOCOL } from '../../../../config';

class DownloadLogs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        location: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
    }

    downloadLogs(mode) {
        this.setState({loading: true});
        const token = localStorage.getItem('token');
        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
            headers: {'Authorization': 'JWT ' + token },
            data: {
                downloadOption: 'logs',
                mode: mode
            },
            responseType: 'blob', // important
        };

        axios(options)
            .then((response) => {
                this.setState({loading: false});
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', mode === 0 ? 'last log.zip' : mode === 1 ? 'last 10 logs.zip' : 'all logs.zip');
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => {
                this.setState({loading: false});
                toast('Download failed!');
                console.log('download error:', error);
            });
    }

    render() {

        const { status } = this.state;

        return (
            <div>
                <div className="pageheader">
                    <h1>Download Logs</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li className="active">Logs</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <div className="d-flex">
                        <button className="btn btn-success" onClick={() => this.downloadLogs(0)}>Last Log</button>
                        <button className="btn btn-success" onClick={() => this.downloadLogs(1)}>Last 10 Logs</button>
                        <button className="btn btn-success" onClick={() => this.downloadLogs(2)}>All Logs</button>
                    </div>
                    <LoadingOverlay
                        active={status}
                        spinner
                        text='Loading...'
                    >
                        <div className="p-3">
                            { status }
                        </div>
                    </LoadingOverlay>

                </section>
                <ToastContainer />
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        username: state.auth.username,
        files: state.files.files,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DownloadLogs));
