import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { TerminalInit } from '../../utils/constant';
// import classNames from 'classnames';
// import styles from './ImageBuild.less'
import xtermStyles from '../Common/xterm.less'

export default class ImageBuild extends PureComponent {

  state = {
    showBuildTerminalId: 'showBuildTerminalId',
  };

  // 数据初始化
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    console.log(params);
    setTimeout(this.initBuildTerminal, 100);
    // this.initBuildTerminal();
  }

  // 初始化查看日志 xterm
  initBuildTerminal = () => {
    if (this.showBuildLogTerminal) return;
    const { showBuildTerminalId } = this.state;
    Terminal.applyAddon(fit);
    const xterm = new Terminal({ ...TerminalInit });
    xterm.open(document.getElementById(showBuildTerminalId));
    for (let i = 0; i < 100; i++) {
      xterm.writeln(`### ${i} ------------------------------------------------------------------- ${i}`);
    }
    xterm.fit();
    this.showBuildLogTerminal = xterm;
  }

  render() {
    const { showBuildTerminalId } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div>{this.props.match.params.serverUrl}</div>
          <div className={xtermStyles.terminal} id={showBuildTerminalId} style={{ height: 600 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
