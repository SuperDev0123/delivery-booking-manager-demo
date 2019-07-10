import React, { Component } from 'react';
import { connect } from 'react-redux';
//import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

class CustomPagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
    };

    componentDidMount() {
    }

    render() {
        return (
            <Pagination size="sm" aria-label="Page navigation example">
                <PaginationItem>
                    <PaginationLink href="#" onClick={() => this.onClickPagination('first')}>
                        &lt;&lt;
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" onClick={() => this.onClickPagination('prev')}>
                        &lt;
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" onClick={() => this.onClickPagination(1)}>
                        1
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" onClick={() => this.onClickPagination(2)}>
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" onClick={() => this.onClickPagination('next')}>
                        &gt;
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" onClick={() => this.onClickPagination('last')}>
                        &gt;&gt;
                    </PaginationLink>
                </PaginationItem>
            </Pagination>
        );
    }
}

export default connect()(CustomPagination);
