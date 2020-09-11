import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

class BokStatusPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    // UNSAFE_componentWillReceiveProps(newProps) {
    // }

    render() {
        return (
            <section className="bok-price">
                <h1>Comming soon</h1>
            </section>
        );
    }
}

// const mapStateToProps = (state) => {
//     return {
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//     };
// };

export default connect()(BokStatusPage);
