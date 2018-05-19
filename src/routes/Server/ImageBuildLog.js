import React, { PureComponent } from 'react';
import { parse } from 'qs';
import lodash from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Card } from 'antd';
import { Link } from 'dva/router';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { TerminalInit } from '../../utils/constant';
import { LanguageMapper, RepositoryTypeMapper, BuildStateMapper } from '../../utils/enum';
// import classNames from 'classnames';
import styles from './ImageBuildLog.less'
import xtermStyles from '../Common/xterm.less'

@connect(({ ImageBuildLogModel, loading }) => ({
  ImageBuildLogModel,
  getPageDataLoading: loading.effects['ImageBuildLogModel/getPageData'],
}))
export default class ImageBuildLog extends PureComponent {

  state = {
    showBuildLogTerminalId: 'showBuildLogTerminalId',
  };

  // 数据初始化
  componentDidMount() {
    const { dispatch, match: { params }, location: { search } } = this.props;
    const { logId } = parse(search.substring(1));
    dispatch({ type: 'ImageBuildLogModel/save', payload: { serverUrl: params.serverUrl, logId } });
    dispatch({ type: 'ImageBuildLogModel/getPageData' });
  }

  componentDidUpdate() {
    const { ImageBuildLogModel: { buildLog }, getPageDataLoading } = this.props;
    if (getPageDataLoading || !buildLog) return;
    lodash.delay(() => {
      this.initBuildLogTerminal();
      this.setLogText(buildLog.buildLogs);
    }, 100);
  }

  componentWillUnmount() {
    if (this.showBuildLogTerminal) {
      this.showBuildLogTerminal.destroy();
    }
  }

  // 初始化查看日志 xterm
  initBuildLogTerminal = () => {
    if (this.showBuildLogTerminal) return;
    const { showBuildLogTerminalId } = this.state;
    Terminal.applyAddon(fit);
    const xterm = new Terminal({ ...TerminalInit });
    xterm.open(document.getElementById(showBuildLogTerminalId));
    xterm.fit();
    this.showBuildLogTerminal = xterm;
  }

  setLogText = (logText) => {
    if (this.showBuildLogTerminal) {
      this.showBuildLogTerminal.clear();
      this.showBuildLogTerminal.write(logText);
      this.showBuildLogTerminal.fit();
    }
  }

  render() {
    const { ImageBuildLogModel: { buildLog }, getPageDataLoading } = this.props;
    const { showBuildLogTerminalId } = this.state;
    if (getPageDataLoading || !buildLog) return <Card loading={true} />;
    let language = LanguageMapper[buildLog.language];
    if (!language) language = LanguageMapper.error;
    let repositoryType = RepositoryTypeMapper[buildLog.repositoryType];
    if (!repositoryType) repositoryType = RepositoryTypeMapper.error;
    let buildState = BuildStateMapper[buildLog.buildState];
    if (!buildState) buildState = BuildStateMapper.error;
    return (
      <PageHeaderLayout>
        <Card bordered={false} loading={getPageDataLoading}>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td className={styles.tableLabel}>项目名称</td>
                <td className={styles.tableValue}>
                  <Link to={`/server/repository/detail/${buildLog.repositoryId}`}>{buildLog.projectName}</Link>
                </td>
                <td className={styles.tableLabel}>项目语言</td>
                <td className={styles.tableValue}>{language.label}</td>
              </tr>
              <tr>
                <td className={styles.tableLabel}>仓库地址</td>
                <td className={styles.tableValue}>
                  <a target="_blank" href={buildLog.repositoryUrl}>{buildLog.repositoryUrl}</a>
                </td>
                <td className={styles.tableLabel}>仓库类型</td>
                <td className={styles.tableValue}>{repositoryType.label}</td>
              </tr>
              <tr>
                <td className={styles.tableLabel}>Branch或Tag</td>
                <td className={styles.tableValue}>{buildLog.branch} ({buildLog.commitId})</td>
                <td className={styles.tableLabel}>编译脚本</td>
                <td className={styles.tableValue}>{buildLog.buildCmd}</td>
              </tr>
              <tr>
                <td className={styles.tableLabel}>服务域名</td>
                <td className={styles.tableValue}>
                  <a target="_blank" href={`http://${buildLog.serverUrl}`}>{buildLog.serverUrl}</a>
                </td>
                <td className={styles.tableLabel}>构建状态</td>
                <td className={styles.tableValue}><span style={{ color: buildState.color }}>{buildState.label}</span></td>
              </tr>
              <tr>
                <td className={styles.tableLabel}>构建时间</td>
                <td className={styles.tableValue}>
                  {`${buildLog.buildStartTime} -- ${buildLog.buildEndTime}`}
                  <span className={styles.spanWidth15} />
                  {(buildLog.buildStartTime && buildLog.buildEndTime) ? `(耗时: ${moment(buildLog.buildEndTime).diff(moment(buildLog.buildStartTime)) / 1000}秒)` : ''}
                </td>
                <td className={styles.tableLabel}>Docker镜像ID</td>
                <td className={styles.tableValue}>{buildLog.imageId}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ height: 20 }} />
          <div className={xtermStyles.terminal} id={showBuildLogTerminalId} style={{ height: 1000 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
