import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Libs
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUser } from '../../state/services/authService';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { API_HOST, HTTP_PROTOCOL } from '../../config';

class ManifestReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingDownload: false,
            loading: true,
            errorList: [],
            allPageCount: 0,
            currentPage: 0,
            selectedStatus: 'all',
        };
    }

    static propTypes = {
        history: PropTypes.object.isRequired,
        getUser: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const token = localStorage.getItem('token');

        if (isLoggedIn && token && token.length > 0)
            this.props.getUser(token);

        this.getBookingErrors();

    }

    getBookingErrors = () => {
        const { selectedStatus, currentPage} = this.state;
        const token = localStorage.getItem('token');
        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/prebooking_errors/',
            headers: { 'Authorization': 'JWT ' + token },
            data: {
                currentPage,
                status: selectedStatus,
            },
        };
        this.setState({loading: true});
        axios(options)
            .then((response) => {                
                this.setState({ loading: false, errorList: response.data.errors, allPageCount: response.data.allPageCount });
            })
            .catch(() => {
                toast('Error');
                this.setState({ loading: false });
            });
    }

    onChangeStatus = (e, pk_booking_id) => {
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
        this.setState({loading: true});
        axios(options)
            .then(() => {                
                this.getBookingErrors();
            })
            .catch(() => {
                toast('Error');
                this.setState({ loading: false });
            });
    }

    onClickRadio = (val) => {
        this.setState({selectedStatus: val});
    }

    onClickPaginationItem(page) {
        this.setState({currentPage: page}, this.getBookingErrors);
    }

    pagination(currentPage, allPageCount) {
        let paginationItems = [];
        for(let i = 0; i < allPageCount; i++) {
            paginationItems.push(
                <PaginationItem key={i+1}>
                    <PaginationLink 
                        href='javscript: void(0)' 
                        onClick={() => this.onClickPaginationItem(i)}
                        className={i === currentPage ? 'current' : null}
                        style={{color: i === currentPage ? '#fff !important': '#048fc2'}}
                    >
                        {i + 1}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return (
            <Pagination size='md' aria-label='Page navigation example' className='d-flex justify-content-center'>
                <PaginationItem>
                    <PaginationLink 
                        href='javscript: void(0)' 
                        onClick={() => currentPage !== 0 && this.onClickPaginationItem(0)}
                        className={currentPage === 0 ? 'disabled' : null}
                    >
                        &lt;&lt;
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        href='javscript: void(0)' 
                        onClick={() => currentPage !== 0 && this.onClickPaginationItem(currentPage - 1)}
                        className={currentPage === 0 ? 'disabled' : null}
                    >
                        &lt;
                    </PaginationLink>
                </PaginationItem>
                {paginationItems}
                <PaginationItem>
                    <PaginationLink
                        href='javscript: void(0)' 
                        onClick={() => currentPage !== allPageCount - 1 && this.onClickPaginationItem(currentPage + 1)}
                        className={currentPage === allPageCount - 1 ? 'disabled' : null}
                    >
                        &gt;
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink 
                        href='javscript: void(0)' 
                        onClick={() => currentPage !== allPageCount - 1 && this.onClickPaginationItem(allPageCount - 1)}
                        className={currentPage === allPageCount - 1 ? 'disabled' : null}
                    >
                        &gt;&gt;
                    </PaginationLink>
                </PaginationItem>
            </Pagination>
        );
    }

    render() {
        const { loading, errorList, selectedStatus, allPageCount, currentPage } = this.state;
        let temp = errorList ? errorList.map((error, index) =>
            (
                <tr key={index}>
                    <td>{error.id}</td>
                    <td>{error.booking_number}</td>
                    <td>{error.error}</td>
                    <td>{error.invoice_number}</td>
                    <td>{error.created_at ? moment(error.created_at).format('DD/MM/YYYY HH:mm') : ''}</td>
                    <td>{error.resolved_timestamp ? moment(error.resolved_timestamp).format('DD/MM/YYYY HH:mm') : ''}</td>
                    <td style={{color: 'green'}}>{
                        error.status == 'closed' ? error.status : (
                            <select defaultValue={error.status} onChange={(e) => this.onChangeStatus(e, error.pk_booking_id)} style={{color: 'red'}}>
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        )
                    }</td>
                    <td>{error.resolved_by}</td>
                </tr>
            )) : [];
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
                <div className="">
                    <table className='table table-hover table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Booking Number</th>
                                <th>Error</th>
                                <th>Invoice Number</th>
                                <th>Created At</th>
                                <th>Resolved At</th>
                                <th>Status</th>
                                <th>Resolved By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {temp}
                        </tbody>
                    </table>
                </div>
                {allPageCount ? this.pagination(currentPage, allPageCount) : ''}

                <ToastContainer />
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        clientname: state.auth.clientname,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (token) => dispatch(getUser(token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManifestReport);
