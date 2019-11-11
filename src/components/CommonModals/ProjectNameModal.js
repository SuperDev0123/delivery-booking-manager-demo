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
        toggleShowProjectNameModal: PropTypes.func,
        onUpdate: PropTypes.func.required,
        name: PropTypes.string.required,
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
            <ReactstrapModal isOpen={isShowProjectNameModal} toggle={() => this.props.toggleShowProjectNameModal()} className="status-note-modal">
                <ModalHeader toggle={() => this.props.toggleShowProjectNameModal()}>Set Project Name</ModalHeader>
                <ModalBody>
                    <label>
                        <p>Project Name: </p>
                        <textarea
                            className="form-control"
                            value={name}
                            onChange={(e) => this.handleInputChange(e)}
                        />
                    </label>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.onUpdate()}>Save</Button>
                    <Button color="secondary" onClick={() => this.props.toggleShowProjectNameModal()}>Cancel</Button>
                </ModalFooter>
            </ReactstrapModal>
        );
    }
}

export default ProjectNameModal;