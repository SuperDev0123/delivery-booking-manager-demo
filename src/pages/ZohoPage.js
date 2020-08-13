import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

import axios from 'axios';

import LoadingOverlay from 'react-loading-overlay';

import { ZOHO_CLIENT_ID, ZOHO_ORG_ID, ZOHO_REDIRECT_URI } from '../config';
import { verifyToken, cleanRedirectState, getDMEClients } from '../state/services/authService';

class ZohoPage extends React.Component {
    intervalID;
    zohoclientid = ZOHO_CLIENT_ID;
    zohoredirecturi = ZOHO_REDIRECT_URI;
    zohoorgid = ZOHO_ORG_ID;

    constructor(props) {
        super(props);

        this.state = {
            zohotickets: [],
            merge: 'disabled',
            loadingStatus: false,
        };
    }
    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        clientname: PropTypes.string,
        cleanRedirectState: PropTypes.func.isRequired,
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

        //get signed in and/or access token for api calls

        if (!localStorage.getItem('zohotoken') && window.location.href.indexOf('access_token=') < 1) {
            window.location.href = 'https://accounts.zoho.com.au/oauth/v2/auth?client_id='+this.zohoclientid+'&response_type=token&scope=Desk.tickets.ALL&redirect_uri='+this.zohoredirecturi;
        }

        //setting token access expiry time

        if (window.location.href.indexOf('access_token=') > -1) {
            var setexpiry = new Date();
            localStorage.setItem('expirytimeoftoken', setexpiry.getTime()+3600000); 
            var querystring = require('querystring');
            let url = window.location.href;
            let params = querystring.parse(url);
            localStorage.setItem('zohotoken', params.access_token);
            this.props.history.push('/zoho');
        }

        //get tickets data

        if (localStorage.getItem('zohotoken')) {
            const options = {
                method: 'get',
                headers: { 'orgId': this.zohoorgid, 'Authorization': 'Zoho-oauthtoken ' + localStorage.getItem('zohotoken') },
                url: 'https://desk.zoho.com.au/api/v1/tickets',
            };
            axios(options)
                .then(({ data }) => {
                    console.log(data);
                    this.setState({ zohotickets: data.data });
                    this.setState({ loadingStatus: false });
                })
                .catch((error) => console.log(error));
        }

        //checking for expiry time of token and request for new access token

        if(localStorage.getItem('expirytimeoftoken') != '' &&
            localStorage.getItem('expirytimeoftoken') != 'undefined' &&
            localStorage.getItem('expirytimeoftoken') !== null)
        {
            var checkexpiry = new Date();
            console.log(checkexpiry.getTime());
            console.log(localStorage.getItem('expirytimeoftoken'));
            if((checkexpiry.getTime() >= localStorage.getItem('expirytimeoftoken')  - 60000)){   // checking for a min less time
                window.location.href = 'https://accounts.zoho.com.au/oauth/v2/auth?response_type=token&client_id='+this.zohoclientid+'&scope=Desk.tickets.ALL&redirect_uri='+this.zohoredirecturi+'&state=1523436222480536829';
            }
        }

        this.setState({ loadingStatus: false });

        // precaution step to check for realtime data if response is slow
        this.getsetrealtimedata();

        // check for realtime data after every 10 seconds
        this.intervalID = setInterval(this.getsetrealtimedata.bind(this), 10000);

    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
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
                    var mergewithid = query.getAttribute('name');
                    // var mergingid = ['"' + element + '"'];
                    const options = {
                        method: 'post',
                        headers: {
                            'orgId': '7000200810',
                            'Authorization': 'Zoho-oauthtoken ' + localStorage.getItem('zohotoken')
                        },
                        data: {
                            'ids': [element],
                            'source': {
                                'contactId': element,
                                'subject': element,
                                'priority': element,
                                'status': element
                            }
                        },
                        url: 'https://desk.zoho.com.au/api/v1/tickets/' + mergewithid + '/merge',
                    };
                    axios(options)
                        .then(() => {

                            window.location.reload(false);

                        })
                        .catch((error) => console.log(error));

                }
            });
        }

    }

    closeTicket(e){
        var r = confirm('Are you sure you want to Close these ticket?');
        if (r == true) {
            var ticketid = e.target.closest('td').getAttribute('id');
            

            const options = {
                method: 'patch',
                headers: {
                    'orgId': '7000200810',
                    'Authorization': 'Zoho-oauthtoken ' + localStorage.getItem('zohotoken')
                },
                contentType: 'application/json; charset=utf-8',
                data: { 'status': 'Closed'},
                url: 'https://desk.zoho.com.au/api/v1/tickets/' + ticketid,
            };
            axios(options)
                .then(() => {
                    window.location.reload(false);
                })
                .catch((error) => console.log(error));
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

        //setting access token expiry time

        if (window.location.href.indexOf('access_token=') > -1) {
            var setexpiry = new Date();
            localStorage.setItem('expirytimeoftoken', setexpiry.getTime()+3600000);
            var querystring = require('querystring');
            let url = window.location.href;
            let params = querystring.parse(url);
            console.log(window.location.href);
            localStorage.setItem('zohotoken', params.access_token);
            this.props.history.push('/zoho');
        }


        //get tickets data

        if (localStorage.getItem('zohotoken') !== null &&
            localStorage.getItem('zohotoken') !== 'undefined' &&
            localStorage.getItem('zohotoken') !== null)
        {
            console.log(localStorage.getItem('zohotoken'));
            const options = {
                method: 'get',
                headers: { 'orgId': this.zohoorgid, 'Authorization': 'Zoho-oauthtoken ' + localStorage.getItem('zohotoken') },
                url: 'https://desk.zoho.com.au/api/v1/tickets',
            };
            axios(options)
                .then(({ data }) => {
                    console.log(data);
                    this.setState({ zohotickets: data.data });
                })
                .catch((error) => console.log(error));



        }

        //checking for expiry time of token

        if(localStorage.getItem('expirytimeoftoken') !== '' &&
            localStorage.getItem('expirytimeoftoken') !== 'undefined' &&
            localStorage.getItem('expirytimeoftoken') !== null)
        {
            var checkexpiry = new Date();
            console.log(checkexpiry.getTime());
            console.log(localStorage.getItem('expirytimeoftoken'));
            if((checkexpiry.getTime() >= localStorage.getItem('expirytimeoftoken')  - 60000)){   // checking for a min less time
                window.location.href = 'https://accounts.zoho.com.au/oauth/v2/auth?response_type=token&client_id='+this.zohoclientid+'&scope=Desk.tickets.ALL&redirect_uri='+this.zohoredirecturi+'&state=1523436222480536829';
            }
        }

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
    render() {
        console.log(this.state);
        const { zohotickets } = this.state;
        let items = zohotickets.map((item, key) => {
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

                <div className="qbootstrap-nav pods" >
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
                                <li className="none"><a href="/bookinglinedetails">Booking Line Datas</a></li>
                            </ul>
                        </div>
                        <div id="icn" className="col-md-4 col-sm-12 col-lg-4 col-xs-12 text-right">
                            <a href=""><i className="icon-plus" aria-hidden="true"></i></a>
                            <div className="popup">
                                <i className="icon-search3" aria-hidden="true"></i>
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
    console.log(state);
    return {
        //tickets: state.ticket.tickets,
        dmeClients: state.auth.dmeClients,
        redirect: state.auth.redirect,
        clientname: state.auth.clientname,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getDMEClients: () => dispatch(getDMEClients()),
        //getTickets: () => dispatch(getTickets()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ZohoPage));
