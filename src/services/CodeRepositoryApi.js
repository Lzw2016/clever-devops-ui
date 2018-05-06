import { stringify } from 'qs';
import request from '../utils/request';
import { ApiPathConfig } from "../utils/constant";

const { prefix, suffix } = ApiPathConfig;
// ================================================================================================= 代码仓库 API

// 新增代码仓库
export async function addCodeRepository(params) {
  return request(`${prefix}/code_repository${suffix}`, { method: 'POST', body: { ...params } });
}

// 查询代码仓库
export async function findCodeRepository(params) {
  return request(`${prefix}/code_repository${suffix}?${stringify(params)}`);
}

// 获取代码仓库
export async function getCodeRepositoryByName(projectName) {
  return request(`${prefix}/code_repository/${projectName}${suffix}`);
}

// 获取代码仓库
export async function getCodeRepositoryById(id) {
  return request(`${prefix}/code_repository/id/${id}${suffix}`);
}

// 更新代码仓库
export async function updateCodeRepository(id, params) {
  return request(`${prefix}/code_repository/${id}${suffix}`, { method: 'PUT', body: { ...params } });
}

// 删除代码仓库
export async function deleteRepository(projectName) {
  return request(`${prefix}/code_repository/${projectName}${suffix}`, { method: 'DELETE' });
}

// 测试连接Git仓库
export async function testConnect(params) {
  return request(`${prefix}/code_repository/test_connect${suffix}`, { method: 'POST', body: { ...params } });
}

// 获取所有的“branch或Tag”信息
export async function getGitBranch(params) {
  return request(`${prefix}/code_repository/git_branch${suffix}`, { method: 'POST', body: { ...params } });
}
