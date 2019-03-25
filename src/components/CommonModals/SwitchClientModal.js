import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class SwitchClientModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedClientId: null,
        };
    }

    static propTypes = {
        isShowSwitchClientModal: PropTypes.bool,
        toggleSwitchClientModal: PropTypes.func,
        clients: PropTypes.array,
        onSwitchClient: PropTypes.func,
    };

    static defaultProps = {
        isShowSwitchClientModal: false,
        clients: [],
    };

    handleInputChange(e) {
        const selectedClientId = e.target.value;
        this.setState({selectedClientId});
    }
    
    render() {
        const {selectedClientId} = this.state;
        const {isShowSwitchClientModal, clients} = this.props;

        const clientOptionsList = clients.map((client, key) => {
            return (<option key={key} value={client.pk_id_dme_client}>{client.company_name}</option>);
        });

        return (
            <ReactstrapModal isOpen={isShowSwitchClientModal} toggle={() => this.props.toggleSwitchClientModal()} className="switch-user-modal">
                <ModalHeader toggle={() => this.props.toggleSwitchClientModal()}>Swtich Client</ModalHeader>
                <ModalBody>
                    <label>
                        <p>Select a Client: </p>
                        <select
                            required 
                            name="clientSelect" 
                            onChange={(e) => this.handleInputChange(e)}
                            value = {selectedClientId} >
                            {clientOptionsList}
                        </select>
                    </label>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.props.onSwitchClient(selectedClientId)}>Switch</Button>
                    <Button color="secondary" onClick={() => this.props.toggleSwitchClientModal()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default SwitchClientModal;
