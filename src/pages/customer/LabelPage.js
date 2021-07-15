import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import print from 'print-js';

import { STATIC_HOST, HTTP_PROTOCOL } from '../../config';
// import { decodeBase64 } from '../../commons/helpers';
import { getLabels4Booking } from '../../state/services/bookingService';

class LabelPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            identifier: null,
            errorMessage: null,
        };
    }

    static propTypes = {
        match: PropTypes.object,
        getLabels4Booking: PropTypes.func.required,
        bookingLabels: PropTypes.object,
    };

    componentDidMount() {
        const identifier = this.props.match.params.id;

        if (identifier && identifier.length > 32) {
            this.props.getLabels4Booking(identifier);
            this.setState({identifier});
        } else {
            this.setState({errorMessage: 'Wrong id.'});
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {errorMessage} = newProps;

        if (errorMessage) {
            this.setState({errorMessage});
        }
    }

    notify = (text) => toast(text);

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

    render() {
        const {bookingLabels} = this.props;
        let sscc_trs = [];
        let index = 0;

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
                        <p className="danger">Error: {this.state.errorMessage}</p>
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
                        </div>
                    </div>
                }
                <ToastContainer />
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.booking.errorMessage,
        bookingLabels: state.booking.bookingLabels
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getLabels4Booking: (identifier) => dispatch(getLabels4Booking(identifier)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelPage);
