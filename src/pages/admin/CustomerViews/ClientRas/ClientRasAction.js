import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getSqlQueryDetails, updateSqlQueryDetails, validateSqlQueryDetails, runUpdateSqlQueryDetails, createSqlQueryDetails } from '../../../../state/services/sqlQueryService';
import { getClientRas, updateClientRas, createClientRas } from '../../../../state/services/clientRasService';
import { ToastContainer, toast } from 'react-toastify';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app');

class ClientRasAction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            sqlQueryDetails: { sql_title: '', sql_query: '', sql_description: '', sql_notes: '' },
            id: 0,
            sql_title: '',
            sql_query: '',
            sql_description: '',
            sql_notes: '',
            loading: false,
            queryResult: [],
            validSqlQueryDetails: false,
            rerunValidateSqlQueryDetails: false,
            updateQueries: [],
            queryTables: [],
            clientRasDetails: {}
        };
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        match: PropTypes.object.isRequired,
        getSqlQueryDetails: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        validateSqlQueryDetails: PropTypes.func.isRequired,
        updateSqlQueryDetails: PropTypes.func.isRequired,
        createSqlQueryDetails: PropTypes.func.isRequired,
        runUpdateSqlQueryDetails: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        
        clientRasDetails: PropTypes.object.isRequired,
        createClientRas: PropTypes.func.isRequired,
        updateClientRas: PropTypes.func.isRequired,
        getClientRas: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const action = this.getParamAction();

        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (action === 'edit' || action === 'duplicate') {
            const id = this.props.match.params.id;
            this.props.getClientRas(id);
        }   
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, clientRasDetails, sqlQueryDetails, sql_title, sql_query, sql_description, sql_notes, validSqlQueryDetails, queryResult, queryTables, rerunValidateSqlQueryDetails, errorMessage, needUpdateClientRas } = newProps;

        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        this.setState({ validSqlQueryDetails, rerunValidateSqlQueryDetails });

        if (queryResult) {
            this.setState({ queryResult, queryTables });
        }

        console.log('needUpdateClientRas', needUpdateClientRas);

        if (clientRasDetails ) {
            this.setState({clientRasDetails });
        }

        if (sqlQueryDetails && !queryResult) {
            const { sql_title,  sql_query, sql_description, sql_notes } = sqlQueryDetails;
            this.setState({ sqlQueryDetails });
            this.setState({ id: sqlQueryDetails.id });
            this.setState({ sql_title, sql_query, sql_description, sql_notes });
        }
        if (rerunValidateSqlQueryDetails) {
            this.props.validateSqlQueryDetails({ sql_title: sql_title, sql_query: sql_query, sql_description: sql_description, sql_notes: sql_notes });
        }

        if (errorMessage) {
            this.notify(errorMessage);
        }

        if (this.state.loading && !errorMessage) {
            this.setState({ loading: false });
            this.props.history.push('/customerdashboard/client-ras');
        }

        if (needUpdateClientRas) {
            this.setState({ loading: false });
            this.props.history.push('/customerdashboard/client-ras');
        }
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    exportCSV() {
        var rows = [];

        const { queryResult } = this.state;

        if(queryResult && typeof queryResult != 'string' && queryResult.length>0){
            let headers = [];
            Object.keys(queryResult[0]).map((row, index) => {
                headers.push(row);
                console.log(index);
            });

            rows.push(headers);
            for( const query of queryResult) {
                let data = [];
                Object.keys(query).map((row1, index1) => {
                    data.push(query[row1]);
                    console.log(index1);
                });

                rows.push(data);
            }
        }

        var csvContent = 'data:text/csv;charset=utf-8,';
        rows.forEach(function(rowArray) {
            var row = rowArray.join(',');
            csvContent += row + '\r\n';
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'download.csv');
        document.body.appendChild(link); // Required for FF
        link.click();

    }

    onInputChange(event) {
        const {clientRasDetails } = this.state;
        clientRasDetails[event.target.name] = event.target.value;
        console.log(event.target.name, clientRasDetails);
        this.setState({clientRasDetails});
    }

    getParamAction() {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const action = params.get('action');
        return action;
    }

    onSubmit(event) {
        const action = this.getParamAction();

        this.setState({ loading: true });
        const { clientRasDetails } = this.state;
        switch(action) {
            case 'add':
                this.props.createClientRas(clientRasDetails);
                break;
            case 'duplicate':
                delete clientRasDetails.id;
                this.props.createClientRas(clientRasDetails);
                break;  
            case 'edit':
                this.props.updateClientRas(clientRasDetails);
                break;
        }

        this.setState({ loading: false });
        event.preventDefault();
    }

    notify = (text) => {
        toast(text);
    };

    toCamelCase = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        const { sql_title, loading, updateQueries,clientRasDetails } = this.state;
        const action = this.getParamAction();

        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >

                    <h2 ref={subtitle => this.subtitle = subtitle}>Review the SQL Script to be Applied on the Database. </h2>
                    <p>Please review the SQL Script to be Applied on the Database.</p>
                    <p>Note that once applied, these statements may not be revertible without losing some of the data.</p>
                    <form>
                        <div className="form-group">
                            <textarea readOnly name="client_ras" value={updateQueries} type="text" className="form-control" id="client_ras" placeholder="Enter Client Ras"></textarea>
                        </div>
                    </form>
                </Modal>
                <div className="pageheader">
                    <h1>{this.toCamelCase(action)} Client Ras</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li><a href="/admin/sqlqueries"> Client Ras</a></li>
                            <li className="active">{this.toCamelCase(action)}</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <LoadingOverlay
                        active={loading}
                        spinner
                        text='Loading...'
                    />

                    <div className="row">
                        <div className="col-md-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">{this.toCamelCase(action)}  Client Ras <b>{sql_title}</b></h3>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => this.onSubmit(e)} role="form">
                                        <div className="form-group required">
                                            <label className="control-label" htmlFor="ra_number">RA Number</label>
                                            <input name="ra_number" type="text" className="form-control" id="ra_number" placeholder="Enter Title" value={clientRasDetails['ra_number'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label" htmlFor="name_first">First Name</label>
                                            <input name="name_first" type="text" className="form-control" id="name_first" placeholder="Enter FirstName" value={clientRasDetails['name_first'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label" htmlFor="name_surname">Sir Name</label>
                                            <input name="name_surname" type="text" className="form-control" id="name_surname" placeholder="Enter FirstName" value={clientRasDetails['name_surname'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label" htmlFor="phone_mobile">Mobile Phone</label>
                                            <input name="phone_mobile" type="text" className="form-control" id="phone_mobile" placeholder="Enter Mobile Phone" value={clientRasDetails['phone_mobile'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="control-label" htmlFor="address1">Address1</label>
                                            <input name="address1" type="text" className="form-control" id="address1" placeholder="Enter Address1" value={clientRasDetails['address1'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label" htmlFor="address2">Address2</label>
                                            <input name="address2" type="text" className="form-control" id="address2" placeholder="Enter Address2" value={clientRasDetails['address2'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label" htmlFor="suburb">Suburb</label>
                                            <input name="suburb" type="text" className="form-control" id="address2" placeholder="Enter Suburb" value={clientRasDetails['suburb'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="control-label" htmlFor="postal_code">Postal Code</label>
                                            <input name="postal_code" type="text" className="form-control" id="postal_code" placeholder="Enter Postal Code" value={clientRasDetails['postal_code'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label" htmlFor="state">State</label>
                                            <input name="state" type="text" className="form-control" id="state" placeholder="Enter State" value={clientRasDetails['state'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label" htmlFor="country">Country</label>
                                            <input name="country" type="text" className="form-control" id="country" placeholder="Enter Country" value={clientRasDetails['country'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label" htmlFor="item_model_num">Item Model Num</label>
                                            <input name="item_model_num"type="text" className="form-control" id="item_model_num" placeholder="Enter State" value={clientRasDetails['item_model_num'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label" htmlFor="description">Description</label>
                                            <input name="description" type="text" className="form-control" id="description" placeholder="Enter Description" value={clientRasDetails['description'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="control-label" htmlFor="serial_number">Serial Number</label>
                                            <input name="serial_number"type="text" className="form-control" id="serial_number" placeholder="Enter Serial Number" value={clientRasDetails['serial_number'] || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                         

                                        <button disabled={loading} type="submit" className="btn btn-primary">Save</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <ToastContainer/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        sql_title: state.sqlQuery.sql_title,
        sql_query: state.sqlQuery.sql_query,
        sql_description: state.sqlQuery.sql_description,
        sql_notes: state.sqlQuery.sql_notes,
        sqlQueryDetails: state.sqlQuery.sqlQueryDetails,
        username: state.auth.username,
        queryResult: state.sqlQuery.queryResult,
        queryTables: state.sqlQuery.queryTables,
        errorMessage: state.sqlQuery.errorMessage,
        validSqlQueryDetails: state.sqlQuery.validSqlQueryDetails,
        urlAdminHome: state.url.urlAdminHome,
        needUpdateSqlQueries: state.sqlQuery.needUpdateSqlQueries,
        rerunValidateSqlQueryDetails: state.sqlQuery.rerunValidateSqlQueryDetails,
        clientRasDetails: state.clientRas.clientRasDetails,
        needUpdateClientRas: state.clientRas.needUpdateClientRas,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getSqlQueryDetails: (fp_id) => dispatch(getSqlQueryDetails(fp_id)),
        createSqlQueryDetails: (data) => dispatch(createSqlQueryDetails(data)),
        updateSqlQueryDetails: (emailTemplateDetails) => dispatch(updateSqlQueryDetails(emailTemplateDetails)),
        validateSqlQueryDetails: (data) => dispatch(validateSqlQueryDetails(data)),
        runUpdateSqlQueryDetails: (data) => dispatch(runUpdateSqlQueryDetails(data)),

        getClientRas: (id) => dispatch(getClientRas(id)),
        createClientRas: (data) => dispatch(createClientRas(data)),
        updateClientRas: (data) => dispatch(updateClientRas(data)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClientRasAction));
