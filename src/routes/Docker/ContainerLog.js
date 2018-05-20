import React, { PureComponent, Fragment } from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Card, Spin, Button } from 'antd';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import DescriptionList from 'components/DescriptionList';
import BizIcon from '../../components/BizIcon';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { ContainerStateMapper } from '../../utils/enum';
import { TerminalInit, WebSocketUrls } from '../../utils/constant';
// import classNames from 'classnames';
import styles from './ContainerLog.less'
import xtermStyles from '../Common/xterm.less'

@connect(({ ContainerLogModel, loading }) => ({
  ContainerLogModel,
  pageLoading: loading.effects['ContainerLogModel/getPageData'],
}))
export default class ContainerLog extends PureComponent {

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
    const { dispatch, match: { params } } = this.props;
    dispatch({ type: 'ContainerLogModel/save', payload: { containerId: params.id } });
    this.getPageData();
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

  getPageData = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'ContainerLogModel/getPageData' });
  }

  // 初始化控制台 xterm
  initLogTerminal = () => {
    if (this.logTerminal) return;
    const { ContainerLogModel: { containerInfo } } = this.props;
    const { showLogTerminalId } = this.state;
    Terminal.applyAddon(fit);
    const xterm = new Terminal({ ...TerminalInit, scrollback: 3000 });
    xterm.open(document.getElementById(showLogTerminalId));
    xterm.write('--------------------------------------------------------------------');
    xterm.writeln('------------------------------------------------------------------');
    xterm.writeln(`# 当前项目 -> ${containerInfo.Name}`);
    if (containerInfo.Config && containerInfo.Config.Labels && containerInfo.Config.Labels.DevopsFlag && containerInfo.Config.Labels.DevopsFlag === 'true') {
      xterm.writeln(`# 服务域名： ${containerInfo.Config.Labels.ServerUrl}`);
      xterm.writeln(`# 代码地址：${containerInfo.Config.Labels.RepositoryType} -> ${containerInfo.Config.Labels.RepositoryUrl}`);
    }
    xterm.write('--------------------------------------------------------------------');
    xterm.writeln('------------------------------------------------------------------');
    xterm.fit();
    this.logTerminal = xterm;
  }

  showLog = () => {
    const { ContainerLogModel: { containerInfo } } = this.props;
    if (!containerInfo) return;
    const { logTerminal } = this;
    // const { ImageBuildModel: { imageConfig } } = this.props;
    const { isConnect } = this.state;
    if (isConnect) {
      return;
    }
    logTerminal.clear();
    // 开始计时
    const stopTimer = setInterval(this.setBuildTime, 1000);
    const webSocket = new WebSocket(WebSocketUrls.serverLog);
    this.setState({ stopTimer, isConnect: true, startTime: new Date(), webSocket });
    // 连接服务器
    webSocket.onopen = () => {
      logTerminal.writeln('\r\n---> 连接服务器成功\r\n');
      webSocket.send(JSON.stringify({ containerId: containerInfo.Id, timestamps: false, stdout: true, stderr: true }));
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
      this.setState({ isConnect: false, time: undefined });
    };
    // 连接错误
    webSocket.onerror = (evt) => {
      logTerminal.writeln(`\r\n---> 连接错误 [${JSON.stringify(evt)}]\r\n`);
      this.setState({ isConnect: false, time: undefined });
    };
  }

  stopShowLog = () => {
    const { isConnect, webSocket } = this.state;
    if (isConnect && webSocket && webSocket instanceof WebSocket && webSocket.readyState === 1) {
      webSocket.close();
    }
  }

  // 计算构建耗时
  setBuildTime = () => {
    const { isConnect, startTime } = this.state;
    if (!isConnect) return;
    if (!(startTime instanceof Date)) return;
    const time = moment(new Date()).diff(moment(startTime))
    this.setState({ time: Math.round(time / 1000) });
  }

  // 标题
  title = () => {
    const { ContainerLogModel: { containerInfo } } = this.props;
    if (!containerInfo) return '加载中...';
    let label = '';
    let text = '';
    if (containerInfo.Name) {
      label = '容器名';
      text = containerInfo.Name;
    } else {
      label = '容器ID';
      text = containerInfo.Id;
    }
    return (
      <span>
        <span>{label}</span>
        <span className={styles.spanWidth10} />
        <span style={{ color: '#1890ff' }}>{text}</span>
        {/* <span className={styles.spanWidth30} /> */}
      </span>
    );
  }

  // 基本详情
  baseDetail = () => {
    const { ContainerLogModel: { containerInfo } } = this.props;
    if (!containerInfo) return '加载中...';
    const { Config: { Labels } } = containerInfo;
    if (!Labels || !Labels.DevopsFlag || Labels.DevopsFlag !== 'true') return '-';
    return (
      <Fragment>
        <DescriptionList size="small" col={2} gutter={0}>
          <DescriptionList.Description term="项目名">{Labels.ProjectName} ({Labels.Language})</DescriptionList.Description>
          <DescriptionList.Description term="服务域名">{Labels.ServerUrl}:{Labels.ServerPorts}</DescriptionList.Description>
          <DescriptionList.Description term="代码地址">{Labels.RepositoryType} - {Labels.RepositoryUrl}</DescriptionList.Description>
          <DescriptionList.Description term="Branch">{Labels.Branch}</DescriptionList.Description>
          <DescriptionList.Description term="CommitID">{Labels.CommitId}</DescriptionList.Description>
        </DescriptionList>
      </Fragment>
    );
  }

  // 容器状态
  buildStateExtra = () => {
    const { ContainerLogModel: { containerInfo } } = this.props;
    if (!containerInfo) return '加载中...';
    let state = ContainerStateMapper[containerInfo.State.Status];
    if (!state) state = ContainerStateMapper.error;
    return (
      <div style={{ paddingRight: 25 }}>
        <div className={styles.textSecondary}>容器状态</div>
        <div className={styles.heading} style={{ color: state.color }}>{state.label}</div>
      </div>
    );
  }

  // 操作
  action = () => {
    const { time } = this.state;
    const { ContainerLogModel: { containerInfo } } = this.props;
    if (!containerInfo) return '加载中...';
    return (
      <Button.Group>
        <Button icon="poweroff" onClick={this.start}>启动</Button>
        <Button type="danger" onClick={this.stop}>
          <span style={{ marginRight: 5 }}>
            <BizIcon type="stop" />
          </span>
          停止
        </Button>
        <Button type="danger" icon="close-circle-o" onClick={this.kill}>强制停止</Button>
        <Button type="danger" icon="reload" onClick={this.restart}>重启</Button>
        <Button type="danger" icon="pause-circle-o" onClick={this.pause}>暂停</Button>
        <Button icon="play-circle-o" onClick={this.unpause}>继续</Button>
        <Button type="danger" icon="delete" onClick={this.remove}>删除</Button>
        <Button icon="sync" onClick={this.getPageData}>刷新</Button>
        {time ?
          <Button type="primary" onClick={this.stopShowLog}>{`${time}秒 (关闭)`}</Button> :
          <Button type="primary" onClick={this.showLog}>连接日志</Button>
        }
      </Button.Group>
    );
  }

  start = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'ContainerLogModel/start' });
  }

  stop = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'ContainerLogModel/stop' });
  }

  restart = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'ContainerLogModel/restart' });
  }

  kill = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'ContainerLogModel/kill' });
  }

  pause = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'ContainerLogModel/pause' });
  }

  unpause = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'ContainerLogModel/unpause' });
  }

  remove = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'ContainerLogModel/remove' });
  }

  render() {
    const { showLogTerminalId } = this.state;
    const { pageLoading, ContainerLogModel } = this.props;
    return (
      <PageHeaderLayout
        title={this.title()}
        content={this.baseDetail()}
        action={this.action()}
        extraContent={this.buildStateExtra()}
      // tabList={tabList}
      // tabActiveKey={tabActiveKey}
      // onTabChange={(key) => this.setState({ tabActiveKey: key })}
      >
        <Spin size='large' delay={100} spinning={pageLoading || ContainerLogModel.pageLoading}>
          <Card bordered={false}>
            <div className={xtermStyles.terminal} id={showLogTerminalId} style={{ height: 600 }} />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
