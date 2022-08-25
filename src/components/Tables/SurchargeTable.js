import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { getSurcharges } from '../../state/services/costService';

class SurchargeTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bookignId: ''
        };
    }

    static propTypes = {
        getSurcharges: PropTypes.func.isRequired,
        surcharges: PropTypes.array.isRequired,
        fps: PropTypes.array.isRequired,
        clientname: PropTypes.string.isRequired,
        bookingId: PropTypes.string,
    };

    componentDidMount() {
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.fps.length > 0 && nextProps.bookingId)
            if (nextProps.bookingId !== this.state.bookingId) {
                this.setState({bookingId: nextProps.bookingId});
                console.log('@1 - ', nextProps.bookingId);
                this.props.getSurcharges(nextProps.bookingId);
            }
    }

    render() {
        const { surcharges, clientname, fps } = this.props;

        const surchargeList = (surcharges || [])
            .filter(surcharge => clientname === 'dme' || (clientname !== 'dme' && surcharge.visible))
            .map((surcharge, index) => {
                const fp = fps.find((fp) => fp.id === parseInt(surcharge.fp));

                return (
                    <tr key={index}>
                        <td>{fp.fp_company_name}</td>
                        <td>{surcharge.description ? surcharge.description : surcharge.name}</td>
                        <td>{surcharge.connote_or_reference}</td>
                        <td>{surcharge.eta_de_date && moment(surcharge.eta_de_date).format('DD/MM/YYYY HH:mm')}</td>
                        {clientname === 'dme' && <td>${parseFloat(surcharge.amount * surcharge.qty).toFixed(2)}</td>}
                        <td>
                            ${(
                                parseFloat(surcharge.qty) *
                                parseFloat(surcharge.amount) *
                                (1 + parseFloat(fp.fp_markupfuel_levy_percent))
                            ).toFixed(2)}
                        </td>
                    </tr>
                );
            });

        return (
            <div className='surcharges-table'>
                {(surcharges || []).length === 0 ?
                    <p>No Linked Services</p>
                    :
                    <table className="table table-hover table-bordered sortable fixed_headers">
                        <thead>
                            <tr>
                                <th className="" scope="col" nowrap><p>Freight Provider</p></th>
                                <th className="" scope="col" nowrap><p>Service</p></th>
                                <th className="" scope="col" nowrap><p>Consignment No</p></th>
                                <th className="" scope="col" nowrap><p>Delivery ETA</p></th>
                                {clientname === 'dme' && <th className="" scope="col" nowrap><p>Quoted Cost</p></th>}
                                <th className="" scope="col" nowrap><p>Quoted $</p></th>
                            </tr>
                        </thead>
                        <tbody>
                            { surchargeList }
                        </tbody>
                    </table>
                }
            </div>
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
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SurchargeTable));
