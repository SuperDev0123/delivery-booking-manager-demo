// React Libs
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// Libs
import { isEmpty, isNull, orderBy } from 'lodash';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button } from 'reactstrap';
// Actions
import { getDMEClients } from '../../state/services/authService';
import { setStatusInfoFilter, getStatusInfo } from '../../state/services/extraService';

class StatusInfoSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: '',
            endDate: '',
            clientPK: 0,
            dmeClients: [],
            statusInfo: [],
        };

        moment.tz.setDefault('Australia/Sydney');
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleStatusInfoSlider: PropTypes.func.isRequired,
        onClickShowStatusInfo: PropTypes.func.isRequired,
        getStatusInfo: PropTypes.func.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        setStatusInfoFilter: PropTypes.func.isRequired,
        dmeClients: PropTypes.array.isRequired,
    };

    componentDidMount() {
        const { startDate, endDate } = this.props;

        if (isEmpty(startDate)) {
            this.setState({startDate: new Date(), endDate: new Date()});
            this.props.setStatusInfoFilter(
                moment().format('YYYY-MM-DD'),
                moment().format('YYYY-MM-DD')
            );
        } else {
            this.setState({ startDate, endDate });
            this.props.setStatusInfoFilter(
                moment(startDate).format('YYYY-MM-DD'),
                moment(endDate).format('YYYY-MM-DD')
            );
        }
        this.props.getDMEClients();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { dmeClients, startDate, endDate, clientPK, needUpdateStatusInfo, statusInfo } = newProps;

        if (dmeClients) {
            this.setState({dmeClients});
        }

        if (needUpdateStatusInfo) {
            this.setState({startDate: moment(startDate).toDate(), endDate: moment(endDate).toDate(), clientPK});
            this.props.getStatusInfo(startDate, endDate, clientPK);
        }

        if (statusInfo) {
            this.setState({statusInfo});
        }
    }

    onDateChange(date, dateType) {
        let startDate = '';
        let endDate = '';

        if (dateType === 'startDate') {
            if (isNull(date)) {
                startDate = new Date();
            } else {
                startDate = moment(date).toDate();
            }

            if (moment(startDate) > moment(this.state.endDate)) {
                endDate = startDate;
                this.setState({startDate, endDate});    
            } else {
                this.setState({startDate});
            }
        } else if (dateType === 'endDate') {
            if (isNull(date)) {
                endDate = new Date();
            } else {
                endDate = moment(date).toDate();
            }

            if (moment(endDate) < moment(this.state.startDate)) {
                startDate = endDate;
                this.setState({startDate, endDate});    
            } else {
                this.setState({endDate});
            }
        }
    }

    onSelected(e, src) {
        if (src === 'client') {
            this.setState({clientPK: e.target.value});
        }
    }

    onClickDateFilter() {
        const { startDate, endDate, clientPK } = this.state;

        this.props.setStatusInfoFilter(
            moment(startDate).format('YYYY-MM-DD'),
            moment(endDate).format('YYYY-MM-DD'),
            clientPK
        );
        this.setState({statusInfo: []});
    }

    onClickShow(dme_delivery_status) {
        const { startDate, endDate, clientPK } = this.state;
        this.props.onClickShowStatusInfo(startDate, endDate, clientPK, dme_delivery_status);
    }

    render() {
        const {isOpen} = this.props;
        const {startDate, endDate, dmeClients, clientPK, statusInfo} = this.state;

        const clientOptionsList = dmeClients.map((client, index) => {
            return (<option key={index} value={client.pk_id_dme_client}>{client.company_name}</option>);
        });

        const statusInfoList = orderBy(statusInfo, ['count'], ['desc']).map((eachItem, index) => {
            return (
                <tr key={index}>
                    <td>{eachItem.dme_delivery_status}</td>
                    <td>{eachItem.dme_status_label}</td>
                    <td>{eachItem.count}</td>
                    <td className="show" onClick={() => this.onClickShow(eachItem.dme_delivery_status)}>
                        <Button color="primary">Show</Button>
                    </td>
                </tr>
            );
        });

        return(
            <SlidingPane
                className='status-info'
                overlayClassName='status-info-slider'
                isOpen={isOpen}
                title='Status Info Slider'
                subtitle=""
                onRequestClose={this.props.toggleStatusInfoSlider}
            >
                <div className="filter-section">
                    <label className="right-10px">
                        Start Date ~ EndDate:&nbsp;
                        <DatePicker
                            selected={startDate}
                            onChange={(e) => this.onDateChange(e, 'startDate')}
                            dateFormat="dd MMM yyyy"
                        />
                        &nbsp; ~ &nbsp;
                        <DatePicker
                            selected={endDate}
                            onChange={(e) => this.onDateChange(e, 'endDate')}
                            dateFormat="dd MMM yyyy"
                        />
                    </label>
                    <label className="left-30px right-10px">
                        Client: 
                        <select 
                            id="client-select" 
                            required 
                            onChange={(e) => this.onSelected(e, 'client')} 
                            value={clientPK}>
                            { clientOptionsList }
                        </select>
                    </label>
                    <button className="btn btn-primary left-10px" onClick={() => this.onClickDateFilter()}>Find</button>
                </div>
                <div className="table-section">
                    <table className="table table-hover table-bordered sortable fixed_headers">
                        <tr>
                            <th className="" width="40%" scope="col" nowrap>
                                <p>Status Name</p>
                            </th>
                            <th className="" width="40%" scope="col" nowrap>
                                <p>Status Label</p>
                            </th>
                            <th className="" width="20%" scope="col" nowrap>
                                <p>Count</p>
                            </th>
                            <th className="" width="20%" scope="col" nowrap>
                            </th>
                        </tr>
                        { statusInfoList }
                    </table>
                </div>
            </SlidingPane>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        dmeClients: state.auth.dmeClients,
        startDate: state.extra.startDate,
        endDate: state.extra.endDate,
        clientPK: state.extra.clientPK,
        statusInfo: state.extra.statusInfo,
        needUpdateStatusInfo: state.extra.needUpdateStatusInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDMEClients: () => dispatch(getDMEClients()),
        getStatusInfo: (startDate, endDate, clientPK) => dispatch(getStatusInfo(startDate, endDate, clientPK)),
        setStatusInfoFilter: (startDate, endDate, clientPK) => dispatch(setStatusInfoFilter(startDate, endDate, clientPK))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StatusInfoSlider));
