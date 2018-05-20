import { message } from 'antd';
import { listImage, remove } from '../services/DockerImageApi';
// import { ModelInitState } from '../utils/constant';

export default {
  namespace: 'ImageListModel',

  state: {
    pageLoading: false,
    queryParam: {
      // ...ModelInitState.queryParam,
      allImages: true,
      withLabels: [],
      danglingImages: undefined,
      digests: undefined,
      name: undefined,
    },
    queryParamProxy: {
      allImages: 'false',
      DevopsFlag: undefined,
      Language: undefined,
      ProjectName: undefined,
      RepositoryType: undefined,
      ServerUrl: undefined,
    },
    data: [],
  },

  effects: {
    *findImage({ payload }, { select, call, put }) {
      let queryParamProxy = yield select(state => state.ImageListModel.queryParamProxy);
      queryParamProxy = { ...queryParamProxy, ...payload };
      const queryParam = { allImages: true, withLabels: [] };
      if (queryParamProxy.allImages === 'true') {
        queryParam.allImages = true;
      } else {
        queryParam.allImages = false;
      }
      if (queryParamProxy.DevopsFlag === 'true') {
        queryParam.withLabels.push('DevopsFlag=true');
      }
      if (queryParamProxy.Language) {
        queryParam.withLabels.push(`Language=${queryParamProxy.Language}`);
      }
      if (queryParamProxy.ProjectName) {
        queryParam.withLabels.push(`ProjectName=${queryParamProxy.ProjectName}`);
      }
      if (queryParamProxy.RepositoryType) {
        queryParam.withLabels.push(`RepositoryType=${queryParamProxy.RepositoryType}`);
      }
      if (queryParamProxy.ServerUrl) {
        queryParam.withLabels.push(`ServerUrl=${queryParamProxy.ServerUrl}`);
      }
      // 请求数据
      const data = yield call(listImage, queryParam);
      if (!data) return;
      // 保存数据
      yield put({ type: 'save', payload: { data, queryParamProxy } });
    },
    *remove({ payload }, { call, put }) {
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(remove, payload.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`删除成功 -> [${payload.RepoTags[0]}]`);
        // 重新加载数据
        yield put({ type: 'findImage' });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
