import { stringify } from 'qs';
import request from '../utils/request';
import { ApiPathConfig } from "../utils/constant";

const { prefix, suffix } = ApiPathConfig;
// ================================================================================================= Docker镜像配置 API

// 新增Docker镜像配置
export async function addImageConfig(params) {
  return request(`${prefix}/image_config${suffix}`, { method: 'POST', body: { ...params } });
}

// 查询Docker镜像配置
export async function findImageConfig(params) {
  return request(`${prefix}/image_config${suffix}?${stringify(params)}`);
}

// 获取Docker镜像配置
export async function getImageConfig(serverUrl) {
  return request(`${prefix}/image_config/${serverUrl}${suffix}`);
}

// 更新Docker镜像配置
export async function updateImageConfig(id, params) {
  return request(`${prefix}/image_config/${id}${suffix}`, { method: 'PUT', body: { ...params } });
}

// 删除Docker镜像配置
export async function deleteImageConfig(id) {
  return request(`${prefix}/image_config/${id}${suffix}`, { method: 'DELETE' });
}

// 根据ImageConfig生成的镜像新增Docker容器
export async function createContainer(id) {
  return request(`${prefix}/image_config/container/${id}${suffix}`, { method: 'POST' });
}
