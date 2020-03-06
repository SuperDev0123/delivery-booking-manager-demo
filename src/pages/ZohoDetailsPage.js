import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import SlideToggle from 'react-slide-toggle';
// import Moment from 'moment';
import ReactHtmlParser from 'react-html-parser';

import { ZOHO_CLIENT_ID, ZOHO_ORG_ID, ZOHO_REDIRECT_URI } from '../config';
import { verifyToken, cleanRedirectState, getDMEClients } from '../state/services/authService';
import moment from 'moment-timezone';

class ZohoDetailsPage extends React.Component {
    intervalID;
    intervalID2;
    mailbackaddress;
    id;
    zohoclientid = ZOHO_CLIENT_ID;
    zohoredirecturi = ZOHO_REDIRECT_URI;
    zohoorgid = ZOHO_ORG_ID;

    temparr = [];

    constructor(props) {
        super(props);

        this.state = {
            zohotickets: [],
            loadingStatus: false,
            ticketid: '',
            threadcontent: [],
            threaddetails: [],
            threadids: [],
            threadiddetails: [],
            mail: '',
        };
        this.addValue = this.addValue.bind(this);
        this.updateInput = this.updateInput.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
    };

    componentDidMount() {
        var urlParams = new URLSearchParams(window.location.search);
        this.id = urlParams.get('id');
        this.setState({ loadingStatus: true });

        const token = localStorage.getItem('token');
        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }
        this.props.getDMEClients();

        if (!localStorage.getItem('zohotoken') && window.location.href.indexOf('access_token=') < 1) {
            window.location.href = 'https://accounts.zoho.com.au/oauth/v2/auth?client_id='+this.zohoclientid+'&response_type=token&scope=Desk.tickets.ALL&redirect_uri='+this.zohoredirecturi;
        }

        if (window.location.href.indexOf('access_token=') > -1) {
            var setexpiry = new Date();
            localStorage.setItem('expirytimeoftoken', setexpiry.getTime()+3600000);
            var querystring = require('querystring');
            let url = window.location.href;
            let params = querystring.parse(url);
            localStorage.setItem('zohotoken', params.access_token);
            this.props.history.push('/zoho');
        }

        //get original ticket data

        if (this.id) {
            const options = {
                method: 'get',
                headers: { 'orgId': this.zohoorgid, 'Authorization': 'Zoho-oauthtoken ' + localStorage.getItem('zohotoken') },
                url: 'https://desk.zoho.com.au/api/v1/tickets/'+this.id,
            };
            axios(options)
                .then(({ data }) => {
                    this.setState({threadcontent: data});
                })
                .catch((error) => console.log(error));
        }

        //get threads/conversations related to ticket

        if (this.id) {
            const options = {
                method: 'get',
                headers: { 'orgId': this.zohoorgid, 'Authorization': 'Zoho-oauthtoken ' + localStorage.getItem('zohotoken') },
                url: 'https://desk.zoho.com.au/api/v1/tickets/'+this.id+'/conversations',
            };
            axios(options)
                .then(({ data }) => {
                    this.setState({threaddetails: data.data});
                })
                .catch((error) => console.log(error));
        }

        this.getsetrealtimedata();
        this.getThreadsdata();

        this.intervalID = setInterval(this.getsetrealtimedata.bind(this), 30000);
        this.intervalID2 = setInterval(this.getThreadsdata.bind(this), 10000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
        clearInterval(this.intervalID2);

        //precautionary waiting for tickets data
        setTimeout(function(){
            this.getThreadsdata();
        }, 5000);
    }

    compare( a, b ) {
        if ( a.createdTime < b.createdTime ){
            return 1;
        }
        if ( a.createdTime > b.createdTime ){
            return -1;
        }
        return 0;
    }

