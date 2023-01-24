import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Libs
import axios from 'axios';
import moment from 'moment-timezone';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUser } from '../../state/services/authService';

class ManifestReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingDownload: false,
            loading: true,
            errorList: [],
            page_index: 0,
            selectedStatus: 'all',
        };
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
    };

    componentDidMount() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const token = localStorage.getItem('token');

        if (isLoggedIn && token && token.length > 0)
            this.props.getUser(token);

        this.props.getBookingErrors();

    }

    UNSAFE_componentWillReceiveProps(newProps) {
        
    }

    onClickRadio = (val) => {
        this.setState({selectedStatus: val});
    }

    render() {
        const { loading, reportStore, selectedStatus } = this.state;
        const reportList = reportStore? this.onFind(reportStore) : '';
        return (
            <LoadingOverlay
                active={loading}
                spinner
                text='Loading...'
            >
                <div>
                    <label>
                        <p>Status type:</p>
                        <input type="radio"
                            id="auto-select-all"
                            checked={selectedStatus === 'all'}
                            onChange={() => this.onClickRadio('all')}
                        />
                        <label htmlFor="auto-select-all">All</label>
                        <input type="radio"
                            id="auto-select-open"
                            checked={selectedStatus === 'open'}
                            onChange={() => this.onClickRadio('open')}
                        />
                        <label htmlFor="auto-select-open">Open</label>
                        <input type="radio"
                            id="auto-select-closed"
                            checked={selectedStatus === 'closed'}
                            onChange={() => this.onClickRadio('closed')}
                        />
                        <label htmlFor="auto-select-closed">Closed</label>
                    </label>
                    <hr />
                </div>
                <div className="manifest">
                    <table className='table table-hover table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Date</th>
                                <th>Warehouse</th>
                                <th>Freight Provider</th>
                                <th>Vehicle Info</th>
                                <th>Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportList}
                        </tbody>
                    </table>
                </div>

                <ToastContainer />
            </LoadingOverlay>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (token) => dispatch(getUser(token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManifestReport);
