import React, { Component } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { orderBy, isNull } from 'lodash';
import { getDailyBooked } from '../../../../state/services/chartService';
import { getAllFPs } from '../../../../state/services/extraService';
import { getDMEClients } from '../../../../state/services/authService';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

class DailyBookedReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            num_daily_booked: [],
            chart_data: [],
            startDate: '',
            endDate: '',
            currentClientnameOption: 'all',
            currentFPOption: 'all',
        };

        this.initFPList = [{value: 'all', label: 'All'}];
        this.initClientList = [{value: 'all', label: 'All'}];
    }

    static propTypes = {
        allFPs: PropTypes.array.isRequired,
        dmeClients: PropTypes.array.isRequired,
        getDailyBooked: PropTypes.func.isRequired,
        getAllFPs: PropTypes.func.isRequired,
        getDMEClients: PropTypes.func.isRequired,
    };
    

    getColor = () => {
        var h = 240;
        var s = Math.floor(Math.random() * 100);
        var l = Math.floor(Math.random() * 60 + 20);
        var color = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
        return color;
    }

    componentDidMount() {
        const {currentFPOption, currentClientnameOption} = this.state;
        const startDate = moment(new Date()).add(-1, 'months').format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');
        this.setState({ startDate: startDate, endDate: endDate });
        this.props.getDailyBooked({ startDate, endDate, currentFPOption, currentClientnameOption });
        setTimeout(() => {
            const that = this;
            that.props.getAllFPs();
            that.props.getDMEClients();
        }, 1000);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        let { num_daily_booked } = newProps;

        if (num_daily_booked) {
            num_daily_booked = this.setupDailyBookedData(num_daily_booked);
            num_daily_booked = orderBy(num_daily_booked, 'bookedDate', 'asc');
            this.setState({ num_daily_booked });
        }
    }

    setupDailyBookedData(value) {
        const {startDate, endDate} = this.state;
        let bookedDate = startDate;
        let returnVal = [];
        while(bookedDate <= endDate) {
            const apiData = value.find(e => e.bookedDate === bookedDate);
            if(apiData) {
                returnVal.push(apiData);
            }
            else {
                returnVal.push({
                    bookedDate,
                    'bookedCount': 0
                });
            }
            bookedDate = moment(bookedDate).add(1, 'days').format('YYYY-MM-DD');
        }
        return returnVal;
    }

    renderColorfulLegendText(value, entry) {
        const { color } = entry;

        return <span style={{ color }}>{value}</span>;
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

                    this.props.getDailyBooked({ startDate: this.state.startDate, endDate: this.state.endDate, currentFPOption: this.state.currentFPOption, currentClientnameOption: this.state.currentClientnameOption });
                });
            } else {
                this.setState({ startDate: moment(startDate).format('YYYY-MM-DD') }, () => {
                    this.props.getDailyBooked({ startDate: this.state.startDate, endDate: this.state.endDate, currentFPOption: this.state.currentFPOption, currentClientnameOption: this.state.currentClientnameOption });
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
                    this.props.getDailyBooked({ startDate: this.state.startDate, endDate: this.state.endDate, currentFPOption: this.state.currentFPOption, currentClientnameOption: this.state.currentClientnameOption });
                });
            } else {
                this.setState({ endDate: moment(endDate).format('YYYY-MM-DD') }, () => {
                    this.props.getDailyBooked({ startDate: this.state.startDate, endDate: this.state.endDate, currentFPOption: this.state.currentFPOption, currentClientnameOption: this.state.currentClientnameOption });
                });
            }
        }
    }

    onFPChange(selectedOption) {
        const {startDate, endDate, currentClientnameOption} = this.state;
        this.setState({ currentFPOption: selectedOption.value });
        this.props.getDailyBooked({ startDate, endDate, currentFPOption: selectedOption.value, currentClientnameOption });
    }

    onClientChange(selectedOption) {
        const {startDate, endDate, currentFPOption} = this.state;
        this.setState({ currentClientnameOption: selectedOption.value });
        this.props.getDailyBooked({ startDate, endDate, currentFPOption, currentClientnameOption: selectedOption.value });
    }

    displayNoOptionsMessage() {
        if (this.state.isBookedBooking == true) {
            return 'No Editable';
        }
    }

    render() {
        const { startDate, endDate, num_daily_booked } = this.state;
        const fpOptions = this.initFPList.concat(this.props.allFPs
            .map(fp => ({ value: fp.fp_company_name, label: fp.fp_company_name })));
        const clientnameOptions = this.initClientList.concat(this.props.dmeClients
            .map(client => ({value: client.company_name, label: client.company_name})));
        const data = num_daily_booked;

        return (
            <div id="main-wrapper" className="theme-default admin-theme">
                <div className="pageheader">

                    <div className="row filter-controls">
                        <div className="row col-sm-12">
                            <div className="col-sm-6 form-group">
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
                        </div>
                        <div className="row col-sm-12" style={{marginTop: '8px'}}>
                            <div className="col-sm-4 form-group">
                                <div>
                                    <span>Freight Provider</span>
                                    <Select
                                        onChange={(e) => this.onFPChange(e)}
                                        options={fpOptions}
                                        placeholder='Select a FP'
                                        noOptionsMessage={() => this.displayNoOptionsMessage()}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-4 form-group">
                                <div>
                                    <span>Client Name</span>
                                    <Select
                                        onChange={(e) => this.onClientChange(e)}
                                        options={clientnameOptions}
                                        placeholder='Select a client'
                                        noOptionsMessage={() => this.displayNoOptionsMessage()}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="chart-card">
                        <p className="chart-card-title" >
                            Total Deliveries by transport company
                        </p>

                        <div className="row">
                            <ResponsiveContainer width={'100%'} height={700}>
                                <LineChart
                                    width={500}
                                    height={300}
                                    data={data}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="bookedDate" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line name="Daily Booked Count" type="monotone" dataKey="bookedCount" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        num_daily_booked: state.chart.num_daily_booked,
        allFPs: state.extra.allFPs,
        dmeClients: state.auth.dmeClients,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDailyBooked: (data) => dispatch(getDailyBooked(data)),
        getAllFPs: () => dispatch(getAllFPs()),
        getDMEClients: () => dispatch(getDMEClients()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DailyBookedReport);
