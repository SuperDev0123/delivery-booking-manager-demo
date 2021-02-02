import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { createAugmentAddress } from '../../../../state/services/augmentService';

class AddAugmentAddress extends Component {
    constructor(props) {
        super(props);

        this.state = {
            origin_word: '',
            augmented_word: '',
            loading: false,
        };
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        createAugmentAddress: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, origin_word, augmented_word } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
        if (origin_word) {
            this.setState({ origin_word: origin_word });
        }
        if (augmented_word) {
            this.setState({ augmented_word: augmented_word });
        }
    }

    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit(event) {
        this.setState({ loading: true });
        const { origin_word, augmented_word } = this.state;
        this.props.createAugmentAddress({ origin_word: origin_word, augmented_word: augmented_word });
        this.setState({ loading: false });
        this.props.history.push('/admin/augmentaddress');
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <div className="pageheader">
                    <h1>Add Augment Address Rules</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li><a href="/admin/augmentaddress">Augment Address Rules</a></li>
                            <li className="active">Add New</li>
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
                                    <h3 className="panel-title">Add New</h3>
                                    <div className="actions pull-right">

                                    </div>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => this.onSubmit(e)} role="form">
                                        <div className="form-group">
                                            <label htmlFor="origin_word">Origin Word</label>
                                            <input name="origin_word" type="text" className="form-control" id="origin_word" placeholder="Origin Word" value={this.state.origin_word} onChange={(e) => this.onInputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="augmented_word">Augmented Word</label>
                                            <input name="augmented_word" type="text" className="form-control" id="augmented_word" placeholder="Augmented Word" value={this.state.augmented_word} onChange={(e) => this.onInputChange(e)} />
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
        origin_word: state.augment.origin_word,
        augmented_word: state.augment.augmented_word,
        username: state.auth.username,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        createAugmentAddress: (fpDetail) => dispatch(createAugmentAddress(fpDetail))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddAugmentAddress));
