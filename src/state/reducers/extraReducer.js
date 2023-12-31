import {
    SUCCESS_GET_PACKAGETYPES,
    FAILED_GET_PACKAGETYPES,
    SUCCESS_GET_ALL_BOOKING_STATUS,
    FAILED_GET_ALL_BOOKING_STATUS,
    SUCCESS_SAVE_STATUS_STATUS,
    FAILED_SAVE_STATUS_STATUS,
    SUCCESS_GET_BOOKING_STATUS_HISTORY,
    FAILED_GET_BOOKING_STATUS_HISTORY,
    SUCCESS_GET_FPS,
    FAILED_GET_FPS,
    SUCCESS_GET_STATUS_ACTIONS,
    SUCCESS_GET_STATUS_DETAILS,
    FAILED_GET_STATUS_ACTIONS,
    FAILED_GET_STATUS_DETAILS,
    SUCCESS_CREATE_STATUS_DETAIL,
    SUCCESS_CREATE_STATUS_ACTION,
    FAILED_CREATE_STATUS_DETAIL,
    FAILED_CREATE_STATUS_ACTION,
    SUCCESS_GET_API_BCLS,
    FAILED_GET_API_BCLS,
    RESET_FLAG_STATUSHISTORY,
    RESET_FLAG_APIBCL,
    SET_STATUS_INFO_FILTER,
    RESET_STATUS_INFO_FLAG,
    SUCCESS_GET_STATUS_INFO,
    FAILED_GET_STATUS_INFO,
    RESET_PROJECT_NAMES,
    SUCCESS_GET_PROJECT_NAMES,
    FAILED_GET_PROJECT_NAMES,
    RESET_STORE_BOOKING_LOGS,
    SUCCESS_GET_EMAIL_LOGS,
    FAILED_GET_EMAIL_LOGS,
    RESET_EMAIL_LOGS,
    SUCCESS_GET_BOOKING_SETS, // BookingSet
    FAILED_GET_BOOKING_SETS, // *
    SUCCESS_CREATE_BOOKING_SET, // *
    FAILED_CREATE_BOOKING_SET, // *
    SUCCESS_UPDATE_BOOKING_SET, // *
    FAILED_UPDATE_BOOKING_SET, // *
    SUCCESS_DELETE_BOOKING_SET, // *
    FAILED_DELETE_BOOKING_SET, // *
    RESET_BOOKING_SET_FLAGS, // BookingSet
    SUCCESS_STATUSHISTORY_SAVE_PU_INFO,
    FAILED_STATUSHISTORY_SAVE_PU_INFO,
    SUCCESS_UPDATE_CLIENT_EMPLOYEE,
    FAILED_UPDATE_CLIENT_EMPLOYEE,
    SUCCESS_GET_ALL_ZOHO_TICKETS,
    FAILED_GET_ALL_ZOHO_TICKETS,
    SUCCESS_GET_ZOHO_TICKETS_WITH_BOOKING_ID,
    FAILED_GET_ZOHO_TICKETS_WITH_BOOKING_ID,
    RESET_ZOHO_TICKETS_WITH_BOOKING_ID,
    SUCCESS_GET_ZOHO_TICKET_DETAILS,
    FAILED_GET_ZOHO_TICKET_DETAILS,
    SUCCESS_GET_ZOHO_TICKET_CONVERSATIONS,
    FAILED_GET_ZOHO_TICKET_CONVERSATIONS,
    SUCCESS_GET_ZOHO_TICKET_THREAD,
    FAILED_GET_ZOHO_TICKET_THREAD,
    SUCCESS_SEND_ZOHO_TICKET_REPLY,
    FAILED_SEND_ZOHO_TICKET_REPLY,
    SUCCESS_GET_ZOHO_DEPARTMENTS,
    FAILED_GET_ZOHO_DEPARTMENTS,
    SUCCESS_GET_ZOHO_TICKET_SUMMARIES,
    FAILED_GET_ZOHO_TICKET_SUMMARIES,
    SUCCESS_GET_CLIENT_PRODUCTS,
    FAILED_GET_CLIENT_PRODUCTS,
    SUCCESS_DELETE_CLIENT_PRODUCTS,
    FAILED_DELETE_CLIENT_PRODUCTS,
    SUCCESS_CREATE_CLIENT_PRODUCTS,
    FAILED_CREATE_CLIENT_PRODUCTS,
    SUCCESS_UPDATE_CLIENT_PRODUCT,
    FAILED_UPDATE_CLIENT_PRODUCT,
    SUCCESS_GET_ALL_ERRORS,
    FAILED_GET_ALL_ERRORS,
    SUCCESS_GET_CLIENT_EMPLOYEES,
    FAILED_GET_CLIENT_EMPLOYEES,
    SUCCESS_GET_CLIENT_EMPLOYEE,
    FAILED_GET_CLIENT_EMPLOYEE,
    SUCCESS_CREATE_CLIENT_EMPLOYEE,
    SUCCESS_GET_PALLETS,
    FAILED_GET_PALLETS,
    SUCCESS_CREATE_PALLET,
    FAILED_CREATE_PALLET,
    SUCCESS_GET_SCANS,
    FAILED_GET_SCANS,
    SUCCESS_CREATE_SCAN,
    FAILED_CREATE_SCAN,
    SUCCESS_UPDATE_SCAN,
    FAILED_UPDATE_SCAN,
    SUCCESS_DELETE_SCAN,
    FAILED_DELETE_SCAN,
    SUCCESS_GET_LOGS,
    FAILED_GET_LOGS,
    SUCCESS_FIND_BOOKING,
    FAILED_FIND_BOOKING,
    RESET_PAGE_URLS,
    SUCCESS_GET_CS_NOTES,       // CS Note
    FAILED_GET_CS_NOTES,        // "
    SUCCESS_CREATE_CS_NOTE,     // "
    FAILED_CREATE_CS_NOTE,      // "
    SUCCESS_UPDATE_CS_NOTE,     // "
    FAILED_UPDATE_CS_NOTE,      // "
    SUCCESS_DELETE_CS_NOTE,     // "
    FAILED_DELETE_CS_NOTE,      // CS Note
} from '../constants/extraConstants';

