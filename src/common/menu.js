import { isUrl } from '../utils/utils';
import { ExternalUrl } from '../utils/constant';

const menuData = [
  // {
  //   name: 'Dashboard',
  //   icon: 'dashboard',
  //   path: 'dashboard',
  //   // hideInBreadcrumb: true,
  //   // hideInMenu: true,
  // },
  {
    name: '服务代码仓库',
    icon: 'IconRepository',
    path: 'server/repository/:list',
  },
  {
    name: '服务配置',
    icon: 'fuwuqipeizhiwenjian',
    path: 'server/config/:list',
  },
  {
    name: '服务列表',
    icon: 'fuwuliebiao',
    path: 'server/list/:list',
  },
  {
    name: '转到Portainer',
    // icon: 'url',
    icon: 'tiaozhuan1',
    path: ExternalUrl.Portainer,
    target: '_blank',
  },
  {
    name: 'Docker管理',
    icon: 'docker',
    path: 'docker',
    children: [
      {
        name: '容器列表',
        icon: 'rongqifuwu',
        path: 'container/:list',
      },
      {
        name: '镜像列表',
        icon: 'jingxiang',
        path: 'image/:list',
      },
      {
        name: '网络管理',
        icon: 'wangluoguanli',
        path: 'network/:list',
      },
      {
        name: '卷管理',
        icon: 'yingpan',
        path: 'volume/:list',
      },
      {
        name: '配置管理',
        icon: 'peizhiwenjian',
        path: 'config/:list',
      },
      {
        name: '密钥管理',
        icon: 'key-16',
        path: 'secret-key/:list',
      },
      {
        name: 'Docker事件',
        icon: 'incident',
        path: 'docker-event/:list',
      },
      {
        name: 'Swarm信息',
        icon: 'info',
        path: 'swarm-info/:list',
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
