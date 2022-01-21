import {TOGGLE_LANGUAGE } from '../Data_Service/constants'

const initialState={
    language_id: 0
   

    


}

const data_Reducer=(state=initialState,action={})=>{

    switch(action.type)
    {

        case TOGGLE_LANGUAGE:
             return { 
                 ...state,
                    language_id: action.data
                  
                }
       
       
        default:  return state
    }





}

export default data_Reducer