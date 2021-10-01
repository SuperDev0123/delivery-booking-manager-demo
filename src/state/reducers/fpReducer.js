import {
    SUCCESS_GET_FPS,
    FAILED_GET_FPS,
    SUCCESS_GET_FP,
    FAILED_GET_FP,
    SUCCESS_CREATE_FP,
    FAILED_CREATE_FP,
    SUCCESS_UPDATE_FP,
    FAILED_UPDATE_FP,
    SUCCESS_DELETE_FP,
    FAILED_DELETE_FP,
    SUCCESS_GET_FP_CARRIERS,
    FAILED_GET_FP_CARRIERS,
    SUCCESS_GET_FP_ZONES,
    FAILED_GET_FP_ZONES,
    SUCCESS_CREATE_FP_CARRIER,
    FAILED_CREATE_FP_CARRIER,
    SUCCESS_UPDATE_FP_CARRIER,
    FAILED_UPDATE_FP_CARRIER,
    SUCCESS_DELETE_FP_CARRIER,
    FAILED_DELETE_FP_CARRIER,
    SUCCESS_CREATE_FP_ZONE,
    FAILED_CREATE_FP_ZONE,
    SUCCESS_UPDATE_FP_ZONE,
    FAILED_UPDATE_FP_ZONE,
    SUCCESS_DELETE_FP_ZONE,
    FAILED_DELETE_FP_ZONE,
    SUCCESS_GET_FP_STATUSES, 
    FAILED_GET_FP_STATUSES,
    SUCCESS_CREATE_FP_STATUS, 
    FAILED_CREATE_FP_STATUS,
    SUCCESS_UPDATE_FP_STATUS,
    FAILED_UPDATE_FP_STATUS,
    SUCCESS_DELETE_FP_STATUS,
    FAILED_DELETE_FP_STATUS
} from '../constants/fpConstants';

const defaultState = {
    allFPs: [],
    fpDetails: {},
    fpCarriers: [],
    fpZones: [],
    dmeStatuses: [],
    fpStatuses: []
};

export const FpReducer = (state = defaultState, {
    type,
    allFPs,
    fpDetails,
    fpCarriers,
    fpZones,
    pageCnt,
    pageInd,
    pageItemCnt, 
    payload
}) => {
    switch (type) {
        case SUCCESS_GET_FPS:
            return {
                ...state,
                allFPs: allFPs
            };
        case FAILED_GET_FPS:
        case SUCCESS_GET_FP:
            return {
                ...state,
                fpDetails: fpDetails
            };
        case FAILED_GET_FP:
        case SUCCESS_CREATE_FP:
            return {
                ...state,
                needUpdateFpDetails: true
            };
        case FAILED_CREATE_FP:
        case SUCCESS_UPDATE_FP:
            return {
                ...state,
                needUpdateFpDetails: true
            };
        case FAILED_UPDATE_FP:
        case SUCCESS_DELETE_FP:
            return {
                ...state,
                needUpdateFpDetails: true
            };
        case FAILED_DELETE_FP:
        case SUCCESS_GET_FP_CARRIERS:
            return {
                ...state,
                fpCarriers: fpCarriers
            };
        case FAILED_GET_FP_CARRIERS:
        case SUCCESS_GET_FP_ZONES:
            return {
                ...state,
                fpZones: fpZones,
                pageCnt: pageCnt,
                pageInd: pageInd,
                pageItemCnt: pageItemCnt
            };
        case FAILED_GET_FP_ZONES:
        case SUCCESS_CREATE_FP_CARRIER:
            return {
                ...state,
                needUpdateFpCarriers: true
            };
        case FAILED_CREATE_FP_CARRIER:
        case SUCCESS_UPDATE_FP_CARRIER:
            return {
                ...state,
                needUpdateFpCarriers: true
            };
        case FAILED_UPDATE_FP_CARRIER:
        case SUCCESS_DELETE_FP_CARRIER:
            return {
                ...state,
                needUpdateFpCarriers: true
            };
        case FAILED_DELETE_FP_CARRIER:
        case SUCCESS_CREATE_FP_ZONE:
            return {
                ...state,
                needUpdateFpZones: true
            };
        case FAILED_CREATE_FP_ZONE:
        case SUCCESS_UPDATE_FP_ZONE:
            return {
                ...state,
                needUpdateFpZones: true
            };
        case FAILED_UPDATE_FP_ZONE:
        case SUCCESS_DELETE_FP_ZONE:
            return {
                ...state,
                needUpdateFpZones: true
            };
        case FAILED_DELETE_FP_ZONE:
        case SUCCESS_GET_FP_STATUSES: 
            return {
                ...state, 
                fpStatuses: payload
            };
        case FAILED_GET_FP_STATUSES:
        case SUCCESS_CREATE_FP_STATUS:
            state.fpStatuses.push(payload);
            return {
                ...state,
                fpStatuses: [...state.fpStatuses]
            };
        case FAILED_CREATE_FP_STATUS:
        case SUCCESS_UPDATE_FP_STATUS:
        {
            let index = state.fpStatuses.findIndex(function(item) {
                return item.id === payload.id;
            });
            state.fpStatuses.splice(index, 1, payload);
            return {
                ...state,
                fpStatuses: [...state.fpStatuses]
            };
        }
        case FAILED_UPDATE_FP_STATUS:
        case SUCCESS_DELETE_FP_STATUS:
            return {
                ...state,
                fpStatuses: state.fpStatuses.filter(item => item.id !== payload)
            };
        case FAILED_DELETE_FP_STATUS:
        default:
            return state;
    }
};
