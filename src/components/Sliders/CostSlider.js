// React Libs
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// import _ from 'lodash';
import moment from 'moment';

import { Button } from 'reactstrap';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

import ConfirmModal from '../CommonModals/ConfirmModal';
import { getCostOptionMaps, getBookingCostOptions, createBookingCostOption, updateBookingCostOption, deleteBookingCostOption } from '../../state/services/costService';

class CostSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 0, // 0: List, 1: Form
            saveMode: 0, // 0: Create, 1: Update
            formInputs: {},
            errorMessage: null,
            selectedBookingCostOption: null,
            isShowDeleteConfirmModal: false,
        };

        moment.tz.setDefault('Australia/Sydney');
        this.submitHandler = this.submitHandler.bind(this);
        this.toggleDeleteConfirmModal = this.toggleDeleteConfirmModal.bind(this);
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        booking: PropTypes.object.isRequired,
        costOptionMaps: PropTypes.array.isRequired,
        bookingCostOptions: PropTypes.array.isRequired,
        getCostOptionMaps: PropTypes.func.isRequired,
        getBookingCostOptions: PropTypes.func.isRequired,
        createBookingCostOption: PropTypes.func.isRequired,
        updateBookingCostOption: PropTypes.func.isRequired,
        deleteBookingCostOption: PropTypes.func.isRequired,
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { isOpen } = nextProps;

        if (!this.props.isOpen && isOpen) {
            this.props.getCostOptionMaps(this.props.booking.vx_freight_provider);
            this.props.getBookingCostOptions(this.props.booking.id);
        }
    }

    toggleDeleteConfirmModal() {
        this.setState(prevState => ({isShowDeleteConfirmModal: !prevState.isShowDeleteConfirmModal}));
    }

    onClickNewBtn() {
        const formInputs = {
            'qty': 1,
        };
        this.setState({viewMode: 1, saveMode: 0, formInputs});
    }

    onClickEditBtn(bookingCostOption) {
        const { formInputs } = this.state;
        formInputs['id'] = bookingCostOption.id;
        formInputs['cost_option'] = bookingCostOption.cost_option;
        formInputs['amount'] = bookingCostOption.amount;
        formInputs['qty'] = bookingCostOption.qty;
        this.setState({viewMode: 1, saveMode: 1, formInputs});
    }

    onClickDeleteBtn(bookingCostOption) {
        this.toggleDeleteConfirmModal();
        this.setState({selectedBookingCostOption: bookingCostOption});
    }

    onClickConfirmBtn() {
        const { selectedBookingCostOption } = this.state;
        this.props.deleteBookingCostOption(selectedBookingCostOption);
        this.toggleDeleteConfirmModal();
    }

    submitHandler(e) {
        e.preventDefault();
        const { formInputs, saveMode } = this.state;

        formInputs['booking'] = this.props.booking.id;

        if (saveMode === 0) {
            this.props.createBookingCostOption(this.state.formInputs);
        } else if (saveMode === 1) {
            this.props.updateBookingCostOption(this.state.formInputs);
        }
        
        this.setState({viewMode: 0});
    }

    onClickCancelBtn() {
        this.setState({viewMode: 0});
    }

    onInputChange(event) {
        const {formInputs} = this.state;
        const target = event.target;
        const value = target.value;
        const name = target.name;

        formInputs[name] = value;
        this.setState({formInputs});
    }

    render() {
        const { isOpen, costOptionMaps, bookingCostOptions } = this.props;
        const { viewMode, formInputs, saveMode } = this.state;

        const bookingCostOptionList = (bookingCostOptions || []).map((bookingCostOption, index) => {
            let cost_option_desc;
            if (costOptionMaps.length > 0) {
                cost_option_desc = costOptionMaps.find(costOptionMap => 
                    costOptionMap.cost_option.id === bookingCostOption.cost_option
                ).cost_option.description;
            }

            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{cost_option_desc}</td>
                    <td>${parseFloat(bookingCostOption.amount).toFixed(2)}</td>
                    <td>{parseFloat(bookingCostOption.qty).toFixed(2)}</td>
                    <td>{moment(bookingCostOption.z_createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                    <td>
                        <Button
                            color="primary"
                            onClick={() => this.onClickEditBtn(bookingCostOption)}
                        >
                            <i className="icon icon-pencil"></i>
                        </Button>
                    </td>
                    <td>
                        <Button
                            color="danger"
                            onClick={() => this.onClickDeleteBtn(bookingCostOption)}
                        >
                            <i className="icon icon-trash"></i>
                        </Button>
                    </td>
                </tr>
            );
        });

        return (
            <SlidingPane
                className='cost-slider'
                overlayClassName='cost-slider-overlay'
                isOpen={isOpen}
                title='Extra Cost Slider'
                subtitle={viewMode === 0 ? 'List View' : 'Form View'}
                onRequestClose={this.props.toggleSlider}
            >
                <div className="slider-content">
                    {viewMode === 1 &&
                        <div className="form-view">
                            <form onSubmit={this.submitHandler}>
                                <label>
                                    <span className="text-left">Cost type</span>
                                    <select required name="cost_option" className="form-control" onChange={(e) => this.onInputChange(e)}>
                                        <option key={0} value="" disabled selected={saveMode === 0 && 'selected'}>Select cost type</option>
                                        {costOptionMaps.map((costOptionMap, index) =>
                                            <option
                                                key={index + 1}
                                                value={costOptionMap.cost_option.id}
                                                disabled={
                                                    saveMode === 0 ?
                                                        bookingCostOptions.find(bookingCostOption => bookingCostOption.cost_option === costOptionMap.cost_option.id) && 'disabled'
                                                        :
                                                        costOptionMap.cost_option.id != formInputs['cost_option'] && 'disabled'
                                                }
                                                selected={saveMode === 1 && costOptionMap.cost_option == formInputs['cost_option'] && 'selected'}
                                            >
                                                {costOptionMap.cost_option.description}
                                            </option>)
                                        }
                                    </select>
                                </label><br />
                                <label>
                                    <span className="text-left">Amount</span>
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
                                        step="0.01"
                                        name="qty"
                                        value={formInputs['qty']}
                                        onChange={(e) => this.onInputChange(e)}
                                    />
                                </label><br />
                                <Button type="submit" color="primary">Save</Button>
                                <Button color="danger" onClick={() => this.onClickCancelBtn()}>Cancel</Button>
                            </form>
                        </div>
                    }
                    {viewMode === 0 &&
                        <div className="list-view">
                            <Button className="new" color="primary" onClick={() => this.onClickNewBtn()}>+</Button>
                            {(bookingCostOptions || []).length === 0 ?
                                <p>No results found</p>
                                :
                                <div>
                                    <table className="table table-hover table-bordered sortable fixed_headers">
                                        <tr>
                                            <th className="" scope="col" nowrap><p>No</p></th>
                                            <th className="" scope="col" nowrap><p>Description</p></th>
                                            <th className="" scope="col" nowrap><p>Amount</p></th>
                                            <th className="" scope="col" nowrap><p>Quantity</p></th>
                                            <th className="" scope="col" nowrap><p>Created At</p></th>
                                            <th className="" scope="col" nowrap><p>Edit</p></th>
                                            <th className="" scope="col" nowrap><p>Delete</p></th>
                                        </tr>
                                        { bookingCostOptionList }
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
            </SlidingPane>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        costOptionMaps: state.cost.costOptionMaps,
        bookingCostOptions: state.cost.bookingCostOptions,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCostOptionMaps: (fpName) => dispatch(getCostOptionMaps(fpName)),
        getBookingCostOptions: (bookingId) => dispatch(getBookingCostOptions(bookingId)),
        createBookingCostOption: (bookingCostOption) => dispatch(createBookingCostOption(bookingCostOption)),
        updateBookingCostOption: (bookingCostOption) => dispatch(updateBookingCostOption(bookingCostOption)),
        deleteBookingCostOption: (bookingCostOption) => dispatch(deleteBookingCostOption(bookingCostOption)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CostSlider));
