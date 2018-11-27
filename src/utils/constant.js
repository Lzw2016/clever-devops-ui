// 全局常量
import React, { Fragment } from 'react';
import { Icon } from 'antd';

// 系统支持的语言
const LocaleLanguage = {
  zh_CN: { locale: 'zh-CN', language: '中文' },
  en_US: { locale: 'en-US', language: 'English' },
};

// 系统信息
const SystemInfo = {
  languageConfigName: 'Language',
  currentLocale: null,
  name: 'DevOps',
  description: 'DevOps - 微服务构建发布管理系统',
  copyright: (
    <Fragment>
      Copyright <Icon type="copyright" /> 2018 clever-devops版权所有
    </Fragment>
  ),
  copyrightLinks: [
    { key: 'help', title: '帮助', href: '', blankTarget: true },
    { key: 'privacy', title: '隐私', href: '', blankTarget: true },
    { key: 'terms', title: '条款', href: '', blankTarget: true },
  ],
  hiddenFooter: false,
  localStorageAuthorityKey: 'clever-devops',
};

// Layout 配置
const LayoutConfig = {
  // 左侧菜单栏宽度配置
  siderMenuWidth: 200,
};

// HTTP 状态码错误说明
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

// Model 初始化值配置
const ModelInitState = {
  // 请求 “分页参数” 和 “排序参数” 默认值配置
  queryParam: { pageSize: 10, pageNo: 1, orderField: undefined, sort: undefined },
  // 分页参数默认值配置
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
};

// 加密解密配置
const CryptoConfig = {
  ManageAES: {
    key: '636c657665722d73656375726974792d',
    iv: 'f0021ea5a06d5a7bade961afe47e9ad9',
  },
  LoginAES: {
    key: '636c657665722d736563757288888888',
    iv: '636c657665722d736563757266666666',
  },
};

const ApiPathConfig = {
  prefix: '/api/devops',
  suffix: '.json',
};

const TerminalInit = {
  cursorBlink: true,
  cursorStyle: 'block', // block underline bar
  enableBold: false,
  bellStyle: 'sound',
  fontFamily: '"DejaVu Sans Mono", "Everson Mono", FreeMono, Menlo, Terminal, monospace, Consolas',
  scrollback: 1000,
  tabStopWidth: 4,
}

const LocationParam = {
  host: window.location.host,         // localhost:8000
  hostname: window.location.hostname, // localhost
  origin: window.location.origin,     // http://localhost:8000
  port: window.location.port,         // 8000
  protocol: window.location.protocol, // http:
}

const WebSocketUrls = {
  buildImage: `ws://${LocationParam.host}/build_image`,
  serverLog: `ws://${LocationParam.host}/server_log`,
  serverStats: `ws://${LocationParam.host}/server_stats`,
};

const ExternalUrl = {
  Portainer: "http://39.108.68.132:9000/",
};

export {
  LocaleLanguage,
  SystemInfo,
  LayoutConfig,
  CodeMessage,
  ModelInitState,
  CryptoConfig,
  ApiPathConfig,
  TerminalInit,
  LocationParam,
  WebSocketUrls,
  ExternalUrl,
};
