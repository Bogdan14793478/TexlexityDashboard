import { AxiosResponse } from "axios";
import { Dispatch } from "react";
import { AuthFormData } from "../components/FormAuth/types";
import { setToStorage } from "../helpers/helpers";
import {
  Action2,
  ActionTypesUser,
  getAllAdminToStore,
} from "../redux/actions/typeActionUser";
import { axiosPublic } from "./axiosPublic";
import axiosInstance from "./axiosPrivate";
import { Get_All_UserI, User } from "../redux/actions/interface";

type Token = { accessToken: string; refreshToken: string };
type SignUpArgs = { email: string; password: string };
type SignUpResponse = AxiosResponse<{ tokens: Token }>;

export const signUp = (data: AuthFormData) => {
  return axiosPublic
    .post<SignUpArgs, SignUpResponse>("admin/login", {
      email: data.name,
      password: data.password,
    })
    .then((result) => {
      setToStorage(result.data.tokens.accessToken, "accessToken");
      setToStorage(result.data.tokens.refreshToken, "refreshToken");
    })
    .then(() => {
      return true;
    })
    .catch((e) => {
      console.log(e, "Error");
      return e;
    });
};

export function getAllAdmin() {
  return async (
    dispatch: Dispatch<Action2<ActionTypesUser.GET_ALL_ADMIN, any>>
  ) => {
    axiosInstance.get<never, AxiosResponse<any>>("admin/all").then((res) => {
      // dispatch(getAllAdmin(res.data.admins));
      console.log(res.data.admins, "res");
    });
  };
}

export function getAllUser() {
  return async (
    dispatch: Dispatch<Action2<ActionTypesUser.GET_ALL_USER, User[]>>
  ) => {
    axiosInstance
      .post<never, AxiosResponse<Get_All_UserI>>("user/all")
      .then((res) => {
        dispatch(getAllAdminToStore(res.data.users));
        console.log(res.data.users, "res user");
      });
  };
}
