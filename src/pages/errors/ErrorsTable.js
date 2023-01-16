import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Libs
import axios from 'axios';
import moment from 'moment-timezone';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Constants
import { API_HOST, HTTP_PROTOCOL } from '../../config';
import { getUser } from '../../state/services/authService';
import { Pagination, PaginationItem, PaginationLink,  } from 'reactstrap';

class ErrorsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingDownload: false,
            loading: true,
            errorList: [],
            currentPage: 1,
            status: 'all',
            allPageCount: 0,
        };
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        onChangeReportType: PropTypes.func.isRequired,
        getUser: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const token = localStorage.getItem('token');

        if (isLoggedIn && token && token.length > 0)
            this.props.getUser(token);

        this.getBookingErrors();

    }

    UNSAFE_componentWillReceiveProps() {
        
    }

    notify = (text) => toast(text);

    getBookingErrors = () => {
        const {currentPage, status} = this.state;
        this.setState({loading: true});
        const token = localStorage.getItem('token');
        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/prebooking_errors/',
            headers: { 'Authorization': 'JWT ' + token },
            data: {
                currentPage,
                status,
            },
        };
        axios(options)
            .then((response) => {                
                this.setState({ loading: false, errorList: response.data.errors, allPageCount: response.data.allPageCount });
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    }

    updateBookingErrors = (e, pk_booking_id) => {
        this.setState({loading: true});
        const token = localStorage.getItem('token');
        const options = {
            method: 'put',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/prebooking_errors/',
            headers: { 'Authorization': 'JWT ' + token },
            data: {
                pk_booking_id,
                status: e.target.value,
            },
        };
        axios(options)
            .then(() => {                
                this.setState({ loading: false });
                this.getBookingErrors();                
            })
            .catch(() => {
                this.setState({ loading: false });
                this.getBookingErrors();                
            });
    }

    onClickCopy(report) {
        navigator.clipboard.writeText(report['b_bookingID_Visuals']);
        this.notify('Booking IDs are copied on clipboard');
    }

    onClickViewOnAllBookingsTab(report) {
        // Open new tab with bookings in report
        localStorage.setItem('report:b_bookingID_Visuals', report['b_bookingID_Visuals'].join(', '));
        window.open('/allbookings', '_blank');
    }

    onChangeFilterType = (e) => {
        this.setState({status: e.target.value, currentPage: 1}, this.getBookingErrors);
    }

    onChangeFilterType = (e) => {
        this.setState({status: e.target.value, currentPage: 1}, this.getBookingErrors);
    }

    onFind = (errors) => {
        const {status} = this.state;
        if (errors) {
            const reportList = errors.map((error, index) => {
                return (
                    <tr key={index}>
                        <td>{error.id}</td>
                        <td>
                            <Link to={`/booking?bookingId=${error.booking_number}`}>
                                {error.booking_number}
                            </Link>
                        </td>
                        <td>{error.invoice_number}</td>                        
                        <td>{error.error}</td>                        
                        <td>{moment(error.created_at).format('DD MMM YYYY')}</td>
                        <td>{error.resolved_timestamp && moment(error.resolved_timestamp).format('DD MMM YYYY')}</td>
                        <td style={{color: error.status === 'closed' ? 'green' : 'red'}}>{
                            error.status == 'open' ? (
                                <select value={status ? status : ''} onChange={e=>this.updateBookingErrors(e, error.pk_booking_id)} >
                                    <option value="open">Open</option>
                                    <option value="closed" style={{color: 'green'}}>Closed</option>                            
                                </select>
                            ) : error.status
                        }</td>
                        <td>{error.resolved_by}</td>                        
                    </tr>
                );
            });
            return reportList;
        }

    }

    onClickPaginationItem(page) {
        this.setState({currentPage: page}, this.getBookingErrors);
    }

    pagination(currentPage, allPageCount) {
        let paginationItems = [];
        for(let i = 1; i <= allPageCount; i++) {
            paginationItems.push(
                <PaginationItem key={i}>
                    <PaginationLink 
                        href='javscript: void(0)' 
                        onClick={() => this.onClickPaginationItem(i)}
                        className={i === currentPage ? 'current' : null}                        
                    >
                        <span style={{color: i === currentPage ? 'white' : null}}>
                            {i} 
                        </span>
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return (
            <Pagination size='md' aria-label='Page navigation example' className='d-flex justify-content-center'>
                <PaginationItem>
                    <PaginationLink 
                        href='javscript: void(0)' 
                        onClick={() => currentPage !== 1 && this.onClickPaginationItem(1)}
                        className={currentPage === 1 ? 'disabled' : null}
                    >
                        &lt;&lt;
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        href='javscript: void(0)' 
                        onClick={() => currentPage !== 1 && this.onClickPaginationItem(currentPage - 1)}
                        className={currentPage === 1 ? 'disabled' : null}
                    >
                        &lt;
                    </PaginationLink>
                </PaginationItem>
                {paginationItems}
                <PaginationItem>
                    <PaginationLink
                        href='javscript: void(0)' 
                        onClick={() => currentPage !== allPageCount && this.onClickPaginationItem(currentPage + 1)}
                        className={currentPage === allPageCount ? 'disabled' : null}
                    >
                        &gt;
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink 
                        href='javscript: void(0)' 
                        onClick={() => currentPage !== allPageCount && this.onClickPaginationItem(allPageCount - 1)}
                        className={currentPage === allPageCount ? 'disabled' : null}
                    >
                        &gt;&gt;
                    </PaginationLink>
                </PaginationItem>
            </Pagination>
        );
    }

    render() {
        const { loading, errorList, status, allPageCount, currentPage } = this.state;
        const reportList = errorList? this.onFind(errorList) : '';
        return (
            <LoadingOverlay
                active={loading}
                spinner
                text='Loading...'
            >
                <div>
                    <label className='inline-radios'>
                        Auto Select type:
                        <input type="radio"
                            id="auto-select-all"
                            checked={status === 'all'}
                            value="all"
                            onChange={this.onChangeFilterType}
                        />
                        <label htmlFor="auto-select-all">All</label>
                        <input type="radio"
                            id="auto-select-open"
                            checked={status === 'open'}
                            value="open"
                            onChange={this.onChangeFilterType}
                        />
                        <label htmlFor="auto-select-open">Open</label><input type="radio"
                            id="auto-select-closed"
                            checked={status === 'closed'}
                            value="closed"
                            onChange={this.onChangeFilterType}
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
                                <th>Booking Number</th>
                                <th>Invoice Number</th>
                                <th>Error</th>
                                <th>Created At</th>
                                <th>Resolved At</th>
                                <th>Status</th>
                                <th>Resolved By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportList}
                        </tbody>
                    </table>
                    {allPageCount ? this.pagination(currentPage, allPageCount) : ''}
                </div>

                <ToastContainer />
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        clientname: state.auth.clientname,
        clients: state.booking.report_clients,
        allFPs: state.booking.report_fps,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (token) => dispatch(getUser(token)),        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorsTable);
