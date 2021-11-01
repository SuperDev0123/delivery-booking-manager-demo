import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { getLogs } from '../../../../state/services/extraService';
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';

class QuickView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logs: [],
            filtered: [],
        };
        this.textArea = React.createRef();
    }

    static propTypes = {
        getLogs: PropTypes.array.func,
        logs: PropTypes.string.isRequired,
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

        this.props.getLogs();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { logs, redirect } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
        if (logs) {
            this.setState({ logs, filtered: logs });
            let that = this;
            setTimeout(function(){
                that.textArea.current.scrollTop = that.textArea.current.scrollHeight;
            }, 500);
        }
    }

    onRefresh() {
        const { getLogs } = this.props;
        this.setState({ logs: [] });
        getLogs();
    }

    onSearch(e, logs) {
        let search = e.target.value;
        let filtered = logs.map(item => (item.replaceAll(search, `<span style="background: yellow;">${search}</span>`)));
        this.setState({filtered});
    }

    render() {
        const { logs, filtered } = this.state;
        let logSum = '';
        filtered.map(log => logSum += log);

        return (
            <div className='admin-logs-quick'>
                <div className="pageheader">
                    <h1>Quick Logs View</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a></li>
                            <li className="active">Logs</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <div className="d-flex justify-content-between">
                        <input
                            type="search"
                            className="bg-white border border-gray rounded shadow-none p-2"
                            placeholder="Search text..."
                            onChange={(e) => this.onSearch(e, logs)}
                            disabled="disabled"
                            title="Coming soon!"
                        />
                        <button className="btn btn-success" onClick={() => this.onRefresh()}>Refresh</button>
                    </div>
                    <LoadingOverlay
                        active={isEmpty(logs)}
                        spinner
                        text='Loading...'
                    >
                        <textarea ref={this.textArea} value={logSum}></textarea>
                    </LoadingOverlay>
                </section>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        username: state.auth.username,
        logs: state.extra.logs,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getLogs: () => dispatch(getLogs()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(QuickView));
