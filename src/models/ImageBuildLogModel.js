// import { message } from 'antd';
import { getCodeRepositoryById } from '../services/CodeRepositoryApi';
import { getImageConfig } from '../services/ImageConfigApi';

export default {
  namespace: 'ImageBuildLogModel',

  state: {
    serverUrl: undefined,
    logId: undefined,
    buildLog: {
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
      const { serverUrl, logId } = yield select(state => state.ImageBuildLogModel);
      // 请求数据
      let buildLog = {};
      if (logId === 'imageConfig') {
        const imageConfig = yield call(getImageConfig, serverUrl);
        if (!imageConfig) return;
        const codeRepository = yield call(getCodeRepositoryById, imageConfig.repositoryId);
        if (!codeRepository) return;
        buildLog = { ...imageConfig, ...codeRepository, repositoryId: codeRepository.id };
      }
      // 保存数据
      yield put({ type: 'save', payload: { buildLog } });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
