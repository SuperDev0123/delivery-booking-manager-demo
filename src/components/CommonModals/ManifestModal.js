import React, {Component} from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ManifestModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            puFromDate: null, 
            vx_freight_provider: '',
            oneManifestFile: false,
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool,
        toggleShowManifestModal: PropTypes.func,
        onClickOk: PropTypes.func.isRequired,
        allFPs: PropTypes.array.isRequired,
    };

    static defaultProps = {
        isOpen: false,
        allFPs: [],
    };

    componentDidMount() {
        let puFromDate = '';
        puFromDate = moment().tz('Australia/Sydney').toDate();

        this.setState({puFromDate: moment(puFromDate).toDate()});
    }

    onDateChange(date) {
        let puFromDate = '';

        if (_.isNull(date)) {
            puFromDate = moment().tz('Australia/Sydney').toDate();
        } else {
            puFromDate = moment(date).toDate();
        }

        this.setState({puFromDate});
    }

    onInputChange(e) {
        if (e.target.name === 'vx_freight_provider') {
            this.setState({vx_freight_provider: e.target.value, errorMessage: ''});
        } else if (e.target.name === 'oneManifestFile') {
            this.setState({oneManifestFile: e.target.checked});
        }
    }

    onClickQuery() {
        const {puFromDate, vx_freight_provider, oneManifestFile} = this.state;

        if (_.isNull(puFromDate)) {
            this.setState({errorMessage: 'Please select PU From Date.'});
        } else if (_.isEmpty(vx_freight_provider)) {
            this.setState({errorMessage: 'Please select Freight Provider.'});
        } else {
            this.props.onClickOk(vx_freight_provider, moment(puFromDate).format('YYYY-MM-DD'), oneManifestFile);
            this.props.toggleShowManifestModal();
        }
    }

    render() {
        const {isOpen, allFPs} = this.props;
        const {puFromDate, vx_freight_provider, oneManifestFile, errorMessage} = this.state;

        const fpList = allFPs.map((fp, index) => {
            return (<option key={index} value={fp.fp_company_name}>{fp.fp_company_name}</option>);
        });

        return (
            <ReactstrapModal isOpen={isOpen} toggle={() => this.props.toggleShowManifestModal()} className="manifest-modal">
                <ModalHeader toggle={() => this.props.toggleShowManifestModal()}>Manifest Download</ModalHeader>
                <ModalBody>
                    <label>
                        <p>Freight Provider: </p>
                        <select
                            required 
                            name="vx_freight_provider" 
                            onChange={(e) => this.onInputChange(e)}
                            value = {vx_freight_provider}
                        >
                            <option value="" selected disabled hidden>Select a FP</option>
                            {fpList}
                        </select>
                    </label>
                    <label>
                        <p>PU From Date: </p>
                        <DatePicker
                            selected={puFromDate}
                            onChange={(e) => this.onDateChange(e)}
                            dateFormat="dd MMM yyyy"
                        />
                    </label>
                    <label>
                        <p>One Manifest File? </p>
                        <input type="checkbox" name="oneManifestFile" className="checkbox" checked={oneManifestFile} onChange={(e) => this.onInputChange(e)} />
                    </label>
                    <p className="red">{errorMessage}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.onClickQuery()}>Query</Button>
                    <Button color="secondary" onClick={() => this.props.toggleShowManifestModal()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default ManifestModal;
