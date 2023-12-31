import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter, } from 'react-router-dom';
import CKEditor from 'ckeditor4-react';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getUserDetails, updateUserDetails } from '../../../../state/services/userService';

class EditUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            loading: false,
            isShowFPDataSlider: false,
            emailName: '',
            sectionName: '',
            emailBody: '',
            emailTemplateDetails: { id: 0, emailName: '', sectionName: '', emailBody: '' },
            pageItemCnt: 10,
            pageInd: 0,
            pageCnt: 0,
        };

    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.bool.isRequired,
        match: PropTypes.object.isRequired,
        getUserDetails: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        updateUserDetails: PropTypes.func.isRequired,
        deleteFpCarrier: PropTypes.func.isRequired,
        deleteFpZone: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        this.props.getUserDetails(id);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, emailTemplateDetails, id, pageInd, pageCnt } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }

        if (emailTemplateDetails) {
            this.setState({ emailTemplateDetails: emailTemplateDetails });
            this.setState({ emailName: emailTemplateDetails.emailName });
            this.setState({ sectionName: emailTemplateDetails.sectionName });
            this.setState({ emailBody: emailTemplateDetails.emailBody });
        }

        if (id) {
            this.setState({ id: id });
        }

        if (pageCnt) {
            this.setState({ pageCnt: parseInt(pageCnt), pageInd: parseInt(pageInd) });
        }
    }

    onSubmit(event) {
        this.setState({ loading: true });
        const { emailTemplateDetails, emailName, sectionName, emailBody } = this.state;
        let data = { id: emailTemplateDetails.id, emailName: emailName, sectionName: sectionName, emailBody: emailBody };
        this.props.updateUserDetails(data);
        this.setState({ loading: false });
        this.props.history.push('/admin/emails');
        event.preventDefault();
    }

    onClickDelete(typeNum, row) {
        if (typeNum === 0) { // Duplicate line
            this.props.deleteFpCarrier({ id: row.id });
        } else if (typeNum === 1) { // Duplicate line detail
            this.props.deleteFpZone({ id: row.id });
        }
    }

    render() {
        const { emailTemplateDetails, loading } = this.state;

        return (
            <div>

                <div className="pageheader">
                    <h1>Edit Email Template</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href={this.props.urlAdminHome}>Home</a>
                            </li>
                            <li><a href="/admin/users">Edit User</a></li>
                            <li className="active">Edit</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <LoadingOverlay
                        active={loading}
                        spinner
                        text='Loading...'
                    />

                    <div className="row">
                        <div className="col-md-12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Edit Email Template <b>{emailTemplateDetails.emailName}</b></h3>
                                    <div className="actions pull-right">
                                        <a onClick={(e) => this.onClickOpenSlide(e)} className="open-slide"><i className="fa fa-columns" aria-hidden="true"></i></a>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => this.onSubmit(e)} role="form">
                                        <input name="id" type="hidden" value={this.state.id} />
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Template Name</label>
                                            <input readOnly name="emailName" type="text" className="form-control" id="exampleInputEmail1" placeholder="Enter Email Name" value={this.state.emailName} onChange={(e) => this.setState({ emailName: e.target.value })} />
                                            <i>*This field cannot be changed</i>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Section Name</label>
                                            <input readOnly name="sectionName" type="text" className="form-control" id="exampleInputEmail1" placeholder="Enter Section Name" value={this.state.sectionName} onChange={(e) => this.setState({ sectionName: e.target.value })} />
                                            <i>*This field cannot be changed</i>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Email Body</label>
                                            <br /><i>*Please do no modify or remove variables with curly braces {}</i>
                                            <CKEditor
                                                data={this.state.emailBody}
                                                onInit={editor => {
                                                    console.log('Editor is ready to use!', editor);
                                                }}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    this.setState({ emailBody: data });
                                                    console.log({ event, editor, data });
                                                }}
                                                onBlur={(event, editor) => {
                                                    console.log('Blur.', editor);
                                                }}
                                                onFocus={(event, editor) => {
                                                    console.log('Focus.', editor);
                                                }}
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-primary pull-right">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        emailTemplateDetails: state.emailTemplate.emailTemplateDetails,
        username: state.auth.username,
        pageCnt: state.fp.pageCnt,
        pageItemCnt: state.fp.pageItemCnt,
        pageInd: state.fp.pageInd,
        urlAdminHome: state.url.urlAdminHome,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getUserDetails: (fp_id) => dispatch(getUserDetails(fp_id)),
        updateUserDetails: (emailTemplateDetails) => dispatch(updateUserDetails(emailTemplateDetails)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditUser));
