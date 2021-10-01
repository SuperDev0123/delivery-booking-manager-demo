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
    SET_LOCAL_FILTER_PAGEITEMCNT,
    SET_LOCAL_FILTER_PAGEINDEX,
    SET_FETCH_ZONES_FLAG,
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

export function successGetAllFPs(data) {
    return {
        type: SUCCESS_GET_FPS,
        allFPs: data.results,
    };
}

export function failedGetAllFPs(error) {
    return {
        type: FAILED_GET_FPS,
        errorMessage: 'Unable to get all FPs. Error:' + error,
    };
}

export function successGetFP(data) {
    return {
        type: SUCCESS_GET_FP,
        fpDetails: data.results[0],
    };
}

export function failedGetFP(error) {
    return {
        type: FAILED_GET_FP,
        errorMessage: 'Unable to get FP. Error:' + error,
    };
}

export function successCreateFp(data) {
    return {
        type: SUCCESS_CREATE_FP,
        fpDetails: data
    };
}

export function failedCreateFp(error) {
    return {
        type: FAILED_CREATE_FP,
        errorMessage: 'Unable to create fp, error: ' + error,
    };
}

export function successUpdateFp(data) {
    return {
        type: SUCCESS_UPDATE_FP,
        fpDetails: data
    };
}

export function failedUpdateFp(error) {
    return {
        type: FAILED_UPDATE_FP,
        errorMessage: 'Unable to create fp, error: ' + error
    };
}

export function successDeleteFp(data) {
    return {
        type: SUCCESS_DELETE_FP,
        fpDetails: data
    };
}

export function failedDeleteFp(error) {
    return {
        type: FAILED_DELETE_FP,
        errorMessage: 'Unable to create fp, error: ' + error
    };
}

export function successGetFPCarriers(data) {
    return {
        type: SUCCESS_GET_FP_CARRIERS,
        fpCarriers: data.results,
    };
}

export function failedGetFPCarriers(error) {
    return {
        type: FAILED_GET_FP_CARRIERS,
        errorMessage: 'Unable to get FP. Error:' + error,
    };
}

export function successCreateFpCarrier(data) {
    return {
        type: SUCCESS_CREATE_FP_CARRIER,
        carrier: data,
        noCarrier: false,
    };
}

export function failedCreateFpCarrier(error) {
    return {
        type: FAILED_CREATE_FP_CARRIER,
        errorMessage: 'Unable to create carrier, error: ' + error,
        bCarrier: false
    };
}

export function successUpdateFpCarrier(data) {
    return {
        type: SUCCESS_UPDATE_FP_CARRIER,
        carrier: data,
        noCarrier: false,
    };
}

export function failedUpdateFpCarrier(error) {
    return {
        type: FAILED_UPDATE_FP_CARRIER,
        errorMessage: 'Unable to create carrier, error: ' + error,
        bCarrier: false
    };
}

export function successDeleteFpCarrier(data) {
    return {
        type: SUCCESS_DELETE_FP_CARRIER,
        carrier: data,
        noCarrier: false,
    };
}

export function failedDeleteFpCarrier(error) {
    return {
        type: FAILED_DELETE_FP_CARRIER,
        errorMessage: 'Unable to create carrier, error: ' + error,
        bCarrier: false
    };
}

export function successGetFPZones(data) {
    return {
        type: SUCCESS_GET_FP_ZONES,
        fpZones: data.results,
        pageCnt: data.page_cnt,
        pageInd: data.page_ind,
        pageItemCnt: data.page_item_cnt,
    };
}

export function failedGetFPZones(error) {
    return {
        type: FAILED_GET_FP_ZONES,
        errorMessage: 'Unable to get FP. Error:' + error,
    };
}

export function successCreateFpZone(data) {
    return {
        type: SUCCESS_CREATE_FP_ZONE,
        zone: data,
        noZone: false,
    };
}

export function failedCreateFpZone(error) {
    return {
        type: FAILED_CREATE_FP_ZONE,
        errorMessage: 'Unable to create zone, error: ' + error,
        bZoner: false
    };
}

export function successUpdateFpZone(data) {
    return {
        type: SUCCESS_UPDATE_FP_ZONE,
        zone: data,
        noZone: false,
    };
}

export function failedUpdateFpZone(error) {
    return {
        type: FAILED_UPDATE_FP_ZONE,
        errorMessage: 'Unable to create carrier, error: ' + error,
        bZone: false
    };
}

export function successDeleteFpZone(data) {
    return {
        type: SUCCESS_DELETE_FP_ZONE,
        zone: data,
        noZone: false,
    };
}

export function failedDeleteFpZone(error) {
    return {
        type: FAILED_DELETE_FP_ZONE,
        errorMessage: 'Unable to create carrier, error: ' + error,
        bZone: false
    };
}

export function setLocalFilter(key, value) {
    if (key === 'pageItemCnt') {
        return {
            type: SET_LOCAL_FILTER_PAGEITEMCNT,
            pageItemCnt: value,
        };
    } else if (key === 'pageInd') {
        return {
            type: SET_LOCAL_FILTER_PAGEINDEX,
            pageInd: value,
        };
    } 
}

export function setNeedUpdateZonesFlag(boolFlag) {
    return {
        type: SET_FETCH_ZONES_FLAG,
        needUpdateZones: boolFlag,
    };
}

export function successGetFpStatuses(data) {
    return {
        type: SUCCESS_GET_FP_STATUSES,
        payload: data
    };
}

export function failedGetFpStatuses(error) {
    return {
        type: FAILED_GET_FP_STATUSES,
        payload: error
    };
}

export function successCreateFpStatus(data) {
    return {
        type: SUCCESS_CREATE_FP_STATUS,
        payload: data
    };
}

export function failedCreateFpStatus(error) {
    return {
        type: FAILED_CREATE_FP_STATUS,
        payload: error
    };
}

export function successUpdateFpStatus(data) {
    return {
        type: SUCCESS_UPDATE_FP_STATUS,
        payload: data
    };
}

export function failedUpdateFpStatus(error) {
    return {
        type: FAILED_UPDATE_FP_STATUS,
        payload: error
    };
}

export function successDeleteFpStatus(data) {
    return {
        type: SUCCESS_DELETE_FP_STATUS,
        payload: data
    };
}

export function failedDeleteFpStatus(error) {
    return {
        type: FAILED_DELETE_FP_STATUS,
        payload: error
    };
}