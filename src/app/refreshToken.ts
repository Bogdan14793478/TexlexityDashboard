import {
  getFromStorage,
  removeFromStorage,
  setToStorage,
} from "../helpers/helpers";
import mem from "mem";
import { axiosPublic } from "./axiosPublic";

const refreshTokenFn = async () => {
  const refreshToken: string | null = getFromStorage("refreshToken");
  console.log(refreshToken, "refreshToken create req");
  try {
    console.log("section try work");
    const response: any = await axiosPublic.post("/admin/refresh", {
      refreshToken,
    });
    console.log(response, "resp to send refresh token");

    // const { session } = response.data;
    // console.log(session, "session");
    if (!response?.tokens.accessToken) {
      console.log("not get accessToken");
      // Log Out
      // removeFromStorage("refreshToken");
      // removeFromStorage("accessToken");
    }
    console.log(response.tokens, "session.tokens");

    setToStorage(response.data.tokens.accessToken, "accessToken");
    setToStorage(response.data.tokens.refreshToken, "refreshToken");

    return response.data.tokens;
  } catch (error) {
    // Log Out
    // removeFromStorage("refreshToken");
    // removeFromStorage("accessToken");
  }
};

const delay = 20000;

export const memoizedRefreshToken = mem(refreshTokenFn, {
  maxAge: delay,
});
