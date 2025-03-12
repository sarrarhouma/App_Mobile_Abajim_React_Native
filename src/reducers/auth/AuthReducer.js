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
              
        default:
            return state;
    }
};

export default authReducer;
