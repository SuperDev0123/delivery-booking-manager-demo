import React from 'react';
import PropTypes from 'prop-types';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button } from 'reactstrap';
import LoadingOverlay from 'react-loading-overlay';

class LineAndLineDetailSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleShowLineSlider: PropTypes.func.isRequired,
        lines: PropTypes.array.isRequired,
        lineDetails: PropTypes.array.isRequired,
        onClickDuplicate: PropTypes.func.isRequired,
        onClickDelete: PropTypes.func.isRequired,
        loadingBookingLine: PropTypes.bool.isRequired,
        loadingBookingLineDetail: PropTypes.bool.isRequired,
        selectedLineIndex: PropTypes.number.isRequired,
        onClickShowLine: PropTypes.func.isRequired,
    };

    render() {
        const { isOpen, lines, lineDetails, loadingBookingLine, loadingBookingLineDetail, selectedLineIndex } = this.props;

        const lineList = lines.map((line, index) => {
            return (
                <tr key={index}>
                    <td>{line.e_type_of_packaging}</td>
                    <td>{line.e_item}</td>
                    <td>{line.e_qty}</td>
                    <td>{line.e_weightUOM}</td>
                    <td>{line.e_weightPerEach}</td>
                    <td>{line.e_Total_KG_weight}</td>
                    <td>{line.e_dimUOM}</td>
                    <td>{line.e_dimLength}</td>
                    <td>{line.e_dimWidth}</td>
                    <td>{line.e_dimHeight}</td>
                    <td>{line.e_1_Total_dimCubicMeter}</td>
                    <td className="show" onClick={() => this.props.onClickShowLine(index)}><Button color="primary">Show</Button></td>
                    <td className="edit"><Button color="primary">Edit</Button></td>
                    <td className="duplicate">
                        <Button color="primary" onClick={() => this.props.onClickDuplicate(0, {pk_lines_id: line.pk_lines_id})}>
                            Duplicate
                        </Button>
                    </td>
                    <td className="delete">
                        <Button color="danger" onClick={() => this.props.onClickDelete(0, {pk_lines_id: line.pk_lines_id})}>
                            Delete
                        </Button>
                    </td>
                </tr>
            );
        });
        
        const lineDetailList = lineDetails.map((lineDetail, index) => {
            if (selectedLineIndex > -1 && 
                parseInt(lines[selectedLineIndex].pk_lines_id) === parseInt(lineDetail.fk_id_booking_lines)) {
                return (
                    <tr key={index}>
                        <td>{lineDetail.modelNumber}</td>
                        <td>{lineDetail.itemDescription}</td>
                        <td>{lineDetail.quantity}</td>
                        <td>{lineDetail.itemFaultDescription}</td>
                        <td>{lineDetail.insuranceValueEach}</td>
                        <td>{lineDetail.gap_ra}</td>
                        <td>{lineDetail.clientRefNumber}</td>
                        <td className="edit"><Button color="primary">Edit</Button></td>
                        <td className="duplicate">
                            <Button color="primary" onClick={() => this.props.onClickDuplicate(1, {pk_id_lines_data: lineDetail.pk_id_lines_data})}>
                                Duplicate
                            </Button>
                        </td>
                        <td className="delete">
                            <Button color="danger" onClick={() => this.props.onClickDelete(1, {pk_id_lines_data: lineDetail.pk_id_lines_data})}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                );
            }
        });

        return (
            <SlidingPane
                className='lld-slider'
                overlayClassName='lld-slider-overlay'
                isOpen={isOpen}
                title='Line And Line Detail Slider'
                subtitle='Table view'
                onRequestClose={this.props.toggleShowLineSlider}>
                <div className="slider-content">
                    <div className="table-view">
                        <LoadingOverlay
                            active={loadingBookingLine}
                            spinner
                            text='Loading...'
                        >
                            <div className="line-section">
                                <table className="table table-hover table-bordered sortable fixed_headers">
                                    <tr>
                                        <th className="" scope="col" nowrap>
                                            <p>Packaging</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Item Description</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Qty</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Wgt UOM</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Wgt Each</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Total Kgs</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Dim UOM</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Length</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Width</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Hegiht</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Cubic Meter</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Show</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Edit</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Duplicate</p>
                                        </th>
                                        <th className="" scope="col" nowrap>
                                            <p>Delete</p>
                                        </th>
                                    </tr>
                                    { lineList }
                                </table>
                            </div>
                        </LoadingOverlay>
                        {
                            (selectedLineIndex > -1) ?
                                <LoadingOverlay
                                    active={loadingBookingLineDetail}
                                    spinner
                                    text='Loading...'
                                >
                                    <div className="line-detail-section">
                                        <table className="table table-hover table-bordered sortable fixed_headers">
                                            <tr>
                                                <th className="" scope="col" nowrap>
                                                    <p>Model</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Item Description</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Qty</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Fault Description</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Insurance Value</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Gap/ RA</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Client Reference #</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Edit</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Duplicate</p>
                                                </th>
                                                <th className="" scope="col" nowrap>
                                                    <p>Delete</p>
                                                </th>
                                            </tr>
                                            { lineDetailList }
                                        </table>
                                    </div>
                                </LoadingOverlay>
                                :
                                null
                        }
                    </div>
                    <div className="form-view">
                    </div>
                </div>
            </SlidingPane>
        );
    }
}

export default LineAndLineDetailSlider;
