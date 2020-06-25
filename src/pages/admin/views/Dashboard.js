import React, { Component } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, LabelList, Label
} from 'recharts';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import { getNumBookingsPerFp } from '../../../state/services/chartService';

  
class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            num_bookings_fp: [],
            startDate:'',
            endDate:''
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

    componentDidMount(){
        const startDate = moment(new Date().getFullYear() + '-01-01').format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');
        this.setState({startDate: startDate, endDate: endDate});
        this.props.getNumBookingsPerFp({startDate, endDate});
    }

    UNSAFE_componentWillReceiveProps(newProps){
        const { num_bookings_fp } = newProps;

        if (num_bookings_fp) {
            this.setState({num_bookings_fp});
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

                    this.props.getNumBookingsPerFp({startDate: this.state.startDate, endDate: this.state.endDate});
                });    
            } else {
                this.setState({startDate: moment(startDate).format('YYYY-MM-DD')},()=> {
                    this.props.getNumBookingsPerFp({startDate: this.state.startDate, endDate: this.state.endDate});
                } );
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
                    this.props.getNumBookingsPerFp({startDate: this.state.startDate, endDate: this.state.endDate});
                });
            } else {
                this.setState({endDate: moment(endDate).format('YYYY-MM-DD')}, () => {
                    this.props.getNumBookingsPerFp({startDate: this.state.startDate, endDate: this.state.endDate});
                });
            }
        }
    }

    render() {
        const  {num_bookings_fp, startDate, endDate} = this.state;

        const data = num_bookings_fp;
        return (
            <div id="main-wrapper" className="theme-default admin-theme">
                <div className="pageheader">
                    <h1>Dashboard</h1>

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
                            Total Deliveries for Freight providers
                        </p>

                        <BarChart 
                            width={1000}
                            height={500}
                            data={data}
                            layout="vertical"
                            label="heaf"
                            margin={{ top: 15, right: 50, left: 50, bottom: 15 }}
                            padding={{ top: 15, right: 50, left: 50, bottom: 15 }}
                        >
                            <XAxis type="number" textAnchor="end">
                                <Label value="Deliveries" position="bottom" style={{textAnchor: 'middle'}}/>
                            </XAxis>
                            <YAxis type="category" dataKey="freight_provider" angle={-30} textAnchor="end">
                                <Label value="Freight providers" offset={20} position="left" angle={-90} style={{textAnchor: 'middle'}}/>
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend verticalAlign="top"  height={36}/>
                            <Bar dataKey="deliveries" fill="#0050A0" barSize={20} name="Deliveries">
                                <LabelList dataKey="deliveries" position="right" />
                                {
                                    data.map((entry, index) => {
                                        const color = this.getColor();
                                        return (
                                            <Cell key={`cell-${index}`} fill={color} stroke={color}/>
                                        );
                                    })
                                }
                            </Bar>
                        </BarChart>
                    </div>

                    <div className="chart-card">
                        <p className="chart-card-title" >
                            On time comparison
                        </p>
                        
                        <div className="row">
                            <BarChart
                                data={data}
                                width={1000}
                                height={500}
                                margin={{ top: 15, right: 50, left: 50, bottom: 15 }}
                                padding={{ top: 15, right: 50, left: 50, bottom: 15 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="freight_provider" angle={-30} textAnchor="end" >
                                    <Label value="Freight providers" position="bottom" style={{ textAnchor: 'middle' }} />
                                </XAxis>
                                <YAxis>
                                    <Label value="Total Deliveries" offset={20} position="left" angle={-90} style={{ textAnchor: 'middle' }} />
                                </YAxis>
                                <Tooltip />
                                <Legend formatter={this.renderColorfulLegendText} verticalAlign="top" height={36} />
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
                                <Bar dataKey="late_deliveries" stackId="a" fill="#92C6EF" barSize={20} name="Late" type="monotone" >
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

                            <div>
                                <table className="table table-hover table-bordered sortable fixed_headers">
                                    <thead>
                                        <th>FP</th>
                                        <th>Total Deliveries</th>
                                        <th>On time %</th>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.freight_provider}</td>
                                                        <td>{item.deliveries}</td>
                                                        <td>{item.ontime_deliveries_percentage}%</td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
