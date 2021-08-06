import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Nav, NavItem, NavLink} from 'reactstrap';

import LoadingOverlay from 'react-loading-overlay';

import { ZOHO_CLIENT_ID, ZOHO_ORG_ID, ZOHO_REDIRECT_URI } from '../config';
import { verifyToken, cleanRedirectState, getDMEClients } from '../state/services/authService';
import { getAllZohoTickets, mergeZohoTickets, closeZohoTicket } from '../state/services/extraService';

class ZohoPage extends React.Component {
    intervalID;
    zohoclientid = ZOHO_CLIENT_ID;
    zohoredirecturi = ZOHO_REDIRECT_URI;
    zohoorgid = ZOHO_ORG_ID;

    constructor(props) {
        super(props);

        this.state = {
            allTickets: [],
            filteredTickets: [], 
            activeTabInd: 0,
            merge: 'disabled',
            loadingStatus: false,
            showSimpleSearchBox: false,
            simpleSearchKeyword: '',
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        clientname: PropTypes.string,
        cleanRedirectState: PropTypes.func.isRequired,
        allTickets: PropTypes.array.isRequired,
        getAllZohoTickets: PropTypes.func.isRequired,
        mergeZohoTickets: PropTypes.func.isRequired,
        closeZohoTicket: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.setState({ loadingStatus: true });
        const token = localStorage.getItem('token');
        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }
        this.props.getDMEClients();
        
        this.setState({ loadingStatus: false });

        // precaution step to check for realtime data if response is slow
        this.getsetrealtimedata();

        // check for realtime data after every 10 seconds
        this.intervalID = setInterval(this.getsetrealtimedata.bind(this), 10000);

    }

