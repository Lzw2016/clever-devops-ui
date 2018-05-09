import { message } from 'antd';
import { findImageConfig, addImageConfig, updateImageConfig, deleteImageConfig } from '../services/ImageConfigApi';
import { ModelInitState } from '../utils/constant';

export default {
  namespace: 'ImageConfigModel',

  state: {
    pageLoading: false,
    queryParam: {
      ...ModelInitState.queryParam,
      projectName: undefined,
      language: undefined,
      repositoryType: undefined,
      repositoryUrl: undefined,
      branch: undefined,
      commitId: undefined,
      buildType: undefined,
      buildCmd: undefined,
      serverUrl: undefined,
      serverPorts: undefined,
      buildState: undefined,
      authorizationType: undefined,
      repositoryId: undefined,
    },
    data: [],
    pagination: {
      ...ModelInitState.pagination,
    },
    // editCodeRepositoryShow: false,
    // editCodeRepositoryData: null,
    // addCodeRepositoryShow: false,
    // addCodeRepositoryData: null,
  },

  effects: {
    *findImageConfig({ payload }, { select, call, put }) {
      let queryParam = yield select(state => state.ImageConfigModel.queryParam);
      let pagination = yield select(state => state.ImageConfigModel.pagination);
      queryParam = { ...queryParam, ...payload };
      // 请求数据
      const response = yield call(findImageConfig, queryParam);
      if (!response) return;
      const { list, pageSize, pageNum, total } = response;
      // 保存数据
      pagination = { ...pagination, current: pageNum, pageSize, total };
      yield put({ type: 'save', payload: { data: list, queryParam, pagination } });
    },
    *deleteImageConfig({ payload }, { call, put }) {
      // 删除数据
      const response = yield call(deleteImageConfig, payload.id);
      if (response) {
        message.success(`删除成功 -> [${payload.serverUrl}]`);
        // 重新加载数据
        yield put({ type: 'findImageConfig' });
      }
    },
    *addImageConfig({ payload }, { select, call, put }) {
      let addCodeRepositoryData = yield select(state => state.ImageConfigModel.addCodeRepositoryData);
      addCodeRepositoryData = { ...addCodeRepositoryData, ...payload };
      yield put({ type: 'save', payload: { addCodeRepositoryData } });
      // 请求数据
      const response = yield call(addImageConfig, addCodeRepositoryData);
      if (response) {
        yield put({ type: 'save', payload: { addCodeRepositoryData: null, addCodeRepositoryShow: false } });
        message.success(`新增成功 -> [${addCodeRepositoryData.projectName}]`)
        // 重新加载数据
        yield put({ type: 'findImageConfig' });
      }
    },
    *updateImageConfig({ payload }, { select, call, put }) {
      let editCodeRepositoryData = yield select(state => state.ImageConfigModel.editCodeRepositoryData);
      editCodeRepositoryData = { ...editCodeRepositoryData, ...payload };
      yield put({ type: 'save', payload: { editCodeRepositoryData } });
      // 请求数据
      const response = yield call(updateImageConfig, editCodeRepositoryData.id, editCodeRepositoryData);
      if (response) {
        yield put({ type: 'save', payload: { editCodeRepositoryData: null, editCodeRepositoryShow: false } });
        message.success(`新增成功 -> [${editCodeRepositoryData.projectName}]`)
        // 重新加载数据
        yield put({ type: 'findImageConfig' });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
