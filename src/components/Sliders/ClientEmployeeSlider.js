import React from 'react';
import PropTypes from 'prop-types';

import { clone, isEmpty } from 'lodash';
import moment from 'moment-timezone';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

class ClientEmployeeSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 0, // 0: List, 1: Form
            saveMode: 0, // 0: Create, 1: Update
            formInputs: {
                status_last: '',
            },
            event_time_stamp: null,
            errorMessage: '',
        };

        moment.tz.setDefault('Australia/Sydney');
        this.tzOffset = new Date().getTimezoneOffset() === 0 ? 0 : -1 * new Date().getTimezoneOffset() / 60;
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleClientEmployeeSlider: PropTypes.func.isRequired,
        allClientEmployees: PropTypes.array.isRequired,
        booking: PropTypes.object.isRequired,
        allBookingStatus: PropTypes.array.isRequired,
        OnCreateStatusHistory: PropTypes.func.isRequired,
        clientname: PropTypes.string.isRequired,
        roles: PropTypes.array.isRequired,
        clients: PropTypes.array.isRequired,
        warehouses: PropTypes.array.isRequired,
        createClientEmployee: PropTypes.func.isRequired,
        updateClientEmployee: PropTypes.func.isRequired,
    };

    onClickPlus() {
        const {booking} = this.props;

        if (booking.z_lock_status) {
            alert('This booking is locked, so `update status` is not available.');
        } else {
            const formInputs = this.state.formInputs;
            formInputs['dme_notes'] = booking.dme_status_history_notes;
            this.setState({viewMode: 1, saveMode: 0, formInputs});
        }
    }

    onSubmit() {
        const { saveMode, formInputs } = this.state;

        if (saveMode == 0)
            this.props.createClientEmployee(formInputs);
        else
            this.props.updateClientEmployee(formInputs);
        
        
        event.preventDefault();
        this.setState({viewMode: 0});
    }

    onClickCancel() {
        this.setState({viewMode: 0});
    }

    onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const formInputs = this.state.formInputs;
        formInputs[name] = value;
        this.setState({formInputs, errorMessage: ''});
    }

    onClickEditButton(pk_id_client_emp) {
        const index = this.props.allClientEmployees.findIndex((element)=> element.pk_id_client_emp == pk_id_client_emp);
        if(index >= 0) {
            const formInputs = clone(this.props.allClientEmployees[index]);
            this.setState({formInputs, viewMode: 1, saveMode: 1});
        }
    }

    onClickAdd() {
        const formInputs = {};
        this.setState({formInputs, viewMode: 1, saveMode: 0});
    }

    renderClientEmployeesTable() {
        const { allClientEmployees, clientname } = this.props;

        const editableStyle = () => {
            return {
                backgroundColor: 'white',
                cursor: 'default',
            };
        };

        const actionButton = (cell, row) => {
            return (
                <div>
                    <a className="btn btn-info btn-sm" onClick={()=>this.onClickEditButton(row.pk_id_client_emp)}>Edit</a>
                </div>
            );
        };

        const tableColumns = [
            {
                dataField: 'pk_id_client_emp',
                text: 'ID',
                editable: false,
                style: {
                    cursor: 'not-allowed',
                },
            }, {
                dataField: 'name_first',
                text: 'First Name',
                editable: false,
                style: editableStyle,
            }, {
                dataField: 'name_last',
                text: 'Last Name',
                editable: false,
                style: editableStyle,
            }, {
                dataField: 'email',
                text: 'Email',
                editable: false,
                style: editableStyle,
            }, {
                dataField: 'phone',
                text: 'Phone',
                editable: false,
                style: editableStyle,
            }, {
                dataField: 'role_name',
                text: 'Role',
                editable: false,
                style: editableStyle,
            }, {
                dataField: 'client_name',
                text: 'Client Name',
                editable: false,
                style: editableStyle,
            },{
                dataField: 'warehouse_name',
                text: 'Warehouse Name',
                editable: false,
                style: editableStyle,
            },{
                dataField: 'clien_emp_job_title',
                text: 'Job Title',
                editable: false,
                style: editableStyle,
            },{
                dataField: 'button',
                text: 'Actions',
                formatter: actionButton
            }
        ];

        return (
            <div className="row" style={{width:'1000px'}}>
                <div className="col-md-12">
                    <div className="panel panel-default">
                        <div className="panel-heading" style={{padding:'20px'}}>
                            <h3 className="panel-title">{clientname} Employees</h3>
                            <div className="actions pull-right">
                                <button className="btn btn-success" onClick={()=>this.onClickAdd()}>Add New</button>
                            </div>
                        </div>
                        <div className="panel-body">
                            <ToolkitProvider
                                id="client_employees"
                                keyField="id"
                                data={allClientEmployees}
                                columns={tableColumns}
                                bootstrap4={true}
                            >
                                {
                                    props => (
                                        <div>
                                            <hr />
                                            <BootstrapTable id="client_employees"
                                                {...props.baseProps}
                                            />
                                        </div>
                                    )
                                }
                            </ToolkitProvider>

                        </div>
                    </div>
                </div>
            </div>
        );
    }


    render() {
        const { roles, clients, warehouses, isOpen } = this.props;
        const { viewMode, saveMode, formInputs,  errorMessage} = this.state;

        return (
            <SlidingPane
                className='sh-slider'
                overlayClassName='sh-slider-overlay'
                isOpen={isOpen}
                title='Client Employee Slider'
                subtitle={viewMode === 0 ? 'List View' : 'Form View'}
                onRequestClose={this.props.toggleClientEmployeeSlider}>
                <div className="slider-content">
                    {
                        viewMode === 0 ?
                            <div>{this.renderClientEmployeesTable()}</div>
                            :
                            <div className="form-view">
                                <label>
                                    <h1>{saveMode===0 ? 'New' : 'Edit'} Client Employee</h1>
                                </label>
                                <form onSubmit={(e) => this.onSubmit(e)} role="form">
                                    <div className="form-group">
                                        <label htmlFor="name_first">First Name</label>
                                        <input name="name_first" type="text" className="form-control" id="name_first" placeholder="Enter First Name"
                                            onChange={(e) => this.onInputChange(e)}
                                            value={formInputs['name_first']} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name_last">Last Name</label>
                                        <input name="name_last" type="text" className="form-control" id="name_last" placeholder="Enter Last Name"
                                            onChange={(e) => this.onInputChange(e)}
                                            value={formInputs['name_last']} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input name="email" type="email" className="form-control" id="name_last" placeholder="Enter Email"
                                            onChange={(e) => this.onInputChange(e)}
                                            value={formInputs['email']} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone</label>
                                        <input name="phone" type="text" className="form-control" id="name_last" placeholder="Enter Phone" value={formInputs['phone']} onChange={(e) => this.onInputChange(e)} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="clien_emp_job_title">Job Title</label>
                                        <input name="clien_emp_job_title" type="text" className="form-control" id="clien_emp_job_title" placeholder="Enter Job Title" value={formInputs['clien_emp_job_title']} onChange={(e) => this.onInputChange(e)} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="fk_id_dme_client">Client</label>
                                        <select name="fk_id_dme_client" value={formInputs['fk_id_dme_client']} className="form-control" id="fk_id_dme_client" onChange={(e) => this.onInputChange(e)}>
                                            {
                                                clients.map((client, index) => {
                                                    return (
                                                        <option key={index} value={client.pk_id_dme_client}>{client.company_name}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="role">Role</label>
                                        <select name="role" value={formInputs['role']} className="form-control" id="role" onChange={(e) => this.onInputChange(e)}>
                                            {
                                                roles.map((role, index) => {
                                                    return (
                                                        <option key={index} value={role.id}>{role.role_code}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="warehouse_id">Warehouse</label>
                                        <select name="warehouse_id" value={formInputs['warehouse_id']} className="form-control" id="warehouse_id" onChange={(e) => this.onInputChange(e)}>
                                            {
                                                warehouses.map((warehouse, index) => {
                                                    return (
                                                        <option key={index} value={warehouse.pk_id_client_warehouses}>{warehouse.name}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </div>
                                    {
                                        isEmpty(errorMessage) ?
                                            <label></label>
                                            :
                                            <label>
                                                <p className='red'>{errorMessage}</p>
                                            </label>
                                    }
                                    <button type="submit" className="btn btn-primary mt-2">Submit</button>
                                    <button className="btn btn-primary mt-2" onClick={() => this.onClickCancel()}>Cancel</button>
                                </form>
                            </div>
                    }
                </div>
            </SlidingPane>
        );
    }
}

export default ClientEmployeeSlider;
