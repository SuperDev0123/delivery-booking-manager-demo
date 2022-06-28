import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

class EmailLogSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selctedEmailName: null,
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        emailLogs: PropTypes.array.isRequired,
    };

    onClickTile(emailName) {
        if (this.state.selctedEmailName === emailName) {
            this.setState({selctedEmailName: null});
        } else {
            this.setState({selctedEmailName: emailName});
        }
    }

    render() {
        const {isOpen, emailLogs} = this.props;
        const {selctedEmailName} = this.state;

        const generalEmailCnt = emailLogs.filter(emailLog => emailLog['emailName'] === 'General Booking').length;
        const podEmailCnt = emailLogs.filter(emailLog => emailLog['emailName'] === 'POD').length;
        const returnEmailCnt = emailLogs.filter(emailLog => emailLog['emailName'] === 'Return Booking').length;
        const unpackedReturnEmailCnt = emailLogs.filter(emailLog => emailLog['emailName'] === 'Unpacked Return Booking').length;
        const futileEmailCnt = emailLogs.filter(emailLog => emailLog['emailName'] === 'Futile Pickup').length;

        const filteredEmailLogs = selctedEmailName ? emailLogs.filter(emailLog => selctedEmailName === emailLog['emailName']) : emailLogs;
        const emailLogsList = filteredEmailLogs.map((emailLog, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{emailLog['emailName']}</td>
                    <td>{emailLog['z_createdByAccount']}</td>
                    <td>{emailLog['z_createdTimeStamp'] && moment(emailLog['z_createdTimeStamp']).format('DD/MM/YYYY HH:mm')}</td>
                </tr>
            );
        });

        return(
            <SlidingPane
                className='email-logs-pan'
                isOpen={isOpen}
                title='Email Logs Slider'
                subtitle='List View'
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
                    <div className="table-view">
                        <div className="row">
                            <div className="col-md-2 tile cur-pointer">
                                <div
                                    className={selctedEmailName === 'General Booking' && 'active'}
                                    onClick={() => this.onClickTile('General Booking')}
                                >
                                    General Booking{generalEmailCnt > 0 && ` (${generalEmailCnt})`}
                                </div>
                            </div>
                            <div className="col-md-2 tile cur-pointer">
                                <div
                                    className={selctedEmailName === 'POD' && 'active'}
                                    onClick={() => this.onClickTile('POD')}
                                >
                                    POD Booking{podEmailCnt > 0 && ` (${podEmailCnt})`}
                                </div>
                            </div>
                            <div className="col-md-2 tile cur-pointer">
                                <div
                                    className={selctedEmailName === 'Return Booking' && 'active'}
                                    onClick={() => this.onClickTile('Return Booking')}
                                >
                                    Return Booking{returnEmailCnt > 0 && ` (${returnEmailCnt})`}
                                </div>
                            </div>
                            <div className="col-md-2 tile cur-pointer">
                                <div
                                    className={selctedEmailName === 'Unpacked Return Booking' && 'active'}
                                    onClick={() => this.onClickTile('Unpacked Return Booking')}
                                >
                                    Unpacked Return {unpackedReturnEmailCnt > 0 && ` (${unpackedReturnEmailCnt})`}
                                </div>
                            </div>
                            <div className="col-md-2 tile cur-pointer">
                                <div
                                    className={selctedEmailName === 'Futile Pickup' && 'active'}
                                    onClick={() => this.onClickTile('Futile Pickup')}
                                >
                                    Futile Pickup{futileEmailCnt > 0 && ` (${futileEmailCnt})`}
                                </div>
                            </div>
                        </div>
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <thead>
                                <tr>
                                    <th className="" scope="col" nowrap="true">
                                        <p>No</p>
                                    </th>
                                    <th className="" scope="col" nowrap="true">
                                        <p>EmailName</p>
                                    </th>
                                    <th className="" scope="col" nowrap="true">
                                        <p>Sender</p>
                                    </th>
                                    <th className="" scope="col" nowrap="true">
                                        <p>Date Time</p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                { emailLogsList }
                            </tbody>
                        </table>
                    </div>
                </div>
            </SlidingPane>
        );
    }
}

export default EmailLogSlider;
