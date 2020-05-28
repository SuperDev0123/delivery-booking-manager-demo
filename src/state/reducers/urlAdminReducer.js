const defaultState = {
    urlAdminHome: '/admin',
};


export const UrlAdminReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        default:
            return {
                ...state,
                payload: payload,
            };
    }
};
