import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import _ from 'lodash';
import moment from 'moment-timezone';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'reactstrap';

import FreightOptionAccordion from '../../components/Accordion/FreightOptionAccordion';
import { getBokWithPricings, onSelectPricing, bookFreight, cancelFreight, autoRepack } from '../../state/services/bokService';
import ExtraCostSummarySlider from '../../components/Sliders/ExtraCostSummarySlider';
import PalletSlider from '../../components/Sliders/PalletSlider';
import { getCubicMeter, getWeight } from '../../commons/helpers';

class BokPricePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isCanceled: null,
            isBooked: null,
            sortedBy: 'lowest',
            isLoadingBok: false,
            isLoadingPricing: false,
            isLoadingOper: false,
            isAutoRepacking: false,
            isShowExtraCostSummarySlider: false,
            isShowPalletSlider: false,
            isShowLineData: false,
            selectedPrice: {},
        };

        this.toggleExtraCostSummarySlider = this.toggleExtraCostSummarySlider.bind(this);
        this.togglePalletSlider = this.togglePalletSlider.bind(this);
        this.onCancelAutoRepack = this.onCancelAutoRepack.bind(this);
    }

    static propTypes = {
        getBokWithPricings: PropTypes.func.isRequired,
        onSelectPricing: PropTypes.func.isRequired,
        onBookFreight: PropTypes.func.isRequired,
        onCancelFreight: PropTypes.func.isRequired,
        onAutoRepack: PropTypes.func.isRequired,
        bokWithPricings: PropTypes.object,
        match: PropTypes.object,
        loadSuccess: PropTypes.bool,
        bookedSuccess: PropTypes.bool,
        canceledSuccess: PropTypes.bool,
        selectPricingSuccess: PropTypes.bool,
        autoRepackSuccess: PropTypes.bool,
    };

    componentDidMount() {
        const identifier = this.props.match.params.id;

        if (identifier && identifier.length > 32) {
            this.props.getBokWithPricings(identifier);
            this.setState({isLoadingBok: true});
        } else {
            this.setState({errorMessage: 'Wrong id.'});
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {errorMessage, needToUpdatePricings, bookedSuccess, canceledSuccess} = newProps;

        if (errorMessage) {
            this.setState({errorMessage});
        }

        if (needToUpdatePricings) {
            const identifier = this.props.match.params.id;
            this.props.getBokWithPricings(identifier);
            this.setState({isLoadingBok: true});
        }

        if (bookedSuccess) {
            this.notify('Freight is booked successfully');
            this.setState({isBooked: true});
        }

        if (canceledSuccess) {
            this.notify('Freight is canceled successfully');
            this.setState({isCanceled: true});
            this.notify('Browser tab will be closed in 3 seconds');

            setTimeout(() => {
                open(location, '_self').close();
            }, 3000);
        }

        if (this.state.isLoadingBok && !this.props.loadSuccess && newProps.loadSuccess) {
            this.setState({isLoadingBok: false});
        }

        if (this.state.isLoadingPricing && !this.props.selectPricingSuccess && newProps.selectPricingSuccess) {
            this.setState({isLoadingPricing: false});
        }

        if (this.state.isLoadingOper && (!this.props.bookedSuccess && newProps.bookedSuccess)) {
            this.setState({isLoadingOper: false});
        }

        if (this.state.isLoadingOper && (!this.props.canceledSuccess && newProps.canceledSuccess)) {
            this.setState({isLoadingOper: false});
        }

        if (this.state.isAutoRepacking && !this.props.autoRepackSuccess && newProps.autoRepackSuccess) {
            this.setState({isAutoRepacking: false, isLoadingBok: true});
            this.props.getBokWithPricings(this.props.match.params.id);
        }
    }

    notify = (text) => {
        toast(text);
    };

    copyToClipBoard = async text => {
        try {
            await navigator.clipboard.writeText(text);
            this.notify('Copied!');
        } catch (err) {
            this.notify('Failed to copy!');
        }
    };

    onClickColumn = (arg) => {
        this.setState({sortedBy: arg});
    }

    onClickCancelBtn() {
        this.setState({isLoadingOper: true});
        this.props.onCancelFreight(this.props.match.params.id);
    }

    onClickBookBtn() {
        this.setState({isLoadingOper: true});
        this.props.onBookFreight(this.props.match.params.id);
    }

    onSelectPricing(cost_id) {
        const {b_090_client_overrided_quote} = this.state;
        this.setState({isLoadingPricing: true});
        this.props.onSelectPricing(cost_id, this.props.match.params.id, parseFloat(b_090_client_overrided_quote).toFixed(2));
    }

    toggleExtraCostSummarySlider() {
        this.setState(prevState => ({isShowExtraCostSummarySlider: !prevState.isShowExtraCostSummarySlider}));
    }

    togglePalletSlider() {
        this.setState(prevState => ({isShowPalletSlider: !prevState.isShowPalletSlider}));
    }

    onClickShowLineData(bok_2) {
        this.setState({isShowLineData: true, selectedBok_2Id: bok_2.pk_booking_lines_id});
    }

    onClickAutoRepack(status) {
        if (status) {
            this.setState({isShowPalletSlider: true});
        } else {
            this.setState({isAutoRepacking: true, isShowLineData: false});
            this.props.onAutoRepack(this.props.match.params.id, status, null);
        }
    }

    onCancelAutoRepack() {
        const {bokWithPricings} = this.props;

        bokWithPricings.b_081_b_pu_auto_pack = false;
        this.setState({bokWithPricings});
    }

    onSelectPallet(palletId) {
        this.setState({isAutoRepacking: true, isShowLineData: false});
        this.props.onAutoRepack(this.props.match.params.id, true, palletId);
        this.togglePalletSlider();
    }

    onClickSurcharge(price) {
        this.setState({selectedPrice: price});
        this.toggleExtraCostSummarySlider();
    }

    render() {
        const {sortedBy, isBooked, isCanceled, isShowLineData, selectedBok_2Id} = this.state;
        const {bokWithPricings} = this.props;

        let bok_1, bok_2s, bok_3s, pricings;
        let isPricingPage = true;
        let canBeChanged = true;
        let sortedPricings = [];
        let isSalesQuote = false;
        let totalCubicMeter = 0;
        let totalLinesCnt = 0;
        let totalLinesKg = 0;

        if (isBooked || isCanceled || (bokWithPricings && Number(bokWithPricings['success']) !== 3) ) {
            canBeChanged = false;
        }

        if (
            bokWithPricings &&
            bokWithPricings['b_client_order_num'][0] === 'Q' &&
            bokWithPricings['b_client_order_num'][1] === '_'
        ) {
            isSalesQuote = true;
        }

        if (bokWithPricings) {
            bokWithPricings['pricings'].map((price, index) => {
                bokWithPricings['pricings'][index]['total'] = (price['client_mu_1_minimum_values'].toFixed(2));
                bokWithPricings['pricings'][index]['sell'] = (price['client_mu_1_minimum_values'] * (1 + price['client_customer_mark_up'])).toFixed(2);
            });
        }

        if (bokWithPricings && sortedBy === 'lowest') {
            sortedPricings = _.sortBy(bokWithPricings['pricings'], ['total']);
        } else if (bokWithPricings && sortedBy === 'fastest') {
            sortedPricings = _.sortBy(bokWithPricings['pricings'], ['eta_in_hour']);
        }

        if (bokWithPricings) {
            bok_1 = bokWithPricings;
            bok_2s = bok_1['bok_2s'].map((bok_2, index) => {
                totalLinesKg += getWeight(bok_2['l_002_qty'], bok_2['l_008_weight_UOM'], bok_2['l_009_weight_per_each']);
                totalLinesCnt += bok_2['l_002_qty'];
                totalCubicMeter += getCubicMeter(bok_2['l_002_qty'], bok_2['l_004_dim_UOM'], bok_2['l_005_dim_length'], bok_2['l_006_dim_width'], bok_2['l_007_dim_height']);

                return (
                    <tr key={index}>
                        <td>{bok_2['l_001_type_of_packaging']}</td>
                        <td>{bok_2['zbl_121_integer_1']}</td>
                        <td>{bok_2['e_item_type']}</td>
                        <td>{bok_2['l_003_item']}</td>
                        <td>{bok_2['l_002_qty']}</td>
                        <td>{bok_2['l_004_dim_UOM']}</td>
                        <td>{bok_2['l_005_dim_length']}</td>
                        <td>{bok_2['l_006_dim_width']}</td>
                        <td>{bok_2['l_007_dim_height']}</td>
                        <td>{bok_2['l_008_weight_UOM']}</td>
                        <td>{bok_2['l_009_weight_per_each']}</td>
                        <td><Button color="primary" onClick={() => this.onClickShowLineData(bok_2)}>Show LineData</Button></td>
                    </tr>
                );
            });
            pricings = sortedPricings.map((price, index) => {
                return (
                    <tr key={index} className={bok_1.quote_id === price.cost_id ? 'selected' : null}>
                        <td>{price['fp_name']}</td>
                        <td>{price['service_name']}</td>
                        <td>
                            ${price['client_mu_1_minimum_values'].toFixed(2)}
                            &nbsp;&nbsp;&nbsp;
                            <i className="fa fa-copy" onClick={() => this.copyToClipBoard(price['client_mu_1_minimum_values'].toFixed(2))}></i>
                        </td>
                        <td>
                            ${price['surcharge_total']} {price['surcharge_total'].toFixed(2) > 0 ? <i className="fa fa-dollar-sign" onClick={() => this.onClickSurcharge(price)}></i> : ''}
                        </td>
                        <td>${price['total']}</td>
                        <td>
                            ${price['sell']}
                            &nbsp;&nbsp;&nbsp;
                            <i className="fa fa-copy" onClick={() => this.copyToClipBoard(price['sell'])}></i>
                        </td>
                        <td>{moment(bok_1['b_021_b_pu_avail_from_date']).add(Math.ceil(price['eta_in_hour'] / 24), 'd').format('YYYY-MM-DD')} ({price['eta']})</td>
                        {isPricingPage && !isSalesQuote &&
                            <td>
                                <Button
                                    color={bok_1.quote_id === price.cost_id ? 'success' : 'primary'}
                                    disabled={canBeChanged ? null : 'disabled'}
                                    onClick={() => this.onSelectPricing(price.cost_id)}
                                >
                                    {bok_1.quote_id === price.cost_id ? <i className="fa fa-check"></i> : null} {bok_1.quote_id === price.cost_id ? 'Selected' : 'Select'}
                                </Button>
                            </td>
                        }
                    </tr>
                );
            });

            bok_3s = [];
            if (isShowLineData) {
                bok_3s = bok_1['bok_3s']
                    .filter(bok_3 => bok_3.fk_booking_lines_id === selectedBok_2Id)
                    .map((bok_3, index) => (
                        <tr key={index}>
                            <td>{bok_3['zbld_104_text_4']}</td>
                            <td>{bok_3['zbld_122_integer_2']}</td>
                            <td>{bok_3['zbld_103_text_3']}</td>
                            <td>{bok_3['zbld_105_text_5']}</td>
                            <td>{bok_3['zbld_101_text_1']}</td>
                            <td>{bok_3['zbld_131_decimal_1']}</td>
                            <td>{bok_3['zbld_132_decimal_2']}</td>
                            <td>{bok_3['zbld_133_decimal_3']}</td>
                            <td>{bok_3['zbld_102_text_2']}</td>
                            <td>{bok_3['zbld_134_decimal_4']}</td>
                        </tr>
                    ));
            }
        }

        return (
            <section className="bok-price">
                {this.state.errorMessage || !bok_1 ?
                    <h1>{this.state.errorMessage}</h1>
                    :
                    <div>
                        <h3><i className="fa fa-circle"></i> Main Info:</h3>
                        <div className="main-info">
                            <div className="">
                                <strong>Client Name: </strong><span>{bok_1['b_client_name']}</span><br />
                                <strong>Client Order Number: </strong><span>{bok_1['b_client_order_num']}</span><br />
                                <strong>Client Sales Invoice Number: </strong><span>{bok_1['b_client_sales_inv_num']}</span><br />
                                <strong>Despatch Date: </strong><span>{bok_1['b_021_b_pu_avail_from_date']}</span>
                            </div>
                            <div className="pu-info disp-inline-block">
                                <label>Pickup From</label><br />
                                <div className="title disp-inline-block">
                                    <strong>Entity Name: </strong><br />
                                    <strong>Street 1: </strong><br />
                                    <strong>Street 2: </strong><br />
                                    <strong>Suburb: </strong><br />
                                    <strong>State: </strong><br />
                                    <strong>PostalCode: </strong><br />
                                    <strong>Country: </strong><br />
                                    <strong>Contact Name: </strong><br />
                                    <strong>Email: </strong><br />
                                    <strong>Phone: </strong><br />
                                </div>
                                <div className="data disp-inline-block">
                                    <span>{bok_1['b_028_b_pu_company']}</span><br />
                                    <span>{bok_1['b_029_b_pu_address_street_1']}</span><br />
                                    {bok_1 && bok_1['b_030_b_pu_address_street_2'] && (<span>{bok_1['b_030_b_pu_address_street_2']}</span>)}<br />
                                    <span>{bok_1['b_032_b_pu_address_suburb']}</span><br />
                                    <span>{bok_1['b_031_b_pu_address_state']}</span><br />
                                    <span>{bok_1['b_033_b_pu_address_postalcode']}</span><br />
                                    <span>{bok_1['b_034_b_pu_address_country']}</span><br />
                                    <span>{bok_1['b_035_b_pu_contact_full_name']}</span><br />
                                    <span>{bok_1['b_037_b_pu_email']}</span><br />
                                    <span>{bok_1['b_038_b_pu_phone_main']}</span><br />
                                </div>
                            </div>
                            <div className="de-info disp-inline-block">
                                <label>Deliver To</label><br />
                                <div className="title disp-inline-block">
                                    <strong>Entity Name: </strong><br />
                                    <strong>Street 1: </strong><br />
                                    <strong>Street 2: </strong><br />
                                    <strong>Suburb: </strong><br />
                                    <strong>State: </strong><br />
                                    <strong>PostalCode: </strong><br />
                                    <strong>Country: </strong><br />
                                    <strong>Contact Name: </strong><br />
                                    <strong>Email: </strong><br />
                                    <strong>Phone: </strong><br />
                                </div>
                                <div className="data disp-inline-block">
                                    <span>{bok_1['b_054_b_del_company']}</span><br />
                                    <span>{bok_1['b_055_b_del_address_street_1']}</span><br />
                                    {bok_1 && bok_1['b_056_b_del_address_street_2'] && (<span>{bok_1['b_056_b_del_address_street_2']}</span>)}<br />
                                    <span>{bok_1['b_058_b_del_address_suburb']}</span><br />
                                    <span>{bok_1['b_057_b_del_address_state']}</span><br />
                                    <span>{bok_1['b_059_b_del_address_postalcode']}</span><br />
                                    <span>{bok_1['b_060_b_del_address_country']}</span><br />
                                    <span>{bok_1['b_061_b_del_contact_full_name']}</span><br />
                                    <span>{bok_1['b_063_b_del_email']}</span><br />
                                    <span>{bok_1['b_064_b_del_phone_main']}</span><br />
                                </div>
                            </div>
                        </div>
                        <FreightOptionAccordion
                            bok_1={bok_1}
                            onClickAutoRepack={(status) => this.onClickAutoRepack(status)}
                        />
                        <h3><i className="fa fa-circle"></i> Lines:</h3>
                        {totalLinesCnt &&
                            <table className="table table-hover table-bordered sortable fixed_headers">
                                <thead>
                                    <tr>
                                        <th>Total Quantity</th>
                                        <th>Total Weight (Kg)</th>
                                        <th>Total Cubic Meter (M3)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{totalLinesCnt}</td>
                                        <td>{totalLinesKg}</td>
                                        <td>{totalCubicMeter.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        }
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <thead>
                                <tr>
                                    <th>Type Of Packaging</th>
                                    <th>Sequence No</th>
                                    <th>Item No</th>
                                    <th>Item Descripton</th>
                                    <th>Quantity</th>
                                    <th>Dim UOM</th>
                                    <th>Length</th>
                                    <th>Width</th>
                                    <th>Height</th>
                                    <th>Weight UOM</th>
                                    <th>Weight Per Each</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bok_2s}
                            </tbody>
                        </table>
                        {isShowLineData && <h3><i className="fa fa-circle"></i> Line Data:</h3>}
                        {isShowLineData &&
                            <table className="table table-hover table-bordered sortable fixed_headers">
                                <thead>
                                    <tr>
                                        <th>Type Of Packaging</th>
                                        <th>Quantity</th>
                                        <th>Item No</th>
                                        <th>Item Description</th>
                                        <th>Dim UOM</th>
                                        <th>Length</th>
                                        <th>Width</th>
                                        <th>Height</th>
                                        <th>Weight UOM</th>
                                        <th>Weight Per Each</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bok_3s}
                                </tbody>
                            </table>
                        }
                        <h3><i className="fa fa-circle"></i> Freight Rates:</h3>
                        <LoadingOverlay
                            active={this.state.isLoadingBok || this.state.isLoadingPricing || this.state.isLoadingOper || this.state.isAutoRepacking}
                            spinner
                            text='Loading...'
                        >
                            <table className="table table-hover table-bordered sortable fixed_headers">
                                <thead>
                                    <tr>
                                        <th>Freight Provider</th>
                                        <th>Service Name</th>
                                        <th onClick={() => this.onClickColumn('lowest')}>Cost $ (click & sort)</th>
                                        <th>Extra $</th>
                                        <th>Total Cost $</th>
                                        <th onClick={() => this.onClickColumn('lowest')}>Sell $ (click & sort)</th>
                                        <th onClick={() => this.onClickColumn('fastest')}>ETA (click & sort)</th>
                                        {isPricingPage && !isSalesQuote && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricings}
                                </tbody>
                            </table>
                            <div className="decision">
                                {(!isSalesQuote && bok_1 && bok_1['b_client_name'] !== 'Jason L') &&
                                    <Button
                                        disabled={canBeChanged ? null : 'disabled'}
                                        color="primary"
                                        onClick={() => this.onClickBookBtn()}
                                    >
                                        {this.props.bookedSuccess || (bokWithPricings && Number(bokWithPricings['success']) !== 3) ? 'Booked' : 'Book'}
                                    </Button>
                                }
                                <Button
                                    disabled={canBeChanged ? null : 'disabled'}
                                    color="danger"
                                    onClick={() => this.onClickCancelBtn()}
                                >
                                    {this.props.canceledSuccess ? 'Quote Canceled' : 'Cancel Quote'}
                                </Button>
                            </div>
                        </LoadingOverlay>
                    </div>
                }

                <ExtraCostSummarySlider
                    isOpen={this.state.isShowExtraCostSummarySlider}
                    toggleSlider={this.toggleExtraCostSummarySlider}
                    selectedPrice = {this.state.selectedPrice}
                    bok_2s = {bokWithPricings ? bokWithPricings['bok_2s'] : []}
                />

                <PalletSlider
                    isOpen={this.state.isShowPalletSlider}
                    toggleSlider={this.togglePalletSlider}
                    onCancelAutoRepack={this.onCancelAutoRepack}
                    onSelectPallet={(palletId) => this.onSelectPallet(palletId)}
                />

                <ToastContainer />
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.bok.errorMessage,
        bokWithPricings: state.bok.BOK_with_pricings,
        needToUpdatePricings: state.bok.needToUpdatePricings,
        loadSuccess: state.bok.loadSuccess,
        bookedSuccess: state.bok.bookedSuccess,
        canceledSuccess: state.bok.canceledSuccess,
        selectPricingSuccess: state.bok.selectPricingSuccess,
        autoRepackSuccess: state.bok.autoRepackSuccess,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getBokWithPricings: (identifier) => dispatch(getBokWithPricings(identifier)),
        onSelectPricing: (costId, identifier, client_overrided_quote) => dispatch(onSelectPricing(costId, identifier, client_overrided_quote)),
        onBookFreight: (identifier) => dispatch(bookFreight(identifier)),
        onCancelFreight: (identifier) => dispatch(cancelFreight(identifier)),
        onAutoRepack: (identifier, repackStatus, palletId) => dispatch(autoRepack(identifier, repackStatus, palletId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BokPricePage);
