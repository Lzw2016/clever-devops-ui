import { message } from 'antd';
import { findCodeRepository, deleteRepository, testConnect } from '../services/CodeRepositoryApi';
import { ModelInitState } from '../utils/constant';

export default {
  namespace: 'CodeRepositoryModel',

  state: {
    pageLoading: false,
    queryParam: {
      ...ModelInitState.queryParam,
      projectName: undefined,
      language: undefined,
      repositoryUrl: undefined,
      repositoryType: undefined,
      authorizationType: undefined,
    },
    data: [],
    pagination: {
      ...ModelInitState.pagination,
    },
  },

  effects: {
    *findCodeRepository({ payload }, { select, call, put }) {
      let queryParam = yield select(state => state.CodeRepositoryModel.queryParam);
      let pagination = yield select(state => state.CodeRepositoryModel.pagination);
      queryParam = { ...queryParam, ...payload };
      // 请求数据
      const response = yield call(findCodeRepository, queryParam);
      if (!response) return;
      const { list, pageSize, pageNum, total } = response;
      // 保存数据
      pagination = { ...pagination, current: pageNum, pageSize, total };
      yield put({ type: 'save', payload: { data: list, queryParam, pagination } });
    },
    *deleteRepository({ payload }, { call, put }) {
      // 删除数据
      const response = yield call(deleteRepository, payload.projectName);
      if (response) {
        message.success(`删除成功 -> [${payload.projectName}]`);
        // 重新加载数据
        yield put({ type: 'findCodeRepository' });
      }
    },
    *testConnect({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { pageLoading: true } });
      const params = { authorizationInfo: payload.authorizationInfo, authorizationType: payload.authorizationType, repositoryUrl: payload.repositoryUrl };
      const response = yield call(testConnect, params);
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (response) {
        message.success(`连接[ ${params.repositoryUrl} ]成功`);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
