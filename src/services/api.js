// import { stringify } from 'qs';
import request from '../utils/request';
// import { LoginEncrypt } from '../utils/crypto'

// 用户登录 type,
export async function accountLogin({ userName, password, autoLogin }) {
  // TODO 用户登录修改
  return { success: true, message: '...', timestamp: 1541944461942, "user": { username: 'lizw', telephone: '', email: '', userType: '', authorities: [], roleNames: [] } };
  // return request('/login.json', { method: 'POST', body: { loginType: "username", username: userName, password: LoginEncrypt(password), "remember-me": autoLogin } });
}

// 用户登出
export async function accountLogout() {
  return request('/logout.json', { method: 'POST' });
}

// 模拟查询当前用户信息
export async function queryCurrent() {
  return { username: 'lizw', telephone: '', email: '', userType: '', authorities: [], roleNames: [] };
  // return request('/login/user_info.json');
}

// 模拟查询通知消息
export async function queryNotices() {
  return [];
  // return [{
  //   id: "000000001",
  //   avatar: "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
  //   title: "你收到了 14 份新周报",
  //   datetime: "2017-08-09",
  //   type: "通知",
  // },
  // {
  //   id: "000000006",
  //   avatar: "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
  //   title: "曲丽丽 评论了你",
  //   description: "描述信息描述信息描述信息",
  //   datetime: "2017-08-07",
  //   type: "消息",
  // },
  // {
  //   id: "000000012",
  //   title: "ABCD 版本发布",
  //   description: "冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务",
  //   extra: "进行中",
  //   status: "processing",
  //   type: "待办",
  // }];
}

// 模拟注册
export async function fakeRegister() {
  return { status: 'ok', currentAuthority: 'user' };
}
