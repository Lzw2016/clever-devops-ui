import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    // '/dashboard': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Dashboard')),
    //   // hideInBreadcrumb: true,
    //   // name: '工作台',
    //   // authority: 'admin',
    // },
    '/server/repository/list': {
      component: dynamicWrapper(app, ['CodeRepositoryModel'], () => import('../routes/Server/CodeRepository')),
    },
    '/server/repository/:list': {
      component: dynamicWrapper(app, ['CodeRepositoryModel'], () => import('../routes/Server/CodeRepository')),
    },
    '/server/repository/detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Server/CodeRepositoryDetail')),
      name: '详情',
    },
    '/server/config/:list': {
      component: dynamicWrapper(app, ['ImageConfigModel'], () => import('../routes/Server/ImageConfig')),
    },
    '/server/config/detail/:serverUrl': {
      component: dynamicWrapper(app, ['ImageConfigDetailModel'], () => import('../routes/Server/ImageConfigDetail')),
      name: '详情',
    },
    '/server/config/build/:serverUrl': {
      component: dynamicWrapper(app, ['ImageBuildModel'], () => import('../routes/Server/ImageBuild')),
      name: '构建镜像',
    },
    '/server/config/build-log/:serverUrl': {
      component: dynamicWrapper(app, ['ImageBuildLogModel'], () => import('../routes/Server/ImageBuildLog')),
      name: '构建日志',
    },
    '/server/list/:list': {
      component: dynamicWrapper(app, [], () => import('../routes/Server/ServerList')),
    },
    '/server/list/detail/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Server/ServerListDetail')),
      name: '详情',
    },
    '/server/list/log/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/Server/ServerLog')),
      name: '服务日志',
    },
    '/docker/container/:list': {
      component: dynamicWrapper(app, ['ContainerListModel'], () => import('../routes/Docker/ContainerList')),
      name: '容器列表',
    },
    '/docker/container/log/:id': {
      component: dynamicWrapper(app, ['ContainerLogModel'], () => import('../routes/Docker/ContainerLog')),
      name: '容器日志',
    },
    '/docker/image/:list': {
      component: dynamicWrapper(app, ['ImageListModel'], () => import('../routes/Docker/ImageList')),
      name: '镜像列表',
    },
    '/docker/network/:list': {
      component: dynamicWrapper(app, [], () => import('../routes/Docker/NetworkList')),
      name: '网络管理',
    },
    '/docker/volume/:list': {
      component: dynamicWrapper(app, [], () => import('../routes/Docker/VolumeList')),
      name: '卷管理',
    },
    '/docker/config/:list': {
      component: dynamicWrapper(app, [], () => import('../routes/Docker/ConfigList')),
      name: '配置管理',
    },
    '/docker/secret-key/:list': {
      component: dynamicWrapper(app, [], () => import('../routes/Docker/SecretKeyList')),
      name: '密钥管理',
    },
    '/docker/docker-event/:list': {
      component: dynamicWrapper(app, [], () => import('../routes/Docker/DockerEventList')),
      name: 'Docker事件',
    },
    '/docker/swarm-info/:list': {
      component: dynamicWrapper(app, [], () => import('../routes/Docker/SwarmInfo')),
      name: 'Docker事件',
    },
    // 异常页面
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    // 用户相关 - 登录注册等
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
