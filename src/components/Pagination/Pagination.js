import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

class CustomPagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        pageCnt: PropTypes.number.isRequired,
        pageInd: PropTypes.number.isRequired,
        onClickPagination: PropTypes.func.isRequired,
    };

    componentDidMount() {
    }

    onClickPaginationItem(event, type) {
        event.preventDefault();
        const {pageCnt, pageInd} = this.props;

        if (pageCnt > 0) {
            if (type === 'first' && pageInd !== 0) {
                this.props.onClickPagination(0);
            } else if (type === 'prev' && pageInd !== 0) {
                this.props.onClickPagination(pageInd - 1);
            } else if (type === 'next' && pageInd !== pageCnt - 1) {
                this.props.onClickPagination(pageInd + 1);
            } else if (type === 'last' && pageInd !== pageCnt - 1) {
                this.props.onClickPagination(pageCnt - 1);
            }
        }
    }

    render() {
        const {pageCnt, pageInd} = this.props;
        let startInd = 0, endInd = 4;

        if (pageCnt > 5 && pageInd > 2) {
            startInd = (pageCnt < pageInd + 3) ? pageCnt - 4 : pageInd - 2;
        }

        endInd = (startInd + 5 > pageCnt) ? pageCnt - 1 : startInd + 4;

        const paginationItems = [];

        for (let i = startInd; i <= endInd; i++) {
            paginationItems.push(
                <PaginationItem key={i}>
                    <PaginationLink 
                        href='#' 
                        onClick={(event) => { 
                            event.preventDefault();
                            this.props.onClickPagination(i);
                        }}
                        className={i === pageInd ? 'current' : null}
                    >
                        {i + 1}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return (
            <Pagination size='sm' aria-label='Page navigation example'>
                <PaginationItem>
                    <PaginationLink 
                        href='#'
                        onClick={(event) => this.onClickPaginationItem(event, 'first')}
                        className={pageCnt === 0 || pageInd === 0 ? 'disabled' : null}
                    >
                        &lt;&lt;
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        href='#' 
                        onClick={(event) => this.onClickPaginationItem(event, 'prev')}
                        className={pageCnt === 0 || pageInd === 0 ? 'disabled' : null}
                    >
                        &lt;
                    </PaginationLink>
                </PaginationItem>
                {paginationItems}
                <PaginationItem>
                    <PaginationLink
                        href='/#' 
                        onClick={(event) => this.onClickPaginationItem(event, 'next')}
                        className={pageCnt === 0 || pageInd === pageCnt - 1 ? 'disabled' : null}
                    >
                        &gt;
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink 
                        href='#' 
                        onClick={(event) => this.onClickPaginationItem(event, 'last')}
                        className={pageCnt === 0 || pageInd === pageCnt - 1 ? 'disabled' : null}
                    >
                        &gt;&gt;
                    </PaginationLink>
                </PaginationItem>
            </Pagination>
        );
    }
}

export default connect()(CustomPagination);
