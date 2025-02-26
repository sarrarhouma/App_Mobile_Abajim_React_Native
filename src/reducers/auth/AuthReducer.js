const initialState = {
    authToken: null,
    userInfo: null,
    isLoading: false,
    error: null,
    children: [],
    userHasKids: false,  
    documentData: null, 
    activeChild: null, // ✅ Track selected child
    correctionVideoUrl: null, // ✅ Store correction video URL
    parentInfo: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "AUTH_LOADING":
        case "DOCUMENT_LOADING":
        case "FETCH_CORRECTION_VIDEO_REQUEST":
            return {
                ...state,
                isLoading: true,
                error: null,
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

        default:
            return state;
    }
};

export default authReducer;

// const initialState = {
//     authToken: null,
//     userInfo: null,
//     isLoading: false,
//     error: null,
//     children: [],
//     userHasKids: false,  
//     documentData: null, 
//     activeChild: null, // ✅ Track selected child
//     correctionVideoUrl: null,
// };

// const authReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case "AUTH_LOADING":
//         case "DOCUMENT_LOADING":
//             return {
//                 ...state,
//                 isLoading: true,
//                 error: null,
//             };

//         case "LOGIN_SUCCESS":
//             return {
//                 ...state,
//                 authToken: action.payload,
//                 isLoading: false,
//                 error: null,
//             };

//         case "FETCH_CHILDREN_SUCCESS":
//             return {
//                 ...state,
//                 isLoading: false,
//                 children: action.payload, 
//                 userHasKids: action.payload.length > 0,  // ✅ Ensure `userHasKids` updates
//             };
            
//         case "LOGIN_FAIL":
//         case "DOCUMENT_FAIL":
//         case "ADD_CHILD_FAIL":
//         case "FETCH_CHILDREN_FAILURE":
//             return {
//                 ...state,
//                 isLoading: false,
//                 error: action.error,
//             };

//         case "DOCUMENT_SUCCESS":
//             return {
//                 ...state,
//                 documentData: action.payload,
//                 isLoading: false,
//                 error: null,
//             };

//         case "LOGOUT":
//             return {
//                 ...initialState, 
//             };

//         case "ADD_CHILD_SUCCESS":
//             const updatedChildren = [...state.children, action.payload];
//             return {
//                 ...state,
//                 children: updatedChildren,
//                 userHasKids: true, 
//                 isLoading: false,
//                 error: null,
//                 activeChild: state.activeChild || action.payload, // ✅ If first child, auto-set
//             };

//         case "SWITCH_ACTIVE_CHILD":
//             return {
//                 ...state,
//                 activeChild: action.payload.child, // ✅ Update active child
//                 authToken: action.payload.token, // ✅ Update token
//                 children: action.payload.children || state.children, // ✅ Ensure children persist
//             };  
            
//         default:
//             return state;
//     }
// };

// export default authReducer;
