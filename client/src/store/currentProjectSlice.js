import { createSlice } from "@reduxjs/toolkit";

const currentProjectSlice = createSlice({
    name:"currentProject",
    initialState:{
        name:null
    },
    reducers:{
        addName: (state, action) => {
            state.name = action.payload;
        }
    }
});
export const {addName} = currentProjectSlice.actions;
export default currentProjectSlice.reducer;