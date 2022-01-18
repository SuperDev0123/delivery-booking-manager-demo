import React, { Component } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, LabelList, Label
} from 'recharts';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getNumActiveBookingsPerClient } from '../../../../state/services/chartService';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

const TABLE_PAGINATION_SIZE = 10;

class ActiveBookings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            num_active_bookings_per_client: [],
            chart_data: [],
            table_data: [],
        };
    }

    static propTypes = {
        getNumActiveBookingsPerClient: PropTypes.func.isRequired,
    };

    getColor = () => {
        var h = 240;
        var s = Math.floor(Math.random() * 100);
        var l = Math.floor(Math.random() * 60 + 20);
        var color = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
        return color;
    }

    componentDidMount() {
        this.props.getNumActiveBookingsPerClient();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        let { num_active_bookings_per_client } = newProps;

        if (num_active_bookings_per_client) {
            num_active_bookings_per_client = _.orderBy(num_active_bookings_per_client, 'inprogress', 'desc');
            this.setState({ num_active_bookings_per_client });
            const chart_data = num_active_bookings_per_client.slice(0, TABLE_PAGINATION_SIZE);
            this.setState({ chart_data });
        }
    }

    renderColorfulLegendText(value, entry) {
        const { color } = entry;

        return <span style={{ color }}>{value}</span>;
    }

    onPageChange(page, sizePerPage) {
        const { num_active_bookings_per_client } = this.state;
        const chart_data = num_active_bookings_per_client.slice((page - 1) * sizePerPage, page * sizePerPage);
        this.setState({ chart_data });
    }

    render() {
        const { chart_data } = this.state;

        const data = chart_data;
        const columns = [
            {
                text: 'Client',
                dataField: 'b_client',
                sort: true
            }, {
                text: 'Total Deliveries',
                dataField: 'inprogress',
                sort: true
            }
        ];


        return (
            <div id="main-wrapper" className="theme-default admin-theme">
                <div className="pageheader">
                    <div className="chart-card">
                        <p className="chart-card-title" >
                            Active Deliveries by transport company
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
                                            <Label value="In-progress Bookings" position="bottom" style={{ textAnchor: 'middle' }} offset={-10} />
                                        </XAxis>
                                        <YAxis type="category" dataKey="b_client" angle={-30} textAnchor="end" width={100} interval={0}>
                                            <Label value="Client companies" offset={10} position="left" angle={-90} style={{ textAnchor: 'middle' }} />
                                        </YAxis>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Tooltip />
                                        <Legend verticalAlign="top" height={36} />
                                        <Bar dataKey="inprogress" fill="#0050A0" barSize={350} name="In-progress Bookings">
                                            <LabelList dataKey="inprogress" position="right" />
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
                                        data={data}
                                        columns={columns}
                                        bootstrap4={true}
                                        pagination={paginationFactory({ sizePerPageList: [{ text: `${TABLE_PAGINATION_SIZE}`, value: TABLE_PAGINATION_SIZE }], hideSizePerPage: true, hidePageListOnlyOnePage: true, withFirstAndLast: false, alwaysShowAllBtns: false, onPageChange: (page, sizePerPage) => { this.onPageChange(page, sizePerPage); } })}
                                        defaultSorted={[{ dataField: 'inprogress', order: 'desc' }]}
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
        num_active_bookings_per_client: state.chart.num_active_bookings_per_client,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getNumActiveBookingsPerClient: (data) => dispatch(getNumActiveBookingsPerClient(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveBookings);
