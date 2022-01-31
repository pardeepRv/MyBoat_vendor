import { TOGGLE_LANGUAGE, PERMISSIONS_ADDED } from '../Data_Service/constants'

const initialState = {
    language_id: 0,
    permissions:[],
}

const data_Reducer = (state = initialState, action = {}) => {

    switch (action.type) {

        case TOGGLE_LANGUAGE:
            return {
                ...state,
                language_id: action.data
            }

        case PERMISSIONS_ADDED:
            return {
                ...state,
                permissions: action.payload
            }

        default: return state
    }

}

export default data_Reducer