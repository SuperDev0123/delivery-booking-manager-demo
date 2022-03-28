import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// Libs
import moment from 'moment';
import { isNull } from 'lodash';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Actions
import { getVehicles } from '../../state/services/vehicleService';

class VehicleSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedVehicle: null,
            lineHaulDate: null,
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        // onSelectPallet: PropTypes.func.isRequired,
        getVehicles: PropTypes.func.isRequired,
        vehicles: PropTypes.array,
        selectedBookingSet: PropTypes.object,
        updateBookingSet: PropTypes.func,
    };

    componentDidMount() {
        this.props.getVehicles();
    }

    notify = (text) => {
        toast(text);
    };

    onDateChange(date) {
        let lineHaulDate = '';

        if (isNull(date)) {
            lineHaulDate = moment().toDate();
        } else {
            lineHaulDate = date;
        }

        this.setState({lineHaulDate});
    }

    onClickSelect(e, vehicle) {
        let bookingSet = this.props.selectedBookingSet;

        if (this.state.lineHaulDate)
            bookingSet.line_haul_date = this.state.lineHaulDate;

        bookingSet.vehicle = vehicle.id;
        this.props.updateBookingSet(bookingSet.id, bookingSet);
        this.props.toggleSlider();
    }

    render() {
        const { isOpen, vehicles, selectedBookingSet } = this.props;
        const { lineHaulDate } = this.state;

        const vehicleList = (vehicles || [])
            .filter(vehicle => vehicle.category === 'linehaul')
            .map((vehicle, index) =>
                <tr key={index} className={selectedBookingSet && vehicle.id === selectedBookingSet.vehicle ? 'selected' : null}>
                    <td><Button color="info" onClick={(e) => this.onClickSelect(e, vehicle)}>Use</Button></td>
                    <td>{vehicle.description}</td>
                    <td>{vehicle.max_length} ({vehicle.dim_UOM})</td>
                    <td>{vehicle.max_width} ({vehicle.dim_UOM})</td>
                    <td>{vehicle.max_height} ({vehicle.dim_UOM})</td>
                    <td>{vehicle.max_mass} (Kg)</td>
                </tr>
            );

        return (
            <SlidingPane
                className='vehicle-slider'
                overlayClassName='vehicle-slider-overlay'
                isOpen={isOpen}
                title='LineHaul(Vehicle) Slider'
                subtitle=''
                onRequestClose={(e) => this.onClose(e)}
            >
                <div className="table-view">
                    {selectedBookingSet &&
                        <label>
                            <p>LineHaul Date:</p>
                            <DatePicker
                                selected={lineHaulDate ? new Date(lineHaulDate) : new Date(selectedBookingSet.line_haul_date)}
                                onChange={(e) => this.onDateChange(e)}
                                dateFormat="dd MMM yyyy"
                            />
                        </label>
                    }
                    <table className="table table-hover table-bordered sortable fixed_headers">
                        <tr>
                            <th className="" scope="col" nowrap><p>Use</p></th>
                            <th className="" scope="col" nowrap><p>Description</p></th>
                            <th className="" scope="col" nowrap><p>Length</p></th>
                            <th className="" scope="col" nowrap><p>Width</p></th>
                            <th className="" scope="col" nowrap><p>Height</p></th>
                            <th className="" scope="col" nowrap><p>Mass</p></th>
                        </tr>
                        { vehicleList }
                    </table>
                </div>

                <ToastContainer />
            </SlidingPane>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        vehicles: state.vehicle.vehicles,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getVehicles: () => dispatch(getVehicles()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VehicleSlider));