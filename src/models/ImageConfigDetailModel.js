// import { message } from 'antd';
import { getCodeRepositoryById } from '../services/CodeRepositoryApi';
import { getImageConfig } from '../services/ImageConfigApi';
import { findImageBuildLog } from '../services/ImageBuildLogApi';
import { listImage } from '../services/DockerImageApi';
import { ModelInitState } from '../utils/constant';

export default {
  namespace: 'ImageConfigDetailModel',

  state: {
    pageLoading: false,
    serverUrl: undefined,
    imageConfig: undefined,
    codeRepository: undefined,
    imageData: [],
    queryBuildLogParam: {
      ...ModelInitState.queryParam,
      repositoryId: undefined,
      imageConfigId: undefined,
      projectName: undefined,
      repositoryUrl: undefined,
      commitId: undefined,
      branch: undefined,
      serverPorts: undefined,
      serverUrl: undefined,
      buildState: undefined,
      imageId: undefined,
      imageName: undefined,
      buildStartTimeStart: undefined,
      buildStartTimeEnd: undefined,
    },
    buildLogData: [],
    buildLogPagination: {
      ...ModelInitState.pagination,
    },
  },

  effects: {
    *getPageData(_, { select, call, put }) {
      const serverUrl = yield select(state => state.ImageConfigDetailModel.serverUrl);
      // 请求数据
      const imageConfig = yield call(getImageConfig, serverUrl);
      if (!imageConfig) return;
      const codeRepository = yield call(getCodeRepositoryById, imageConfig.repositoryId);
      if (!codeRepository) return;
      // 查询 imageData
      yield put({ type: 'findImageData', payload: { allImages: true, withLabels: `ImageConfigId=${imageConfig.id}` } });
      // 查询 buildLogData
      yield put({ type: 'findImageBuildLog', payload: { repositoryId: codeRepository.id, imageConfigId: imageConfig.id } });
      // 保存数据
      yield put({ type: 'save', payload: { imageConfig, codeRepository } });
    },
    *findImageData({ payload }, { call, put }) {
      // 请求数据
      const imageData = yield call(listImage, payload);
      if (!imageData) return;
      // 保存数据
      yield put({ type: 'save', payload: { imageData } });
    },
    *findImageBuildLog({ payload }, { select, call, put }) {
      let { queryBuildLogParam, buildLogPagination } = yield select(state => state.ImageConfigDetailModel);
      queryBuildLogParam = { ...queryBuildLogParam, ...payload };
      // 请求数据
      const response = yield call(findImageBuildLog, queryBuildLogParam);
      if (!response) return;
      const { list, pageSize, pageNum, total } = response;
      // 保存数据
      buildLogPagination = { ...buildLogPagination, current: pageNum, pageSize, total };
      yield put({ type: 'save', payload: { buildLogData: list, queryBuildLogParam, buildLogPagination } });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
