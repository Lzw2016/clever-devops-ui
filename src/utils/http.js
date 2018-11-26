import axios from 'axios';
// import qs from 'qs';
import { notification } from 'antd';
import { CodeMessage } from './constant';

// 全局请求配置
axios.interceptors.request.use(
  config => {
    const baseURL = '/';
    const timeout = 30000;
    const validateStatus = status => {
      return status >= 200 && status < 300;
    };
    return { ...config, baseURL, timeout, validateStatus };
  },
  error => {
    notification.error({
      message: '请求发送失败',
      description: '发送请求给服务端失败，请检查电脑网络，再重试',
    });
    return Promise.reject(error);
  }
);

// 请求异常通知
const errorNotice = error => {
  const { response } = error;
  if (error && response) {
    const { data } = response;
    if (data && data.message) {
      if (data.validMessageList) {
        // TODO 解析校验错误
        data.message = '请求参数校验失败';
      }
      notification.error({ message: `${data.error} -> ${data.path}`, description: data.message });
      return true;
    }
    const errortext = CodeMessage[response.status] || response.statusText;
    notification.error({
      message: `请求错误,响应状态码:${response.status}`,
      description: errortext,
    });
  } else {
    notification.error({ message: '请求服务端异常', description: '服务器异常' });
  }
  return false;
};

//  全局拦截配置
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // resolve 通过， reject 驳回
    if (errorNotice(error)) {
      return Promise.reject(error.response);
    } else {
      return Promise.reject(error);
    }
  }
);

// 处理响应数据
const transformResponse = response => {
  if (response.data) {
    return response.data;
  }
  return null;
};

export default {
  request(config) {
    return axios.request(config).then(response => transformResponse(response));
  },
  get(url, config) {
    return axios.get(url, config).then(response => transformResponse(response));
  },
  delete(url, config) {
    return axios.delete(url, config).then(response => transformResponse(response));
  },
  head(url, config) {
    return axios.head(url, config).then(response => transformResponse(response));
  },
  options(url, config) {
    return axios.options(url, config).then(response => transformResponse(response));
  },
  post(url, data, config) {
    return axios.post(url, data, config).then(response => transformResponse(response));
  },
  put(url, data, config) {
    return axios.put(url, data, config).then(response => transformResponse(response));
  },
  patch(url, data, config) {
    return axios.patch(url, data, config).then(response => transformResponse(response));
  },
};
