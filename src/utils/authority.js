import { SystemInfo } from './constant';

// use localStorage to store the authority info, which might be sent from server in actual project.
// 读取用户所有权限
export function getAuthority() {
  // console.log("### getAuthority", localStorage.getItem(SystemInfo.localStorageAuthorityKey))
  const authority = localStorage.getItem(SystemInfo.localStorageAuthorityKey);
  // console.log("### authority -> ", authority)
  return authority ? JSON.parse(authority) : [];
}

// 保存用户所有权限
export function setAuthority(authority) {
  // console.log("### setAuthority", authority)
  return localStorage.setItem(SystemInfo.localStorageAuthorityKey, authority ? JSON.stringify(authority) : JSON.stringify([]));
}