    getThreadsdata(){
        if (this.id) {
            const options = {
                method: 'get',
                headers: {
                    'orgId': this.zohoorgid,
                    'Authorization': 'Zoho-oauthtoken ' + localStorage.getItem('zohotoken')
                },
                url: 'https://desk.zoho.com.au/api/v1/tickets/' + this.id + '/conversations',
            };
            axios(options)
                .then(({data}) => {
                    this.setState({threaddetails: data.data});

                    const { threaddetails } = this.state;
                    threaddetails.map((item) => {

                        const { threadiddetails } = this.state;
                        if (Number(threaddetails.length) > Number(threadiddetails.length)) {
                            const options = {
                                method: 'get',
                                headers: { 'orgId': this.zohoorgid, 'Authorization': 'Zoho-oauthtoken ' + localStorage.getItem('zohotoken') },
                                url: 'https://desk.zoho.com.au/api/v1/tickets/'+this.id+'/threads/'+item.id,
                            };
                            axios(options)
                                .then(({ data }) => {
                                    const { threadiddetails } = this.state;
                                    if(Number(threadiddetails.length) > 0){
                                        var flag = false;
                                        for(var i = 0; i < Number(threadiddetails.length); i++ ){
                                            if(Number(data.id) === Number(threadiddetails[i].id)){
                                                flag = true;
                                                break;
                                            }
                                        }
                                        if(!flag){
                                            this.setState({threadiddetails: this.state.threadiddetails.concat(data)});
                                            this.setState({threadiddetails: this.state.threadiddetails.sort(this.compare)});
                                            this.setState({loadingStatus: false});
                                        }
                                    } else {
                                        this.setState({threadiddetails: this.state.threadiddetails.concat(data)});
                                        this.setState({threadiddetails: this.state.threadiddetails.sort(this.compare)});
                                        this.setState({loadingStatus: false});
                                    }
                                })
                                .catch((error) => console.log(error));
                        }
                    });
                })
                .catch((error) => console.log(error));
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
            localStorage.setItem('zohotoken', params.access_token);
            this.props.history.push('/zoho');
        }

        //checking expiry time to renew access token

        if(localStorage.getItem('expirytimeoftoken') != '' && localStorage.getItem('expirytimeoftoken') != 'undefined' && localStorage.getItem('expirytimeoftoken') !== null){
            var checkexpiry = new Date();
            if((checkexpiry.getTime() <= localStorage.getItem('expirytimeoftoken')) && (checkexpiry.getTime() >= localStorage.getItem('expirytimeoftoken') - 60000) ){   // checking for a min less time
                window.location.href = 'https://accounts.zoho.com.au/oauth/v2/auth?response_type=token&client_id='+this.zohoclientid+'&scope=Desk.tickets.ALL&redirect_uri='+this.zohoredirecturi+'&state=1523436222480536829';
            }
        }
    }

    //attachment download

    getattachment(event){
        event.preventDefault();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', event.target.href);
        var filename = event.target.id;
        xhr.responseType = 'blob';
        xhr.setRequestHeader('orgId', '7000200810');
        xhr.setRequestHeader('Authorization', 'Zoho-oauthtoken ' + localStorage.getItem('zohotoken'));

        xhr.onload = (function () {

            var a = document.createElement('a');
            a.download = filename;
            a.rel = 'noopener';
            a.href = URL.createObjectURL(xhr.response);
            setTimeout(function () { URL.revokeObjectURL(a.href); }, 4E4);
            a.dispatchEvent(new MouseEvent('click'));

        });
        xhr.onerror = (function () {
            console.error('could not download file');
        });
        xhr.send();
    }


    //reply by mail
    sendReply(tomail = '', fromemail = ''){
        var r = confirm('Send E-Mail?');
        if (r == true) {
            // const { threadcontent } = this.state;
            const optionsnew = {
                method: 'post',
                headers: {
                    'orgId': this.zohoorgid,
                    'Authorization': 'Zoho-oauthtoken ' + localStorage.getItem('zohotoken')
                },
                data: {
                    'channel' : 'EMAIL',
                    'to' : tomail,
                    'fromEmailAddress' : fromemail,
                    'contentType' : 'plainText',
                    'content' : this.state.mail,
                    // 'subject' : '#' +threadcontent.ticketNumber + ' ' + threadcontent.subject,
                    'isForward' : 'true',
                },
                url: 'https://desk.zoho.com.au/api/v1/tickets/' + this.id + '/sendReply',
            };
            axios(optionsnew)
                .then(() => {
                    window.location.reload(false);
                })
                .catch((error) => console.log(error));
        }

    }

