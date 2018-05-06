import { stringify } from 'qs';
import request from '../utils/request';
import { ApiPathConfig } from "../utils/constant";

const { prefix, suffix } = ApiPathConfig;
// ================================================================================================= Docker Containers操作 API

// 查询Docker Image
export async function listImage(params) {
  return request(`${prefix}/docker/image${suffix}?${stringify(params)}`);
}

// 检查Docker Image
export async function inspect(image) {
  return request(`${prefix}/docker/image/${image}${suffix}`);
}

// 查询Docker ImageHistory
export async function history(image) {
  return request(`${prefix}/docker/image/${image}/history${suffix}`);
}

// 删除Docker镜像
export async function remove(image) {
  return request(`${prefix}/docker/image/${image}${suffix}`, { method: 'DELETE' });
}