    UNSAFE_componentWillMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        // document.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        clearInterval(this.intervalID);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target))
            this.setState({showSimpleSearchBox: false});
    }


    clickMerge(e){

        e.preventDefault();

        document.querySelectorAll('#merge').forEach(query => { query.removeAttribute('disabled');});
        document.querySelectorAll('#btnmerge').forEach(query => { query.style.display='none';});

        e.target.closest('td').children[2].style.display = 'inline';
        e.target.closest('td').children[3].style.display = 'inline';

        var element = e.target.closest('td').getAttribute('id');
        document.getElementsByName(element)[0].setAttribute('checked', 'checked');
        document.getElementsByName(element)[0].setAttribute('disabled', 'disabled');
        document.getElementsByName(element)[0].setAttribute('readOnly', 'true');
        console.log(document.getElementsByName(element));

        document.getElementsByName(element)[0].setAttribute('readOnly', 'true');
    }

    cancelMerge(e){

        //cancel a merge action before submitting

        var element = e.target.closest('td').getAttribute('id');
        document.getElementsByName(element)[0].removeAttribute('checked');
        document.getElementsByName(element)[0].removeAttribute('disabled');
        document.querySelectorAll('#merge').forEach(query => { query.setAttribute('disabled','disabled');});
        document.querySelectorAll('#btnmerge').forEach(query => { query.style.display='inline';});
        e.target.closest('td').children[2].style.display = 'none';
        e.target.closest('td').children[3].style.display = 'none';
        e.target.closest('td').children[4].style.display = 'none';
    }

    submitMerge(e){

        //merging two tickets

        var r = confirm('Are you sure you want to Merge these two tickets?');
        if (r == true) {
            var element = e.target.closest('td').getAttribute('id');
            document.querySelectorAll('input[checked=checked]').forEach(query => {
                // console.log(query.getAttribute('name'));
                if (query.getAttribute('name') !== element) {
                    let id = query.getAttribute('name');
                    // var mergingid = ['"' + element + '"'];
                    let idsToMerge =  [element];
                    let source = {
                        'contactId': element,
                        'subject': element,
                        'priority': element,
                        'status': element
                    };
                    this.props.mergeZohoTickets(id, idsToMerge, source);
                }
            });
        }

    }

    closeTicket(e){
        var r = confirm('Are you sure you want to Close these ticket?');
        if (r == true) {
            var ticketid = e.target.closest('td').getAttribute('id');
            
            this.props.closeZohoTicket(ticketid);
        }
    }

    updateCheck(e){

        //checking for second checkbox's checked status

        if( e.target.closest('input').getAttributeNode('checked') == null){
            e.target.closest('input').setAttribute('checked', 'checked');
        } else {
            e.target.closest('input').removeAttribute('checked');
        }

        var countchecked = document.querySelectorAll('input[checked=checked]').length;

        if(countchecked == 2){
            document.querySelectorAll('#merge').forEach(query => {
                if(query.getAttributeNode('checked') == null){
                    query.setAttribute('disabled','disabled');
                }
            });

        } else if(countchecked < 2){
            document.querySelectorAll('#merge').forEach(query => {
                if(query.getAttributeNode('checked') == null){
                    query.removeAttribute('disabled');
                }
            });
        }
    }

    getsetrealtimedata() {
        this.props.getAllZohoTickets();
        this.setState({ allTickets: this.props.allTickets, filteredTickets: this.props.allTickets });
    }
    

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
    }

    onClickTab(activeTabInd) {
        this.setState({activeTabInd});
        this.getFilteredTickets();
    }

    getFilteredTickets() {
        let filteredTickets = [];
        let { activeTabInd, allTickets } = this.state;
        for(let ticket of allTickets) {
            switch(activeTabInd) {
                case 0:
                    filteredTickets.push(ticket);
                    break;
                case 1:
                    if(ticket.assigneeId) 
                        filteredTickets.push(ticket);
                    break;
                case 2:
                    if(ticket.status === 'Open')
                        filteredTickets.push(ticket);
                    break;
                case 3: 
                    if (ticket.dueDate) {
                        let dueDate = new Date(ticket.dueDate);
                        if (this.isToday(dueDate)) 
                            filteredTickets.push(ticket);
                    }
                    break;
                case 4:
                    if (ticket.dueDate) {
                        let dueDate = new Date(ticket.dueDate);
                        if (this.isTomorrow(dueDate)) 
                            filteredTickets.push(ticket);
                    }
                    break;
            }
        }

        this.setState({filteredTickets});
    }


    isToday(someDate) {
        const today = new Date();
        return someDate.getDate() == today.getDate() &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear();
    }

    isTomorrow(someDate) {
        const today = new Date();
        const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        return someDate.getDate() == tomorrow.getDate() &&
            someDate.getMonth() == tomorrow.getMonth() &&
            someDate.getFullYear() == tomorrow.getFullYear();
    }

    onInputChange(e) {
        this.setState({simpleSearchKeyword: e.target.value});
    }

    onClickSimpleSearch(num) {
        if (num === 0) {
            this.setState({showSimpleSearchBox: true});
        }
    }
    
    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    onSimpleSearch(e) {
        e.preventDefault();
        const { simpleSearchKeyword, activeTabInd, allTickets } = this.state;
       
        let filteredTickets = [];
        if (simpleSearchKeyword.length === 0) {
            alert('Please input search keyword!');
        } else {
            for (let ticket of allTickets) {
                if(JSON.stringify(ticket).indexOf(simpleSearchKeyword) > 1)
                    switch(activeTabInd) {
                        case 0:
                            filteredTickets.push(ticket);
                            break;
                        case 1:
                            if(ticket.assigneeId) 
                                filteredTickets.push(ticket);
                            break;
                        case 2:
                            if(ticket.status === 'Open')
                                filteredTickets.push(ticket);
                            break;
                        case 3: 
                            if (ticket.dueDate) {
                                let dueDate = new Date(ticket.dueDate);
                                if (this.isToday(dueDate)) 
                                    filteredTickets.push(ticket);
                            }
                            break;
                        case 4:
                            if (ticket.dueDate) {
                                let dueDate = new Date(ticket.dueDate);
                                if (this.isTomorrow(dueDate)) 
                                    filteredTickets.push(ticket);
                            }
                            break;
                    }
            }
            this.setState({filteredTickets: filteredTickets});
        }
    }

    render() {
        const { activeTabInd, showSimpleSearchBox, simpleSearchKeyword, filteredTickets } = this.state;
        let items = filteredTickets.map((item, key) => {
            return(
                <tr key={key}>
                    <td><input id="merge" name={ item.id } type="checkbox" onChange={this.updateCheck} disabled/></td>
                    <td>{item.id}</td>
                    <td>{item.subject}</td>
                    <td>{item.email}</td>
                    <td>{item.status}</td>
                    <td className="text-center" id={item.id}><Link to={'/zohodetails?id='+item.id}><i className="fa fa-eye"></i> </Link>
                        <a id="btnmerge" onClick={this.clickMerge} data-toggle="tooltip" title="Merge"><i className="icon-flow-merge" aria-hidden="true"></i></a>
                        <a id="btncancelmerge" onClick={this.cancelMerge} data-toggle="tooltip" title="Cancel Merge"><i className="icon-cancel" aria-hidden="true"></i></a>
                        <a id="btnsubmitmerge" onClick={this.submitMerge} data-toggle="tooltip" title="Submit Merge"><i className="icon-check" aria-hidden="true"></i></a>
                        <a id="btncloseticket" onClick={this.closeTicket} data-toggle="tooltip" title="Close Ticket"><i className="icon-delete2" aria-hidden="true"></i></a>
                        {/*<a href={'/zohodetails/' + item.id}>View</a>*/}
                    </td>
                </tr>
            );
        });
        return (
            <LoadingOverlay active={this.state.loadingStatus} spinner text='Please Wait...' >

                <div className="qbootstrap-nav pods zoho" >
                    <div id="headr" className="col-md-12">
                        <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                            <ul className="nav nav-tabs">
                                <li><Link to="/booking">Header</Link></li>
                                <li className=""><Link to="/allbookings">All Bookings</Link></li>
                                <li className=""><a href="/bookingsets">Booking Sets</a></li>
                                <li className=""><a href="/pods">PODs</a></li>
                                {this.props.clientname === 'dme' && <li className="active"><Link to="/zoho">Zoho</Link></li>}
                                <li className=""><Link to="/reports">Reports</Link></li>
                                <li className="none"><a href="/bookinglines">Booking Lines</a></li>
                                <li className="none"><a href="/bookinglinedetails">Booking Line Data</a></li>
                            </ul>
                        </div>
                        <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right">
                            <a href=""><i className="icon-plus" aria-hidden="true"></i></a>
                            <div className="popup" onClick={() => this.onClickSimpleSearch(0)}>
                                <i className="icon-search3" aria-hidden="true"></i>
                                {
                                    showSimpleSearchBox &&
                                    <div ref={this.setWrapperRef}>
                                        <form onSubmit={(e) => this.onSimpleSearch(e)}>
                                            <input className="popuptext" type="text" placeholder="Search.." name="search" value={simpleSearchKeyword} onChange={(e) => this.onInputChange(e)} />
                                        </form>
                                    </div>
                                }
                            </div>

                            <div className="popup">
                                <i className="icon icon-th-list" aria-hidden="true"></i>
                            </div>
                            <a href=""><i className="icon-cog2" aria-hidden="true"></i></a>
                            <a href=""><i className="icon-calendar3" aria-hidden="true"></i></a>
                            <a href="">?</a>
                        </div>

                    </div>
                    <div className="clearfix"></div>
                    <div className="tabs">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={activeTabInd === 0 ? 'active' : ''}
                                    onClick={() => this.onClickTab(0)}
                                >
                                    All
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={activeTabInd === 1 ? 'active' : ''}
                                    onClick={() => this.onClickTab(1)}
                                >
                                    Not Assigned
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={activeTabInd === 2 ? 'active' : ''}
                                    onClick={() => this.onClickTab(2)}
                                >
                                    Open
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    className={activeTabInd === 3 ? 'active' : ''}
                                    onClick={() => this.onClickTab(3)}
                                >
                                    Due Today
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    className={activeTabInd === 4 ? 'active' : ''}
                                    onClick={() => this.onClickTab(4)}
                                >
                                    Due Tomorrow
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </div>

                    <table className="table table-striped table-bordered table-hover custom-table p-2">
                        <thead>
                            <tr>
                                <th id="merge" className="text-center">Select</th>
                                <th>Ticket Id</th>
                                <th>Subject</th>
                                <th>Email-Id</th>
                                <th>Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items}
                        </tbody>
                    </table>
                </div>
            </LoadingOverlay>
        );

    }
}

const mapStateToProps = (state) => {
    return {
        allTickets: state.extra.allTickets,
        dmeClients: state.auth.dmeClients,
        redirect: state.auth.redirect,
        clientname: state.auth.clientname,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getDMEClients: () => dispatch(getDMEClients()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAllZohoTickets: () => dispatch(getAllZohoTickets()),
        mergeZohoTickets: (id, ids, source) => dispatch(mergeZohoTickets(id, ids, source)),
        closeZohoTicket: (id) => dispatch(closeZohoTicket(id))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ZohoPage));
