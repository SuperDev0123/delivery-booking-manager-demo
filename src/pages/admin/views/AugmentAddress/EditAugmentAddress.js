import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getAugmentAddress, updateAugmentAddress } from '../../../../state/services/augmentService';

class EditAugmentAddress extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            augmentAddress: {id:0, origin_word: '', augmented_word:''}
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        match: PropTypes.object.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        getAugmentAddress: PropTypes.func.isRequired,
        updateAugmentAddress: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        this.props.getAugmentAddress(id);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, augmentAddress } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (augmentAddress) {
            this.setState({ augmentAddress: augmentAddress });
        }
    }

    onInputChange(event) {
        const { augmentAddress } = this.state;
        augmentAddress[event.target.name] = event.target.value;

        this.setState({ augmentAddress: augmentAddress });
    }

    onSubmit(event) {
        this.setState({ loading: true });
        const { augmentAddress } = this.state;
        this.props.updateAugmentAddress({ id: augmentAddress.id, origin_word: augmentAddress.origin_word, augmented_word: augmentAddress.augmented_word });
        this.setState({ loading: false });
        this.props.history.push('/admin/augmentaddress');
        event.preventDefault();
    }

    render() {
        return (
            <div>

                <div className="pageheader">
                    <h1>Edit Augmented Rules</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li><a href="/admin/augmentaddress">Augmented Rules</a></li>
                            <li className="active">Edit</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    />
                    <div className="row">
                        <div className="col-md-6">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Edit Augment Address Rule</h3>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => this.onSubmit(e)} role="form">
                                        <div className="form-group">
                                            <label htmlFor="inputOriginWord">Origin Word</label>
                                            <input name="origin_word" type="text" className="form-control" id="inputOriginWord" placeholder="Enter Origin Word" value={this.state.augmentAddress.origin_word} onChange={(e) => this.onInputChange(e)} />
                                            <input name="id" type="hidden" value={this.state.id} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputAugmentedWord">Augmented Word</label>
                                            <input name="augmented_word" type="text" className="form-control" id="inputAugmentedWord" placeholder="Enter Augmented Word" value={this.state.augmentAddress.augmented_word} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-5 mb-2">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        augmentAddress: state.augment.augmentAddress,
        username: state.auth.username,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAugmentAddress: (id) => dispatch(getAugmentAddress(id)),
        updateAugmentAddress: (augmentAddress) => dispatch(updateAugmentAddress(augmentAddress)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditAugmentAddress));
