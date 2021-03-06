import React, { PureComponent, Fragment } from 'react';
// import { parse } from 'qs';
import lodash from 'lodash';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import { Card } from 'antd';
import { Link } from 'dva/router';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { TerminalInit, WebSocketUrls } from '../../utils/constant';
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
    screenHeight: document.documentElement.clientHeight,
    showBuildTerminalId: 'showBuildTerminalId',
    isBuilding: false,
    buildState: undefined,
    buildStartTime: undefined,
    buildTime: undefined,
    stopTimer: undefined,
  };

  // 数据初始化
  componentDidMount() {
    window.addEventListener('resize', this.handleHeight);
    const { dispatch, match: { params } } = this.props;
    dispatch({ type: 'ImageBuildModel/save', payload: { serverUrl: params.serverUrl } });
    dispatch({ type: 'ImageBuildModel/getPageData' });
  }

  componentDidUpdate() {
    if (this.buildTerminal) {
      this.buildTerminal.fit();
    }
    const { ImageBuildModel: { imageConfig, codeRepository }, getPageDataLoading } = this.props;
    if (getPageDataLoading || !imageConfig || !codeRepository) return;
    lodash.delay(() => this.initBuildTerminal(), 100);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleHeight);
    if (this.buildTerminal) {
      this.buildTerminal.destroy();
    }
    const { stopTimer } = this.state;
    if (stopTimer) clearInterval(stopTimer);
  }

  // 动态设置高度
  @Bind()
  @Debounce(400)
  handleHeight = () => {
    const screenHeight = document.documentElement.clientHeight;
    this.setState({ screenHeight });
  };

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
    const { buildTerminal } = this;
    const { ImageBuildModel: { imageConfig } } = this.props;
    const { isBuilding } = this.state;
    if (isBuilding) {
      return;
    }
    // 开始计时
    const stopTimer = setInterval(this.setBuildTime, 1000);
    this.setState({ stopTimer, isBuilding: true });
    const webSocket = new WebSocket(WebSocketUrls.buildImage);
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
      this.setState({ isBuilding: false });
    };
    // 连接错误
    webSocket.onerror = (evt) => {
      buildTerminal.writeln(`\r\n---> 连接错误 [${JSON.stringify(evt)}]\r\n`);
      this.setState({ isBuilding: false });
    };
  }

  buildAction = (buildState) => {
    const { isBuilding, buildTime } = this.state;
    if (isBuilding) return buildTime ? <span>{buildTime} 秒</span> : '';
    // 当前镜像构建状态(0：未构建, 1：正在下载代码, 2：正在编译代码, 3：正在构建镜像, S：构建成功, F：构建失败)
    let actionText;
    if (buildState === '1' || buildState === '2' || buildState === '3') {
      actionText = '连接构建控制台';
    }
    if (buildState === '0' || buildState === 'S' || buildState === 'F') {
      actionText = '开始构建';
    }
    return (
      <Fragment>
        {buildTime ? <span>{buildTime} 秒</span> : ''}
        {actionText ? <span className={styles.spanWidth16} /> : ''}
        {actionText ? <a onClick={() => this.buildImage()}>{actionText}</a> : ''}
      </Fragment>
    );
  }

  // 计算构建耗时
  setBuildTime = () => {
    const { isBuilding, buildStartTime } = this.state;
    if (!isBuilding) return;
    if (!(buildStartTime instanceof Date)) return;
    const buildTime = moment(new Date()).diff(moment(buildStartTime))
    this.setState({ buildTime: Math.round(buildTime / 1000) });
  }

  render() {
    let { screenHeight } = this.state;
    screenHeight -= 430;
    if (screenHeight < 350) screenHeight = 515;
    const { ImageBuildModel: { imageConfig, codeRepository }, getPageDataLoading } = this.props;
    const { showBuildTerminalId } = this.state;
    if (getPageDataLoading || !imageConfig || !codeRepository) return <Card loading={true} />;
    let language = LanguageMapper[codeRepository.language];
    if (!language) language = LanguageMapper.error;
    let repositoryType = RepositoryTypeMapper[codeRepository.repositoryType];
    if (!repositoryType) repositoryType = RepositoryTypeMapper.error;
    const { buildState = imageConfig.buildState } = this.state;
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
                  <a target="_blank" rel="noopener noreferrer" href={codeRepository.repositoryUrl}>{codeRepository.repositoryUrl}</a>
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
                  <a target="_blank" rel="noopener noreferrer" href={`http://${imageConfig.serverUrl}`}>{imageConfig.serverUrl}</a>
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
          <div className={xtermStyles.terminal} id={showBuildTerminalId} style={{ height: screenHeight }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
