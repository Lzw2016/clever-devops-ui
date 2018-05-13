// 系统常量

const SystemInfo = {
  name: 'DevOps',
  description: 'DevOps - 微服务构建发布管理系统',
};

const CodeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const ApiPathConfig = {
  prefix: '/api/devops',
  suffix: '.json',
};

const ModelInitState = {
  queryParam: { pageSize: 10, pageNo: 1 },
  pagination: {
    defaultCurrent: 1,
    defaultPageSize: 10,
    hideOnSinglePage: false,
    pageSizeOptions: ['10', '30', '50', '100'],
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `总记录数${total}条`,
    current: 1,
    pageSize: 10,
    total: 0,
  },
}

const TerminalInit = {
  cursorBlink: true,
  cursorStyle: 'block', // block underline bar
  enableBold: false,
  bellStyle: 'sound',
  fontFamily: '"DejaVu Sans Mono", "Everson Mono", FreeMono, Menlo, Terminal, monospace, Consolas',
  scrollback: 10000,
  tabStopWidth: 4,
}

const WebSocketUrls = {
  buildImage: 'ws://127.0.0.1:28080/build_image',
  serverLog: 'ws://127.0.0.1:28080/server_log',
};

export {
  SystemInfo,
  CodeMessage,
  ApiPathConfig,
  ModelInitState,
  TerminalInit,
  WebSocketUrls,
};
