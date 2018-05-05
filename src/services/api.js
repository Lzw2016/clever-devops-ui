// import request from '../utils/request';

export async function fakeAccountLogin() {
  return { status: "ok", type: "account", currentAuthority: "admin" };
}

export async function fakeRegister() {
  return { status: "ok", currentAuthority: "user" };
}

export async function queryCurrent() {
  return { name: "Serati Ma", avatar: "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png", userid: "00000001", notifyCount: 3 };
}

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
