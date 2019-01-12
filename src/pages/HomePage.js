import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import img1 from '../public/images/1.png';
import img2 from '../public/images/2.png';
import img3 from '../public/images/3.png';

import { verifyToken } from '../state/services/authService';
import { getUser } from '../state/services/authService';

class HomePage extends Component {
    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        getUser: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    componentDidUpdate() {
        const currentRoute = this.props.location.pathname;

        if (this.props.redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token.length > 0) {
            this.props.verifyToken();
            this.props.getUser(token);
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <section className="theme-bg">
                <div className="right-pan">
                    <p>Deliver Me</p>
                    <p>Your Delivery Concierge.. </p>
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
                                <h4>Your Delivery Concierge</h4>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={img2} alt="Second slide" />
                            <div className="carousel-caption d-none d-md-block">
                                <h1>Deliver Me</h1>
                                <h4>Your Delivery Concierge.. </h4>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
