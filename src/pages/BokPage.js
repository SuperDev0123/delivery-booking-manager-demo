import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import '../styles/pages/dmeapiinv.scss';

import { getBookings, getBookingLines, getBookingLinesData } from '../state/services/bokService';

class BokPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            BOK_1_headers: [],
            BOK_2_lines: [],
            BOK_3_lines_data: [],
        };
    }
    static propTypes = {
        getBookings: PropTypes.func.isRequired,
        getBookingLines: PropTypes.func.isRequired,
        getBookingLinesData: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.getBookings();
        this.props.getBookingLines();
        this.props.getBookingLinesData();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {BOK_1_headers, BOK_2_lines, BOK_3_lines_data, redirect} = newProps;
        if (BOK_1_headers) {
            this.setState({BOK_1_headers});
        }

        if (BOK_2_lines) {
            this.setState({BOK_2_lines});
        }

        if (BOK_3_lines_data) {
            this.setState({BOK_3_lines_data});
        }

        if (redirect) {
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
    }

    render() {
        const { BOK_1_headers, BOK_2_lines, BOK_3_lines_data } = this.state;
        const columns1 = [
            {
                dataField: 'pk_header_id',
                text: 'pk_header_id'
            }, {
                dataField: 'fk_client_id',
                text: 'fk_client_id'
            }, {
                dataField: 'b_client_warehouse_code',
                text: 'b_client_warehouse_code'
            }, {
                dataField: 'b_clientPU_Warehouse',
                text: 'b_clientPU_Warehouse'
            }, {
                dataField: 'b_000_1_b_clientreference_ra_numbers',
                text: 'b_000_1_b_clientreference_ra_numbers'
            }, {
                dataField: 'b_000_2_b_price',
                text: 'b_000_2_b_price'
            }, {
                dataField: 'b_001_b_freight_provider',
                text: 'b_001_b_freight_provider'
            }, {
                dataField: 'b_002_b_vehicle_type',
                text: 'b_002_b_vehicle_type'
            }, {
                dataField: 'b_003_b_service_name',
                text: 'b_003_b_service_name'
            }, {
                dataField: 'b_005_b_created_for',
                text: 'b_005_b_created_for'
            }, {
                dataField: 'b_006_b_created_for_email',
                text: 'b_006_b_created_for_email'
            }, {
                dataField: 'b_0061_b_created_for_phone',
                text: 'b_0061_b_created_for_phone'
            }, {
                dataField: 'b_007_b_ready_status',
                text: 'b_007_b_ready_status'
            }, {
                dataField: 'b_008_b_category',
                text: 'b_008_b_category'
            }, {
                dataField: 'b_009_b_priority',
                text: 'b_009_b_priority'
            }, {
                dataField: 'b_010_b_notes',
                text: 'b_010_b_notes'
            }, {
                dataField: 'b_012_b_driver_bring_connote',
                text: 'b_012_b_driver_bring_connote'
            }, {
                dataField: 'b_013_b_package_job',
                text: 'b_013_b_package_job'
            }, {
                dataField: 'b_016_b_pu_instructions_address',
                text: 'b_016_b_pu_instructions_address'
            }, {
                dataField: 'b_019_b_pu_tail_lift',
                text: 'b_019_b_pu_tail_lift'
            }, {
                dataField: 'b_020_b_pu_num_operators',
                text: 'b_020_b_pu_num_operators'
            }, {
                dataField: 'b_021_b_pu_avail_from_date',
                text: 'b_021_b_pu_avail_from_date'
            }, {
                dataField: 'b_022_b_pu_avail_from_time_hour',
                text: 'b_022_b_pu_avail_from_time_hour'
            }, {
                dataField: 'b_043_b_del_instructions_contact',
                text: 'b_043_b_del_instructions_contact'
            }, {
                dataField: 'b_044_b_del_instructions_address',
                text: 'b_044_b_del_instructions_address'
            }, {
                dataField: 'b_049_b_del_avail_from_time_minute',
                text: 'b_049_b_del_avail_from_time_minute'
            }, {
                dataField: 'b_050_b_del_by_date',
                text: 'b_050_b_del_by_date'
            }, {
                dataField: 'b_051_b_del_by_time_hour',
                text: 'b_051_b_del_by_time_hour'
            }, {
                dataField: 'b_052_b_del_by_time_minute',
                text: 'b_052_b_del_by_time_minute'
            }, {
                dataField: 'b_054_b_del_company',
                text: 'b_054_b_del_company'
            }, {
                dataField: 'b_055_b_del_address_street_1',
                text: 'b_055_b_del_address_street_1'
            }, {
                dataField: 'b_056_b_del_address_street_2',
                text: 'b_056_b_del_address_street_2'
            }, {
                dataField: 'b_057_b_del_address_state',
                text: 'b_057_b_del_address_state'
            }, {
                dataField: 'b_058_b_del_address_suburb',
                text: 'b_058_b_del_address_suburb'
            }, {
                dataField: 'b_059_b_del_address_postalcode',
                text: 'b_059_b_del_address_postalcode'
            }, {
                dataField: 'b_060_b_del_address_country',
                text: 'b_060_b_del_address_country'
            }, {
                dataField: 'b_061_b_del_contact_full_name',
                text: 'b_061_b_del_contact_full_name'
            }, {
                dataField: 'b_063_b_del_email',
                text: 'b_063_b_del_email'
            }, {
                dataField: 'b_064_b_del_phone_main',
                text: 'b_064_b_del_phone_main'
            }, {
                dataField: 'b_066_b_del_communicate_via',
                text: 'b_066_b_del_communicate_via'
            }, {
                dataField: 'b_065_b_del_phone_mobile',
                text: 'b_065_b_del_phone_mobile'
            }, {
                dataField: 'b_000_3_consignment_number',
                text: 'b_000_3_consignment_number'
            },
        ];

        const columns2 = [
            {
                dataField: 'l_001_type_of_packaging',
                text: 'l_001_type_of_packaging'
            }, {
                dataField: 'l_002_qty',
                text: 'l_002_qty'
            }, {
                dataField: 'l_003_item',
                text: 'l_003_item'
            }, {
                dataField: 'l_004_dim_UOM',
                text: 'l_004_dim_UOM'
            }, {
                dataField: 'l_005_dim_length',
                text: 'l_005_dim_length'
            }, {
                dataField: 'l_006_dim_width',
                text: 'l_006_dim_width'
            }, {
                dataField: 'l_007_dim_height',
                text: 'l_007_dim_height'
            }, {
                dataField: 'l_008_weight_UOM',
                text: 'l_008_weight_UOM'
            }, {
                dataField: 'l_009_weight_per_each',
                text: 'l_009_weight_per_each'
            },
        ];

        const columns3 = [
            {
                dataField: 'ld_002_model_number',
                text: 'ld_002_model_number'
            }, {
                dataField: 'ld_001_qty',
                text: 'ld_001_qty'
            }, {
                dataField: 'ld_003_item_description',
                text: 'ld_003_item_description'
            }, {
                dataField: 'ld_004_fault_description',
                text: 'ld_004_fault_description'
            }, {
                dataField: 'ld_005_item_serial_number',
                text: 'ld_005_item_serial_number'
            }, {
                dataField: 'ld_006_insurance_value',
                text: 'ld_006_insurance_value'
            }, {
                dataField: 'ld_007_gap_ra',
                text: 'ld_007_gap_ra'
            }, {
                dataField: 'ld_008_client_ref_number',
                text: 'ld_008_client_ref_number'
            },
        ];

        return (
            <section>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3>Bookings (Last 50s)</h3>
                                </div>
                                <div className="panel-body">
                                    <div className="table-responsive">
                                        <BootstrapTable
                                            keyField="id"
                                            data={ BOK_1_headers }
                                            columns={ columns1 }
                                            bootstrap4={ true }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3>Booking Lines (Last 50s)</h3>
                                </div>
                                <div className="panel-body">
                                    <div className="table-responsive">
                                        <BootstrapTable
                                            keyField="id"
                                            data={ BOK_2_lines }
                                            columns={ columns2 }
                                            bootstrap4={ true }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3>Booking Lines Data (Last 50s)</h3>
                                </div>
                                <div className="panel-body">
                                    <div className="table-responsive">
                                        <BootstrapTable
                                            keyField="id"
                                            data={ BOK_3_lines_data }
                                            columns={ columns3 }
                                            bootstrap4={ true }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        errorMessage: state.auth.errorMessage,
        redirect: state.auth.redirect,
        BOK_1_headers: state.bok.BOK_1_headers,
        BOK_2_lines: state.bok.BOK_2_lines,
        BOK_3_lines_data: state.bok.BOK_3_lines_data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getBookings: () => dispatch(getBookings()),
        getBookingLines: () => dispatch(getBookingLines()),
        getBookingLinesData: () => dispatch(getBookingLinesData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BokPage);
