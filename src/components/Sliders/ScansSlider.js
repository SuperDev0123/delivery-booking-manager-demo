import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateTimePicker from 'react-datetime-picker';

import {
    getScans, createScan, updateScan, deleteScan
} from '../../state/services/extraService';
import ConfirmModal from '../CommonModals/ConfirmModal';
// Constants
import { timeDiff } from '../../commons/constants';

class ScansSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 0, // 0: List, 1: Form
            saveMode: 0, // 0: Create, 1: Update
            formInputs: {},
            errorMessage: null,
            selectedScan: null,
            isShowDeleteConfirmModal: false,
        };

        moment.tz.setDefault('Australia/Sydney');
        this.tzOffset = new Date().getTimezoneOffset() === 0 ? 0 : -1 * new Date().getTimezoneOffset() / 60;
        this.submitHandler = this.submitHandler.bind(this);
        this.toggleDeleteConfirmModal = this.toggleDeleteConfirmModal.bind(this);
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleScansSlider: PropTypes.func.isRequired,
        scans: PropTypes.array.isRequired,
        clientname: PropTypes.string,
        fps: PropTypes.array,
        getScans: PropTypes.func.isRequired,
        createScan: PropTypes.func.isRequired,
        updateScan: PropTypes.func.isRequired,
        deleteScan: PropTypes.func.isRequired,
        booking: PropTypes.object,
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { isOpen, booking } = nextProps;

        if (!this.props.isOpen && isOpen) {
            this.props.getScans(booking.id);
        }
    }

    notify = (text) => toast(text);

    toggleDeleteConfirmModal() {
        this.setState(prevState => ({isShowDeleteConfirmModal: !prevState.isShowDeleteConfirmModal}));
    }

    onClickNewBtn() {
        let conveted_date = moment().add(this.tzOffset, 'h');               // Current -> UTC
        conveted_date = conveted_date.add(timeDiff, 'h');                   // UTC -> Sydney
        const formInputs = {
            'name': '',
            'desc': '',
            'applied_at': conveted_date
        };
        this.setState({viewMode: 1, saveMode: 0, formInputs});
    }

    onClickEditBtn(scan) {
        const { fps } = this.props;
        const { formInputs } = this.state;
        const fp = fps.find((fp) => fp.id === parseInt(scan.fp));

        formInputs['id'] = scan.id;
        formInputs['status'] = scan.status;
        formInputs['desc'] = scan.desc;
        formInputs['event_timestamp'] = scan.event_timestamp;
        formInputs['fp'] = fp.id;

        if (scan.booking) {
            formInputs['booking'] = scan.booking;
        }

        this.setState({viewMode: 1, saveMode: 1, formInputs});
    }

    onClickDeleteBtn(scan) {
        this.toggleDeleteConfirmModal();
        this.setState({selectedScan: scan});
    }

    onClickConfirmBtn() {
        const { selectedScan } = this.state;
        this.props.deleteScan(selectedScan);
        this.toggleDeleteConfirmModal();
    }

    submitHandler(e) {
        e.preventDefault();
        const { formInputs, saveMode } = this.state;

        if (saveMode === 0) {
            formInputs['booking'] = this.props.booking.id;
            this.props.createScan(formInputs);
        } else if (saveMode === 1) {
            this.props.updateScan(formInputs);
        }
        
        this.setState({viewMode: 0});
    }

    onClickCancelBtn() {
        this.setState({viewMode: 0});
    }
    
    onInputChange(event) {
        const { formInputs } = this.state;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        formInputs[name] = value;
        this.setState({formInputs});
    }

    onChangeDateTime(date, fieldName) {
        const { formInputs } = this.state;
        let conveted_date = moment(date).add(this.tzOffset, 'h');           // Current -> UTC
        conveted_date = conveted_date.add(timeDiff, 'h');                   // UTC -> Sydney

        formInputs[fieldName] = conveted_date;
        this.setState({formInputs});
    }

    render() {
        const { isOpen, scans, toggleScansSlider, clientname, fps } = this.props;
        const { viewMode, formInputs, saveMode } = this.state;
        const fpOptions = fps.map((fp, index) => (<option key={index} value={fp.id}>{fp.fp_company_name}</option>));

        const scanList = (scans || [])
            .map((scan, index) => {
                const fp = fps.find((fp) => fp.id === parseInt(scan.fp));

                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{fp.fp_company_name}</td>
                        <td>{scan.status}</td>
                        <td>{scan.desc}</td>
                        <td>{scan.event_timestamp && moment(scan.event_timestamp).format('DD/MM/YYYY HH:mm:ss')}</td>
                        {clientname === 'dme' &&
                            <td>
                                <Button color="primary" onClick={() => this.onClickEditBtn(scan)}>
                                    <i className="icon icon-pencil"></i>
                                </Button>
                            </td>
                        }
                        {clientname === 'dme' &&
                            <td>
                                <Button color="danger" onClick={() => this.onClickDeleteBtn(scan)}>
                                    <i className="icon icon-trash"></i>
                                </Button>
                            </td>
                        }
                    </tr>
                );
            });

        return (
            <SlidingPane
                className='sh-slider'
                overlayClassName='sh-slider-overlay'
                isOpen={isOpen}
                title='Scans Slider'
                subtitle={'List View'}
                onRequestClose={toggleScansSlider}
            >
                <div className="slider-content">
                    {viewMode === 1 &&
                        <div className="form-view">
                            <h2>{saveMode === 0 ? 'Create a new FP Scan' : 'Update FP Scan'}</h2>
                            <form onSubmit={this.submitHandler}>
                                <label>
                                    <span className="text-left">Status</span>
                                    <input
                                        className="form-control"
                                        required
                                        name="status"
                                        value={formInputs['status']}
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Description</span>
                                    <input
                                        className="form-control"
                                        required
                                        name="desc"
                                        value={formInputs['desc']}
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Select a Freight Provider</span>
                                    <select 
                                        required
                                        name='fp'
                                        onChange={(e) => this.onInputChange(e)}
                                        value={formInputs['fp']}
                                    >
                                        <option key={0} value="" disabled selected={saveMode === 0 && 'selected'}>Select a FP</option>
                                        {fpOptions}
                                    </select>
                                </label><br />
                                <label>
                                    <span className="text-left">Scan timestamp</span>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeDateTime(date, 'event_timestamp')}
                                        value={formInputs['event_timestamp'] ?
                                            new Date(moment(formInputs['event_timestamp']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))
                                            : null}
                                        format={'dd/MM/yyyy HH:mm'}
                                    />
                                </label><br />
                                <Button type="submit" color="primary">Save</Button>
                                <Button color="danger" onClick={() => this.onClickCancelBtn()}>Cancel</Button>
                            </form>
                        </div>
                    }
                    {viewMode === 0 &&
                        <div className="list-view">
                            {clientname === 'dme' && <Button className="new" color="primary" onClick={() => this.onClickNewBtn()}>+</Button>}
                            {(scans || []).length === 0 ?
                                <p>No results found</p>
                                :
                                <div>
                                    <table className="table table-hover table-bordered sortable fixed_headers">
                                        <tr>
                                            <th className="" scope="col" nowrap><p>No</p></th>
                                            <th className="" scope="col" nowrap><p>Freight Provider</p></th>
                                            <th className="" scope="col" nowrap><p>Status</p></th>
                                            <th className="" scope="col" nowrap><p>Description</p></th>
                                            <th className="" scope="col" nowrap><p>Scanned timestamp</p></th>
                                            {clientname === 'dme' && <th className="" scope="col" nowrap><p>Edit</p></th>}
                                            {clientname === 'dme' && <th className="" scope="col" nowrap><p>Delete</p></th>}
                                        </tr>
                                        { scanList }
                                    </table>
                                </div>
                            }
                        </div>
                    }
                </div>

                <ConfirmModal
                    isOpen={this.state.isShowDeleteConfirmModal}
                    onOk={() => this.onClickConfirmBtn('delete')}
                    onCancel={this.toggleDeleteConfirmModal}
                    title={'Delete FP Scan'}
                    text={'Are you sure you want to delete this FP Scan?'}
                    okBtnName={'Delete'}
                />

                <ToastContainer />
            </SlidingPane>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        scans: state.extra.scans,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getScans: (bookingId) => dispatch(getScans(bookingId)),
        createScan: (scan) => dispatch(createScan(scan)),
        updateScan: (scan) => dispatch(updateScan(scan)),
        deleteScan: (scan) => dispatch(deleteScan(scan)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScansSlider));
