import React, { Component } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, LabelList, Label
} from 'recharts';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import { getNumBookingsPerFp } from '../../../../state/services/chartService';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

const TABLE_PAGINATION_SIZE = 15;

class TotalDeliveries extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            num_bookings_fp: [],
            chart_data: [],
            startDate: '',
            endDate: ''
        };
    }

    static propTypes = {
        getNumBookingsPerFp: PropTypes.func.isRequired,
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
        this.props.getNumBookingsPerFp({ startDate, endDate });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        let { num_bookings_fp } = newProps;

        if (num_bookings_fp) {
            num_bookings_fp = _.orderBy(num_bookings_fp, 'deliveries', 'desc');
            this.setState({ num_bookings_fp });
            const chart_data = num_bookings_fp.slice(0, TABLE_PAGINATION_SIZE);
            this.setState({ chart_data });
        }
    }

    renderColorfulLegendText(value, entry) {
        const { color } = entry;

        return <span style={{ color }}>{value}</span>;
    }

    onDateChange(date, dateType) {
        let startDate = '';
        let endDate = '';

        if (dateType === 'startDate') {
            if (_.isNull(date)) {
                startDate = moment().toDate();
            } else {
                startDate = date;
            }

            if (moment(startDate) > moment(this.state.endDate)) {
                this.setState({
                    startDate: moment(startDate).format('YYYY-MM-DD'),
                    endDate: moment(startDate).format('YYYY-MM-DD')
                }, () => {

                    this.props.getNumBookingsPerFp({ startDate: this.state.startDate, endDate: this.state.endDate });
                });
            } else {
                this.setState({ startDate: moment(startDate).format('YYYY-MM-DD') }, () => {
                    this.props.getNumBookingsPerFp({ startDate: this.state.startDate, endDate: this.state.endDate });
                });
            }
        } else if (dateType === 'endDate') {
            if (_.isNull(date)) {
                endDate = moment().toDate();
            } else {
                endDate = date;
            }

            if (moment(endDate) < moment(this.state.startDate)) {
                this.setState({
                    startDate: moment(endDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD')
                }, () => {
                    this.props.getNumBookingsPerFp({ startDate: this.state.startDate, endDate: this.state.endDate });
                });
            } else {
                this.setState({ endDate: moment(endDate).format('YYYY-MM-DD') }, () => {
                    this.props.getNumBookingsPerFp({ startDate: this.state.startDate, endDate: this.state.endDate });
                });
            }
        }
    }

    onPageChange(page, sizePerPage) {
        const { num_bookings_fp } = this.state;
        const chart_data = num_bookings_fp.slice((page - 1) * sizePerPage, page * sizePerPage);
        this.setState({ chart_data });
    }

    render() {
        const { num_bookings_fp, startDate, endDate, chart_data } = this.state;

        const data = chart_data;

        const columns = [
            {
                text: 'Transporters',
                dataField: 'freight_provider',
                sort: true
            }, {
                text: 'Total Deliveries',
                dataField: 'deliveries',
                sort: true
            }
        ];


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
                            Total Deliveries by transport company
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
                                            <Label value="Deliveries" position="bottom" style={{ textAnchor: 'middle' }} offset={-10} />
                                        </XAxis>
                                        <YAxis type="category" dataKey="freight_provider" angle={-30} textAnchor="end" width={100} interval={0}>
                                            <Label value="Transport companies" offset={10} position="left" angle={-90} style={{ textAnchor: 'middle' }} />
                                        </YAxis>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Tooltip />
                                        <Legend verticalAlign="top" height={36} />
                                        <Bar dataKey="deliveries" fill="#0050A0" barSize={350} name="Deliveries">
                                            <LabelList dataKey="deliveries" position="right" />
                                            {
                                                data.map((entry, index) => {
                                                    const color = this.getColor();
                                                    return (
                                                        <Cell key={`cell-${index}`} fill={color} stroke={color} />
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
                                        defaultSorted={[{ dataField: 'deliveries', order: 'desc' }]}
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getNumBookingsPerFp: (data) => dispatch(getNumBookingsPerFp(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TotalDeliveries);
