import React from 'react';
import fetch from 'dva/fetch';
import { notification } from 'antd';
import lodash from 'lodash';
// import { routerRedux } from 'dva/router';
import store from '../index';
import { CodeMessage } from './constant';

async function checkStatus(response) {
  // 成功，直接返回response
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  // 失败，读取异常消息message
  let errortext;
  let json;
  try {
    json = await response.json();
    if (json && json.message) {
      errortext = json.message;
    }
  } catch (err) {
    errortext = undefined;
  }
  if (!errortext) {
    errortext = CodeMessage[response.status] || response.statusText;
  }
  // 处理错误 - 显示
  if (response.status === 400 && json && json.validMessageList && json.validMessageList instanceof Array) {
    const validMessageList = [];
    lodash.forEach(json.validMessageList, (item, index) => {
      validMessageList.push({ index, lable: `${item.errorMessage}(${item.filed}=${item.value})` });
    })
    notification.error({
      message: `请求参数验证失败 ${response.status}`,
      description: (
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          {validMessageList.map(item => (<li key={item.index}>{item.lable}</li>))}
        </ol>
      ),
    });
  } else {
    notification.error({ message: `请求错误 ${response.status}`, description: errortext });
  }
  // 返回错误
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
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      }
      const text = response.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        // console.log("响应数据Json解析失败", err);
        return text;
      }
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      const { hash } = window.location;
      if (status === 401 && !lodash.startsWith(hash, "#/user/login?redirect=")) {
        dispatch({ type: 'login/logout' });
        // return;
      }
      // if (status === 403) {
      //   dispatch(routerRedux.push('/exception/403'));
      //   return;
      // }
      // if (status <= 504 && status >= 500) {
      //   dispatch(routerRedux.push('/exception/500'));
      //   return;
      // }
      // if (status >= 404 && status < 422) {
      //   dispatch(routerRedux.push('/exception/404'));
      // }
    });
}
