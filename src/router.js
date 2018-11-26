import React from 'react';
import lodash from 'lodash';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import { IntlProvider, addLocaleData } from 'react-intl';
import moment from 'moment';
import 'moment/locale/zh-cn';
import antdEnUS from 'antd/lib/locale-provider/en_US';
import antdZhCN from 'antd/lib/locale-provider/zh_CN';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import enUSMessages from '../locales/en.json';
import zhCNMessages from '../locales/zh.json';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import { getQueryPath } from './utils/utils';
import { SystemInfo, LocaleLanguage } from './utils/constant';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

// 国际化支持
function getLocale() {
  // 读取系统语言
  let locale = (navigator.language || navigator.userLanguage).substr(0, 2);
  if (window.localStorage && localStorage.getItem(SystemInfo.languageConfigName)) {
    locale = localStorage.getItem(SystemInfo.languageConfigName);
  }
  // 设置默认语言
  if (lodash.values(LocaleLanguage).findIndex(item => item.locale === locale) === -1) {
    locale = LocaleLanguage.zh_CN.locale;
  }
  // 设置语言配置
  let [intlLocale, intlMessages, antdLocale] = [locale, undefined, undefined];
  switch (locale) {
    case LocaleLanguage.en_US.locale:
      addLocaleData(en);
      intlMessages = enUSMessages;
      antdLocale = antdEnUS;
      moment.locale('en-us');
      break;
    case LocaleLanguage.zh_CN.locale:
      addLocaleData(zh);
      intlMessages = zhCNMessages;
      antdLocale = antdZhCN;
      moment.locale('zh-cn');
      break;
    default:
      [intlLocale, intlMessages, antdLocale] = [locale, undefined, undefined];
  }
  return { intlLocale, intlMessages, antdLocale };
}

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  // 读取语言信息
  const { intlLocale, intlMessages, antdLocale } = getLocale();
  SystemInfo.currentLocale = intlLocale;
  return (
    <IntlProvider locale={intlLocale} messages={intlMessages}>
      <LocaleProvider locale={antdLocale}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/user" component={UserLayout} />
            <AuthorizedRoute
              path="/"
              render={props => <BasicLayout {...props} />}
              // authority={['admin', 'user']}
              authority={[]}
              redirectPath={getQueryPath('/user/login', {
                redirect: window.location.href,
              })}
            />
          </Switch>
        </ConnectedRouter>
      </LocaleProvider>
    </IntlProvider>
  );
}

export default RouterConfig;
