import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import print from 'print-js';
import axios from 'axios';

import FPPricingSlider from '../../components/Sliders/FPPricingSlider';
import { API_HOST, STATIC_HOST, HTTP_PROTOCOL } from '../../config';
import { getLabels4Booking, getPricingInfos } from '../../state/services/bookingService';

class LabelPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            identifier: null,
            errorMessage: null,
            isShowFPPricingSlider: false,
            loadingPricingInfos: false,
            pricingInfos: [],
        };

        this.toggleFPPricingSlider = this.toggleFPPricingSlider.bind(this);
    }

    static propTypes = {
        match: PropTypes.object,
        getLabels4Booking: PropTypes.func.required,
        bookingLabels: PropTypes.object,
        clientname: PropTypes.string,
        getPricingInfos: PropTypes.func.isRequired,
        pricingInfos: PropTypes.array,
    };

    componentDidMount() {
        const identifier = this.props.match.params.id;

        if (identifier && identifier.length > 32) {
            this.props.getLabels4Booking(identifier);
            this.setState({identifier});
        } else {
            this.setState({errorMessage: 'A Freight booking does not exist for this Sales Order. Please go to Pronto Sales Orders, \
                click the "Freight Deliver-ME" button, select a valid freight option and when complete click the "Send Booking Now" button at the bottom of the screen. \
                Your booking will then be ready for freight and freight labels can be printed from the Pronto "Enquire by Package" screen.'});
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {errorMessage, pricingInfos} = newProps;

        if (errorMessage) {
            if (errorMessage === 'Order does not exist!') {
                this.setState({errorMessage: 'A Freight booking does not exist for this Sales Order. Please go to Pronto Sales Orders, \
                click the "Freight Deliver-ME" button, select a valid freight option and when complete click the "Send Booking Now" button at the bottom of the screen. \
                Your booking will then be ready for freight and freight labels can be printed from the Pronto "Enquire by Package" screen.'});
            } else {
                this.setState({errorMessage});
            }
        }

        if (pricingInfos) {
            this.setState({loadingPricingInfos: false});
        }
    }

    notify = (text) => toast(text);

    toggleFPPricingSlider() {
        this.setState(prevState => ({isShowFPPricingSlider: !prevState.isShowFPPricingSlider}));
    }

    onClickPreview(url) {
        if (url && url.length > 0) {
            const win = window.open(HTTP_PROTOCOL + '://' + STATIC_HOST + '/pdfs/' + url, '_blank');
            win.focus();
        } else {
            this.notify('Has no label');
        }
    }

    onClickPrint(pdf = null) {
        const {bookingLabels} = this.props;

        if (pdf) {
            print({printable: pdf, type: 'pdf', showModal: true, base64: true});
        } else {
            print({printable: bookingLabels['pdf'], type: 'pdf', showModal: true, base64: true});
        }
    }

    onClickDownload(pdfUrl) {
        const {bookingLabels} = this.props;
        const token = localStorage.getItem('token');

        const options = {
            method: 'post',
            url: HTTP_PROTOCOL + '://' + API_HOST + '/download/',
            headers: {'Authorization': 'JWT ' + token},
            data: {url: pdfUrl, downloadOption: 'zpl', id: bookingLabels['id']},
            responseType: 'blob', // important
        };

        axios(options).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'zpl.zip');
            document.body.appendChild(link);
            link.click();
        });
    }

    bulkBookingUpdate(bookingIds, fieldName, fieldContent) {
        const token = localStorage.getItem('token');

        if (!token) {
            this.notify('Login required!');
            return;
        }

        return new Promise((resolve, reject) => {
            const options = {
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + token },
                url: HTTP_PROTOCOL + '://' + API_HOST + '/bookings/bulk_booking_update/',
                data: {bookingIds, fieldName, fieldContent},
            };

            axios(options)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    onClickUseCheapest(quote) {
        const {bookingLabels} = this.props;

        this.bulkBookingUpdate([bookingLabels['id']], 'vx_freight_provider', quote.fp)
            .then(() => {
                window.location.reload(false);
            })
            .catch(() => {
                this.notify('Failed, please contact support center.');
            });
    }

    onSelectPricing(pricingInfo) {
        const {bookingLabels} = this.props;

        this.bulkBookingUpdate([bookingLabels['id']], 'vx_freight_provider', pricingInfo.freight_provider)
            .then(() => {
                this.toggleFPPricingSlider();
                window.location.reload(false);
            })
            .catch(() => {
                this.notify('Failed, please contact support center.');
            });
    }

    onClickOpenPricingSlider() {
        const {bookingLabels} = this.props;
        const token = localStorage.getItem('token');

        if (!token) {
            this.notify('Login required!');
            return;
        }

        this.setState({loadingPricingInfos: true});
        this.toggleFPPricingSlider();
        this.props.getPricingInfos(bookingLabels.pk_booking_id);
    }

    render() {
        const {bookingLabels, pricingInfos} = this.props;
        let sscc_trs = [];
        let index = 0;
        let _pricingInfos = [];

        if (pricingInfos) {
            const scanned_pricings = pricingInfos.filter(pricingInfo => pricingInfo.packed_status === 'scanned');
            _pricingInfos = scanned_pricings.length > 0 ? scanned_pricings : pricingInfos;
        }

        if (bookingLabels) {
            for (const value of Object.entries(bookingLabels.sscc_obj)) {
                const sscc = value[0];

                bookingLabels.sscc_obj[sscc].map((sscc_info, sscc_info_index) => {
                    index++;
                    const tr = (
                        <tr key={index}>
                            {sscc_info_index === 0 && <td rowSpan={bookingLabels.sscc_obj[sscc].length.toString()}>{sscc}</td>}
                            <td>{sscc_info['e_item_type']}</td>
                            <td>{sscc_info['e_item']}</td>
                            <td>{sscc_info['e_qty']}</td>
                            <td>{sscc_info['e_type_of_packaging']}</td>
                            {sscc_info_index === 0 &&
                                <td rowSpan={bookingLabels.sscc_obj[sscc].length.toString()}>
                                    <Button
                                        color="info"
                                        disabled={!sscc_info.is_available && 'disabled'}
                                        onClick={() => this.onClickPreview(sscc_info['url'])}
                                    >
                                        Preview
                                    </Button>
                                    <Button
                                        color="primary"
                                        disabled={!sscc_info.is_available && 'disabled'}
                                        onClick={() => this.onClickPrint(sscc_info['pdf'])}
                                    >
                                        Print
                                    </Button>
                                    <Button
                                        color="primary"
                                        disabled={!sscc_info.is_available && 'disabled'}
                                        onClick={() => this.onClickDownload(sscc_info['url'])}
                                    >
                                        Download(ZPL)
                                    </Button>
                                </td>
                            }
                        </tr>
                    );

                    sscc_trs.push(tr);
                });
            }
        }

        return (
            <section className="label">
                {!bookingLabels ?
                    this.state.errorMessage ?
                        <div className="error-msg">
                            <p className="">
                                {this.state.errorMessage}
                            </p>
                        </div>
                        :
                        <p className="info">Loading...</p>
                    :
                    <div>
                        <h4><i className="fa fa-circle"></i> Main Info:</h4>
                        <div className="main-info">
                            <p><strong>DME Booking ID: </strong>{bookingLabels.b_bookingID_Visual}</p>
                            <p><strong>Client name: </strong>{bookingLabels.b_client_name}</p>
                            <p><strong>Client order number: </strong>{bookingLabels.b_client_order_num}</p>
                            <p><strong>Client invoice number: </strong>{bookingLabels.b_client_sales_inv_num}</p>
                            <p><strong>Freight provider: </strong>{bookingLabels.vx_freight_provider}</p>
                            <p><strong>Consignment number: </strong>{bookingLabels.v_FPBookingNumber}</p>
                            <p><strong>No of sscc: </strong>{bookingLabels.no_of_sscc}</p>
                            {bookingLabels.quotes_cnt === 0 &&
                                <p>
                                    <strong>Error: </strong>
                                    Sales order {bookingLabels['b_client_order_num']} has either address and / or item line errors in it preventing freight being booked. <br />
                                    Please go Deliver-ME booking <a href={`/booking/?bookingid=${bookingLabels.id}`} target='_blank' rel="noopener noreferrer">{bookingLabels.id}</a> and review the address and line information. <br />
                                    When complete click &apos;Update&apos; and then &apos;Price & Time Calc (FC)&apos;. Select the appropriate provider. <br />
                                    Your booking will then be ready for freight and freight labels can be printed from the Pronto &apos;Enquire by Package&apos; screen.
                                </p>
                            }
                        </div>
                        <h4><i className="fa fa-circle"></i> SSCC Info:</h4>
                        <div className="sscc-info">
                            <table className="table table-hover table-bordered sortable fixed_headers">
                                <thead>
                                    <tr>
                                        <th style={{width: '15%'}}>SSCC</th>
                                        <th style={{width: '10%'}}>Code</th>
                                        <th style={{width: '20%'}}>Description</th>
                                        <th style={{width: '10%'}}>Qty</th>
                                        <th style={{width: '10%'}}>Type of Package</th>
                                        {<th style={{width: '10%'}}>Preview</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sscc_trs}
                                </tbody>
                            </table>
                        </div>
                        <div className="action">
                            {bookingLabels.full_label_name &&
                                <Button
                                    color="info"
                                    disabled={bookingLabels.full_label_name ? false : true}
                                    onClick={() => this.onClickPreview(bookingLabels.full_label_name)}
                                >
                                    Preview
                                </Button>
                            }
                            <Button color="primary" onClick={() => this.onClickPrint()}>Print</Button>
                            {bookingLabels.full_label_name &&
                                <Button
                                    color="primary"
                                    disabled={bookingLabels.full_label_name ? false : true}
                                    onClick={() => this.onClickDownload(bookingLabels.full_label_name)}
                                >
                                    Download(ZPL)
                                </Button>
                            }
                        </div>
                        <h4><i className="fa fa-circle"></i> Cost Comparison:</h4>
                        <Button color="info" onClick={() => this.onClickOpenPricingSlider()} className="see-all-quotes">See all quotes</Button>
                        {(bookingLabels && bookingLabels.quote && bookingLabels.quote.cheapest) &&
                            <div className="cost-comparision">
                                <p>
                                    <strong>Current Provider: </strong>
                                    {bookingLabels.quote.original &&
                                        `${bookingLabels.quote.original.fp} Quoted Cost at Time of Order: $${parseFloat(bookingLabels.quote.original.cost_dollar).toFixed(2)}, `
                                    }
                                    {bookingLabels.quote.scanned &&
                                        `${bookingLabels.quote.scanned.fp} Quoted Cost at Time of Order: $${parseFloat(bookingLabels.quote.scanned.cost_dollar).toFixed(2)}`
                                    }
                                </p><br />
                                <p>
                                    <strong>Most Cost Effective Provider: </strong> 
                                    {bookingLabels.quote.cheapest.fp} Quoted Cost on Actual DIMS: 
                                    ${parseFloat(bookingLabels.quote.cheapest.cost_dollar).toFixed(2)}, Savings: ${parseFloat(bookingLabels.quote.cheapest.savings).toFixed(2)}
                                </p>
                                <Button color="info" onClick={() => this.onClickUseCheapest(bookingLabels.quote.cheapest)}>YES CHANGE</Button>
                            </div>
                        }

                        <FPPricingSlider
                            isOpen={this.state.isShowFPPricingSlider}
                            toggleSlider={this.toggleFPPricingSlider}
                            pricingInfos={_pricingInfos}
                            onSelectPricing={(pricingInfo) => this.onSelectPricing(pricingInfo)}
                            isLoading={this.state.loadingPricingInfos}
                            x_manual_booked_flag={bookingLabels.x_manual_booked_flag}
                            api_booking_quote_id={bookingLabels.api_booking_quote}
                            onLoadPricingErrors={this.onLoadPricingErrors}
                            errors={this.state.errors}
                            isBooked={bookingLabels.b_dateBookedDate ? true : false}
                            clientname={this.props.clientname}
                            clientSalesTotal={bookingLabels.client_sales_total}
                        />
                    </div>
                }

                <ToastContainer />
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        clientname: state.auth.clientname,
        errorMessage: state.booking.errorMessage,
        pricingInfos: state.booking.pricingInfos,
        bookingLabels: state.booking.bookingLabels
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getLabels4Booking: (identifier) => dispatch(getLabels4Booking(identifier)),
        getPricingInfos: (pk_booking_id) => dispatch(getPricingInfos(pk_booking_id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelPage);
