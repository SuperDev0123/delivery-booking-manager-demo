import React from 'react';
import PropTypes from 'prop-types';

class Children extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        childBookings: PropTypes.array.isRequired,
    };

    static defaultProps = {
    };

    // componentDidMount() {
    // }

    render() {
        const { childBookings } = this.props;
        const childrenList = [];

        if (childBookings) {
            childBookings.map((child, index) => {
                child.lines.map((line, index01) => {
                    childrenList.push(
                        <tr key={index}>
                            {index01 === 0 && <td rowSpan={child.lines.length}><a href={`/booking?bookingId=${child.b_bookingID_Visual}`}>{child.b_bookingID_Visual}</a></td>}
                            {index01 === 0 && <td rowSpan={child.lines.length}>{child.vx_freight_provider}</td>}
                            {index01 === 0 && <td rowSpan={child.lines.length}>{child.b_status}</td>}
                            <td>{line.e_item}</td>
                            <td>{line.e_qty}</td>
                        </tr>
                    );
                });
            });
        }

        return (
            <div className='children module'>
                <table className="table table-hover table-bordered sortable fixed_headers">
                    <thead>
                        <tr>
                            <th style={{width: '15%'}}>Booking ID</th>
                            <th style={{width: '10%'}}>Freight Provider</th>
                            <th style={{width: '20%'}}>Status</th>
                            <th style={{width: '10%'}}>Line Description</th>
                            <th style={{width: '10%'}}>Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {childrenList}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Children;
