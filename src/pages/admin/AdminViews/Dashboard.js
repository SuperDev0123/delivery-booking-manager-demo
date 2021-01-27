import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
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
        return (
            <div id="main-wrapper" className="theme-default admin-theme">
                <div className="pageheader">
                    <h1>Dashboard</h1>

                    <div className="chart-card">
                        <ul className="animated" role="menu" style={{
                            listStyle: 'none',
                            padding: '15px'
                        }}>
                            <li style={{padding:'5px'}}>
                                <a href='/admin/chart/totaldeliveries'>
                                    <span className="icon">
                                        <i className="fa fa-cog"></i>
                                    </span>&nbsp;&nbsp;&nbsp;&nbsp;Total Deliveries by transport company</a>
                            </li>

                            <li style={{padding:'5px'}}>
                                <a href='/admin/chart/ontimelatedeliveries'>
                                    <span className="icon">
                                        <i className="fa fa-cog"></i>
                                    </span>&nbsp;&nbsp;&nbsp;&nbsp;Ontime/Late Deliveries</a>
                            </li>

                            <li style={{padding:'5px'}}>
                                <a href='/admin/chart/deliveriesbyclient'>
                                    <span className="icon">
                                        <i className="fa fa-cog"></i>
                                    </span>&nbsp;&nbsp;&nbsp;&nbsp;Total Client Bookings</a>
                            </li>
                        </ul>
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
