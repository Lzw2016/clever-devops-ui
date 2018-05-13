import React, { PureComponent } from 'react';
// import { parse } from 'qs';
import lodash from 'lodash';
// import moment from 'moment';
import { connect } from 'dva';
import { Card } from 'antd';
import { Link } from 'dva/router';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { TerminalInit } from '../../utils/constant';
import { LanguageMapper, RepositoryTypeMapper, BuildStateMapper } from '../../utils/enum';
// import classNames from 'classnames';
import styles from './ImageBuild.less'
import xtermStyles from '../Common/xterm.less'

@connect(({ ImageBuildModel, loading }) => ({
  ImageBuildModel,
  getPageDataLoading: loading.effects['ImageBuildModel/getPageData'],
}))
export default class ImageBuild extends PureComponent {

  state = {
    showBuildTerminalId: 'showBuildTerminalId',
  };

  // 数据初始化
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({ type: 'ImageBuildModel/save', payload: { serverUrl: params.serverUrl } });
    dispatch({ type: 'ImageBuildModel/getPageData' });
  }

  componentDidUpdate() {
    const { ImageBuildModel: { build }, getPageDataLoading } = this.props;
    if (getPageDataLoading || !build) return;
    lodash.delay(() => this.initBuildTerminal(), 100);
  }

  componentWillUnmount() {
    if (this.showBuildLogTerminal) {
      this.showBuildLogTerminal.destroy();
    }
  }

  // 初始化查看日志 xterm
  initBuildTerminal = () => {
    if (this.showBuildTerminal) return;
    const { showBuildTerminalId } = this.state;
    Terminal.applyAddon(fit);
    const xterm = new Terminal({ ...TerminalInit });
    xterm.open(document.getElementById(showBuildTerminalId));
    xterm.fit();
    this.showBuildTerminal = xterm;
  }

  render() {
    const { ImageBuildModel: { build }, getPageDataLoading } = this.props;
    const { showBuildTerminalId } = this.state;
    if (getPageDataLoading || !build) return <Card loading={true} />;
    let language = LanguageMapper[build.language];
    if (!language) language = LanguageMapper.error;
    let repositoryType = RepositoryTypeMapper[build.repositoryType];
    if (!repositoryType) repositoryType = RepositoryTypeMapper.error;
    let buildState = BuildStateMapper[build.buildState];
    if (!buildState) buildState = BuildStateMapper.error;
    return (
      <PageHeaderLayout>
        <Card bordered={false} loading={getPageDataLoading}>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td className={styles.tableLabel}>项目名称</td>
                <td className={styles.tableValue}>
                  <Link to={`/server/repository/detail/${build.repositoryId}`}>{build.projectName}</Link>
                </td>
                <td className={styles.tableLabel}>项目语言</td>
                <td className={styles.tableValue}>{language.label}</td>
              </tr>
              <tr>
                <td className={styles.tableLabel}>仓库地址</td>
                <td className={styles.tableValue}>
                  <a target="_blank" href={build.repositoryUrl}>{build.repositoryUrl}</a>
                </td>
                <td className={styles.tableLabel}>仓库类型</td>
                <td className={styles.tableValue}>{repositoryType.label}</td>
              </tr>
              <tr>
                <td className={styles.tableLabel}>Branch或Tag</td>
                <td className={styles.tableValue}>{build.branch} ({build.commitId})</td>
                <td className={styles.tableLabel}>编译脚本</td>
                <td className={styles.tableValue}>{build.buildCmd}</td>
              </tr>
              <tr>
                <td className={styles.tableLabel}>服务域名</td>
                <td className={styles.tableValue}>
                  <a target="_blank" href={`http://${build.serverUrl}`}>{build.serverUrl}</a>
                </td>
                <td className={styles.tableLabel}>构建状态</td>
                <td className={styles.tableValue}><span style={{ color: buildState.color }}>{buildState.label}</span></td>
              </tr>
            </tbody>
          </table>
          <div style={{ height: 20 }} />
          <div className={xtermStyles.terminal} id={showBuildTerminalId} style={{ height: 600 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
