import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AdminHeader extends Component {
    constructor(props) {
        super(props);

    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        breadcrumbs: PropTypes.array.isRequired,
    }

    render() {
        const { title, breadcrumbs } = this.props;
        return (
            <div className='pageheader'>
                <h1>{title}</h1>
                <div className='breadcrumb-wrapper hidden-xs'>
                    <span className='label'>You are here:</span>
                    <ol className='breadcrumb'>
                        {breadcrumbs.map((breadcrumb, index) => {
                            if (index < breadcrumbs.length - 1) {
                                return (<li key={index}><a href={breadcrumb.url}>{breadcrumb.name}</a></li>);
                            } else {
                                return <li key={index} className='active'>{breadcrumb.name}</li>;
                            }
                        })}
                    </ol>
                </div>
            </div>
        );
    }
}

export default AdminHeader;