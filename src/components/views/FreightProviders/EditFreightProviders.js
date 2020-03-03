import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';

import { verifyToken, cleanRedirectState } from '../../../state/services/authService';   
import { getFPDetails, updateFpDetail, getFPCarriers, getFPZones, setGetZonesFilter, setNeedUpdateZonesState, createFpCarrier, updateFpCarrier, deleteFpCarrier, createFpZone, updateFpZone, deleteFpZone } from '../../../state/services/fpService';  
import FPDataSlider from '../../Sliders/FPDataSlider';

class EditFreightProviders extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            id: 0,
            loading: false,
            isShowFPDataSlider: false,
            fpDetails: {id: 0, fp_company_name: '', fp_address_country: 'AU'},
            fpCarriers: [],
            fpZones: [],
            pageItemCnt: 10,
            pageInd: 0,
            pageCnt: 0,
        };
        this.toggleShowFPDataSlider = this.toggleShowFPDataSlider.bind(this);
        this.setGetZonesFilter = setGetZonesFilter.bind(this);
        this.onPageItemCntChange = this.onPageItemCntChange.bind(this);
        this.onClickPagination = this.onClickPagination.bind(this);
    }

    static propTypes = {
        verifyToken: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        redirect: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        getFPDetails: PropTypes.func.isRequired,
        getFPCarriers: PropTypes.func.isRequired,
        getFPZones: PropTypes.func.isRequired,
        setGetZonesFilter: PropTypes.func.isRequired,
        setNeedUpdateZonesState: PropTypes.func.isRequired,
        createFpCarrier: PropTypes.func.isRequired,
        updateFpCarrier: PropTypes.func.isRequired,
        deleteFpCarrier: PropTypes.func.isRequired,
        createFpZone:  PropTypes.func.isRequired,
        updateFpZone:  PropTypes.func.isRequired,
        deleteFpZone:  PropTypes.func.isRequired,
        cleanRedirectState:  PropTypes.func.isRequired,
        updateFpDetail:  PropTypes.func.isRequired,
    }

    componentDidMount() {
        const fp_id = this.props.match.params.id;

        const token = localStorage.getItem('token');

        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        this.props.getFPDetails(fp_id);
        this.props.getFPCarriers(fp_id);
        this.props.getFPZones(fp_id);
        Modal.setAppElement(this.el);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, fpDetails, id, fpCarriers, fpZones, pageItemCnt, pageInd, pageCnt, needUpdateFpCarriers, needUpdateFpZones } = newProps;
        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }

        if (fpDetails) {
            this.setState({ fpDetails: fpDetails });
        }

        if (id) {
            this.setState({ id: id });
        }
        if (fpCarriers) {
            this.setState({fpCarriers: fpCarriers});
        }
        if (fpZones) {
            this.setState({fpZones: fpZones});
        }

        if (pageCnt) {
            this.setState({ pageCnt: parseInt(pageCnt), pageInd: parseInt(pageInd) });
        }

        if (needUpdateFpCarriers && fpDetails) {
            this.setState({loading: true});

            this.props.getFPCarriers(fpDetails.id, pageItemCnt, pageInd);
        } else {
            this.setState({loading: false});
        }

        if (needUpdateFpZones && fpDetails) {
            this.setState({loading: true});

            this.props.getFPZones(fpDetails.id, pageItemCnt, pageInd);
        } else {
            this.setState({loading: false});
        }
    }

    onInputChange(event) {
        //this.setState({[event.target.name]: event.target.value});
        const { fpDetails } = this.state;
        if(event.target.name == 'fp_company_name'){
            this.setState({ fpDetails: {fp_company_name: event.target.value, id: fpDetails.id, fp_address_country: fpDetails.fp_address_country} });
        }
    }

    onSubmit(event) {
        this.setState({loading: true});
        const { fpDetails } = this.state;
        this.props.updateFpDetail({id: fpDetails.id, fp_company_name: fpDetails.fp_company_name, fp_address_country: fpDetails.fp_address_country});
        this.setState({loading: false});
        this.props.history.push('/providers');
        event.preventDefault();
    }

    onClickOpenSlide(e) {
        e.preventDefault();
        this.toggleShowFPDataSlider();
    }

    toggleShowFPDataSlider() {
        /*const { isBookingSelected } = this.state;

        if (isBookingSelected) {
            this.setState(prevState => ({isShowFPDataSlider: !prevState.isShowFPDataSlider}));
        } else {
            alert('Please select a booking.');
        }*/
        this.setState(prevState => ({isShowFPDataSlider: !prevState.isShowFPDataSlider}));
    }

    onPageItemCntChange(e) {
        const {fpDetails, pageInd} = this.state;
        const pageItemCnt = parseInt(e.target.value);
        this.setGetZonesFilter('pageInd', 0);
        this.setGetZonesFilter('pageItemCnt', pageItemCnt);
        this.setState({ pageItemCnt });
        this.props.getFPZones(fpDetails.id, pageItemCnt, pageInd);
    }

    onClickPagination(pageInd) {
        const {fpDetails, pageItemCnt} = this.state;
        this.setGetZonesFilter('pageInd', pageInd);
        this.props.getFPZones(fpDetails.id, pageItemCnt, pageInd);
    }

    onClickDelete(typeNum, row) {
        console.log('onDelete: ', typeNum, row);

        if (typeNum === 0) { // Duplicate line
            this.props.deleteFpCarrier({ id: row.id });
            //this.setState({loadingBookingLine: true});
        } else if (typeNum === 1) { // Duplicate line detail
            this.props.deleteFpZone({ id: row.id });
            //this.setState({loadingBookingLineDetail: true});
        }
    }

    render() {
        const { fpDetails, isShowFPDataSlider, fpCarriers, fpZones, pageCnt, pageInd, pageItemCnt } = this.state;

        return (
            <div>
            
                <div className="pageheader">
                    <h1>Edit Freight Providers</h1>
                    <div className="breadcrumb-wrapper hidden-xs">
                        <span className="label">You are here:</span>
                        <ol className="breadcrumb">
                            <li><a href="/">Dashboard</a>
                            </li>
                            <li><a href="/providers">Freight Providers</a></li>
                            <li className="active">Edit</li>
                        </ol>
                    </div>
                </div>
                <section id="main-content" className="animated fadeInUp">
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    />
                    <FPDataSlider
                        isOpen={isShowFPDataSlider}
                        toggleShowFPDataSlider={this.toggleShowFPDataSlider}
                        fpCarriers={fpCarriers}
                        fpZones={fpZones}
                        fpDetails={fpDetails}
                        pageCnt={pageCnt}
                        pageItemCnt={pageItemCnt}
                        pageInd={pageInd}
                        setGetZonesFilter={this.setGetZonesFilter}
                        handlePageItemCntChange={this.onPageItemCntChange}
                        handleClickPagination={this.onClickPagination}
                        createFpCarrier={(data) => this.props.createFpCarrier(data)}
                        updateFpCarrier={(data) => this.props.updateFpCarrier(data)}
                        deleteFpCarrier={(data) => this.props.deleteFpCarrier(data)}
                        createFpZone={(data) => this.props.createFpZone(data)}
                        updateFpZone={(data) => this.props.updateFpZone(data)}
                        deleteFpZone={(data) => this.props.deleteFpZone(data)}
                        onClickDelete={(typeNum, data) => this.onClickDelete(typeNum, data)}
                    />
                    <div className="row">
                        <div className="col-md-6">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Edit Freight Provider <b>{this.state.fpDetails.fp_company_name}</b></h3>
                                    <div className="actions pull-right">
                                        <a onClick={(e) => this.onClickOpenSlide(e)} className="open-slide"><i className="fa fa-columns" aria-hidden="true"></i></a>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => this.onSubmit(e)} role="form">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Company Name</label>
                                            <input name="fp_company_name" type="text" className="form-control" id="exampleInputEmail1" placeholder="Enter Company Name" value={this.state.fpDetails.fp_company_name} onChange={(e) => this.onInputChange(e)} />
                                            <input name="id" type="hidden" value={this.state.id} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword1">Country</label>
                                            <select name="fp_address_country" className="form-control" id="exampleInputPassword1" value={this.state.fpDetails.fp_address_country} onChange={(e) => this.onInputChange(e)} >
                                                <option value="AUS">Australia</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Submit</button>
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
        fpDetails: state.fp.fpDetails,
        fpCarriers: state.fp.fpCarriers,
        fpZones: state.fp.fpZones,
        username: state.auth.username,
        pageCnt: state.fp.pageCnt,
        pageItemCnt: state.fp.pageItemCnt,
        pageInd: state.fp.pageInd,
        needUpdateFpCarriers: state.fp.needUpdateFpCarriers,
        needUpdateFpZones: state.fp.needUpdateFpZones,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getFPDetails: (fp_id) => dispatch(getFPDetails(fp_id)),
        getFPCarriers: (fp_id) => dispatch(getFPCarriers(fp_id)),
        getFPZones: (fp_id, pageItemCnt, pageInd) => dispatch(getFPZones(fp_id, pageItemCnt, pageInd)),
        updateFpDetail: (fpDetails) => dispatch(updateFpDetail(fpDetails)),
        setGetZonesFilter: (key, value) => dispatch(setGetZonesFilter(key, value)),
        setNeedUpdateZonesState: (boolFlag) => dispatch(setNeedUpdateZonesState(boolFlag)),
        createFpCarrier: (data) => dispatch(createFpCarrier(data)),
        updateFpCarrier: (data) => dispatch(updateFpCarrier(data)),
        deleteFpCarrier: (data) => dispatch(deleteFpCarrier(data)),
        createFpZone: (data) => dispatch(createFpZone(data)),
        updateFpZone: (data) => dispatch(updateFpZone(data)),
        deleteFpZone: (data) => dispatch(deleteFpZone(data)),
        
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditFreightProviders));
