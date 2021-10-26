import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Actions
import { getPallets, createPallet } from '../../state/services/extraService';

// Constants
const NEW = 0;
const DUPLICATE = 1;
const LIST = 0;
const FORM = 1;

class PalletSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formInputs: {},
            viewMode: LIST,
            saveMode: NEW,
            selectedPallet: null,
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        toggleSlider: PropTypes.func.isRequired,
        onSelectPallet: PropTypes.func.isRequired,
        getPallets: PropTypes.func.isRequired,
        createPallet: PropTypes.func.isRequired,
        pallets: PropTypes.array,
    };

    componentDidMount() {
        this.props.getPallets();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {pallets} = newProps;

        if (pallets) {
            this.setState({viewMode: LIST});
        }
    }

    notify = (text) => {
        toast(text);
    };

    onClickNew(e) {
        e.preventDefault();
        this.setState({viewMode: FORM, saveMode: NEW, formInputs: {}});
    }

    onClickDuplicate(e, pallet) {
        e.preventDefault();
        const formInputs = {
            'code': pallet.code,
            'type': pallet.type,
            'desc': pallet.desc,
            'length': pallet.length,
            'width': pallet.width,
            'height': pallet.height,
            'weight': pallet.weight,
        };
        this.setState({viewMode: FORM, saveMode: DUPLICATE, formInputs});
    }

    onClickSelect(e, pallet=null) {
        e.preventDefault();
        this.setState({selectedPallet: pallet});

        if (pallet)
            this.props.onSelectPallet(pallet.id);
        else
            this.props.onSelectPallet(-1);
    }

    onClickCancel(e) {
        e.preventDefault();
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

    onSubmit(e) {
        const {formInputs} = this.state;
        const {pallets} = this.props;
        let isDuplicated = false;
        e.preventDefault();

        pallets.map(pallet => {
            if (
                pallet.code === formInputs['code'] &&
                pallet.type === formInputs['type'] &&
                pallet.desc === formInputs['desc'] &&
                pallet.length === formInputs['length'] &&
                pallet.width === formInputs['width'] &&
                pallet.height === formInputs['height'] &&
                pallet.weight === formInputs['weight']
            ) {
                isDuplicated = true;
                this.notify('Your new Pallet already exist!');
            }
        });

        if (!isDuplicated)
            this.props.createPallet(formInputs);
    }

    render() {
        const { isOpen, pallets } = this.props;
        const { viewMode, saveMode, formInputs } = this.state;

        let palletList = pallets.map((pallet, index) =>
            <tr key={index}>
                <td><Button color="info" onClick={(e) => this.onClickSelect(e, pallet)}>Use</Button></td>
                <td>{pallet.code}</td>
                <td>{pallet.type}</td>
                <td>{pallet.desc}</td>
                <td>{pallet.length}</td>
                <td>{pallet.width}</td>
                <td>{pallet.height}</td>
                <td>{pallet.weight}</td>
                <td>{pallet.max_weight}</td>
                <td className="duplicate">
                    <Button color="primary" onClick={(e) => this.onClickDuplicate(e, pallet)}>Duplicate</Button>
                </td>
            </tr>
        );

        return (
            <SlidingPane
                className='pallet-slider'
                overlayClassName='pallet-slider-overlay'
                isOpen={isOpen}
                title='Pallet Slider'
                subtitle=''
                onRequestClose={() => this.props.toggleSlider()}
            >
                {viewMode === LIST ?
                    <div className="table-view">
                        <Button color="primary" onClick={(e) => this.onClickNew(e)}>New</Button>
                        <table className="table table-hover table-bordered sortable fixed_headers">
                            <tr>
                                <th className="" scope="col" nowrap><p>Use</p></th>
                                <th className="" scope="col" nowrap><p>Code</p></th>
                                <th className="" scope="col" nowrap><p>Type</p></th>
                                <th className="" scope="col" nowrap><p>Description</p></th>
                                <th className="" scope="col" nowrap><p>Length(mm)</p></th>
                                <th className="" scope="col" nowrap><p>Width(mm)</p></th>
                                <th className="" scope="col" nowrap><p>Height(mm)</p></th>
                                <th className="" scope="col" nowrap><p>Weight(kg)</p></th>
                                <th className="" scope="col" nowrap><p>Max Weight(kg)</p></th>
                                <th className="" scope="col" nowrap><p>Action</p></th>
                            </tr>
                            { palletList }
                            <tr><td><Button color="info" onClick={(e) => this.onClickSelect(e, null)}>Use DME AI</Button></td></tr>
                        </table>
                    </div>
                    :
                    <div className="form-view">
                        <label><h1>{saveMode===NEW ? 'Create' : 'Duplicate'} a Pallet</h1></label>
                        <form onSubmit={(e) => this.onSubmit(e)} role="form">
                            <div className="form-group">
                                <label htmlFor="code">First Name</label>
                                <input name="code" type="text" className="form-control" id="code" placeholder="PLT_01"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={formInputs['code']} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="type">Type</label>
                                <input name="type" type="text" className="form-control" id="type" placeholder="Standard"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={formInputs['type']} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="desc">Description</label>
                                <input name="desc" type="text" className="form-control" id="desc" placeholder="Australia Standard Pallet"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={formInputs['desc']} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="length">Length (mm)</label>
                                <input name="length" type="number" className="form-control" id="length" placeholder="1200"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={formInputs['length']} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="width">Width (mm)</label>
                                <input name="width" type="number" className="form-control" id="width" placeholder="1200"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={formInputs['width']} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="height">Height (mm)</label>
                                <input name="height" type="number" className="form-control" id="height" placeholder="1600"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={formInputs['height']} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="weight">Weight (kg)</label>
                                <input name="weight" type="weight" className="form-control" id="weight" placeholder="500"
                                    onChange={(e) => this.onInputChange(e)}
                                    value={formInputs['weight']} />
                            </div>
                            <Button type="submit" className="btn btn-primary mt-2">Submit</Button>
                            <Button className="btn btn-secondary mt-2" onClick={(e) => this.onClickCancel(e)}>Cancel</Button>
                        </form>
                    </div>
                }
                <ToastContainer />
            </SlidingPane>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pallets: state.extra.pallets,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getPallets: () => dispatch(getPallets()),
        createPallet: (pallet) => dispatch(createPallet(pallet)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PalletSlider));
