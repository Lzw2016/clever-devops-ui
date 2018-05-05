import { queryCurrent } from '../services/api';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({ type: 'saveCurrentUser', payload: response });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload };
    },
    changeNotifyCount(state, action) {
      return { ...state, currentUser: { ...state.currentUser, notifyCount: action.payload } };
    },
  },
};
