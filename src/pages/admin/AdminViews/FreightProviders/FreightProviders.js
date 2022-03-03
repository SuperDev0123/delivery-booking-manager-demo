import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { verifyToken, cleanRedirectState } from '../../../../state/services/authService';
import { getAllFPs, deleteFpDetail, createFpDetail } from '../../../../state/services/fpService';
import { getFPDetails, updateFpDetail, getFPCarriers, getFPZones, setGetZonesFilter, setNeedUpdateZonesState, createFpCarrier, updateFpCarrier, deleteFpCarrier, createFpZone, updateFpZone, deleteFpZone } from '../../../../state/services/fpService';
import FPDataSlider from '../../../../components/Sliders/FPDataSlider';
import AdminHeader from '../../../../components/admin/AdminHeader';
import FPAddForm from '../../../../components/admin/FPAddForm';

class FreightProviders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            componentState: 'listView',
            allFPs: [],
            fpCarries: [],
            username: null,
            loading: false,
            isShowFPDataSlider: false,
            fpDetails: { id: 0, fp_company_name: '', fp_address_country: 'AU', fp_markupfuel_levy_percent: '', hex_color_code: '#36c'},
            fpCarriers: [],
            fpZones: [],
            pageItemCnt: 10,
            pageInd: 0,
            pageCnt: 0,
            fp_company_name: '', 
            fp_address_country: 'AU',
            fp_markupfuel_levy_percent: '',
            hex_color_code: '#36c',
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
        redirect: PropTypes.bool.isRequired,
        match: PropTypes.object.isRequired,
        getAllFPs: PropTypes.func.isRequired,
        cleanRedirectState: PropTypes.func.isRequired,
        deleteFpDetail: PropTypes.func.isRequired,
        urlAdminHome: PropTypes.string.isRequired,
        getFPDetails: PropTypes.func.isRequired,
        getFPCarriers: PropTypes.func.isRequired,
        getFPZones: PropTypes.func.isRequired,
        setGetZonesFilter: PropTypes.func.isRequired,
        setNeedUpdateZonesState: PropTypes.func.isRequired,
        createFpCarrier: PropTypes.func.isRequired,
        updateFpCarrier: PropTypes.func.isRequired,
        deleteFpCarrier: PropTypes.func.isRequired,
        createFpZone: PropTypes.func.isRequired,
        updateFpZone: PropTypes.func.isRequired,
        deleteFpZone: PropTypes.func.isRequired,
        updateFpDetail: PropTypes.func.isRequired,
        createFpDetail: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const { componentState } =  this.state;
        this.setState({ loading: true });
        const token = localStorage.getItem('token');
        
        if (token && token.length > 0) {
            this.props.verifyToken();
        } else {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/admin');
        }
        
        if (componentState == 'listView') {
            this.props.getAllFPs();
        }
        else if (componentState == 'edit') {
            const fp_id = this.state.id;
            this.props.getFPDetails(fp_id);
            this.props.getFPCarriers(fp_id);
            this.props.getFPZones(fp_id);
            Modal.setAppElement(this.el);
        }
        this.setState({ loading: false });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { redirect, allFPs, fp_company_name, fp_address_country } = newProps;
        const { fpDetails, id, fpCarriers, fpZones, pageItemCnt, pageInd, pageCnt, needUpdateFpCarriers, needUpdateFpZones } = newProps;

        const currentRoute = this.props.location.pathname;
        if (redirect && currentRoute != '/') {
            localStorage.setItem('isLoggedIn', 'false');
            this.props.cleanRedirectState();
            this.props.history.push('/');
        }
        if (allFPs) {
            this.setState({ allFPs });
        }

        if (fpDetails) {
            this.setState({ fpDetails: fpDetails });
        }

        if (id) {
            this.setState({ id: id });
        }

        if (fpCarriers) {
            this.setState({ fpCarriers: fpCarriers });
        }

        if (fpZones) {
            this.setState({ fpZones: fpZones });
        }

        if (pageCnt) {
            this.setState({ pageCnt: parseInt(pageCnt), pageInd: parseInt(pageInd) });
        }

        if (needUpdateFpCarriers && fpDetails) {
            this.setState({ loading: true });

            this.props.getFPCarriers(fpDetails.id, pageItemCnt, pageInd);
        } else {
            this.setState({ loading: false });
        }

        if (needUpdateFpZones && fpDetails) {
            this.setState({ loading: true });

            this.props.getFPZones(fpDetails.id, pageItemCnt, pageInd);
        } else {
            this.setState({ loading: false });
        }

        if (fp_company_name) {
            this.setState({ fp_company_name: fp_company_name });
        }
        if (fp_address_country) {
            this.setState({ fp_address_country: fp_address_country });
        }
    }

    onClickOpenSlide(e) {
        e.preventDefault();
        this.toggleShowFPDataSlider();
    }

    toggleShowFPDataSlider() {
        this.setState(prevState => ({ isShowFPDataSlider: !prevState.isShowFPDataSlider }));
    }

    onPageItemCntChange(e) {
        const { fpDetails, pageInd } = this.state;
        const pageItemCnt = parseInt(e.target.value);
        this.setGetZonesFilter('pageInd', 0);
        this.setGetZonesFilter('pageItemCnt', pageItemCnt);
        this.setState({ pageItemCnt });
        this.props.getFPZones(fpDetails.id, pageItemCnt, pageInd);
    }

    onClickPagination(pageInd) {
        const { fpDetails, pageItemCnt } = this.state;
        this.setGetZonesFilter('pageInd', pageInd);
        this.props.getFPZones(fpDetails.id, pageItemCnt, pageInd);
    }

    onClickDelete(typeNum, row) {
        if (typeNum === 0) {
            this.props.deleteFpCarrier({ id: row.id });
        } else if (typeNum === 1) {
            this.props.deleteFpZone({ id: row.id });
        }
    }

    onAddClick() {
        this.setState({
            componentState: 'add',
        });
    }

    onEditClick(fp_id) {
        this.props.getFPDetails(fp_id);
        this.setState({
            componentState: 'edit',
            id: fp_id,
        });
    }

    onSubmit(event) {
        this.setState({ loading: true });
        const { fpDetails } = this.state;
        this.props.updateFpDetail({
            id: fpDetails.id, 
            fp_company_name: fpDetails.fp_company_name, 
            fp_address_country: fpDetails.fp_address_country,
            fp_markupfuel_levy_percent: fpDetails.fp_markupfuel_levy_percent,
            hex_color_code: fpDetails.hex_color_code
        });
        this.setState({ loading: false });
        event.preventDefault();
    }

    onChangeComponentState(componentState) {
        this.setState({componentState});
        this.props.getAllFPs();
    }

    removeFpDetail(event, fp) {
        this.setState({ loading: true });
        confirmAlert({
            title: 'Confirm to delete Freight Provider',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => { this.props.deleteFpDetail(fp); this.props.getAllFPs(); }
                },
                {
                    label: 'No',
                    onClick: () => console.log('Click No')
                }
            ]
        });

        this.setState({ loading: false });
        event.preventDefault();
    }

    render() {
        const { fpDetails, isShowFPDataSlider, fpCarriers, fpZones, pageCnt, pageInd, pageItemCnt } = this.state;
        const { allFPs, componentState } = this.state;
        const addBreadcrumbs = [
            {name: 'Home', url: this.props.urlAdminHome},
            {name: 'Freight Providers', url: '/admin/providers'},
            {name: 'Edit', url:'#'}
        ];

        const editBreadcrumbs = [
            {name: 'Home', url: this.props.urlAdminHome},
            {name: 'Freight Providers', url: '/admin/providers'},
            {name: 'Edit', url:'#'}
        ];

        const listBreadcrumbs = [
            {name: 'Home', url: this.props.urlAdminHome},
            {name: 'Freight Providers', url: '#'},
        ];


        const fpsList = allFPs.map((fp, index) => {
            return (
                <tr key={index}>
                    <td>{fp.id}</td>
                    <td>{fp.fp_company_name}</td>
                    <td>{fp.fp_address_country}</td>
                    <td>{fp.fp_markupfuel_levy_percent}</td>
                    <td>{fp.hex_color_code}</td>
                    <td><button className="btn btn-info btn-sm" onClick={() => this.onEditClick(fp.id)}>Edit</button>&nbsp;&nbsp;<button onClick={(event) => this.removeFpDetail(event, fp)} className="btn btn-danger btn-sm">Delete</button></td>
                </tr>
            );
        });

        return (
            <div>
                {
                    (componentState == 'listView') && 
                    (
                        <div>
                            <AdminHeader title="Freight Providers" breadcrumbs={listBreadcrumbs} />
                            <section id="main-content" className="animated fadeInUp">
                                <LoadingOverlay
                                    active={this.state.loading}
                                    spinner
                                    text='Loading...'
                                />
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="panel panel-default">
                                            <div className="panel-heading">
                                                <h3 className="panel-title">Freight Providers</h3>
                                                <div className="actions pull-right">
                                                    <button className="btn btn-success" onClick={() => this.onAddClick()}>Add New</button>
                                                </div>
                                            </div>
                                            <div className="panel-body">
                                                <table id="example" className="table table-striped table-bordered" cellSpacing="0" width="100%">
                                                    <thead>
                                                        <tr>
                                                            <th>id</th>
                                                            <th>Name</th>
                                                            <th>Country</th>
                                                            <th>Markup</th>
                                                            <th>Color</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {fpsList}
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )
                }
                {
                    (componentState == 'edit') &&
                    (
                        <div>
                            <AdminHeader title='Edit Freight Providers' breadcrumbs={editBreadcrumbs} />
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
                                            <FPAddForm componentType="edit" onChangeState={() => this.onChangeComponentState('listView')}/>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )
                }
                {
                    (componentState == 'add') &&
                    (
                        <div>
                            <AdminHeader title="Add Freight Provider" breadcrumbs={addBreadcrumbs} />
                            <section id="main-content" className="animated fadeInUp">
                                <LoadingOverlay
                                    active={this.state.loading}
                                    spinner
                                    text='Loading...'
                                />
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="panel panel-default">
                                            <div className="panel-heading">
                                                <h3 className="panel-title">Add New</h3>
                                                <div className="actions pull-right">

                                                </div>
                                            </div>
                                            <FPAddForm componentType="add" onChangeState={() => this.onChangeComponentState('listView')}/>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        redirect: state.auth.redirect,
        allFPs: state.fp.allFPs,
        username: state.auth.username,
        needUpdateFpDetails: state.fp.needUpdateFpDetails,
        urlAdminHome: state.url.urlAdminHome,
        fpDetails: state.fp.fpDetails,
        fpCarriers: state.fp.fpCarriers,
        fpZones: state.fp.fpZones,
        pageCnt: state.fp.pageCnt,
        pageItemCnt: state.fp.pageItemCnt,
        pageInd: state.fp.pageInd,
        needUpdateFpCarriers: state.fp.needUpdateFpCarriers,
        needUpdateFpZones: state.fp.needUpdateFpZones,
        fp_company_name: state.fp.fp_company_name,
        fp_address_country: state.fp.fp_address_country,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        verifyToken: () => dispatch(verifyToken()),
        cleanRedirectState: () => dispatch(cleanRedirectState()),
        getAllFPs: () => dispatch(getAllFPs()),
        deleteFpDetail: (fp) => dispatch(deleteFpDetail(fp)),
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
        createFpDetail: (fpDetail) => dispatch(createFpDetail(fpDetail))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FreightProviders));
