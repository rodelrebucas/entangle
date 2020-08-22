import { ApiService } from "../../../service/api";
import { registerReducerAction } from "./reducer";

export const requestRegisterAction = (token: string) => ({
  type: "REQUEST",
  method: ApiService.getApi().post,
  route: "/auth",
  resultReducerAction: registerReducerAction,
  payload: {
    token,
  },
});
