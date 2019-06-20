import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class XMLModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vx_freight_provider: '',
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.required,
        toggleShowXMLModal: PropTypes.func.required,
        onClickBuildXML: PropTypes.func.required,
    };

    static defaultProps = {
        isOpen: false,
    };

    componentDidMount() {
    }

    onInputChange(e) {
        this.setState({vx_freight_provider: e.target.value});
    }

    onClickBuildBtn() {
        this.props.onClickBuildXML(this.state.vx_freight_provider);
        this.props.toggleShowXMLModal();
    }

    render() {
        const {isOpen} = this.props;
        const {vx_freight_provider, errorMessage} = this.state;

        return (
            <ReactstrapModal isOpen={isOpen} toggle={() => this.props.toggleShowXMLModal()} className="xml-modal">
                <ModalHeader toggle={() => this.props.toggleShowXMLModal()}>XML Download</ModalHeader>
                <ModalBody>
                    <label>
                        <p>Freight Provider: </p>
                        <select
                            required 
                            name="vx_freight_provider" 
                            onChange={(e) => this.onInputChange(e)}
                            value = {vx_freight_provider} >
                            <option value="" selected disabled hidden>Select a Freight Provider</option>
                            <option value="allied">Allied</option>
                            <option value="TASFR">Tas</option>
                        </select>
                    </label>
                    <p className="red">{errorMessage}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" disabled={vx_freight_provider.length > 0 ? false : true} onClick={() => this.onClickBuildBtn()}>Build XML</Button>
                    <Button color="secondary" onClick={() => this.props.toggleShowXMLModal()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default XMLModal;
