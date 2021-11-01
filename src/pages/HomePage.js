import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import img1 from '../public/images/1.png';
import img2 from '../public/images/2.png';
import img3 from '../public/images/3.png';

import { verifyToken, getUser, cleanRedirectState } from '../state/services/authService';

class HomePage extends Component {
    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        getUser: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
            this.props.getUser(token);
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const {redirect} = newProps;

        if (redirect) {
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <section className="theme-bg">
                <div className="right-pan">
                    <p>Deliver Me</p>
                    <h5 style={{fontWeight: 'bold'}}>Your Freight Department - Automated</h5>
                    <br />
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 30}}>
                        <h4>The Deliver-ME freight department module is a platform that allows our clients to automate their freight department</h4>
                        <br />
                        <h4>From organising all requirements needed to optimise the freight logistics function and their customer&apos;s experience</h4>
                        <i className="fas fa-angle-double-down" style={{fontSize: 16, fontWeight: 'bold'}}></i>
                        <h4>to accurate live costing of freight sensitive to the end customer&apos;s needs when selling online or via their internal sales application</h4>
                        <i className="fas fa-angle-double-down" style={{fontSize: 16, fontWeight: 'bold'}}></i>
                        <h4>to freight packing, despatch and delivery management</h4>
                        <i className="fas fa-angle-double-down" style={{fontSize: 16, fontWeight: 'bold'}}></i>
                        <h4>through to reconciliation and payment of freight bills</h4>
                    </div>
                </div>
                <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                    </ol>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img className="d-block w-100" src={img1} alt="First slide" />
                            <div className="carousel-caption d-none d-md-block">
                                <h1>Deliver Me</h1>
                                <h4>Your Freight Department - Automated</h4>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={img2} alt="Second slide" />
                            <div className="carousel-caption d-none d-md-block">
                                <h1>Deliver Me</h1>
                                <h4>Your Freight Department - Automated</h4>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={img3} alt="Third slide" />
                            <div className="carousel-caption d-none d-md-block">
                                <h1>Deliver Me</h1>
                                <h4>Your Freight Your Delivery</h4>
                            </div>
                        </div>
                    </div>
                    <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        errorMessage: state.auth.errorMessage,
        redirect: state.auth.redirect,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getUser: (token) => dispatch(getUser(token)),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
