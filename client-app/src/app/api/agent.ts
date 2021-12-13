import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const baseUrl = "http://localhost:5000/api";

axios.defaults.baseURL = baseUrl;
axios.interceptors.response.use(async (response) => {
  try {
    await sleep(520);
    return response;
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
});

const resposeBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(resposeBody),
  post: <T>(url: string, data: {}) => axios.post<T>(url, data).then(resposeBody),
  put: <T>(url: string, data: {}) => axios.put<T>(url, data).then(resposeBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(resposeBody),
};

const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id:string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => axios.post<void>("/activities", activity),
  update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => axios.delete<void>(`/activities/${id}`),
};

const agent = {
  Activities,
};

export default agent;