const defaultState = {
    packageTypes: [],
    allBookingStatus: [],
    allClientEmployees: [],
    statusHistories: null,
    statusInfo: [],
    needUpdateStatusHistories: false,
    needUpdateStatusActions: false,
    needUpdateStatusDetails: false,
    needUpdateStatusInfo: false,
    needUpdateBookingSets: false,
    isBookingSetDeleted: false,
    projectNames: null,
    emailLogs: [],
    bookingset: null,
    bookingsets: null,
    allTickets: [],
    zohoDepartments: [],
    zohoTickets: [],
    zohoTicketSummaries: [],
    ticketDetails: [],
    ticketThread: [],
    ticketConversations: [],
    loadingZohoTickets: false,
    loadingZohoDepartments: false,
    loadingZohoTicketSummaries: false,
    clientProducts: [],
    allFPs: [],
    errors: [],
    clientEmployee: {},
    updatedClientEmployee: {},
    pallets: [],
    scans: [],
    logs: [],
    pricePageUrl: null,
    statusPageUrl: null,
    csNotes: [],
};

export const ExtraReducer = (state = defaultState, {
    type,
    payload,
    packageTypes,
    allBookingStatus,
    statusHistory,
    statusHistories,
    errorMessage,
    allFPs,
    statusActions,
    statusDetails,
    apiBCLs,
    startDate,
    endDate,
    clientPK,
    statusInfo
}) => {
    switch (type) {
        case RESET_PAGE_URLS:
            return {
                ...state,
                pricePageUrl: null,
                statusPageUrl: null,
                errorMessage: null,
            };
        case RESET_BOOKING_SET_FLAGS:
            return {
                ...state,
                isBookingSetDeleted: false,
                needUpdateBookingSets: false,
            };
        case SUCCESS_STATUSHISTORY_SAVE_PU_INFO:
            return {
                ...state,
                needUpdateStatusHistories: true,
            };
        case RESET_EMAIL_LOGS:
            return {
                ...state,
                emailLogs: [],
            };
        case RESET_STORE_BOOKING_LOGS:
            return {
                ...state,
                storeBookingLogs: [],
            };
        case RESET_PROJECT_NAMES:
            return {
                ...state,
                projectNames: [],
            };
        case RESET_STATUS_INFO_FLAG:
            return {
                ...state,
                needUpdateStatusInfo: false,
            };
        case RESET_FLAG_APIBCL:
            return {
                ...state,
                apiBCLs: null,
            };
        case RESET_FLAG_STATUSHISTORY:
            return {
                ...state,
                statusHistories: null,
                needUpdateStatusHistories: false,
            };
        case RESET_ZOHO_TICKETS_WITH_BOOKING_ID:
            return {
                ...state,
                zoho_tickets: [],
                loadingZohoTickets: true, 
            };
        case SUCCESS_GET_PACKAGETYPES:
            return {
                ...state,
                packageTypes: packageTypes,
            };
        case SUCCESS_GET_ALL_BOOKING_STATUS:
            return {
                ...state,
                allBookingStatus: allBookingStatus,
            };
        case SUCCESS_GET_BOOKING_STATUS_HISTORY:
            return {
                ...state,
                statusHistories: statusHistories,
                needUpdateStatusHistories: false,
            };
        case SUCCESS_SAVE_STATUS_STATUS:
            return {
                ...state,
                statusHistory: statusHistory,
                needUpdateStatusHistories: true,
            };
        case SUCCESS_GET_FPS:
            return {
                ...state,
                allFPs: allFPs,
            };
        case SUCCESS_GET_STATUS_ACTIONS:
            return {
                ...state,
                statusActions: statusActions,
                needUpdateStatusActions: false,
            };
        case SUCCESS_GET_STATUS_DETAILS:
            return {
                ...state,
                statusDetails: statusDetails,
                needUpdateStatusDetails: false,
            };
        case SUCCESS_CREATE_STATUS_DETAIL:
            return {
                ...state,
                needUpdateStatusDetails: true,
            };
        case SUCCESS_CREATE_STATUS_ACTION:
            return {
                ...state,
                needUpdateStatusActions: true,
            };
        case SUCCESS_GET_API_BCLS:
            return {
                ...state,
                apiBCLs: apiBCLs,
            };
        case SET_STATUS_INFO_FILTER:
            return {
                ...state,
                startDate: startDate,
                endDate: endDate,
                clientPK: clientPK,
                needUpdateStatusInfo: true,
            };
        case SUCCESS_GET_STATUS_INFO:
            return {
                ...state,
                statusInfo: statusInfo,
            };
        case SUCCESS_GET_PROJECT_NAMES:
            return {
                ...state,
                projectNames: payload
            };
        case SUCCESS_GET_EMAIL_LOGS:
            return {
                ...state,
                emailLogs: payload
            };
        case SUCCESS_CREATE_BOOKING_SET:
            return {
                ...state,
                bookingset: payload
            };
        case SUCCESS_GET_BOOKING_SETS:
            return {
                ...state,
                bookingsets: payload
            };
        case SUCCESS_UPDATE_BOOKING_SET:
            return {
                ...state,
                bookingset: payload,
                bookingsets: null,
                needUpdateBookingSets: true,
            };
        case SUCCESS_DELETE_BOOKING_SET:
            return {
                ...state,
                bookingset: payload,
                bookingsets: null,
                needUpdateBookingSets: true,
                isBookingSetDeleted: true,
            };
        case SUCCESS_GET_ALL_ZOHO_TICKETS:
            return {
                ...state,
                allTickets: payload,
                // loadingZohoTickets: false
            };
        case SUCCESS_GET_ZOHO_TICKET_DETAILS:
            return {
                ...state,
                ticketDetails: payload,
                // loadingZohoTickets: false
            };
        case SUCCESS_GET_ZOHO_TICKET_CONVERSATIONS:
            return {
                ...state,
                ticketConversations: payload,
                // loadingZohoTickets: false
            };
        case SUCCESS_GET_ZOHO_TICKET_THREAD:
            return {
                ...state,
                ticketThread: payload,
                // loadingZohoTickets: false
            };
        case SUCCESS_SEND_ZOHO_TICKET_REPLY:
            return {
                ...state,
                // loadingZohoTickets: false
            };
        case SUCCESS_GET_ZOHO_TICKETS_WITH_BOOKING_ID:
            return {
                ...state,
                zohoTickets: payload,
                loadingZohoTickets: false
            };
        case SUCCESS_GET_ZOHO_DEPARTMENTS:
            return {
                ...state,
                zohoDepartments: payload,
                loadingZohoDepartments: false
            };
        case FAILED_GET_ZOHO_DEPARTMENTS:
            return {
                ...state,
                zohoDepartments: payload,
                loadingZohoDepartments: false
            };
        case SUCCESS_GET_ZOHO_TICKET_SUMMARIES:
            return {
                ...state,
                zohoTicketSummaries: payload,
                loadingZohoTicketSummaries: false
            };
        case FAILED_GET_ZOHO_TICKET_SUMMARIES:
            return {
                ...state,
                zohoTicketSummaries: payload,
                loadingZohoTicketSummaries: false
            };
        case SUCCESS_GET_CLIENT_PRODUCTS:
            return {
                ...state,
                clientProducts: payload
            };
        case SUCCESS_CREATE_CLIENT_PRODUCTS:
            return {
                ...state,
                clientProducts: [
                    ...state.clientProducts,
                    payload
                ]
            };
        case SUCCESS_UPDATE_CLIENT_PRODUCT:
            return {
                ...state,
                clientProducts: state.clientProducts.map((item) => {
                    if (item.id === payload.id) return payload;
                    else return item;
                })
            };
        case SUCCESS_DELETE_CLIENT_PRODUCTS: 
            var clientProducts = [];
            for (const clientProduct of state.clientProducts) {
                if ( clientProduct.id != payload.id) {
                    clientProducts.push(clientProduct);
                }
            }
            return {
                ...state,
                clientProducts: clientProducts
            };
        case SUCCESS_GET_ALL_ERRORS:
            return {
                ...state,
                errors: payload
            };
        case SUCCESS_GET_CLIENT_EMPLOYEES:
            return {
                ...state,
                allClientEmployees: payload
            };
        case SUCCESS_GET_CLIENT_EMPLOYEE:
            return {
                ...state,
                clientEmployee: payload
            };
        case SUCCESS_UPDATE_CLIENT_EMPLOYEE:
            return {
                ...state,
                updatedClientEmployee: payload
            };
        case SUCCESS_CREATE_CLIENT_EMPLOYEE:
            return {
                ...state,
                updatedClientEmployee: payload
            };
        case SUCCESS_GET_PALLETS:
            return {
                ...state,
                pallets: payload,
            };
        case SUCCESS_CREATE_PALLET:
            var pallets = Array.from(state.pallets);
            pallets.push(payload);
            return {
                ...state,
                pallets: pallets,
            };
        case SUCCESS_GET_SCANS:
            return {
                ...state,
                scans: payload
            };
        case SUCCESS_CREATE_SCAN:
            return {
                ...state,
                scans: [...state.scans, payload],
            };
        case SUCCESS_UPDATE_SCAN: {
            const index = state.scans.findIndex(scan => scan.id === payload.id);
            const _scans = [...state.scans];
            _scans[index] = payload;

            return {
                ...state,
                scans: _scans,
            };
        }
        case SUCCESS_DELETE_SCAN: {
            const index = state.scans.findIndex(scan => scan.id === payload.id);
            const _scans = [...state.scans];
            _scans.splice(index, 1);

            return {
                ...state,
                scans: _scans,
            };
        }
        case SUCCESS_GET_LOGS:
            return {
                ...state,
                logs: payload
            };
        case SUCCESS_FIND_BOOKING:
            return {
                ...state,
                pricePageUrl: payload.pricePageUrl,
                statusPageUrl: payload.statusPageUrl,
                errorMessage: payload.message,
            };
        case FAILED_GET_ALL_ERRORS:
            return {
                ...state,
                errors: []
            };
        case FAILED_GET_CLIENT_PRODUCTS:
            return {
                ...state,
                clientProducts: []
            };
        case FAILED_GET_ALL_ZOHO_TICKETS:
            return {
                ...state,
                // loadingZohoTickets: false
            };
        case FAILED_GET_ZOHO_TICKETS_WITH_BOOKING_ID:
            return {
                ...state,
                // loadingZohoTickets: false
            };
        case FAILED_GET_ZOHO_TICKET_DETAILS:
            return {
                ...state,
                // loadingZohoTickets: false
            };
        case FAILED_GET_ZOHO_TICKET_CONVERSATIONS:
            return {
                ...state,
                // loadingZohoTickets: false
            };
        case FAILED_GET_ZOHO_TICKET_THREAD:
            return {
                ...state,
                // loadingZohoTickets: false
            };
        case FAILED_SEND_ZOHO_TICKET_REPLY:
            return {
                ...state,
                // loadingZohoTickets: false
            };
        case SUCCESS_GET_CS_NOTES:
            return {
                ...state,
                csNotes: payload
            };
        case SUCCESS_CREATE_CS_NOTE:
            return {
                ...state,
                csNotes: [
                    ...state.csNotes,
                    payload
                ]
            };
        case SUCCESS_UPDATE_CS_NOTE:
            return {
                ...state,
                csNotes: state.csNotes.map((item) => {
                    if (item.id === payload.id) return payload;
                    else return item;
                })
            };
        case SUCCESS_DELETE_CS_NOTE: 
            var csNotes = [];
            for (const csNote of state.csNotes) {
                if ( csNote.id != payload.id) {
                    csNotes.push(csNote);
                }
            }
            return {
                ...state,
                csNotes
            };
        case FAILED_CREATE_STATUS_ACTION:
        case FAILED_CREATE_STATUS_DETAIL:
        case FAILED_GET_STATUS_DETAILS:
        case FAILED_GET_STATUS_ACTIONS:
        case FAILED_GET_FPS:
        case FAILED_SAVE_STATUS_STATUS:
        case FAILED_GET_BOOKING_STATUS_HISTORY:
        case FAILED_GET_PACKAGETYPES:
        case FAILED_GET_ALL_BOOKING_STATUS:
        case FAILED_GET_API_BCLS:
        case FAILED_GET_STATUS_INFO:
        case FAILED_GET_PROJECT_NAMES:
        case FAILED_GET_EMAIL_LOGS:
        case FAILED_CREATE_BOOKING_SET:
        case FAILED_GET_BOOKING_SETS:
        case FAILED_UPDATE_BOOKING_SET:
        case FAILED_DELETE_BOOKING_SET:
        case FAILED_GET_CS_NOTES:
        case FAILED_CREATE_CS_NOTE:
        case FAILED_UPDATE_CS_NOTE:
        case FAILED_DELETE_CS_NOTE:
        case FAILED_STATUSHISTORY_SAVE_PU_INFO:
        case FAILED_UPDATE_CLIENT_EMPLOYEE:
        case FAILED_DELETE_CLIENT_PRODUCTS:
        case FAILED_CREATE_CLIENT_PRODUCTS:
        case FAILED_UPDATE_CLIENT_PRODUCT:
        case FAILED_GET_CLIENT_EMPLOYEES:
        case FAILED_GET_CLIENT_EMPLOYEE:
        case FAILED_GET_PALLETS:
        case FAILED_GET_SCANS:
        case FAILED_CREATE_SCAN:
        case FAILED_UPDATE_SCAN:
        case FAILED_DELETE_SCAN:
        case FAILED_CREATE_PALLET:
        case FAILED_GET_LOGS:
        case FAILED_FIND_BOOKING:
            return {
                ...state,
                errorMessage: errorMessage,
            };
        default:
            return state;
    }
};
