import { stringify } from 'qs';
import request from '../utils/request';
import { ApiPathConfig } from "../utils/constant";

const { prefix, suffix } = ApiPathConfig;
// ================================================================================================= Docker镜像构建日志 API

// 查询Docker镜像构建日志
export async function findByPage(params) {
  return request(`${prefix}/image_build_log${suffix}?${stringify(params)}`);
}

// 查询Docker镜像构建日志
export async function getImageBuildLog(id) {
  return request(`${prefix}/image_build_log/${id}${suffix}`);
}
