import {
    SUCCESS_GET_SURCHARGES,
    FAILED_GET_SURCHARGES,
    SUCCESS_CREATE_SURCHARGE,
    FAILED_CREATE_SURCHARGE,
    SUCCESS_UPDATE_SURCHARGE,
    FAILED_UPDATE_SURCHARGE,
    SUCCESS_DELETE_SURCHARGE,
    FAILED_DELETE_SURCHARGE,
} from '../constants/costConstants';

const defaultState = {
    surcharges: [],
    errorMessage: '',
};

export const CostReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case SUCCESS_GET_SURCHARGES:
            return {
                ...state,
                surcharges: payload,
            };
        case SUCCESS_CREATE_SURCHARGE:
            return {
                ...state,
                surcharges: [...state.surcharges, payload],
            };
        case SUCCESS_UPDATE_SURCHARGE: {
            const index = state.surcharges.findIndex(surcharge => surcharge.id === payload.id);
            const _surcharges = [...state.surcharges];
            _surcharges[index] = payload;

            return {
                ...state,
                surcharges: _surcharges,
            };
        }
        case SUCCESS_DELETE_SURCHARGE: {
            const index = state.surcharges.findIndex(surcharge => surcharge.id === payload.id);
            const _surcharges = [...state.surcharges];
            _surcharges.splice(index, 1);

            return {
                ...state,
                surcharges: _surcharges,
            };
        }
        case FAILED_GET_SURCHARGES:
        case FAILED_CREATE_SURCHARGE:
        case FAILED_UPDATE_SURCHARGE:
        case FAILED_DELETE_SURCHARGE:
            return {
                ...state,
                errorMessage: payload,
            };
        default:
            return state;
    }
};
