// React Libs
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { isEmpty, clone } from 'lodash';
import moment from 'moment-timezone';
import { Button } from 'reactstrap';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

// Services
import { createCSNote, updateCSNote, deleteCSNote } from '../../state/services/extraService';

// Constants
const NEW = 0;
const UPDATE = 1;
const LIST = 0;
const FORM = 1;
const DELETE = 2;

class CSNoteSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: LIST,
            saveMode: NEW,
            formInputs: {
                note: '',
            },
            errorMessage: null,
            selectedNoteIndex: null,
        };

        moment.tz.setDefault('Australia/Sydney');
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        createCSNote: PropTypes.func.isRequired,
        updateCSNote: PropTypes.func.isRequired,
        deleteCSNote: PropTypes.func.isRequired,
        // Data
        csNotes: PropTypes.array.isRequired,
        clientname: PropTypes.string.isRequired,
        booking: PropTypes.object.isRequired,
    };

    // componentDidMount() {
    //
    // }

    // UNSAFE_componentWillReceiveProps(newProps) {
    // }

    onClickNewBtn() {
        const formInputs = this.state.formInputs;
        formInputs['note'] = '';
        this.setState({viewMode: FORM, saveMode: NEW, formInputs});
    }

    onClickEditButton(index) {
        const formInputs = clone(this.props.csNotes[index]);
        this.setState({formInputs, viewMode: FORM, saveMode: UPDATE});
    }

    onClickDeleteButton(index) {
        this.setState({selectedNoteIndex: index, viewMode: DELETE});
    }

    onClickSave() {
        const {booking} = this.props;
        const {saveMode} = this.state;
        const csNote = clone(this.state.formInputs);
        csNote['booking'] = booking.id;

        if (csNote['note'] === '') {
            this.setState({errorMessage: 'Please write a note.'});
            return;
        }

        if (saveMode === 0) {
            this.props.createCSNote(csNote);
        } else if (saveMode === 1) {
            this.props.updateCSNote(csNote);
        }

        this.setState({
            viewMode: LIST,
            saveMode: NEW,
            formInputs: {
                note: '',
            },
        });
    }

    onClickDelete() {
        this.props.deleteCSNote(this.props.csNotes[this.state.selectedNoteIndex]['id']);
        this.setState({
            viewMode: LIST,
            saveMode: NEW,
            formInputs: {
                note: '',
            },
        });
    }

    onClickCancel() {
        this.setState({viewMode: LIST});
    }

    onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const formInputs = this.state.formInputs;
        formInputs[name] = value;
        this.setState({formInputs, errorMessage: ''});
    }

    render() {
        const {isOpen, csNotes, clientname} = this.props;
        const {viewMode, saveMode, formInputs, errorMessage, selectedNoteIndex} = this.state;

        const csNoteList = csNotes.map((eachItem, index) => {
            return (
                <tr key={index}>
                    <td>{eachItem.note}</td>
                    <td>{moment(eachItem.z_createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}</td>
                    <td>{eachItem.z_createdByAccount}</td>
                    {(clientname === 'dme') &&
                    <td>
                        <Button color="primary" onClick={() => this.onClickEditButton(index)}><i className="icon icon-pencil"></i></Button>
                        <Button color="danger" onClick={() => this.onClickDeleteButton(index)}><i className="fa fa-trash" aria-hidden="true"></i></Button>
                    </td>
                    }
                </tr>
            );
        });

        return(
            <SlidingPane
                className='cs-note-slider'
                overlayClassName='cs-note-slider-overlay'
                isOpen={isOpen}
                title='Customer Support Notes'
                subtitle=""
                onRequestClose={this.props.toggleSlider}
            >
                {viewMode === LIST &&
                    <div className="list-view">
                        {clientname === 'dme' &&
                            <Button color="primary" onClick={() => this.onClickNewBtn()}>+</Button>
                        }
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <tr>
                                <th className="" scope="col" nowrap><p>Note</p></th>
                                <th className="" scope="col" nowrap><p>Written At</p></th>
                                <th className="" scope="col" nowrap><p>Author</p></th>
                                <th className="" scope="col" nowrap><p>Action</p></th>
                            </tr>
                            { csNoteList }
                        </table>
                    </div>
                }
                {viewMode === FORM &&
                    <div className="form-view">
                        <label>
                            <h1>{saveMode===0 ? 'New' : 'Edit'} Note</h1>
                        </label>
                        <label>
                            <p>Note</p>
                            <textarea
                                name="note"
                                value={formInputs['note']} 
                                onChange={(e) => this.onInputChange(e)}
                            />
                        </label>
                        {isEmpty(errorMessage) ?
                            <label></label>
                            :
                            <label>
                                <p className='red'>{errorMessage}</p>
                            </label>
                        }
                        <Button
                            color="primary"
                            onClick={() => this.onClickSave()}
                        >
                            {saveMode === 0 ? 'Create' : 'Update'}
                        </Button>
                        <Button color="danger" onClick={() => this.onClickCancel()}>
                            Cancel
                        </Button>
                    </div>
                }
                {viewMode === DELETE &&
                    <div className="form-view">
                        <label>
                            <h1>Are you sure to delete following note?</h1>
                        </label>
                        <label>
                            <p>Note: {csNotes[selectedNoteIndex]['note']}</p>
                        </label>
                        {isEmpty(errorMessage) ?
                            <label></label>
                            :
                            <label>
                                <p className='red'>{errorMessage}</p>
                            </label>
                        }
                        <Button
                            color="primary"
                            onClick={() => this.onClickDelete()}
                        >
                            Yes, Delete
                        </Button>
                        <Button color="danger" onClick={() => this.onClickCancel()}>
                            No
                        </Button>
                    </div>
                }
            </SlidingPane>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        csNotes: state.extra.csNotes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createCSNote: (csNote) => dispatch(createCSNote(csNote)),
        updateCSNote: (csNote) => dispatch(updateCSNote(csNote)),
        deleteCSNote: (noteId) => dispatch(deleteCSNote(noteId)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CSNoteSlider));
