import React, { Component } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, LabelList, Label
} from 'recharts';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import { isNull, orderBy } from 'lodash';
import { getDMEClients } from '../../../../state/services/authService';
import { getNumBookingsPerClient, getNumBookingsPerStatus } from '../../../../state/services/chartService';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Select from 'react-select';

const TABLE_PAGINATION_SIZE = 10;

class ByClient extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            num_bookings_fp: [],
            num_bookings_status: [],
            chart_data: [],
            startDate: '',
            endDate: '',
            client_name: '',
        };
    }

    static propTypes = {
        getNumBookingsPerClient: PropTypes.func.isRequired,
        getNumBookingsPerStatus: PropTypes.func.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        dmeClients: PropTypes.array.isRequired,
    };

    getColor = () => {
        var h = 240;
        var s = Math.floor(Math.random() * 100);
        var l = Math.floor(Math.random() * 60 + 20);
        var color = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
        return color;
    }

    componentDidMount() {
        const startDate = moment(new Date().getFullYear() + '-01-01').format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');
        this.setState({ startDate: startDate, endDate: endDate });
        this.props.getNumBookingsPerClient({ startDate, endDate });
        
        this.props.getDMEClients();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        let { num_bookings_fp, num_bookings_status } = newProps;

        if (num_bookings_fp) {
            num_bookings_fp = orderBy(num_bookings_fp, 'client_name', 'asc');
            this.setState({ num_bookings_fp });
            const chart_data = num_bookings_fp.slice(0, TABLE_PAGINATION_SIZE);
            this.setState({ chart_data });
        }

        if (num_bookings_status) {
            num_bookings_status = orderBy(num_bookings_status, 'status', 'asc');
            this.setState({ num_bookings_status });
        }
    }

    renderColorfulLegendText(value, entry) {
        const { color } = entry;

        return <span style={{ color }}>{value}</span>;
    }

    displayNoOptionsMessage() {
        return 'No Editable';
    }

    onDateChange(date, dateType) {
        let startDate = '';
        let endDate = '';

        if (dateType === 'startDate') {
            if (isNull(date)) {
                startDate = moment().toDate();
            } else {
                startDate = date;
            }

            if (moment(startDate) > moment(this.state.endDate)) {
                this.setState({
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(startDate).format('YYYY-MM-DD')
                }, () => {

                    this.props.getNumBookingsPerClient({ startDate: this.state.startDate, endDate: this.state.endDate });
                });
            } else {
                this.setState({ startDate: moment(startDate).format('YYYY-MM-DD') }, () => {
                    this.props.getNumBookingsPerClient({ startDate: this.state.startDate, endDate: this.state.endDate });
                });
            }
        } else if (dateType === 'endDate') {
            if (isNull(date)) {
                endDate = moment().toDate();
            } else {
                endDate = date;
            }

            if (moment(endDate) < moment(this.state.startDate)) {
                this.setState({
                    startDate: moment(endDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD')
                }, () => {
                    this.props.getNumBookingsPerClient({ startDate: this.state.startDate, endDate: this.state.endDate });
                });
            } else {
                this.setState({ endDate: moment(endDate).format('YYYY-MM-DD') }, () => {
                    this.props.getNumBookingsPerClient({ startDate: this.state.startDate, endDate: this.state.endDate });
                });
            }
        }
    }

    onPageChange(page, sizePerPage) {
        const { num_bookings_fp } = this.state;
        const chart_data = num_bookings_fp.slice((page - 1) * sizePerPage, page * sizePerPage);
        this.setState({ chart_data });
    }

    onChangeClientName ( client_name ) {
        const {startDate, endDate} = this.state;
        this.setState({client_name : client_name});
        this.props.getNumBookingsPerStatus({ startDate, endDate, client_name });
    }

    render() {
        const { num_bookings_fp, num_bookings_status, startDate, endDate, chart_data } = this.state;

        const data = chart_data;

        const dataFormatter = (cell) => {
            if (cell)
                return cell;
            else
                return 0;
        };

        const decimalFormatter = (cell) => {
            if (cell) {
                return Number(cell).toFixed(2);
            }
            else
                return 0;
        };
        const columns = [
            {
                text: 'Client Name',
                dataField: 'client_name',
                sort: true
            }, {
                text: 'Total Deliveries',
                dataField: 'deliveries',
                sort: true
            }, {
                text: 'Total on time',
                dataField: 'ontime_deliveries',
                formatter: dataFormatter,
                sort: true
            }, {
                text: 'Total Late',
                dataField: 'late_deliveries',
                formatter: dataFormatter,
                sort: true
            }, {
                text: 'Quoted Cost',
                dataField: 'inv_cost_quoted',
                align: 'right',
                formatter: decimalFormatter,
                sort: true
            }, {
                text: 'Quoted $',
                dataField: 'inv_sell_quoted',
                align: 'right',
                formatter: decimalFormatter,
                sort: true
            }, {
                text: 'Quoted $*',
                dataField: 'inv_sell_quoted_override',
                align: 'right',
                formatter: decimalFormatter,
                sort: true
            }
        ];

        const columns_status = [
            {
                text: 'Status',
                dataField: 'status',
                sort: true
            }, {
                text: 'Count',
                dataField: 'value',
                sort: true
            }
        ];

        const clientnameOptions = this.props.dmeClients
            .map(client => ({value: client.company_name, label: client.company_name}));

        const currentClientnameOption = {
            value: this.state.client_name,
            label: this.state.client_name 
        };

        return (
            <div id="main-wrapper" className="theme-default admin-theme">
                <div className="pageheader">

                    <div className="row filter-controls">
                        <DatePicker
                            selected={startDate ? new Date(startDate) : ''}
                            onChange={(e) => this.onDateChange(e, 'startDate')}
                            dateFormat="dd MMM yyyy"
                        />
                        <DatePicker
                            selected={endDate ? new Date(endDate) : ''}
                            onChange={(e) => this.onDateChange(e, 'endDate')}
                            dateFormat="dd MMM yyyy"
                        />
                    </div>

                    <div className="chart-card">
                        <p className="chart-card-title" >
                            Total Client Bookings
                        </p>

                        <div className="row">
                            <div className="col-md-7 col">
                                <ResponsiveContainer width={'100%'} height={700}>
                                    <BarChart
                                        data={data}
                                        layout="vertical"
                                        label="heaf"
                                        margin={{ top: 15, right: 50, left: 50, bottom: 15 }}
                                        padding={{ top: 15, right: 50, left: 50, bottom: 15 }}
                                    >
                                        <XAxis type="number" textAnchor="end" height={70}>
                                            <Label value=" Total Deliveries" position="bottom" style={{ textAnchor: 'middle' }} offset={-10} />
                                        </XAxis>
                                        <YAxis type="category" dataKey="client_name" angle={-30} textAnchor="end" width={100} >
                                            <Label value="Client/Sub Client" offset={20} position="left" angle={-90} style={{ textAnchor: 'middle' }} />
                                        </YAxis>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Tooltip />
                                        <Legend verticalAlign="top" height={36} />

                                        <Bar dataKey="deliveries" stackId="a" fill="#0050A0" barSize={20} name="Total Deliveries">
                                            <LabelList dataKey="deliveries" />
                                            {
                                                data.map((entry, index) => {
                                                    return (
                                                        <Cell key={`cell-${index}`} />
                                                    );
                                                })
                                            }
                                        </Bar>

                                        <Bar dataKey="ontime_deliveries" stackId="a" fill="#82C0E0" barSize={350} name="On Time" type="monotone" >
                                            <LabelList dataKey="ontime_deliveries" />
                                            {
                                                data.map((entry, index) => {
                                                    return (
                                                        <Cell key={`cell-${index}`} />
                                                    );
                                                })
                                            }
                                        </Bar>

                                        <Bar dataKey="late_deliveries" stackId="a" fill="#A20000" barSize={350} name="Late" type="monotone" >
                                            <LabelList dataKey="late_deliveries" />
                                            {
                                                data.map((entry, index) => {
                                                    return (
                                                        <Cell key={`cell-${index}`} />
                                                    );
                                                })
                                            }
                                        </Bar>

                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="col-md-5 col">
                                <div className="table-responsive">
                                    <BootstrapTable
                                        keyField="id"
                                        data={num_bookings_fp}
                                        columns={columns}
                                        bootstrap4={true}
                                        pagination={paginationFactory({ sizePerPageList: [{ text: `${TABLE_PAGINATION_SIZE}`, value: TABLE_PAGINATION_SIZE }], hideSizePerPage: true, hidePageListOnlyOnePage: true, withFirstAndLast: false, alwaysShowAllBtns: false, onPageChange: (page, sizePerPage) => { this.onPageChange(page, sizePerPage); } })}
                                        defaultSorted={[{ dataField: 'client_name', order: 'asc' }]}
                                    />
                                </div>
                                
                                <Select
                                    value={currentClientnameOption}
                                    onChange={(e) => this.onChangeClientName(e.value)}
                                    options={clientnameOptions}
                                    placeholder='Select a client'
                                    noOptionsMessage={() => this.displayNoOptionsMessage()}
                                />

                                <div className="table-responsive">
                                    <BootstrapTable
                                        keyField="id"
                                        data={num_bookings_status}
                                        columns={columns_status}
                                        bootstrap4={true}
                                        pagination={paginationFactory({ sizePerPageList: [{ text: `${TABLE_PAGINATION_SIZE}`, value: TABLE_PAGINATION_SIZE }], hideSizePerPage: true, hidePageListOnlyOnePage: true, withFirstAndLast: false, alwaysShowAllBtns: false })}
                                        defaultSorted={[{ dataField: 'status', order: 'asc' }]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        num_bookings_fp: state.chart.num_bookings_fp,
        num_bookings_status: state.chart.num_bookings_status,
        dmeClients: state.auth.dmeClients,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getNumBookingsPerClient: (data) => dispatch(getNumBookingsPerClient(data)),
        getNumBookingsPerStatus: (data) => dispatch(getNumBookingsPerStatus(data)),
        getDMEClients: () => dispatch(getDMEClients()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ByClient);
