import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import img1 from '../public/images/1.png';
import img2 from '../public/images/2.png';
import img3 from '../public/images/3.png';

import { getUser } from '../state/services/authService';

class HomePage extends Component {
    static propTypes = {
        getUser: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const token = localStorage.getItem('token');

        if (token)
            this.props.getUser(token);
    }

    render() {
        return (
            <section className="theme-bg">
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
        username: state.auth.username
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (token) => dispatch(getUser(token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);