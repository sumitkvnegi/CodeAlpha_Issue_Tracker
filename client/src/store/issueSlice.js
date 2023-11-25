import { createSlice } from "@reduxjs/toolkit";

const issueSlice = createSlice({
    name:"issue",
    initialState:{
        data:null
    },
    reducers:{
        addData: (state, action) => {
            state.data = action.payload;
        }
    }
});
export const {addData} = issueSlice.actions;
export default issueSlice.reducer;