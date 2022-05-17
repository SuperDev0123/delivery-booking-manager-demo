// React Libs
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'reactstrap';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import DateTimePicker from 'react-datetime-picker';

import ConfirmModal from '../CommonModals/ConfirmModal';
import { getSurcharges, createSurcharge, updateSurcharge, deleteSurcharge } from '../../state/services/costService';
// Constants
import { timeDiff } from '../../commons/constants';

class AdditionalSurchargeSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 0, // 0: List, 1: Form
            saveMode: 0, // 0: Create, 1: Update
            formInputs: {},
            errorMessage: null,
            selectedSurcharge: null,
            isShowDeleteConfirmModal: false,
            bookingId: '',
        };

        moment.tz.setDefault('Australia/Sydney');
        this.tzOffset = new Date().getTimezoneOffset() === 0 ? 0 : -1 * new Date().getTimezoneOffset() / 60;
        this.submitHandler = this.submitHandler.bind(this);
        this.toggleDeleteConfirmModal = this.toggleDeleteConfirmModal.bind(this);
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        booking: PropTypes.object.isRequired,
        clientname: PropTypes.string,
        fps: PropTypes.array,
        bookingId: PropTypes.string,
        surcharges: PropTypes.array.isRequired,
        getSurcharges: PropTypes.func.isRequired,
        createSurcharge: PropTypes.func.isRequired,
        updateSurcharge: PropTypes.func.isRequired,
        deleteSurcharge: PropTypes.func.isRequired,
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen) {
            if (nextProps.fps.length > 0 && nextProps.booking.id)
                if (nextProps.booking.id !== this.state.bookingId) {
                    this.setState({bookingId: nextProps.booking.id});
                    this.props.getSurcharges(nextProps.booking.id);
                }
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
            'qty': 1,
            'is_manually_entered': true,
            'booked_date': conveted_date
        };
        this.setState({viewMode: 1, saveMode: 0, formInputs});
    }

    onClickEditBtn(surcharge) {
        const { fps } = this.props;
        const { formInputs } = this.state;
        const fp = fps.find((fp) => fp.id === parseInt(surcharge.fp));

        if (!surcharge['is_manually_entered']) {
            this.notify('It is not recommended to edit `AUTO` surcharge!');
        }

        formInputs['id'] = surcharge.id;
        formInputs['name'] = surcharge.name;
        formInputs['visible'] = surcharge.visible;
        formInputs['is_manually_entered'] = surcharge.is_manually_entered;
        formInputs['booked_date'] = surcharge.booked_date;
        formInputs['eta_pu_date'] = surcharge.eta_pu_date;
        formInputs['eta_de_date'] = surcharge.eta_de_date;
        formInputs['actual_pu_date'] = surcharge.actual_pu_date;
        formInputs['actual_de_date'] = surcharge.actual_de_date;
        formInputs['fp'] = surcharge.fp;
        formInputs['connote_or_reference'] = surcharge.connote_or_reference;
        formInputs['qty'] = surcharge.qty;
        formInputs['amount'] = surcharge.amount;
        formInputs['markup_percentage'] = fp.fp_markupfuel_levy_percent;

        if (surcharge.booking) {
            formInputs['booking'] = surcharge.booking;
        }

        this.setState({viewMode: 1, saveMode: 1, formInputs});
    }

    onClickDeleteBtn(surcharge) {
        if (!surcharge['is_manually_entered']) {
            this.notify('It is not recommended to edit `AUTO` surcharge!');
        }

        this.toggleDeleteConfirmModal();
        this.setState({selectedSurcharge: surcharge});
    }

    onClickConfirmBtn() {
        const { selectedSurcharge } = this.state;
        this.props.deleteSurcharge(selectedSurcharge);
        this.toggleDeleteConfirmModal();
    }

    submitHandler(e) {
        e.preventDefault();
        const { formInputs, saveMode } = this.state;

        if (saveMode === 0) {
            formInputs['booking'] = this.props.booking.id;
            this.props.createSurcharge(formInputs);
        } else if (saveMode === 1) {
            this.props.updateSurcharge(formInputs);
        }
        
        this.setState({viewMode: 0});
    }

    onClickCancelBtn() {
        this.setState({viewMode: 0});
    }

    onInputChange(event) {
        const { fps } = this.props;
        const { formInputs } = this.state;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name === 'fp') {
            const fp = fps.find((fp) => fp.id === parseInt(value));
            formInputs['markup_percentage'] = fp.fp_markupfuel_levy_percent;
        }

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
        const { isOpen, surcharges, clientname, fps } = this.props;
        const { viewMode, formInputs, saveMode } = this.state;
        const fpOptions = fps.map((fp, index) => (<option key={index} value={fp.id}>{fp.fp_company_name}</option>));

        const surchargeList = (surcharges || [])
            .filter(surcharge => clientname === 'dme' || (clientname !== 'dme' && surcharge.visible))
            .map((surcharge, index) => {
                const fp = fps.find((fp) => fp.id === parseInt(surcharge.fp));
                formInputs['markup_percentage'] = fp.fp_markupfuel_levy_percent;

                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        {clientname === 'dme' && <td>{surcharge.visible ? 'Yes' : 'No'}</td>}
                        <td>{surcharge.is_manually_entered ? 'Yes, manually' : 'No'}</td>
                        <td>{fp.fp_company_name}</td>
                        <td>{surcharge.name}</td>
                        <td>{surcharge.connote_or_reference}</td>
                        <td>{surcharge.description ? surcharge.description : surcharge.name}</td>
                        <td>{surcharge.booked_date && moment(surcharge.booked_date).format('DD/MM/YYYY HH:mm')}</td>
                        <td>{surcharge.eta_pu_date && moment(surcharge.eta_pu_date).format('DD/MM/YYYY HH:mm')}</td>
                        <td>{surcharge.eta_de_date && moment(surcharge.eta_de_date).format('DD/MM/YYYY HH:mm')}</td>
                        <td>{surcharge.actual_pu_date && moment(surcharge.actual_pu_date).format('DD/MM/YYYY HH:mm')}</td>
                        <td>{surcharge.actual_de_date && moment(surcharge.actual_de_date).format('DD/MM/YYYY HH:mm')}</td>
                        <td>{parseFloat(surcharge.qty).toFixed(2)}</td>
                        <td>{parseFloat(formInputs['markup_percentage'] * 100).toFixed(2) + '%'}</td>
                        {clientname === 'dme' && <td>${parseFloat(surcharge.amount).toFixed(2)}</td>}
                        {clientname === 'dme' && <td>${parseFloat(surcharge.amount * surcharge.qty).toFixed(2)}</td>}
                        <td>${(parseFloat(surcharge.amount) * (1 + parseFloat(formInputs['markup_percentage']))).toFixed(2)}</td>
                        <td>${(parseFloat(surcharge.qty) * parseFloat(surcharge.amount) * (1 + parseFloat(formInputs['markup_percentage']))).toFixed(2)}</td>
                        {clientname === 'dme' &&
                            <td>
                                <Button color="primary" onClick={() => this.onClickEditBtn(surcharge)}>
                                    <i className="icon icon-pencil"></i>
                                </Button>
                            </td>
                        }
                        {clientname === 'dme' &&
                            <td>
                                <Button color="danger" onClick={() => this.onClickDeleteBtn(surcharge)}>
                                    <i className="icon icon-trash"></i>
                                </Button>
                            </td>
                        }
                    </tr>
                );
            });

        return (
            <SlidingPane
                className='additional-surcharge-slider'
                overlayClassName='additional-surcharge-slider-overlay'
                isOpen={isOpen}
                title='Linked Services Slider'
                subtitle={viewMode === 0 ? 'List View' : 'Form View'}
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
                    {viewMode === 1 &&
                        <div className="form-view">
                            <h2>{saveMode === 0 ? 'Create a new Service' : 'Update Service'}</h2>
                            <form onSubmit={this.submitHandler}>
                                <label>
                                    <span className="text-left">Visible to customer</span>
                                    <div>
                                        <input
                                            className="checkbox"
                                            name="visible"
                                            type="checkbox"
                                            checked={formInputs['visible']}
                                            onChange={(e) => this.onInputChange(e)}
                                        />
                                    </div>
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
                                    <span className="text-left">Service Name</span>
                                    <input
                                        className="form-control"
                                        required
                                        name="name"
                                        value={formInputs['name']}
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Connote / Reference</span>
                                    <input
                                        className="form-control"
                                        required
                                        name="connote_or_reference"
                                        value={formInputs['connote_or_reference']}
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Booked Date</span>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeDateTime(date, 'booked_date')}
                                        value={formInputs['booked_date'] ?
                                            new Date(moment(formInputs['booked_date']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))
                                            : null}
                                        format={'dd/MM/yyyy HH:mm'}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Estimated Pickup Date</span>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeDateTime(date, 'eta_pu_date')}
                                        value={formInputs['eta_pu_date'] ?
                                            new Date(moment(formInputs['eta_pu_date']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))
                                            : null}
                                        format={'dd/MM/yyyy HH:mm'}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Estimated Delivery Date</span>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeDateTime(date, 'eta_de_date')}
                                        value={formInputs['eta_de_date'] ?
                                            new Date(moment(formInputs['eta_de_date']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))
                                            : null}
                                        format={'dd/MM/yyyy HH:mm'}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Actual Pickup Date</span>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeDateTime(date, 'actual_pu_date')}
                                        value={formInputs['actual_pu_date'] ?
                                            new Date(moment(formInputs['actual_pu_date']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))
                                            : null}
                                        format={'dd/MM/yyyy HH:mm'}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Actual Delivery Date</span>
                                    <DateTimePicker
                                        onChange={(date) => this.onChangeDateTime(date, 'actual_de_date')}
                                        value={formInputs['actual_de_date'] ?
                                            new Date(moment(formInputs['actual_de_date']).toDate().toLocaleString('en-US', {timeZone: 'Australia/Sydney'}))
                                            : null}
                                        format={'dd/MM/yyyy HH:mm'}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Amount ($)</span>
                                    <input
                                        className="form-control"
                                        required
                                        type="number"
                                        step="0.01"
                                        name="amount"
                                        value={formInputs['amount']}
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Quantity</span>
                                    <input
                                        className="form-control"
                                        required
                                        type="number"
                                        step="1"
                                        name="qty"
                                        value={formInputs['qty']}
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Total Cost Ex GST to Deliver-ME</span>
                                    <input
                                        className="form-control"
                                        disabled
                                        value={formInputs['amount'] ? `$${(formInputs['amount'] * formInputs['qty'])}` : 'N/A'}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">MarkUp Percent</span>
                                    <input
                                        className="form-control"
                                        disabled
                                        name="markup_percentage"
                                        value={formInputs['markup_percentage'] && `$${formInputs['markup_percentage'] * 100}%`}
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Unit Sell ex GST to the customer</span>
                                    <input
                                        className="form-control"
                                        disabled
                                        value={(formInputs['amount'] && formInputs['markup_percentage']) ?
                                            `$${(formInputs['amount'] * (1 + formInputs['markup_percentage']))}` : 'N/A'}
                                    />
                                </label><br />
                                <label>
                                    <span className="text-left">Total Sell ex GST to the customer</span>
                                    <input
                                        className="form-control"
                                        disabled
                                        value={(formInputs['amount'] && formInputs['markup_percentage']) ?
                                            `$${(parseFloat(formInputs['amount'] * formInputs['qty']) * (1 + formInputs['markup_percentage'])).toFixed(2)}` : 'N/A'}
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
                            {(surcharges || []).length === 0 ?
                                <p>No results found</p>
                                :
                                <div>
                                    <table className="table table-hover table-bordered sortable fixed_headers">
                                        <tr>
                                            <th className="" scope="col" nowrap><p>No</p></th>
                                            {clientname === 'dme' && <th className="" scope="col" nowrap><p>Visible to Customer</p></th>}
                                            <th className="" scope="col" nowrap><p>Is Manually Entered?</p></th>
                                            <th className="" scope="col" nowrap><p>Booked Date</p></th>
                                            <th className="" scope="col" nowrap><p>Freight Provider or Supplier</p></th>
                                            <th className="" scope="col" nowrap><p>Service Name</p></th>
                                            <th className="" scope="col" nowrap><p>Connote or Reference</p></th>
                                            <th className="" scope="col" nowrap><p>Service / Surcharge Description</p></th>
                                            <th className="" scope="col" nowrap><p>ETA Pickup Date</p></th>
                                            <th className="" scope="col" nowrap><p>ETA Delivery Date</p></th>
                                            <th className="" scope="col" nowrap><p>Actual Pickup Date</p></th>
                                            <th className="" scope="col" nowrap><p>Actual Delivery Date</p></th>
                                            <th className="" scope="col" nowrap><p>Quantity</p></th>
                                            <th className="" scope="col" nowrap><p>Markup %</p></th>
                                            {clientname === 'dme' && <th className="" scope="col" nowrap><p>Unit Cost Amount to Deliver-ME Ex GST</p></th>}
                                            {clientname === 'dme' && <th className="" scope="col" nowrap><p>Total Cost Ex GST to Deliver-ME</p></th>}
                                            <th className="" scope="col" nowrap><p>Unit Sell ex GST</p></th>
                                            <th className="" scope="col" nowrap><p>Total Sell ex GST</p></th>
                                            {clientname === 'dme' && <th className="" scope="col" nowrap><p>Edit</p></th>}
                                            {clientname === 'dme' && <th className="" scope="col" nowrap><p>Delete</p></th>}
                                        </tr>
                                        { surchargeList }
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
                    title={'Delete Cost Option'}
                    text={'Are you sure you want to delete this cost?'}
                    okBtnName={'Delete'}
                />

                <ToastContainer />
            </SlidingPane>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        surcharges: state.cost.surcharges,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getSurcharges: (bookingId) => dispatch(getSurcharges(bookingId)),
        createSurcharge: (surcharge) => dispatch(createSurcharge(surcharge)),
        updateSurcharge: (surcharge) => dispatch(updateSurcharge(surcharge)),
        deleteSurcharge: (surcharge) => dispatch(deleteSurcharge(surcharge)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdditionalSurchargeSlider));
