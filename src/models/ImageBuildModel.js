// import { message } from 'antd';
import { getCodeRepositoryById } from '../services/CodeRepositoryApi';
import { getImageConfig } from '../services/ImageConfigApi';

export default {
  namespace: 'ImageBuildModel',

  state: {
    serverUrl: undefined,
    build: {
      repositoryId: undefined,
      projectName: undefined,
      language: undefined,
      repositoryUrl: undefined,
      repositoryType: undefined,
      branch: undefined,
      commitId: undefined,
      buildCmd: undefined,
      serverUrl: undefined,
      buildState: undefined,
      buildStartTime: undefined,
      buildEndTime: undefined,
      imageId: undefined,
      buildLogs: undefined,
    },
  },

  effects: {
    *getPageData(_, { select, call, put }) {
      const { serverUrl } = yield select(state => state.ImageBuildModel);
      // 请求数据
      let build = {};
      const imageConfig = yield call(getImageConfig, serverUrl);
      if (!imageConfig) return;
      const codeRepository = yield call(getCodeRepositoryById, imageConfig.repositoryId);
      if (!codeRepository) return;
      build = { ...imageConfig, ...codeRepository, repositoryId: codeRepository.id };
      // 保存数据
      yield put({ type: 'save', payload: { build } });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
