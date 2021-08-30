import {
    SUCCESS_GET_BOK_1_HEADERS,
    FAILED_GET_BOK_1_HEADERS,
    SUCCESS_GET_BOK_2_LINES,
    FAILED_GET_BOK_2_LINES,
    SUCCESS_GET_BOK_3_LINES_DATA,
    FAILED_GET_BOK_3_LINES_DATA,
    SUCCESS_GET_BOK_WITH_PRICINGS,
    FAILED_GET_BOK_WITH_PRICINGS,
    SUCCESS_SELECT_PRICING,
    FAILED_SELECT_PRICING,
    RESET_NEED_TO_UPDATE_PRICINGS,
    SUCCESS_GET_DE_STATUS,
    FAILED_GET_DE_STATUS,
    SUCCESS_BOOK_FREIGHT,
    FAILED_BOOK_FREIGHT,
    SUCCESS_CANCEL_FREIGHT,
    FAILED_CANCEL_FREIGHT,
    SUCCESS_UPDATE_BOK_1,
    FAILED_UPDATE_BOK_1,
    SUCCESS_AUTO_REPACK,
    FAILED_AUTO_REPACK,
    SUCCESS_ADD_BOK_LINE,
    FAILED_ADD_BOK_LINE,
    SUCCESS_UPDATE_BOK_LINE,
    FAILED_UPDATE_BOK_LINE,
    SUCCESS_DELETE_BOK_LINE,
    FAILED_DELETE_BOK_LINE,
} from '../constants/bokConstants';

const defaultState = {
    BOK_1_headers: [],
    BOK_2_lines: [],
    BOK_3_lines_data: [],
    BOK_with_pricings: null,
    needToUpdatePricings: null,
    errorMessage: '',
    deliveryStep: null,
    deliveryStatus: null,
    clientLogoUrl: '',
    quote: null,
    booking: null,
    loadSuccess: null,
    bookedSuccess: null,
    canceledSuccess: null,
    selectPricingSuccess: null,
    autoRepackSuccess: null,
    lineOperationSuccess: null,
};

export const BokReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case RESET_NEED_TO_UPDATE_PRICINGS:
            return {
                ...state,
                needToUpdatePricings: false,
                loadSuccess: null,
                bookedSuccess: null,
                canceledSuccess: null,
                selectPricingSuccess: null,
                autoRepackSuccess: null,
                lineOperationSuccess: null,
            };
        case SUCCESS_GET_BOK_1_HEADERS:
            return {
                ...state,
                BOK_1_headers: payload,
            };
        case SUCCESS_GET_BOK_2_LINES:
            return {
                ...state,
                BOK_2_lines: payload,
            };
        case SUCCESS_GET_BOK_3_LINES_DATA:
            return {
                ...state,
                BOK_3_lines_data: payload,
            };
        case SUCCESS_GET_BOK_WITH_PRICINGS:
            return {
                ...state,
                loadSuccess: true,
                BOK_with_pricings: payload,
            };
        case SUCCESS_UPDATE_BOK_1:
        case SUCCESS_SELECT_PRICING:
            return {
                ...state,
                needToUpdatePricings: true,
                selectPricingSuccess: true,
            };
        case SUCCESS_GET_DE_STATUS:
            return {
                ...state,
                deliveryStatus: payload.status,
                deliveryStep: payload.step,
                clientLogoUrl: payload.logo_url,
                quote: payload.quote,
                booking: payload.booking,
                lastUpdated: payload.last_updated,
                lines: payload.lines,
                etaDate: payload.eta_date,
                lastMilestone: payload.last_milestone,
                timestamps: payload.timestamps
            };
        case SUCCESS_BOOK_FREIGHT:
            return {
                ...state,
                bookedSuccess: true,
            };
        case SUCCESS_CANCEL_FREIGHT:
            return {
                ...state,
                canceledSuccess: true,
            };
        case SUCCESS_AUTO_REPACK:
            return {
                ...state,
                autoRepackSuccess: true,
            };
        case SUCCESS_ADD_BOK_LINE:
        case SUCCESS_UPDATE_BOK_LINE:
        case SUCCESS_DELETE_BOK_LINE:
            return {
                ...state,
                lineOperationSuccess: true,
            };
        case FAILED_SELECT_PRICING:
        case FAILED_GET_BOK_1_HEADERS:
        case FAILED_GET_BOK_2_LINES:
        case FAILED_GET_BOK_3_LINES_DATA:
        case FAILED_GET_BOK_WITH_PRICINGS:
        case FAILED_GET_DE_STATUS:
        case FAILED_BOOK_FREIGHT:
        case FAILED_CANCEL_FREIGHT:
        case FAILED_UPDATE_BOK_1:
        case FAILED_AUTO_REPACK:
        case FAILED_ADD_BOK_LINE:
        case FAILED_UPDATE_BOK_LINE:
        case FAILED_DELETE_BOK_LINE:
            return {
                ...state,
                errorMessage: payload,
                needToUpdatePricings: false,
            };
        default:
            return state;
    }
};
