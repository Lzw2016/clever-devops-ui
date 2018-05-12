// import React, { PureComponent, Fragment } from 'react';
// // import { Card } from 'antd';
// import { Terminal } from 'xterm';
// import * as fit from 'xterm/lib/addons/fit/fit';
// import { TerminalInit } from '../../utils/constant';
// // import classNames from 'classnames';
// import styles from './TerminalComponent.less'

// export default class TerminalComponent extends PureComponent {

//   // 数据初始化
//   componentDidMount() {
//   }

//   setLogText = (xtermText) => {
//     this.xtermInit();
//     const { xterm } = this;
//     xterm.clear();
//     xterm.write(xtermText);
//     xterm.fit();
//   }

//   xtermInit = () => {
//     const { terminalId } = this.props;
//     if (!this.xterm) {
//       Terminal.applyAddon(fit);
//       const xterm = new Terminal({ ...TerminalInit });
//       xterm.open(document.getElementById(terminalId));
//       xterm.fit();
//       this.xterm = xterm;
//     }
//   }

//   render() {
//     const { terminalId, height, xtermText } = this.props;
//     this.setLogText(xtermText);
//     return (
//       <Fragment>
//         <div className={styles.terminal} id={terminalId} style={{ height }} />
//       </Fragment>
//     );
//   }
// }
