import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';

import LoadingOverlay from 'react-loading-overlay';
import SlideToggle from 'react-slide-toggle';
import ReactHtmlParser from 'react-html-parser';

import { ZOHO_CLIENT_ID, ZOHO_ORG_ID, ZOHO_REDIRECT_URI } from '../config';
import { verifyToken, cleanRedirectState, getDMEClients } from '../state/services/authService';
import { getZohoTicketDetails, getZohoTicketConversations, sendZohoTicketReply } from '../state/services/extraService';

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
            ticketid: '',
            details: {},
            conversations: [],
            threadids: [],
            threadiddetails: [],
            mail: '',
        };
        this.addValue = this.addValue.bind(this);
        this.updateInput = this.updateInput.bind(this);
    }

    static propTypes = {
        clientname: PropTypes.string.isRequired,
        verifyToken: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        details: PropTypes.object.isRequired,
        conversations: PropTypes.array.isRequired,
        getDMEClients: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        getZohoTicketDetails: PropTypes.func.isRequired,
        getZohoTicketThread: PropTypes.func.isRequired,
        getZohoTicketConversations: PropTypes.func.isRequired,
        sendZohoTicketReply: PropTypes.func.isRequired
    };

    componentDidMount() {
        var urlParams = new URLSearchParams(window.location.search);
        this.id = urlParams.get('id');

        const token = localStorage.getItem('token');
        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.history.push('/');
        }
        this.props.getDMEClients();

        if (this.id) {
            //get original ticket data
            this.props.getZohoTicketDetails(this.id);

            //get threads/conversations related to ticket
            this.props.getZohoTicketConversations(this.id);
        }

        this.getsetrealtimedata();

        this.intervalID = setInterval(this.getsetrealtimedata.bind(this), 30000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
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

    getsetrealtimedata() {
        if (this.id) {
            //get original ticket data
            this.props.getZohoTicketDetails(this.id);

            //get threads/conversations related to ticket
            this.props.getZohoTicketConversations(this.id);
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
    sendReply(fromEmail = '', toEmail = ''){
        var r = confirm('Send E-Mail?');
        if (r == true) {
            const { mail } = this.state;
            let html = mail.split('\n').map(p => `<p>${p}</p>`).join('');
            const { details, conversations } = this.state;
            let content = `<html><head></head><body><div>${html}<br /><br />-----Original Message-----<br />From: ${conversations[0].fromEmailAddress}<br />\
            Sent: ${moment.utc(conversations[0].createdTime).tz('Australia/Sydney').format('dddd, DD MMMM YYYY hh:mm A')}<br />To: ${conversations[0].to}\
            Cc: ${conversations[0].cc}<br />Subject: ${details.subject}<br /><br />${conversations[0].content}</div><body></html>`;
            this.props.sendZohoTicketReply(this.id, fromEmail, toEmail, content);
        }

    }

    //call sendReply function on successful adding of mail body
    addValue(evt) {
        evt.preventDefault();
        if(this.state.mail != undefined){
            const { clientname } = this.props;
            const { details } = this.state;
            if (clientname === 'dme') this.sendReply('care@deliver-me.com.au', details.email);
            else this.sendReply(details.email, 'care@deliver-me.com.au');
        } else{
            alert('Mail body missing!');
        }
    }

    //update mail body content
    updateInput(evt) {
        evt.preventDefault();
        this.setState({mail: evt.target.value});
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, details, conversations } = newProps;
        const currentRoute = this.props.location.pathname;

        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if(!isEmpty(details) && !isEmpty(conversations)) this.setState({ details, conversations });
    }

    render() {
        const { details, conversations } = this.state;
        let items = conversations.map((item, key) => {
            this.mailbackaddress = item.fromEmailAddress;
            if('author' in item) {
                if(item.channel.includes('ONLINE_CHAT')){
                    return (<SlideToggle collapsed key={key}>
                        {({toggle, setCollapsibleElement}) => (
                            <div>

                                <div className="media p-3 mb-3 my-collapsible">
                                    <div className='border border-primary p-1 font-weight-bold'>{item.author.name.split(' ').map(item => item[0]).join('')}</div>
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
                                        })
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
                                <div className="media p-3  mb-3 my-collapsible">
                                    <div className='border border-primary p-1 font-weight-bold'>{item.author.name.split(' ').map(item => item[0]).join('')}</div>
                                    <div className="media-body ml-3 my-collapsible__toggle" onClick={toggle}>
                                        <div className="py-2 px-3 toggle-sec">
                                            <p className="small mb-0 text-muted"><strong>{ item.summary }</strong> { moment.utc(item.createdTime).tz('Australia/Sydney').format('YYYY-MM-DD') }</p>
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
                                        })
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
                                <div className="media p-3  mb-3 my-collapsible">
                                    <div className='border border-primary p-1 font-weight-bold'>{item.author.name.split(' ').map(item => item[0]).join('')}</div>
                                    <div className="media-body ml-3 my-collapsible__toggle" onClick={toggle}>
                                        <div className="py-2 px-3 toggle-sec">
                                            <p className="small mb-0 text-muted"><strong>{ item.summary }</strong> { moment.utc(item.createdTime).tz('Australia/Sydney').format('YYYY-MM-DD') } </p>
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
                                        })
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
            } else {
                return (<SlideToggle collapsed key={key}>
                    {({ toggle, setCollapsibleElement }) => (
                        <div>
                            <div className="media p-3  mb-3 my-collapsible">
                                <div className='border border-info p-1 font-weight-bold'>{item.commenter.name.split(' ').map(item => item[0]).join('')}</div>
                                <div className="media-body ml-3 my-collapsible__toggle" onClick={toggle}>
                                    <div className="py-2 px-3 toggle-sec">
                                        <p className="small mb-0 text-muted"><strong>{ item.summary }</strong> { moment.utc(item.modifiedTime).tz('Australia/Sydney').format('YYYY-MM-DD') } </p>
                                    </div>
                                    <p className="px-3"> From { item.commenter.email }
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
                                    })
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
            <LoadingOverlay active={isEmpty(details) || isEmpty(conversations)} spinner text='Please Wait...' >
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
                    <div className="rounded-lg overflow-hidden container shadow py-5 px-4">
                        <div className="row">
                            <div className="col-3 px-0">
                                <div className="bg-white">
                                    <div className="messages-box">
                                        <div className="list-group rounded-0">
                                            <a className="list-group-item list-group-item-action active text-white rounded-0">
                                                { !isEmpty(details) && <div className="media" style={{display:'block'}}>
                                                    <h5>#{ details.ticketNumber } { details.subject }</h5>
                                                    {/* <p className="font-italic mb-0 text-medium">{conversations.length && conversations[conversations.length - 1].author.name}</p> */}
                                                    <p className="font-italic mb-0 text-medium">{ details.email }</p>
                                                    <p className="text-medium pull-right mb-0">
                                                        {  moment.utc(details.createdTime).tz('Australia/Sydney').format('YYYY-MM-DD') }
                                                    </p>
                                                </div>}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                            </div>
                            <div className="col-9 px-0">
                                {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                                <div className="px-4 py-5 chat-box bg-white">
                                    { !isEmpty(conversations) && items }
                                </div>

                                {/*// Typing area*/}
                                <form className="bg-light" onSubmit={this.addValue}>
                                    <div className="input-group" >
                                        <textarea type="text" placeholder="Type a message" aria-describedby="button-addon2" className="form-control rounded-0 border-0 py-4 bg-light" onChange={this.updateInput} rows="1"/>
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
        clientname: state.auth.clientname,
        dmeClients: state.auth.dmeClients,
        redirect: state.auth.redirect,
        details: state.extra.ticketDetails,
        conversations: state.extra.ticketConversations,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        getDMEClients: () => dispatch(getDMEClients()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getZohoTicketDetails: (id) => dispatch(getZohoTicketDetails(id)),
        getZohoTicketConversations: (id) => dispatch(getZohoTicketConversations(id)),
        sendZohoTicketReply: (id, from, to, content) => dispatch(sendZohoTicketReply(id, from, to, content))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ZohoDetailsPage);
