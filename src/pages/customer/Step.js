import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Step extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        statusName: PropTypes.string.isRequired,
        statusClass: PropTypes.string.isRequired,
    }

    render() {
        const {statusName, statusClass } = this.props;
        return (
            <li key={statusName} className={statusClass}><p><strong>{statusName.toUpperCase()}</strong></p></li>
        );
    }
}

export default Step;