import {createSlice} from '@reduxjs/toolkit'


const initialState={
    user:null,

}

const AuthSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        SetUser(state,action){
            state.user=action.payload
        },
        RemoveUser(state,action){
            state.user=null
        }

    }
})

export const {SetUser,RemoveUser}=AuthSlice.actions
export default AuthSlice.reducer