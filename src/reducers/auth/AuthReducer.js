const initialState = {
    authToken: null,
    userInfo: null,
    isLoading: false,
    error: null,
    children: [],
    userHasKids: false,  
    documentData: null, 
    activeChild: null, 
    correctionVideoUrl: null, 
    parentInfo: null,
    webinars: [], 
    otpVerified: false,
    teacherProfile: null,
    isFollowing: false,
    followersCount: 0,
    notifications: [],
    manuals: [],
    videoCounts: {},
    meeting: null,
    meetings: [], 
    loading: false, 
    loadingMeetings: false,
    reservations: [],
    reservationSuccess: false,
    updatedReservation: null,
    reservationError: null,
    cancelLoading: false,
    cancelError: null,
    cancelSuccess: false,
    sale: null,
    saleError: null


};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "AUTH_LOADING":
        case "DOCUMENT_LOADING":
        case "FETCH_CORRECTION_VIDEO_REQUEST":
        case "FETCH_WEBINARS_REQUEST": // ✅ Added webinars loading state
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case "SEND_OTP_REQUEST":
        case "VERIFY_OTP_REQUEST":
        case "RESET_PASSWORD_REQUEST":
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        
        case "SEND_OTP_SUCCESS":
            return {
                ...state,
                isLoading: false,
                error: null,
            };
        
        case "VERIFY_OTP_SUCCESS":
            return {
                ...state,
                otpVerified: true,
                isLoading: false,
                error: null,
            };
        
        case "RESET_PASSWORD_SUCCESS":
            return {
                ...state,
                otpVerified: false, // Réinitialiser après changement du mot de passe
                isLoading: false,
                error: null,
                };
        
        case "SEND_OTP_FAILURE":
        case "VERIFY_OTP_FAILURE":
        case "RESET_PASSWORD_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                };
        
        case "LOGIN_SUCCESS":
            return {
                ...state,
                authToken: action.payload,
                isLoading: false,
                error: null,
            };

        case "FETCH_CHILDREN_SUCCESS":
            return {
                ...state,
                isLoading: false,
                children: action.payload, 
                userHasKids: action.payload.length > 0,  // ✅ Ensure `userHasKids` updates
            };

        case "LOGIN_FAIL":
        case "DOCUMENT_FAIL":
        case "ADD_CHILD_FAIL":
        case "FETCH_CHILDREN_FAILURE":
        case "FETCH_CORRECTION_VIDEO_FAILURE":
        case "FETCH_WEBINARS_FAILURE": // ✅ Handle webinars fetch failure
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };

        case "DOCUMENT_SUCCESS":
            return {
                ...state,
                documentData: action.payload,
                isLoading: false,
                error: null,
            };

        case "FETCH_CORRECTION_VIDEO_SUCCESS":
            return {
                ...state,
                correctionVideoUrl: action.payload, // ✅ Store the fetched URL
                isLoading: false,
                error: null,
            };

        case "FETCH_WEBINARS_SUCCESS": // ✅ Handle webinars success
            return {
                ...state,
                webinars: action.payload, // ✅ Store fetched webinars
                isLoading: false,
                error: null,
            };

        case "LOGOUT":
            return {
                ...initialState, 
            };

        case "ADD_CHILD_SUCCESS":
            const updatedChildren = [...state.children, action.payload];
            return {
                ...state,
                children: updatedChildren,
                userHasKids: true, 
                isLoading: false,
                error: null,
                activeChild: state.activeChild || action.payload, // ✅ If first child, auto-set
            };

        case "SWITCH_ACTIVE_CHILD":
            return {
                ...state,
                activeChild: action.payload.child, // ✅ Update active child
                authToken: action.payload.token, // ✅ Update token
                children: action.payload.children || state.children, // ✅ Ensure children persist
            }; 

        case "UPDATE_CHILD_REQUEST":
            return {
                ...state,
                isLoading: true,
                error: null,
            };
              
        case "UPDATE_CHILD_SUCCESS":
            return {
                ...state,
                children: state.children.map((child) =>
                    child.id === action.payload.id ? action.payload : child
                ),
                isLoading: false,
                error: null,
            };
              
        case "UPDATE_CHILD_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };

        case "FETCH_PARENT_INFO_REQUEST":
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case "FETCH_PARENT_INFO_SUCCESS":
            return {
                ...state,
                parentInfo: action.payload, // ✅ Save fetched parent data
                isLoading: false,
                error: null,
            };

        case "FETCH_PARENT_INFO_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }; 
        case "FETCH_TEACHER_REQUEST":
            return {
                ...state,
                isLoading: true,
                error: null,
            };
              
        case "FETCH_TEACHER_SUCCESS":
            return {
                ...state,
                isLoading: false,
                teacherProfile: action.payload,
                error: null,
            };
              
        case "FETCH_TEACHER_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case "SET_IS_FOLLOWING":
            return {
                ...state,
                isFollowing: action.payload,
            };
              
        case "SET_FOLLOWERS_COUNT":
            return {
                ...state,
                followersCount: action.payload,
            };
        case "FETCH_NOTIFICATIONS_REQUEST":
            return { ...state, isLoading: true };
              
        case "FETCH_NOTIFICATIONS_SUCCESS":
            return { ...state, notifications: action.payload, isLoading: false };
              
        case "FETCH_NOTIFICATIONS_FAILURE":
            return { ...state, isLoading: false, error: action.payload };
        case "FETCH_MANUELS_SUCCESS":
            return {
                ...state,
                manuals: action.payload,
                isLoading: false,
            };
              
        case "FETCH_VIDEO_COUNTS_SUCCESS":
            return {
                 ...state,
                videoCounts: action.payload,
                isLoading: false,
            };
        case "TOGGLE_FAVORITE_SUCCESS":
            return {
                ...state,
                webinars: state.webinars.map((webinar) =>
                webinar.id === action.payload.webinarId
                    ? { ...webinar, isFavorite: action.payload.isFavorite }
                    : webinar
                ),
            };
              
        case "FETCH_FAVORITES_SUCCESS":
            return {
                ...state,
                favorites: action.payload,
                webinars: state.webinars.map((webinar) => ({
                ...webinar,
                isFavorite: action.payload.includes(webinar.id),
                })),
            };
            case "FETCH_MEETINGS_REQUEST":
            return { ...state, loadingMeetings: true };

        case "FETCH_MEETINGS_SUCCESS":
            return { ...state, meetings: action.payload, loadingMeetings: false };

        case "FETCH_MEETINGS_FAILURE":
            return { ...state, loadingMeetings: false, error: action.payload };
        case "FETCH_RESERVATIONS_REQUEST":
        case "UPDATE_RESERVATION_REQUEST":
            return { ...state, isLoading: true, error: null };
        
        case "FETCH_RESERVATIONS_SUCCESS":
            return { ...state, reservations: action.payload, isLoading: false };
        
        case "FETCH_RESERVATIONS_FAILURE":
            return { ...state, error: action.payload, isLoading: false };
        
        case "UPDATE_RESERVATION_SUCCESS":
            return { 
                    ...state,
                    updatedReservation: action.payload,
                    isLoading: false,
                    reservations: state.reservations.map(res => 
                        res.id === action.payload.id ? action.payload : res
                    )
                };
                
        case "UPDATE_RESERVATION_FAILURE":
            return { ...state, error: action.payload, isLoading: false };          
        case "FETCH_MEETING_BY_ID_REQUEST":
            return { ...state, loading: true, error: null };
                
            case "FETCH_MEETING_BY_ID_SUCCESS":
                console.log("Reducer Meeting récupéré : ", action.payload); 
                return { ...state, loading: false, meeting: action.payload };
                
        case "FETCH_MEETING_BY_ID_FAILURE":
            return { ...state, loading: false, error: action.payload };              
        case "RESERVE_MEETING_REQUEST":
            return { 
                ...state, 
                loading: true, 
                reservationSuccess: false, 
                error: null 
            };
        case "RESERVE_MEETING_SUCCESS":
            return { 
                    ...state, 
                    loading: false, 
                    reservationSuccess: true,
                    reservations: [...state.reservations, action.payload] 
            };
        case "RESET_RESERVATION_SUCCESS": // Add this case to reset the flag
            return { 
                    ...state, 
                    reservationSuccess: false 
            };
        case "RESERVE_MEETING_FAILURE":
            return { 
                ...state, 
                loading: false, 
                reservationSuccess: false, 
                error: action.payload 
            };
        case "CANCEL_RESERVATION_REQUEST":
            return {
                    ...state,
                    cancelLoading: true,
                    cancelError: null,
                    cancelSuccess: false
                };
            case "CANCEL_RESERVATION_SUCCESS":
                return {
                        ...state,
                        cancelLoading: false,
                        cancelSuccess: true,
                        currentMeeting: state.currentMeeting ? {
                            ...state.currentMeeting,
                            isReserved: false,
                            reservationId: null,
                            status: "available"
                        } : null,
                        meetings: state.meetings.map(meeting => 
                            meeting.id === action.payload.meeting_id 
                                ? { 
                                    ...meeting, 
                                    isReserved: false, 
                                    reservationId: null,
                                    status: "available"
                                } 
                                : meeting
                        )
                };
        case "CANCEL_RESERVATION_FAILURE":
            return {
                    ...state,
                    cancelLoading: false,
                    cancelError: action.payload,
                    cancelSuccess: false
                };
        default:
            return state;
    }
};

export default authReducer;
