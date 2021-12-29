import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { myHistory } from "../../features/history";
import { Activity } from "../models/activity";
import { store } from "../stores/Store";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const baseUrl = "http://localhost:5000/api";

axios.defaults.baseURL = baseUrl;



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
  create: (activity: Activity) => axios.post<void>("/activities", activity),
  update: (activity: Activity) =>
    axios.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => axios.delete<void>(`/activities/${id}`),
};

const agent = {
  Activities,
};

export default agent;
