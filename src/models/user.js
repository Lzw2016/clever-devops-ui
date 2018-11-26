import { queryCurrent } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetchCurrent({ successCallBack }, { call, put }) {
      const response = yield call(queryCurrent);
      // response --> { username, telephone, email , userType, authorities, roleNames }
      if (!response) return;
      const { username } = response;
      yield put({
        type: 'saveCurrentUser',
        payload: { ...response, name: username, userid: username, notifyCount: 0, avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png' },
      });
      setAuthority(response.authorities);
      reloadAuthorized();
      if (successCallBack instanceof Function) {
        successCallBack(response);
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, list: action.payload };
    },
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
    changeNotifyCount(state, action) {
      return { ...state, currentUser: { ...state.currentUser, notifyCount: action.payload } };
    },
  },
};
