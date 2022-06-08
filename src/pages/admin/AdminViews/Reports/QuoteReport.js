import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import Select from 'react-dropdown-select';
import DatePicker from 'react-datepicker';
import LoadingOverlay from 'react-loading-overlay';
import axios from 'axios';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { HTTP_PROTOCOL, API_HOST } from '../../../../config';
import { verifyToken, cleanRedirectState, getDMEClients } from '../../../../state/services/authService';

class QuoteReport extends Component {
    constructor(props) {
        super(props);
        const now = new Date();
        const backDate = new Date(now.setDate(now.getDate() - 30));
        this.state = {
            id: 0,
            loading: false,
            clients: [],
            kfClientIds: [],
            multi: true,
            separator: true,
            startDate: backDate,
            endDate: new Date(),
            clientOpts: [],
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        match: PropTypes.object.isRequired,
        clients: PropTypes.array.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        getClients: PropTypes.func.isRequired,
    }

    componentDidMount() {

        // const token = localStorage.getItem('token');

        // if (token && token.length > 0) {
        //     this.props.verifyToken();
        // } else {
        //     localStorage.setItem('isLoggedIn', 'false');
        //     this.props.cleanRedirectState();
        //     this.props.history.push('/admin');
        // }

        this.props.getClients();
        this.setState({loading: true});
        Modal.setAppElement(this.el);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, clients } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (clients && clients.length) {
            const clientOpts = clients.map((client) => {
                return { label: client.company_name, value: client.dme_account_num};
            });
            this.setState({clientOpts, loading: false});
        }
    }

    notify = (text) => toast(text);

    onInputChange(event) {
        const { fpDetails } = this.state;
        if (event.target.name == 'fp_company_name') {
            this.setState({ fpDetails: { fp_company_name: event.target.value, id: fpDetails.id, fp_address_country: fpDetails.fp_address_country } });
        }
    }

    onMultiSelect(clients) {
        const kfClientIds = clients.map((client) => client.value);
        this.setState({kfClientIds});
    }

    onSubmit(event) {
        event.preventDefault();
        this.setState({ loading: true });
        this.setState({ loading: false });
        this.props.history.push('/admin/reports');
    }

    onClickDownload(e) {
        e.preventDefault();
        let {startDate, endDate, kfClientIds } = this.state;

        if (moment(endDate).diff(moment(startDate), 'days') > 100) {
            this.notify('You selected 3+ months range, it can take 5 mins to build report.');
        }

        const token = localStorage.getItem('token');
        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
            headers: {'Authorization': 'JWT ' + token},
            data: {
                kfClientIds,
                startDate: moment(startDate).format('YYYY-MM-DD'),
                endDate: moment(endDate).format('YYYY-MM-DD'),
                downloadOption: 'quote-report'
            },
            responseType: 'blob', // important
        };

        axios(options).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Quote_Report_' + moment().utc().format('YYYY-MM-DD_HH:mm') + '.zip');
            document.body.appendChild(link);
            link.click();
        });
    }

    render() {
        const { clientOpts } = this.state;

        return (
            <div>
                <ToastContainer />

                <div className="pageheader">
                    <h1>Quote Report</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li><a href="/admin/providers">Reports</a></li>
                            <li className="active">Quote</li>
                        </ol>
                    </div>
                </div>
                <LoadingOverlay
                    active={this.state.loading}
                    spinner
                    text='Loading...'
                />
                <section id="main-content" className="animated fadeInUp">
                    <div className="row">
                        <div className="col-md-12 col-12">
                            <div className="card panel-default">
                                <div className="card-header">
                                    <h3 className="panel-title">Quote Report</h3>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={(e) => this.onClickDownload(e)} role="form">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Clients: </label>
                                            <Select 
                                                options={clientOpts}
                                                onChange={(clients) => this.onMultiSelect(clients)}
                                                multi={true}
                                                separator={true}
                                                clearable={true}
                                            />
                                            <span>* If none is selected, it will get report for all clients.</span>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword1">Start Date: </label>
                                            <div>
                                                <DatePicker
                                                    className="date-picker"
                                                    selected={this.state.startDate}
                                                    onSelect={(date) => this.setState({startDate: date})}
                                                    onChange={(date) => this.setState({startDate: date})}
                                                    dateFormat="dd MMM yyyy"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword1">End Date: </label>
                                            <div>
                                                <DatePicker
                                                    className="date-picker"
                                                    selected={this.state.endDate}
                                                    onSelect={(date) => this.setState({endDate: date})}
                                                    onChange={(date) => this.setState({endDate: date})}
                                                    dateFormat="dd MMM yyyy"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group mt-2">
                                            <button type="submit" className="btn btn-primary">Download</button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        urlAdminHome: state.url.urlAdminHome,
        clients: state.auth.dmeClients,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getClients: () => dispatch(getDMEClients())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(QuoteReport));
