import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import moment from 'moment';

import { Button } from 'reactstrap';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

class CostSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 0, // 0: List, 1: Form
            saveMode: 0, // 0: Create, 1: Update
            formInputs: {},
            errorMessage: null,
        };

        moment.tz.setDefault('Australia/Sydney');
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        costOptionMaps: PropTypes.array,
        bookingCostOptions: PropTypes.array,
    };

    // UNSAFE_componentWillReceiveProps(nextProps) {
    // }

    onClickNewBtn() {
        const formInputs = {};
        formInputs['qty'] = 1;
        this.setState({viewMode: 1, saveMode: 0, formInputs});
    }

    onClickEditBtn(bookingCostOption) {
        console.log('@1 - ', bookingCostOption);
    }

    onClickDeleteBtn(bookingCostOption) {
        console.log('@2 - ', bookingCostOption);
    }

    // onInputChange(event) {
    //     this.setState({b_booking_project: event.target.value, errorMessage: ''});
    // }

    render() {
        const { isOpen, bookingCostOptions } = this.props;
        const { viewMode, errorMessage } = this.state;

        console.log('@1 - ', this.props.costOptionMaps);

        const bookingCostOptionList = (bookingCostOptions || []).map((bookingCostOption, index) => {
            const cost_option_desc = this.props.costOptionMaps.find(costOptionMap => 
                costOptionMap.cost_option.id === bookingCostOption.cost_option
            ).cost_option.description;

            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{cost_option_desc}</td>
                    <td>${bookingCostOption.amount}</td>
                    <td>{bookingCostOption.qty}</td>
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
                            {!_.isEmpty(errorMessage) &&
                                <label>
                                    <p className='red'>{errorMessage}</p>
                                </label>
                            }
                            <Button color="primary" onClick={() => this.onClickSave()}>Save</Button>
                            <Button color="danger" onClick={() => this.props.toggleSlider()}>Cancel</Button>
                        </div>
                    }
                    {viewMode === 0 &&
                        <div className="list-view">
                            {(bookingCostOptions || []).length === 0 ?
                                <p>No results found</p>
                                :
                                <div>
                                    <Button color="primary" onClick={() => this.onClickNewBtn()}>+</Button>
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
            </SlidingPane>
        );
    }
}

export default CostSlider;
