
import { API as AmplifyAPI } from "aws-amplify";

export const API = {
  get: (apiName, path, init) => AmplifyAPI.get(apiName, path, init),
  post: (apiName, path, init) => {
    init.body = {
      ...init.body,
    };
    return AmplifyAPI.post(apiName, path, init);
  },
  put: (apiName, path, init) => {
    init.body = {
      ...init.body,
    };
    return AmplifyAPI.put(apiName, path, init);
  },
  del: (apiName, path, init) => {
    init.body = {
      ...init.body,
    };
    return AmplifyAPI.del(apiName, path, init);
  },
};
