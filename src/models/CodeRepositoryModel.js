import { message } from 'antd';
import { findCodeRepository, deleteRepository, testConnect, addCodeRepository, updateCodeRepository } from '../services/CodeRepositoryApi';
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
    editCodeRepositoryShow: false,
    editCodeRepositoryData: null,
    addCodeRepositoryShow: false,
    addCodeRepositoryData: null,
  },

  effects: {
    *findCodeRepository({ payload }, { select, call, put }) {
      let queryParam = yield select(state => state.CodeRepositoryModel.queryParam);
      let pagination = yield select(state => state.CodeRepositoryModel.pagination);
      queryParam = { ...queryParam, ...payload };
      // 请求数据
      const response = yield call(findCodeRepository, queryParam);
      if (!response) return;
      const { records, size, current, total } = response;
      // 保存数据
      pagination = { ...pagination, current, pageSize: size, total };
      yield put({ type: 'save', payload: { data: records, queryParam, pagination } });
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
    *addCodeRepository({ payload }, { select, call, put }) {
      let addCodeRepositoryData = yield select(state => state.CodeRepositoryModel.addCodeRepositoryData);
      addCodeRepositoryData = { ...addCodeRepositoryData, ...payload };
      yield put({ type: 'save', payload: { addCodeRepositoryData } });
      // 请求数据
      const response = yield call(addCodeRepository, addCodeRepositoryData);
      if (response) {
        yield put({ type: 'save', payload: { addCodeRepositoryData: null, addCodeRepositoryShow: false } });
        message.success(`新增成功 -> [${addCodeRepositoryData.projectName}]`)
        // 重新加载数据
        yield put({ type: 'findCodeRepository' });
      }
    },
    *updateCodeRepository({ payload }, { select, call, put }) {
      let editCodeRepositoryData = yield select(state => state.CodeRepositoryModel.editCodeRepositoryData);
      editCodeRepositoryData = { ...editCodeRepositoryData, ...payload };
      yield put({ type: 'save', payload: { editCodeRepositoryData } });
      // 请求数据
      const response = yield call(updateCodeRepository, editCodeRepositoryData.id, editCodeRepositoryData);
      if (response) {
        yield put({ type: 'save', payload: { editCodeRepositoryData: null, editCodeRepositoryShow: false } });
        message.success(`更新成功 -> [${editCodeRepositoryData.projectName}]`)
        // 重新加载数据
        yield put({ type: 'findCodeRepository' });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
