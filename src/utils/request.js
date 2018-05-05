import fetch from 'dva/fetch';
import { notification } from 'antd';
// import { routerRedux } from 'dva/router';
import store from '../index';
import { CodeMessage } from './constant';

async function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  let errortext;
  try {
    const json = await response.json();
    if (json && json.message) {
      errortext = json.message;
    }
  } catch (err) {
    errortext = undefined;
  }
  if (!errortext) {
    errortext = CodeMessage[response.status] || response.statusText;
  }
  notification.error({ message: `请求错误 ${response.status}`, description: errortext });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = { credentials: 'include' };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = { Accept: 'application/json', 'Content-Type': 'application/json; charset=utf-8', ...newOptions.headers };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = { Accept: 'application/json', ...newOptions.headers };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        dispatch({ type: 'login/logout' });
        return;
      }
      if (status === 403) {
        // dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        // dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        // dispatch(routerRedux.push('/exception/404'));
      }
    });
}
