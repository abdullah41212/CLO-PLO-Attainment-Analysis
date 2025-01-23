import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  currUser: null,
  loginStatus: false,
  selectedStudent: {},
  studentinfo: null, // This is the field you want to update
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrUser(state, action) {
      state.currUser = action.payload;
    },
    Addstudent(state, action) {
      state.selectedStudent = action.payload;
    },
    LoginStatusTrue(state) {
      state.loginStatus = true;
    },
    LoginStatusfalse(state) {
      state.loginStatus = false;
    },
    SetStudentInfo(state, action) {
      state.studentinfo = action.payload; // Update `studentinfo` here
    },
  },
});

const store = configureStore({
  reducer: userSlice.reducer,
});

export const action = userSlice.actions;
export default store;
