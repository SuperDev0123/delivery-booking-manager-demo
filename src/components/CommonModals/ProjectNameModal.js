import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button, Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ProjectNameModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
        };
    }

    static propTypes = {
        isShowProjectNameModal: PropTypes.bool,
        toggleProjectNameModal: PropTypes.func,
        onUpdate: PropTypes.func.isRequired,
        name: PropTypes.string,
    };

    static defaultProps = {
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({name: nextProps.name});
    }

    handleInputChange(e) {
        this.setState({name: e.target.value});
    }
    
    onUpdate() {
        const {name} = this.state;
        this.props.onUpdate(name);
    }

    render() {
        const {name} = this.state;
        const {isShowProjectNameModal} = this.props;

        return (
            <ReactstrapModal isOpen={isShowProjectNameModal} toggle={() => this.props.toggleProjectNameModal()} className="status-note-modal">
                <ModalHeader toggle={() => this.props.toggleProjectNameModal()}>Set Vehicle Loaded</ModalHeader>
                <ModalBody>
                    <label>
                        <p>Vehicle Loaded: </p>
                        <textarea
                            className="form-control"
                            value={name}
                            onChange={(e) => this.handleInputChange(e)}
                        />
                    </label>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.onUpdate()}>Save</Button>
                    <Button color="secondary" onClick={() => this.props.toggleProjectNameModal()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default ProjectNameModal;
