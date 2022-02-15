import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import BootstrapTable from 'react-bootstrap-table-next';

class ScansSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleScansSlider: PropTypes.func.isRequired,
        scans: PropTypes.array.isRequired,
    };

    render() {
        const { isOpen, scans, toggleScansSlider } = this.props;

        const scansColumns = [
            {
                dataField: 'event_timestamp',
                text: 'Scan Date',
                formatter: (cell) => {
                    return moment(cell).format('DD/MM/YYYY');
                },
                style: {
                    paddingRight: '5px'
                }
            }, {
                dataField: 'status',
                text: 'Status',
                style: {
                    paddingRight: '5px',
                    minWidth: '50px'
                }
            }, {
                dataField: 'desc',
                text: 'Description'
            }
        ];

        return (
            <SlidingPane
                className='sh-slider'
                overlayClassName='sh-slider-overlay'
                isOpen={isOpen}
                title='Scans Slider'
                subtitle={'List View'}
                onRequestClose={toggleScansSlider}>
                <div className="slider-content">
                    {scans &&
                        <BootstrapTable
                            keyField="id"
                            data={ scans }
                            columns={ scansColumns }
                            bootstrap4={ true }
                            bordered={ false }
                        />
                    }
                </div>
            </SlidingPane>
        );
    }
}

export default ScansSlider;
