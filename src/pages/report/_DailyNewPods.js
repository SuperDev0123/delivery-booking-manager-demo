import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Clock from 'react-live-clock';
import moment from 'moment-timezone';
import { Button } from 'reactstrap';

import { getReports } from '../../state/services/reportService';

class DailyNewPods extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reports: [],
        };
    }

    static propTypes = {
        getReports: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.getReports();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { reports } = newProps;

        if (reports) {
            this.setState({reports});
        }
    }

    render() {
        const { reports } = this.state;

        let reportsList = reports.map((report, index) => {
            return (
                <div className="layout-card" key={index}>
                    <div className="info">
                        <p className="">
                            {index + 1}.&nbsp;&nbsp;&nbsp;
                            <strong>{report.name}&nbsp;</strong>
                            ({report.type})&nbsp;
                            {
                                (report.z_downloadedTimeStamp) ?
                                    <span className="downloaded">Downloaded</span>
                                    :
                                    <span className="new"><i>NEW!</i></span>
                            }
                        </p>
                        <p className="">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>Created At: {moment(report.z_createdTimeStamp).format('DD MMM YYYY HH:mm:ss')}</span>
                            {
                                (report.z_downloadedTimeStamp) &&
                                    <span>&nbsp;&nbsp;Downloaded At: {moment(report.z_downloadedTimeStamp).format('DD MMM YYYY HH:mm:ss')}</span>
                            }
                        </p>
                    </div>
                    <div className="action">
                        <Button color="primary">A</Button>
                        <Button color="primary">A</Button>
                        <Button color="primary">A</Button>
                    </div>
                </div>
            );
        });

        return (
            <div className="tab-pane fade in active">
                <div className="content">
                    <span className="right">Sydney AU: <Clock format={'DD MMM YYYY h:mm:ss A'} disabled={true} ticking={true} timezone={'Australia/Sydney'} /></span>
                    {reportsList}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reports: state.report.reports,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getReports: () => dispatch(getReports()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DailyNewPods);
