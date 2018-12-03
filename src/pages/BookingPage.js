import React, { Component } from 'react';
import { connect } from 'react-redux';

class BookingPage extends Component {
    render() {
        return (
            <div id="page">
                This is Booking page.
            </div>
        );
    }
}

// const mapStateToProps = (state) => {
//     return {
//         username: state.auth.username
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {

//     };
// };

export default connect()(BookingPage);