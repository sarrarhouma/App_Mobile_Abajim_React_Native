const initialState = {
    authToken: null,
    userInfo: null,
    isLoading: false,
    error: null,
    children: [],
    userHasKids: false,  
    documentData: null, 
    activeChild: null, // ✅ Track selected child
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "AUTH_LOADING":
        case "DOCUMENT_LOADING":
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
            return {
                ...state,
                isLoading: false,
                error: action.error,
            };

        case "DOCUMENT_SUCCESS":
            return {
                ...state,
                documentData: action.payload,
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
                userHasKids: updatedChildren.length > 0, 
                isLoading: false,
                error: null,
                activeChild: updatedChildren.length === 1 ? action.payload : state.activeChild, // ✅ If first child, auto-set
            };

        case "SWITCH_ACTIVE_CHILD":
            return {
                ...state,
                activeChild: action.payload.child, // ✅ Update the active child
                uthToken: action.payload.token,  // ✅ Update session token
                children: state.children.length > 0 ? state.children : action.payload.children, // ✅ Preserve children list
            };
            
            
        default:
            return state;
    }
};

export default authReducer;
