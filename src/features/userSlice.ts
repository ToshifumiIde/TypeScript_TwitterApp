import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: { uid: "", photoUrl: "", displayName: "" },
  },
  reducers: {
    login: (state , action) => {
      state.user = action.payload;
      // actionのpayloadから受け取ったユーザー情報をstateのuserに登録
    },
    logout: (state) => {
      state.user = {uid:"",photoUrl:"",displayName:"",};
      // logoutした段階で、ユーザー情報は初期化する
    },
  },
});

export const { login, logout} = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
