import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

import { verifyToken, cleanRedirectState } from '../../../../state/services/adminAuthService';
import { getSqlQueryDetails, updateSqlQueryDetails, validateSqlQueryDetails, runUpdateSqlQueryDetails } from '../../../../state/services/sqlQueryService';

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

class EditSqlQueries extends Component {
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
            queryTables: []
        };
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        getSqlQueryDetails: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        validateSqlQueryDetails: PropTypes.func.isRequired,
        updateSqlQueryDetails: PropTypes.func.isRequired,
        runUpdateSqlQueryDetails: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        const token = localStorage.getItem('admin_token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isAdminLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        this.props.getSqlQueryDetails(id);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, sqlQueryDetails, sql_title, sql_query, sql_description, sql_notes, validSqlQueryDetails, queryResult, queryTables, rerunValidateSqlQueryDetails } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isAdminLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        this.setState({ validSqlQueryDetails, rerunValidateSqlQueryDetails });

        if (queryResult) {
            this.setState({ queryResult, queryTables });
        }

        if (sqlQueryDetails && !queryResult) {
            const { sql_title,  sql_query, sql_description, sql_notes } = sql_description;
            this.setState({ sqlQueryDetails });
            this.setState({ id: sqlQueryDetails.id });
            this.setState({ sql_title, sql_query, sql_description, sql_notes });
        }
        if (rerunValidateSqlQueryDetails) {
            this.props.validateSqlQueryDetails({ sql_title: sql_title, sql_query: sql_query, sql_description: sql_description, sql_notes: sql_notes });
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

    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        this.setState({ loading: true });
        const { id, sql_title, sql_query, sql_description, sql_notes, username } = this.state;
        let data = { id: id, sql_title: sql_title, sql_query: sql_query, sql_description: sql_description, sql_notes: sql_notes, z_createdByAccount: username };
        this.props.updateSqlQueryDetails(data);
        this.setState({ loading: false });
        this.props.history.push('/admin/sqlqueries');
        event.preventDefault();
    }

    onValidate(event) {
        this.setState({ loading: true });
        const { sql_title, sql_query, sql_description, sql_notes } = this.state;
        this.props.validateSqlQueryDetails({ sql_title: sql_title, sql_query: sql_query, sql_description: sql_description, sql_notes: sql_notes });
        this.setState({ loading: false });
        event.preventDefault();
    }

    onUpdate(event) {
        this.setState({ loading: true });
        const { sql_title, sql_query, sql_description, sql_notes, updateQueries } = this.state;
        let i = 0;
        updateQueries.forEach((query) => {
            this.props.runUpdateSqlQueryDetails({ sql_title: sql_title, sql_query: query, sql_description: sql_description, sql_notes: sql_notes });
            i++;
        });
        if (i == updateQueries.length) {
            this.props.validateSqlQueryDetails({ sql_title: sql_title, sql_query: sql_query, sql_description: sql_description, sql_notes: sql_notes });
        }
        this.setState({ loading: false, modalIsOpen: false, updateQueries: [] });
        //this.props.history.push('/admin/sqlqueries');
        event.preventDefault();
    }

    handleTableChange = (type, { data, cellEdit: { rowId, dataField, newValue } }) => {
        setTimeout(() => {
            this.state.updateQueries.push('UPDATE ' + this.state.queryTables[0] + ' SET ' + dataField + ' = "' + newValue + '" WHERE ' + this.state.queryTables[4] + ' = ' + rowId);
            const result = data.map((row) => {
                if (row[this.state.queryTables[4]] === rowId) {
                    const newRow = { ...row };
                    newRow[dataField] = newValue;
                    return newRow;
                }
                return row;
            });
            this.setState(() => ({
                queryResult: result,
                errorMessage: null
            }));

        }, 2000);
    }

    render() {
        const { sql_title, sql_query, sql_description, sql_notes, validSqlQueryDetails, queryResult, loading, updateQueries, queryTables } = this.state;

        const cellEdit = cellEditFactory({
            mode: 'dbclick',
            blurToSave: true
        });

        let tableColumns = [];

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
                            <textarea readOnly name="sql_query" value={updateQueries} type="text" className="form-control" id="sql_query" placeholder="Enter Query"></textarea>
                        </div>
                    </form>
                    <button type="button" onClick={(e) => this.onUpdate(e)} disabled={updateQueries.length === 0} className="btn btn-success pull-right">Apply</button>&nbsp;&nbsp;<button type="button" onClick={this.closeModal} className="btn btn-primary pull-right">Cancel</button>&nbsp;&nbsp;
                </Modal>
                <div className="pageheader">
                    <h1>Edit SQL Query</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a>
                            </li>
                            <li><a href="/sqlqueries">SQL Queries</a></li>
                            <li className="active">Edit</li>
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
                                    <h3 className="panel-title">Edit SQL Query <b>{sql_title}</b></h3>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => this.onSubmit(e)} role="form">
                                        <div className="form-group required">
                                            <label className="control-label" htmlFor="sql_title">Title</label>
                                            <input name="sql_title" required="required" type="text" className="form-control" id="sql_title" placeholder="Enter Title" value={sql_title || ''} onChange={(e) => this.onInputChange(e)} />
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label" htmlFor="sql_description">Description</label>
                                            <textarea name="sql_description" type="text" className="form-control" id="sql_description" placeholder="Enter Title" onChange={(e) => this.onInputChange(e)} value={sql_description || ''} >{sql_description}</textarea>
                                        </div>

                                        <div className="form-group required">
                                            <label className="control-label" htmlFor="sql_query">SQL Query</label>
                                            <textarea name="sql_query" required="required" type="text" className="form-control" id="sql_query" placeholder="Enter Query" onChange={(e) => { this.setState({ validSqlQueryDetails: false }); this.onInputChange(e); }} value={sql_query || ''}>{sql_query}</textarea>
                                            <button style={{ float: 'right' }} type="button" disabled={sql_query === '' || loading} onClick={(e) => this.onValidate(e)} className="btn btn-info">Run</button>
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label" htmlFor="sql_notes">Notes</label>
                                            <textarea name="sql_notes" type="text" className="form-control" id="sql_notes" placeholder="Enter Notes" onChange={(e) => this.onInputChange(e)} value={sql_notes || ''} >{sql_notes}</textarea>
                                        </div>
                                        <button disabled={sql_title === '' || !validSqlQueryDetails || loading} type="submit" className="btn btn-primary">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Query Result</h3>
                                    <div className="actions pull-right">
                                        <button type="button" disabled={updateQueries.length === 0} onClick={(e) => { this.onValidate(e); this.setState({ updateQueries: [] }); }} className="btn btn-primary">Discard</button>&nbsp;&nbsp;<button type="button" disabled={updateQueries.length === 0} onClick={this.openModal} className="btn btn-success">Apply</button>
                                    </div>
                                </div>
                                <div className="panel-body" style={{ maxHeight: '452px', overflowY: 'auto' }}>
                                    {queryResult && queryResult.length > 0 && queryTables && queryTables.length > 0 ? (
                                        <BootstrapTable
                                            remote={{ cellEdit: true }}
                                            keyField={queryTables[4]}
                                            data={queryResult}
                                            columns={tableColumns}
                                            cellEdit={cellEdit}
                                            onTableChange={this.handleTableChange}
                                        />
                                    ) : ( <code>Make changes in query and click on run button to get result.</code> )}
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
        redirect: state.adminAuth.redirect,
        sqlQueryDetails: state.sqlQuery.sqlQueryDetails,
        username: state.adminAuth.username,
        queryResult: state.sqlQuery.queryResult,
        queryTables: state.sqlQuery.queryTables,
        validSqlQueryDetails: state.sqlQuery.validSqlQueryDetails,
        rerunValidateSqlQueryDetails: state.sqlQuery.rerunValidateSqlQueryDetails
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getSqlQueryDetails: (fp_id) => dispatch(getSqlQueryDetails(fp_id)),
        updateSqlQueryDetails: (emailTemplateDetails) => dispatch(updateSqlQueryDetails(emailTemplateDetails)),
        validateSqlQueryDetails: (data) => dispatch(validateSqlQueryDetails(data)),
        runUpdateSqlQueryDetails: (data) => dispatch(runUpdateSqlQueryDetails(data)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditSqlQueries));
