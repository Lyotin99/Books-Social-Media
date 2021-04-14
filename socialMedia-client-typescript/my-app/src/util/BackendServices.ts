import axios from "axios";

declare module "axios" {
  export interface AxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<T>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T>;
    put<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T>;
    patch<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T>;
  }
}

export const axiosGet = (pathUrl: string): Promise<any> => {
  return axios.get(pathUrl, {
    headers: {
      Authorization: localStorage.getItem("FBIdToken"),
    },
  });
};

export const axiosPost = (pathUrl: string, obj: any): Promise<any> => {
  return axios.post(pathUrl, obj, {
    headers: {
      Authorization: localStorage.getItem("FBIdToken"),
    },
  });
};

export const axiosPut = (pathUrl: string, obj: any): Promise<any> => {
  return axios.put(pathUrl, obj, {
    headers: {
      Authorization: localStorage.getItem("FBIdToken"),
    },
  });
};

export const axiosDelete = (pathUrl: string): Promise<any> => {
  return axios.delete(pathUrl, {
    headers: {
      Authorization: localStorage.getItem("FBIdToken"),
    },
  });
};
export {};
