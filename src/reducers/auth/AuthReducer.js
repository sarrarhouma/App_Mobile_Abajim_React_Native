const initialState = {
    authToken: null,
    userInfo: null,
    isLoading: false,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "AUTH_LOADING":
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
        
        case "LOGIN_FAIL":
            return {
                ...state,
                isLoading: false,
                error: action.error, 
            };
        
        case "LOGOUT":
            return {
                ...state,
                authToken: null,    
                isLoading: false,
                userInfo: null,
            };

        default:
            return state;
    }
};

export default authReducer;  