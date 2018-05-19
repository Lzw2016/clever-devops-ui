import { message } from 'antd';
import { listContainers, start, stop, restart, kill, pause, unpause, remove } from '../services/DockerContainersApi';
// import { ModelInitState } from '../utils/constant';

export default {
  namespace: 'ContainerListModel',

  state: {
    pageLoading: false,
    queryParam: {
      // ...ModelInitState.queryParam,
      limit: undefined,
      withSizes: true,
      allContainers: true,
      withLabels: [],
      withStatusCreated: undefined,
      withStatusExited: undefined,
      withStatusPaused: undefined,
      withStatusRestarting: undefined,
      withStatusRunning: undefined,
    },
    queryParamProxy: {
      withStatus: undefined,
      DevopsFlag: undefined,
      Language: undefined,
      ProjectName: undefined,
      RepositoryType: undefined,
      ServerUrl: undefined,
    },
    data: [],
  },

  effects: {
    *findContainers({ payload }, { select, call, put }) {
      let queryParamProxy = yield select(state => state.ContainerListModel.queryParamProxy);
      queryParamProxy = { ...queryParamProxy, ...payload };
      const queryParam = { withSizes: true, allContainers: true, withLabels: [] };
      switch (queryParamProxy.withStatus) {
        case 'created':
          queryParam.withStatusCreated = true;
          break;
        case 'running':
          queryParam.withStatusRunning = true;
          break;
        case 'exited':
          queryParam.withStatusExited = true;
          break;
        case 'paused':
          queryParam.withStatusPaused = true;
          break;
        case 'restarting':
          queryParam.withStatusRestarting = true;
          break;
        default:
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
      const data = yield call(listContainers, queryParam);
      if (!data) return;
      // 保存数据
      yield put({ type: 'save', payload: { data, queryParamProxy } });
    },
    *start({ payload }, { call, put }) {
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(start, payload.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`启动成功 -> [${payload.Names[0]}]`);
        // 重新加载数据
        yield put({ type: 'findContainers' });
      }
    },
    *stop({ payload }, { call, put }) {
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(stop, payload.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`停止成功 -> [${payload.Names[0]}]`);
        // 重新加载数据
        yield put({ type: 'findContainers' });
      }
    },
    *restart({ payload }, { call, put }) {
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(restart, payload.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`重启成功 -> [${payload.Names[0]}]`);
        // 重新加载数据
        yield put({ type: 'findContainers' });
      }
    },
    *kill({ payload }, { call, put }) {
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(kill, payload.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`停止成功 -> [${payload.Names[0]}]`);
        // 重新加载数据
        yield put({ type: 'findContainers' });
      }
    },
    *pause({ payload }, { call, put }) {
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(pause, payload.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`暂停成功 -> [${payload.Names[0]}]`);
        // 重新加载数据
        yield put({ type: 'findContainers' });
      }
    },
    *unpause({ payload }, { call, put }) {
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(unpause, payload.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`启动成功 -> [${payload.Names[0]}]`);
        // 重新加载数据
        yield put({ type: 'findContainers' });
      }
    },
    *remove({ payload }, { call, put }) {
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(remove, payload.Id, { forceKill: undefined, removeVolumes: undefined });
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`删除成功 -> [${payload.Names[0]}]`);
        // 重新加载数据
        yield put({ type: 'findContainers' });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
