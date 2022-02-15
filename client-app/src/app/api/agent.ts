import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { myHistory } from "../../features/history";
import { Activity, ActivityFormValues } from "../models/activity";
import { Photo, Profile, UserActivity } from "../models/profile";
import { User, UserFormValues } from "../models/user";
import { store } from "../stores/Store";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const baseUrl = "http://localhost:5000/api";

axios.defaults.baseURL = baseUrl;

axios.interceptors.request.use(config => {
  const token = store.commonStore.token;
  if (token) {
    config.headers = { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return config;
})

axios.interceptors.response.use(
  async (response) => {
    await sleep(520);
    return response;
  },
  (error: AxiosError) => {
    const { status, data , config } = error.response!;

    switch (status) {
      case 400:
        if(typeof data ==='string')
        {
          toast.error(data);
        }

        if (config.method === "get" && data.errors.hasOwnProperty("id")) {
          myHistory.push("/not-found");
        }
        
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        } else {
          toast.error(data);
        }

        break;
      case 401:
        toast.error("Unathorise");
        break;
      case 404:
        myHistory.push("/notfpund");
        break;
      case 500:
        store.commonStore.setServerError(data);
        myHistory.push('/server-error');
        break;
    }
    return Promise.reject(error);
  }
);

const resposeBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(resposeBody),
  post: <T>(url: string, data: {}) =>
    axios.post<T>(url, data).then(resposeBody),
  put: <T>(url: string, data: {}) => axios.put<T>(url, data).then(resposeBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(resposeBody),
};

const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) => requests.post<void>("/activities", activity),
  update: (activity: ActivityFormValues) =>
  requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete<void>(`/activities/${id}`),
  attend: (id:string) => requests.post<void>(`/activities/${id}/attend`,{})
};

const Account={
  current: ()=> requests.get<User>('/account'),
  login: (user:Partial<UserFormValues>) => requests.post<User>('/account/login', user),
  register: (user:UserFormValues) => requests.post<User>('/account/register', user),
}

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
      let formData = new FormData();
      formData.append('File', file);
      return axios.post<Photo>('photos', formData, {
          headers: { 'Content-type': 'multipart/form-data' }
      })
  },
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
  updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
  updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
  listFollowings: (username: string, predicate: string) =>
      requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
  listActivities: (username: string, predicate: string) =>
      requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
}

const agent = {
  Activities,
  Account,
  Profiles
};

export default agent;
