import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import LoadingOverlay from 'react-loading-overlay';
import { confirmAlert } from 'react-confirm-alert';
import { getAllFPs, getFpStatuses, createFpStatus, updateFpStatus, deleteFpStatus } from '../../../../state/services/fpService';
import { getAllBookingStatus } from '../../../../state/services/extraService';
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';

class StatusMapping extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rowIndexToEdit: -1,
            mode: 'view',
            fpName: '',
            fpStatuses: []
        };
    }

    static propTypes = {
        allFPs: PropTypes.array.isRequired,
        getAllFPs: PropTypes.func.isRequired,
        dmeStatuses: PropTypes.array.isRequired,
        fpStatuses: PropTypes.array.isRequired,
        username: PropTypes.string.isRequired,
        getDmeStatuses: PropTypes.func.isRequired,
        getFpStatuses: PropTypes.func.isRequired,
        createFpStatus: PropTypes.func.isRequired,
        updateFpStatus: PropTypes.func.isRequired,
        deleteFpStatus: PropTypes.func.isRequired,
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

        this.props.getAllFPs();
        this.props.getDmeStatuses();
        this.props.getFpStatuses(this.state.fpName);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, fpStatuses } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
        if (fpStatuses) {
            this.setState({ fpStatuses });
        }
    }

    onDelete(id) {
        confirmAlert({
            title: 'Confirm to delete Freight Provider',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.props.deleteFpStatus(id)
                },
                {
                    label: 'No',
                    onClick: () => console.log('Click No')
                }
            ]
        });
    }

    onCancel() {
        this.setState({mode: 'view'});
    }

    onAdd() {
        this.setState({mode: 'add'});
    }

    onEdit(index) {
        this.setState({mode: 'edit', rowIndexToEdit: index});
    }

    onSelectFp(value) {
        this.setState({fpName: value});
        this.props.getFpStatuses(value);
    }

    render() {
        var self = this;
        const { fpName, fpStatuses, rowIndexToEdit, mode } = this.state;
        const { username, allFPs, dmeStatuses, createFpStatus, updateFpStatus } = this.props;

        const RowToAdd = () => {
            let row = {
                dme_status: 'Entered'
            };
            const onChange = (e) => {
                row[e.target.name] = e.target.value;
            };
            const onSave = () => {
                createFpStatus({
                    ...row,
                    z_createdByAccount: username,
                    fp_name: fpName
                });
                self.setState({mode: 'view'});
            };
            return (
                <tr key='add'>
                    <td></td>
                    <td><input name="fp_original_status" onChange={onChange} style={{width: '100%'}} /></td>
                    <td><input name="fp_lookup_status" onChange={onChange} style={{width: '100%'}} /></td>
                    <td>
                        <select name="dme_status" defaultValue="Entered" onChange={onChange}>
                            {dmeStatuses.map((itm, index) => (
                                <option key={index} value={itm}>
                                    {itm}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <a onClick={() => onSave()} className="btn btn-info btn-sm" href="javascript:void(0)">Save</a>&nbsp;&nbsp;
                        <a onClick={() => self.onCancel()} className="btn btn-info btn-sm" href="javascript:void(0)">Cancel</a>&nbsp;&nbsp;
                    </td>
                </tr>
            );
        }; 

        const list = fpStatuses.map((item, index) => {
            if (rowIndexToEdit === index && mode === 'edit') {
                let row = {};
                const onChange = (e) => {
                    row[e.target.name] = e.target.value;
                };
                const onSave = () => {
                    updateFpStatus({
                        id: item.id,
                        data: {
                            ...row,
                            z_modifiedByAccount: username,
                        }
                    });
                    self.setState({mode: 'view'});
                };
                return (
                    <tr key={index}>
                        <td>{item.id}</td>
                        <td><input name="fp_origianl_status" onChange={onChange} style={{width: '100%'}} defaultValue={item.fp_original_status} /></td>
                        <td><input name="fp_lookup_status" onChange={onChange} style={{width: '100%'}} defaultValue={item.fp_lookup_status} /></td>
                        <td>
                            <select name="dme_status" onChange={onChange} defaultValue={item.dme_status}>
                                {dmeStatuses.map((itm, index) => (
                                    <option key={index} value={itm}>
                                        {itm}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <a onClick={() => onSave()} className="btn btn-info btn-sm" href="javascript:void(0)">Save</a>&nbsp;&nbsp;
                            <a onClick={() => self.onCancel()} className="btn btn-info btn-sm" href="javascript:void(0)">Cancel</a>&nbsp;&nbsp;
                        </td>
                    </tr>
                );
            } else {
                return (
                    <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.fp_original_status}</td>
                        <td>{item.fp_lookup_status}</td>
                        <td>{item.dme_status}</td>
                        <td>
                            <a onClick={() => self.onEdit(index)} className="btn btn-info btn-sm" href="javascript:void(0)">Edit</a>&nbsp;&nbsp;
                            <a onClick={() => self.onDelete(item.id)} className="btn btn-danger btn-sm" href="javascript:void(0)">Delete</a>
                        </td>
                    </tr>
                );
            }
        });

        return (
            <div>
                <div className="pageheader">
                    <h1>Freight Provider Status Mapping</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li className="active">Freight Providers</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <LoadingOverlay
                        active={isEmpty(allFPs) && isEmpty(dmeStatuses) && isEmpty(fpStatuses)}
                        spinner
                        text='Loading...'
                    />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="panel panel-default">
                                <div className="panel-heading d-flex align-items-center">
                                    <h3 className="panel-title">Select Freight Provider</h3>&nbsp;&nbsp;
                                    <select onChange={(e) => self.onSelectFp(e.target.value)}>
                                        {allFPs.map((item, index) => (
                                            <option key={index} value={item.fp_company_name}>{item.fp_company_name}</option>
                                        ))}
                                    </select>
                                    <div className="actions">
                                        <a className="btn btn-success" onClick={() => self.onAdd()} href="javascript:void(0)">Add New</a>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <table id="example" className="table table-striped table-bordered" cellSpacing="0" width="100%">
                                        <thead>
                                            <tr>
                                                <th>id</th>
                                                <th>Original Status</th>
                                                <th>Lookup Status</th>
                                                <th>DME Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mode === 'add' && <RowToAdd />}
                                            {list}
                                        </tbody>
                                    </table>

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
        dmeStatuses: state.extra.allBookingStatus.map(item => item.dme_delivery_status),
        fpStatuses: state.fp.fpStatuses,
        username: state.auth.username,
        allFPs: state.fp.allFPs,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDmeStatuses: () => dispatch(getAllBookingStatus()),
        getFpStatuses: (fpName) => dispatch(getFpStatuses(fpName)),
        createFpStatus: (data) => dispatch(createFpStatus(data)),
        updateFpStatus: (data) => dispatch(updateFpStatus(data)),
        deleteFpStatus: (id) => dispatch(deleteFpStatus(id)),
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAllFPs: () => dispatch(getAllFPs()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StatusMapping));
