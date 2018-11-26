import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { accountLogin, accountLogout } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    // ok:登录成功 error:登录失败
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      // response --> {success: true, message: '...',timestamp: 1541944461942, "user": { username, telephone, email , userType, authorities, roleNames }}
      if (!response) return;
      // { status: 'ok', type: 'account', currentAuthority: 'admin' } -- status: 'error'
      const loginStatus = { type: 'account' };
      loginStatus.status = response.success ? 'ok' : 'error';
      loginStatus.currentAuthority = response.user.authorities;
      yield put({ type: 'changeLoginStatus', payload: loginStatus });
      // Login successfully
      if (loginStatus.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    *logout(_, { put, call }) {
      yield call(accountLogout);
      yield put({ type: 'changeLoginStatus', payload: { status: false, currentAuthority: ['guest'] } });
      reloadAuthorized();
      yield put(routerRedux.push({ pathname: '/user/login', search: stringify({ redirect: window.location.href }) }));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
