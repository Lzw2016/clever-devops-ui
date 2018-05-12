import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { TerminalInit } from '../../utils/constant';
// import classNames from 'classnames';
// import styles from './ImageBuildLog.less'
import xtermStyles from '../Common/xterm.less'

export default class ImageBuildLog extends PureComponent {

  state = {
    showBuildLogTerminalId: 'showBuildLogTerminalId',
  };

  // 数据初始化
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    console.log(params);
    setTimeout(this.initBuildLogTerminal, 100);
    // this.initBuildLogTerminal();
  }

  // 初始化查看日志 xterm
  initBuildLogTerminal = () => {
    if (this.showBuildLogTerminal) return;
    const { showBuildLogTerminalId } = this.state;
    Terminal.applyAddon(fit);
    const xterm = new Terminal({ ...TerminalInit });
    xterm.open(document.getElementById(showBuildLogTerminalId));
    for (let i = 0; i < 100; i++) {
      xterm.writeln(`### ${i} ------------------------------------------------------------------- ${i}`);
    }
    xterm.fit();
    this.showBuildLogTerminal = xterm;
  }

  render() {
    const { showBuildLogTerminalId } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={xtermStyles.terminal} id={showBuildLogTerminalId} style={{ height: 600 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
