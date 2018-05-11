import { message } from 'antd';
import { getGitBranch, findCodeRepository } from '../services/CodeRepositoryApi';
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
    editImageConfigShow: false,
    editImageConfigData: undefined,
    editAllGitBranch: [],
    addImageConfigShow: false,
    addImageConfigData: {},
    addAllGitBranch: [],
    repositoryQueryParam: {
      pageNo: 1,
      pageSize: 15,
      projectName: undefined,
    },
    repositoryData: [],
    selectRepository: undefined,
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
    *updateImageConfig({ payload }, { call, put }) {
      const editImageConfigData = { ...payload };
      yield put({ type: 'save', payload: { editImageConfigData } });
      // 请求数据
      const response = yield call(updateImageConfig, editImageConfigData.id, editImageConfigData);
      if (response) {
        yield put({ type: 'save', payload: { editImageConfigData: null, editImageConfigShow: false } });
        message.success(`更新成功 -> [${editImageConfigData.serverUrl}]`)
        // 重新加载数据
        yield put({ type: 'findImageConfig' });
      }
    },
    *getEditAllGitBranch({ payload }, { call, put }) {
      // 清空数据
      yield put({ type: 'save', payload: { editAllGitBranch: [] } });
      // 请求数据
      const allGitBranch = yield call(getGitBranch, payload);
      if (!allGitBranch) return;
      yield put({ type: 'save', payload: { editAllGitBranch: allGitBranch } });
    },
    *getAddAllGitBranch({ payload }, { call, put }) {
      // 清空数据
      yield put({ type: 'save', payload: { addAllGitBranch: [] } });
      // 请求数据
      const allGitBranch = yield call(getGitBranch, payload);
      if (!allGitBranch) return;
      yield put({ type: 'save', payload: { addAllGitBranch: allGitBranch } });
    },
    *findCodeRepository({ payload }, { select, call, put }) {
      let repositoryQueryParam = yield select(state => state.ImageConfigModel.repositoryQueryParam);
      repositoryQueryParam = { ...repositoryQueryParam, ...payload };
      // 清空数据
      yield put({ type: 'save', payload: { repositoryData: [], selectRepository: undefined } });
      // 请求数据
      const response = yield call(findCodeRepository, repositoryQueryParam);
      if (!response) return;
      const { list } = response;
      // 保存数据
      yield put({ type: 'save', payload: { repositoryData: list, repositoryQueryParam } });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
