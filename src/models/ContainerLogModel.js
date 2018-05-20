import { message } from 'antd';
import { inspect, start, stop, restart, kill, pause, unpause, remove } from '../services/DockerContainersApi';
// import { ModelInitState } from '../utils/constant';

export default {
  namespace: 'ContainerLogModel',

  state: {
    pageLoading: false,
    containerId: undefined,
    containerInfo: undefined,
  },

  effects: {
    *getPageData(_, { select, call, put }) {
      const containerId = yield select(state => state.ContainerLogModel.containerId);
      // 请求数据
      const containerInfo = yield call(inspect, containerId);
      if (!containerInfo) return;
      // 保存数据
      yield put({ type: 'save', payload: { containerInfo } });
    },
    *start(_, { select, call, put }) {
      const containerInfo = yield select(state => state.ContainerLogModel.containerInfo);
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(start, containerInfo.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`启动成功 -> [${containerInfo.Names}]`);
        // 重新加载数据
        yield put({ type: 'getPageData' });
      }
    },
    *stop(_, { select, call, put }) {
      const containerInfo = yield select(state => state.ContainerLogModel.containerInfo);
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(stop, containerInfo.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`停止成功 -> ${containerInfo.Name}`);
        // 重新加载数据
        yield put({ type: 'getPageData' });
      }
    },
    *restart(_, { select, call, put }) {
      const containerInfo = yield select(state => state.ContainerLogModel.containerInfo);
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(restart, containerInfo.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`重启成功 -> [${containerInfo.Names}]`);
        // 重新加载数据
        yield put({ type: 'getPageData' });
      }
    },
    *kill(_, { select, call, put }) {
      const containerInfo = yield select(state => state.ContainerLogModel.containerInfo);
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(kill, containerInfo.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`停止成功 -> [${containerInfo.Names}]`);
        // 重新加载数据
        yield put({ type: 'getPageData' });
      }
    },
    *pause(_, { select, call, put }) {
      const containerInfo = yield select(state => state.ContainerLogModel.containerInfo);
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(pause, containerInfo.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`暂停成功 -> [${containerInfo.Names}]`);
        // 重新加载数据
        yield put({ type: 'getPageData' });
      }
    },
    *unpause(_, { select, call, put }) {
      const containerInfo = yield select(state => state.ContainerLogModel.containerInfo);
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(unpause, containerInfo.Id);
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`启动成功 -> [${containerInfo.Names}]`);
        // 重新加载数据
        yield put({ type: 'getPageData' });
      }
    },
    *remove(_, { select, call, put }) {
      const containerInfo = yield select(state => state.ContainerLogModel.containerInfo);
      // 加载中
      yield put({ type: 'save', payload: { pageLoading: true } });
      // 请求数据
      const data = yield call(remove, containerInfo.Id, { forceKill: undefined, removeVolumes: undefined });
      // 停止加载
      yield put({ type: 'save', payload: { pageLoading: false } });
      if (data) {
        message.success(`删除成功 -> [${containerInfo.Names}]`);
        // 重新加载数据
        yield put({ type: 'getPageData' });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
