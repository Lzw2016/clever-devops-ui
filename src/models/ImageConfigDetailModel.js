// import { message } from 'antd';
import { getCodeRepositoryById } from '../services/CodeRepositoryApi';
import { getImageConfig } from '../services/ImageConfigApi';

export default {
  namespace: 'ImageConfigDetailModel',

  state: {
    pageLoading: false,
    serverUrl: undefined,
    imageConfig: undefined,
    codeRepository: undefined,
  },

  effects: {
    *getPageData(_, { select, call, put }) {
      const serverUrl = yield select(state => state.ImageConfigDetailModel.serverUrl);
      // 请求数据
      const imageConfig = yield call(getImageConfig, serverUrl);
      if (!imageConfig) return;
      const codeRepository = yield call(getCodeRepositoryById, imageConfig.repositoryId);
      if (!codeRepository) return;
      // 保存数据
      yield put({ type: 'save', payload: { imageConfig, codeRepository } });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
