import React, { PureComponent } from 'react';
// import { parse } from 'qs';
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
import styles from './ImageBuild.less'
import xtermStyles from '../Common/xterm.less'

@connect(({ ImageBuildModel, loading }) => ({
  ImageBuildModel,
  getPageDataLoading: loading.effects['ImageBuildModel/getPageData'],
}))
export default class ImageBuild extends PureComponent {

  state = {
    showBuildTerminalId: 'showBuildTerminalId',
    buildState: undefined,
    buildStartTime: undefined,
    buildTime: undefined,
    stopTimer: undefined,
  };

  // 数据初始化
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({ type: 'ImageBuildModel/save', payload: { serverUrl: params.serverUrl } });
    dispatch({ type: 'ImageBuildModel/getPageData' });
  }

  componentDidUpdate() {
    const { ImageBuildModel: { imageConfig, codeRepository }, getPageDataLoading } = this.props;
    if (getPageDataLoading || !imageConfig || !codeRepository) return;
    lodash.delay(() => this.initBuildTerminal(), 100);
  }

  componentWillUnmount() {
    if (this.showBuildLogTerminal) {
      this.showBuildLogTerminal.destroy();
    }
    const { stopTimer } = this.state;
    if (stopTimer) clearInterval(stopTimer);
  }

  // 初始化控制台 xterm
  initBuildTerminal = () => {
    if (this.buildTerminal) return;
    const { ImageBuildModel: { codeRepository } } = this.props;
    const { showBuildTerminalId } = this.state;
    Terminal.applyAddon(fit);
    const xterm = new Terminal({ ...TerminalInit });
    xterm.open(document.getElementById(showBuildTerminalId));
    xterm.write('--------------------------------------------------------------------');
    xterm.writeln('------------------------------------------------------------------');
    xterm.writeln(`# 当前构建项目 ${codeRepository.projectName}, 项目地址 ${codeRepository.repositoryUrl}`);
    xterm.write('--------------------------------------------------------------------');
    xterm.writeln('------------------------------------------------------------------');
    xterm.fit();
    this.buildTerminal = xterm;
  }

  buildImage = () => {
    const { buildTerminal, isBuilding } = this;
    const { ImageBuildModel: { imageConfig } } = this.props;
    // const { } = this.state;
    if (isBuilding) {
      return;
    }
    this.isBuilding = true;
    // 开始计时
    const stopTimer = setInterval(this.setBuildTime, 1000);
    this.setState({ stopTimer });
    const webSocket = new WebSocket('ws://127.0.0.1:28080/build_image');
    // 连接服务器
    webSocket.onopen = () => {
      buildTerminal.writeln('\r\n---> 连接服务器成功\r\n');
      webSocket.send(JSON.stringify({ imageConfigId: imageConfig.id, startContainer: false }));
    };
    // 消息处理
    webSocket.onmessage = (evt) => {
      const { buildState, complete, logText, startTime } = JSON.parse(evt.data);
      buildTerminal.write(logText);
      if (complete) {
        webSocket.close();
      }
      this.setState({ buildState, buildStartTime: new Date(startTime) });
    };
    // 连接关闭
    webSocket.onclose = (evt) => {
      buildTerminal.writeln(`\r\n---> 断开连接 [${JSON.stringify(evt)}]\r\n`);
      this.isBuilding = false;
    };
    // 连接错误
    webSocket.onerror = (evt) => {
      buildTerminal.writeln(`\r\n---> 连接错误 [${JSON.stringify(evt)}]\r\n`);
      this.isBuilding = false;
    };
  }

  buildAction = (buildState) => {
    const { isBuilding } = this;
    const { buildTime } = this.state;
    if (isBuilding) return buildTime ? <span>{buildTime} 秒</span> : '';
    // 当前镜像构建状态(0：未构建, 1：正在下载代码, 2：正在编译代码, 3：正在构建镜像, S：构建成功, F：构建失败)
    if (buildState === '1' || buildState === '2' || buildState === '3') {
      return (<a onClick={() => this.buildImage()}>连接构建控制台</a>);
    }
    if (buildState === '0' || buildState === 'S' || buildState === 'F') {
      return (<a onClick={() => this.buildImage()}>开始构建</a>);
    }
  }

  // 计算构建耗时
  setBuildTime = () => {
    if (!this.isBuilding) return;
    const { buildStartTime } = this.state;
    if (!(buildStartTime instanceof Date)) return;
    const buildTime = moment(new Date()).diff(moment(buildStartTime))
    this.setState({ buildTime: Math.round(buildTime / 1000) });
  }

  render() {
    const { ImageBuildModel: { imageConfig, codeRepository }, getPageDataLoading } = this.props;
    const { showBuildTerminalId } = this.state;
    if (getPageDataLoading || !imageConfig || !codeRepository) return <Card loading={true} />;
    let language = LanguageMapper[codeRepository.language];
    if (!language) language = LanguageMapper.error;
    let repositoryType = RepositoryTypeMapper[codeRepository.repositoryType];
    if (!repositoryType) repositoryType = RepositoryTypeMapper.error;
    const buildState = this.state.buildState || imageConfig.buildState;
    let buildStateText = BuildStateMapper[buildState];
    if (!buildStateText) buildStateText = BuildStateMapper.error;
    return (
      <PageHeaderLayout>
        <Card bordered={false} loading={getPageDataLoading}>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td className={styles.tableLabel}>项目名称</td>
                <td className={styles.tableValue}>
                  <Link to={`/server/repository/detail/${codeRepository.id}`}>{codeRepository.projectName}</Link>
                </td>
                <td className={styles.tableLabel}>项目语言</td>
                <td className={styles.tableValue}>{language.label}</td>
              </tr>
              <tr>
                <td className={styles.tableLabel}>仓库地址</td>
                <td className={styles.tableValue}>
                  <a target="_blank" href={codeRepository.repositoryUrl}>{codeRepository.repositoryUrl}</a>
                </td>
                <td className={styles.tableLabel}>仓库类型</td>
                <td className={styles.tableValue}>{repositoryType.label}</td>
              </tr>
              <tr>
                <td className={styles.tableLabel}>Branch或Tag</td>
                <td className={styles.tableValue}>{imageConfig.branch} ({imageConfig.commitId})</td>
                <td className={styles.tableLabel}>编译脚本</td>
                <td className={styles.tableValue}>{imageConfig.buildCmd}</td>
              </tr>
              <tr>
                <td className={styles.tableLabel}>服务域名</td>
                <td className={styles.tableValue}>
                  <a target="_blank" href={`http://${imageConfig.serverUrl}`}>{imageConfig.serverUrl}</a>
                </td>
                <td className={styles.tableLabel}>构建状态</td>
                <td className={styles.tableValue}>
                  <span style={{ color: buildStateText.color }}>{buildStateText.label}</span>
                  <span className={styles.spanWidth16} />
                  {this.buildAction(buildState)}
                </td>
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
