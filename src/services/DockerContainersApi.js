import { stringify } from 'qs';
import request from '../utils/request';
import { ApiPathConfig } from "../utils/constant";

const { prefix, suffix } = ApiPathConfig;
// ================================================================================================= Docker Containers操作 API

// 查询Docker Containers
export async function listContainers(params) {
  return request(`${prefix}/docker/container${suffix}?${stringify(params, { indices: false })}`);
}

// 检查Docker Containers
export async function inspect(id) {
  return request(`${prefix}/docker/container/${id}${suffix}`);
}

// 查看Docker Containers内运行的进程列表
export async function containerProcesses(id, psArgs = '') {
  return request(`${prefix}/docker/container/${id}/top${suffix}?psArgs=${psArgs}`);
}

// 启动Docker Containers
export async function start(id) {
  return request(`${prefix}/docker/container/${id}/start${suffix}`);
}

// 停止Docker Containers
export async function stop(id, secondsToWaitBeforeKilling = '0') {
  return request(`${prefix}/docker/container/${id}/stop${suffix}?secondsToWaitBeforeKilling=${secondsToWaitBeforeKilling}`);
}

// 重新启动Docker Containers
export async function restart(id, secondsToWaitBeforeRestart = '0') {
  return request(`${prefix}/docker/container/${id}/restart${suffix}?secondsToWaitBeforeRestart=${secondsToWaitBeforeRestart}`);
}

// 杀死Docker Containers
export async function kill(id) {
  return request(`${prefix}/docker/container/${id}/kill${suffix}`);
}

// 暂停Docker Containers
export async function pause(id) {
  return request(`${prefix}/docker/container/${id}/pause${suffix}`);
}

// 恢复Docker Containers(取消暂停)
export async function unpause(id) {
  return request(`${prefix}/docker/container/${id}/unpause${suffix}`);
}

// 重命名Docker Containers
export async function rename(id, newName) {
  return request(`${prefix}/docker/container/${id}/rename${suffix}?newName=${newName}`);
}

// 删除Docker Containers
export async function remove(id, params) {
  return request(`${prefix}/docker/container/${id}/remove${suffix}?${stringify(params)}`);
}

// 读取Docker Containers的日志
export async function logs(id, params) {
  return request(`${prefix}/docker/container/logs/${id}${suffix}?${stringify(params)}`);
}

// 读取Docker 监控数据
export async function stats(id) {
  return request(`${prefix}/docker/container/stats/${id}${suffix}`);
}