    //call sendReply function on successful adding of mail body
    addValue(evt) {
        evt.preventDefault();
        if(this.state.mail != undefined){
            const { threadcontent } = this.state;
            this.sendReply(threadcontent.email, 'support@dmesupport.zohodesk.com.au');
        } else{
            alert('Mail body missing!');
        }
    }

    //update mail body content
    updateInput(evt) {
        this.setState({mail: evt.target.value});
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
        const { threadcontent } = this.state;
        const { threadiddetails } = this.state;
        let items = threadiddetails.map((item, key) => {
            this.mailbackaddress = item.fromEmailAddress;
            if(item.channel.includes('ONLINE_CHAT')){
                return (<SlideToggle collapsed key={key}>
                    {({toggle, setCollapsibleElement}) => (
                        <div>

                            <div className="media p-3 mb-3 my-collapsible">
                                <img src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg" alt="user" width="50" className="rounded-circle"/>
                                <div className="media-body ml-3 ">
                                    <div className="py-2 px-3 toggle-sec my-collapsible__toggle" onClick={toggle}>
                                        <p className="small mb-0 text-muted"><strong>CHAT</strong> </p>
                                    </div>
                                    <p className="px-3">{ item.fromEmailAddress }</p>
                                    <div className="my-collapsible__content" ref={setCollapsibleElement}>
                                        <div className="table-responsive my-collapsible__content-inner">
                                            { ReactHtmlParser(item.content) }
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="divattach">
                                {item.attachments[0] != undefined ? (
                                    item.attachments.map((attach, keys) => {
                                        return <a key={keys} className="attachmentanchor" onClick={this.getattachment} href={attach.href} id={attach.name}>{attach.name}</a>;
                                    }
                                    )

                                // <a className="attachmentanchor" onClick={this.getattachment} href={item.attachments[0].href}><p>{item.attachmentCount} </p>Attachment(s)</a>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>
                    )}

                </SlideToggle>
                );
            } else if(item.channel.includes('EMAIL')){
                return (<SlideToggle collapsed key={key}>
                    {({ toggle, setCollapsibleElement }) => (
                        <div>
                            <div className="media p-3  mb-3 my-collapsible"><img src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg" alt="user" width="50" className="rounded-circle"/>
                                <div className="media-body ml-3 my-collapsible__toggle" onClick={toggle}>
                                    <div className="py-2 px-3 toggle-sec">
                                        <p className="small mb-0 text-muted"><strong>{ item.summary }</strong> { moment(item.createdTime).format('YYYY-MM-DD') }</p>
                                    </div>
                                    <p className="px-3"> From { item.fromEmailAddress }
                                    </p>
                                    <div className="slide-toggle__box" ref={setCollapsibleElement}>
                                        <div className="my-collapsible__content-inner">
                                            <div className="gmail_attr">
                                                { ReactHtmlParser(item.content) }
                                            </div>

                                        </div>
                                    </div>

                                </div>
                                {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                            </div>
                            <div className="divattach">
                                {item.attachments[0] != undefined ? (
                                    item.attachments.map((attach, keys) => {
                                        return <a key={keys} className="attachmentanchor" onClick={this.getattachment} href={attach.href} id={attach.name}>{attach.name}</a>;
                                    }
                                    )

                                // <a className="attachmentanchor" onClick={this.getattachment} href={item.attachments[0].href}><p>{item.attachmentCount} </p>Attachment(s)</a>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>
                    )}


                    {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                </SlideToggle>
                );
            } else if(item.channel.includes('WEB')){
                return (<SlideToggle collapsed key={key}>
                    {({ toggle, setCollapsibleElement }) => (
                        <div>
                            <div className="media p-3  mb-3 my-collapsible"><img src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg" alt="user" width="50" className="rounded-circle"/>
                                <div className="media-body ml-3 my-collapsible__toggle" onClick={toggle}>
                                    <div className="py-2 px-3 toggle-sec">
                                        <p className="small mb-0 text-muted"><strong>{ item.summary }</strong> { moment(item.createdTime).format('YYYY-MM-DD') } </p>
                                    </div>
                                    <p className="px-3"> From { item.fromEmailAddress }
                                    </p>
                                    <div className="slide-toggle__box" ref={setCollapsibleElement}>
                                        <div className="my-collapsible__content-inner">
                                            <div className="gmail_attr">
                                                { ReactHtmlParser(item.content) }
                                            </div>
                                        </div>

                                    </div>
                                    {/*{item.attachments[0] != undefined ? (*/}
                                    {/*    <a className="attachmentanchor" onClick={this.getattachment} href={item.attachments[0].href}><p>{item.attachmentCount} </p>Attachment(s)</a>*/}
                                    {/*) : (*/}
                                    {/*    <p></p>*/}
                                    {/*)}*/}
                                </div>
                                {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                            </div>
                            <div className="divattach">
                                {item.attachments[0] != undefined ? (
                                    item.attachments.map((attach, keys) => {
                                        return <a key={keys} className="attachmentanchor" onClick={this.getattachment} href={attach.href} id={attach.name}>{attach.name}</a>;
                                    }
                                    )

                                // <a className="attachmentanchor" onClick={this.getattachment} href={item.attachments[0].href}><p>{item.attachmentCount} </p>Attachment(s)</a>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>
                    )}
                    

                    {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                </SlideToggle>
                );
            }

        });


        return (
            <LoadingOverlay active={this.state.loadingStatus} spinner text='Please Wait...' >
                <div className="qbootstrap-nav pods" >
                    <div id="headr" className="col-md-12">
                        <div className="col-md-7 col-sm-12 col-lg-8 col-xs-12 col-md-push-1">
                            <ul className="nav nav-tabs">
                                <li><a href="/booking">Header</a></li>
                                <li><a href="/allbookings">All Bookings</a></li>
                                <li><a href="/pods">PODs</a></li>
                                <li className="active"><a href="/zoho">Zoho</a></li>
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
                        <div className="clearfix">
                        </div>
                    </div>
                    <div className="container py-5 px-4">
                        <div className="row rounded-lg overflow-hidden shadow">
                            <div className="col-3 px-0">
                                <div className="bg-white">
                                    <div className="messages-box">
                                        <div className="list-group rounded-0">
                                            <a className="list-group-item list-group-item-action active text-white rounded-0">
                                                <div className="media" style={{display:'block'}}>
                                                    <img src="https://res.cloudinary.com/mhmd/image/upload/v1564960395/avatar_usae7z.svg" alt="user" width="50" className="rounded-circle"/>
                                                    <small className="small font-weight-bold pull-right mr-2">
                                                        { moment(threadcontent.createdTime).format('YYYY-MM-DD') }
                                                        {/*<Moment format="MMM Do YY">{ threadcontent.createdTime }</Moment>*/}
                                                    </small>
                                                    <div className="media-body ml-4 text-left">
                                                        <div className="d-flex align-items-center justify-content-between mb-1">
                                                            <h6 className="mb-0">{ threadcontent.email }</h6>
                                                        </div>
                                                        <p className="font-italic mb-0 text-small">#{ threadcontent.ticketNumber } { threadcontent.subject }</p>
                                                    </div>

                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                            </div>


                            {/*//  Chat Box*/}

                            <div className="col-9 px-0">
                                {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                                <div className="px-4 py-5 chat-box bg-white">
                                    { items }
                                </div>

                                {/*// Typing area*/}
                                <form className="bg-light" onSubmit={this.addValue}>
                                    <div className="input-group" >
                                        <input type="text" placeholder="Type a message" aria-describedby="button-addon2" className="form-control rounded-0 border-0 py-4 bg-light" onChange={this.updateInput}/>
                                        <div className="input-group-append">
                                            <button id="button-addon2" type="submit" className="btn btn-link"><i className="fa fa-paper-plane"></i></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        dmeClients: state.auth.dmeClients,
        redirect: state.auth.redirect,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getDMEClients: () => dispatch(getDMEClients()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ZohoDetailsPage);