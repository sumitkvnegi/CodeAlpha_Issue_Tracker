import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import issueSlice from "./issueSlice";
import currentProjectSlice from "./currentProjectSlice";

const store = configureStore({
    reducer:{
        app: appSlice,
        issue: issueSlice,
        currentProject:currentProjectSlice
    }
});

export default store;