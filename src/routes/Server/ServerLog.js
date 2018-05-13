import React, { PureComponent, Fragment } from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { Card } from 'antd';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { TerminalInit, WebSocketUrls } from '../../utils/constant';
// import classNames from 'classnames';
import styles from './ServerLog.less'
import xtermStyles from '../Common/xterm.less'

export default class ServerLog extends PureComponent {

  state = {
    showLogTerminalId: 'showLogTerminalId',
    isConnect: false,
    webSocket: undefined,
    startTime: undefined,
    time: undefined,
    stopTimer: undefined,
  };

  // 数据初始化
  componentDidMount() {
    // const { dispatch, match: { params } } = this.props;
    // dispatch({ type: 'ImageBuildModel/save', payload: { serverUrl: params.serverUrl } });
    // dispatch({ type: 'ImageBuildModel/getPageData' });
  }

  componentDidUpdate() {
    // const { ImageBuildModel: { imageConfig, codeRepository }, getPageDataLoading } = this.props;
    // if (getPageDataLoading || !imageConfig || !codeRepository) return;
    lodash.delay(() => this.initLogTerminal(), 1000);
  }

  componentWillUnmount() {
    if (this.logTerminal) {
      this.logTerminal.destroy();
    }
    const { stopTimer, webSocket } = this.state;
    if (stopTimer) clearInterval(stopTimer);
    if (webSocket && webSocket instanceof WebSocket && webSocket.readyState === 1) webSocket.close();
  }

  // 初始化控制台 xterm
  initLogTerminal = () => {
    if (this.logTerminal) return;
    // const { ImageBuildModel: { codeRepository } } = this.props;
    const { showLogTerminalId } = this.state;
    Terminal.applyAddon(fit);
    const xterm = new Terminal({ ...TerminalInit, scrollback: 3000 });
    xterm.open(document.getElementById(showLogTerminalId));
    xterm.write('--------------------------------------------------------------------');
    xterm.writeln('------------------------------------------------------------------');
    // xterm.writeln(`# 当前构建项目 ${codeRepository.projectName}, 项目地址 ${codeRepository.repositoryUrl}`);
    xterm.write('--------------------------------------------------------------------');
    xterm.writeln('------------------------------------------------------------------');
    xterm.fit();
    this.logTerminal = xterm;
  }

  showLog = () => {
    const { logTerminal } = this;
    // const { ImageBuildModel: { imageConfig } } = this.props;
    const { isConnect } = this.state;
    if (isConnect) {
      return;
    }
    // 开始计时
    const stopTimer = setInterval(this.setBuildTime, 1000);
    const webSocket = new WebSocket(WebSocketUrls.serverLog);
    this.setState({ stopTimer, isConnect: true, startTime: new Date(), webSocket });
    // 连接服务器
    webSocket.onopen = () => {
      logTerminal.writeln('\r\n---> 连接服务器成功\r\n');
      webSocket.send(JSON.stringify({ containerId: 'e27fe6adf5d81bd4b35529e197c9239466d028ed92599e8415886d3d1f3358e4', timestamps: false, stdout: true, stderr: true }));
    };
    // 消息处理
    webSocket.onmessage = (evt) => {
      const { logText, complete } = JSON.parse(evt.data); // , stdType
      logTerminal.write(logText);
      if (complete) {
        webSocket.close();
      }
    };
    // 连接关闭
    webSocket.onclose = (evt) => {
      logTerminal.writeln(`\r\n---> 断开连接 [${JSON.stringify(evt)}]\r\n`);
      this.setState({ isConnect: false });
    };
    // 连接错误
    webSocket.onerror = (evt) => {
      logTerminal.writeln(`\r\n---> 连接错误 [${JSON.stringify(evt)}]\r\n`);
      this.setState({ isConnect: false });
    };
  }

  stopShowLog = () => {
    const { isConnect, webSocket } = this.state;
    if (isConnect && webSocket && webSocket instanceof WebSocket && webSocket.readyState === 1) webSocket.close();
  }

  buildAction = () => {
    const { isConnect, time } = this.state;
    if (isConnect) {
      return (
        <Fragment>
          {time ? <span>{time} 秒</span> : ''}
          {time ? <span className={styles.spanWidth16} /> : ''}
          <a onClick={this.stopShowLog}>停止查看</a>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <a onClick={this.showLog}>连接日志</a>
      </Fragment>
    );
  }

  // 计算构建耗时
  setBuildTime = () => {
    const { isConnect, startTime } = this.state;
    if (!isConnect) return;
    if (!(startTime instanceof Date)) return;
    const time = moment(new Date()).diff(moment(startTime))
    this.setState({ time: Math.round(time / 1000) });
  }

  render() {
    // const { ImageBuildModel: { imageConfig, codeRepository }, getPageDataLoading } = this.props;
    const { showLogTerminalId } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          {this.buildAction()}
          <div className={xtermStyles.terminal} id={showLogTerminalId} style={{ height: 600 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
