import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    // hideInBreadcrumb: true,
    // hideInMenu: true,
  },
  {
    name: '服务管理',
    icon: 'fuwu-guanli',
    path: 'server',
    children: [
      {
        name: '服务代码仓库',
        icon: 'IconRepository',
        path: 'repository',
      },
      {
        name: '服务配置',
        icon: 'fuwuqipeizhiwenjian',
        path: 'config',
      },
      {
        name: '服务列表',
        icon: 'fuwuliebiao',
        path: 'list',
      },
    ],
  },
  {
    name: 'Docker管理',
    icon: 'docker',
    path: 'docker',
    children: [
      {
        name: '容器列表',
        icon: 'rongqifuwu',
        path: 'container',
      },
      {
        name: '镜像列表',
        icon: 'jingxiang',
        path: 'image',
      },
      {
        name: '网络管理',
        icon: 'wangluoguanli',
        path: 'network',
      },
      {
        name: '卷管理',
        icon: 'yingpan',
        path: 'volume',
      },
      {
        name: '配置管理',
        icon: 'peizhiwenjian',
        path: 'config',
      },
      {
        name: '密钥管理',
        icon: 'key-16',
        path: 'secret-key',
      },
      {
        name: 'Docker事件',
        icon: 'incident',
        path: 'event',
      },
      {
        name: 'Swarm信息',
        icon: 'info',
        path: 'info',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);