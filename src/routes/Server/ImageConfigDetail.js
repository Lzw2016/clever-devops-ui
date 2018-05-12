import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ProjectInfo from '../Common/ProjectInfo'
import { AuthorizationTypeMapper, BuildStateMapper } from '../../utils/enum';
import { TerminalInit } from '../../utils/constant';
// import classNames from 'classnames';
import styles from './ImageConfigDetail.less'
import xtermStyles from '../Common/xterm.less'

@connect(({ ImageConfigDetailModel, loading }) => ({
  ImageConfigDetailModel,
  getPageDataLoading: loading.effects['ImageConfigDetailModel/getPageData'],
}))
export default class ImageConfigDetail extends PureComponent {

  state = {
    tabActiveKey: 'Info',
    tabList: [
      { key: 'Info', tab: '项目信息' },
      { key: 'ImageList', tab: '镜像列表' },
      { key: 'ContainerList', tab: '容器列表' },
      { key: 'BuildImage', tab: '构建镜像' },
      { key: 'BuildImageHistory', tab: '构建历史' },
      { key: 'BuildImageLog', tab: '构建日志' },
    ],
    showBuildLogTerminalId: 'showBuildLogTerminalId',
  };

  // 数据初始化
  componentDidMount() {
    console.log('数据初始化');
    const { dispatch, match: { params } } = this.props;
    dispatch({ type: 'ImageConfigDetailModel/save', payload: { serverUrl: params.serverUrl } });
    dispatch({ type: 'ImageConfigDetailModel/getPageData' });
  }

  // 标题
  title = () => {
    const { ImageConfigDetailModel: { imageConfig, codeRepository } } = this.props;
    if (!imageConfig || !codeRepository) return '加载中...';
    return (
      <span>
        <span>{`项目 ${codeRepository.projectName}`}</span>
        <span className={styles.spanWidth30} />
        <span>{`服务 ${imageConfig.serverUrl}`}</span>
      </span>
    );
  }

  // 基本详情
  baseDetail = () => {
    const { ImageConfigDetailModel: { imageConfig, codeRepository } } = this.props;
    if (!imageConfig || !codeRepository) return '加载中...';
    let authorizationType = AuthorizationTypeMapper[codeRepository.authorizationType];
    if (!authorizationType) authorizationType = AuthorizationTypeMapper.error;
    return (
      <Fragment>
        <DescriptionList size="small" col={4} gutter={0}>
          <DescriptionList.Description term="项目名称">
            <a target="_blank" href={codeRepository.repositoryUrl}>{codeRepository.projectName}</a>
          </DescriptionList.Description>
          <DescriptionList.Description term="项目语言">{codeRepository.language}</DescriptionList.Description>
          <DescriptionList.Description term="仓库类型">{codeRepository.repositoryType}</DescriptionList.Description>
          <DescriptionList.Description term="访问授权">{authorizationType.label}</DescriptionList.Description>
          <DescriptionList.Description term="服务域名">
            <a target="_blank" href={`http://${imageConfig.serverUrl}`}>{imageConfig.serverUrl}</a>
          </DescriptionList.Description>
          <DescriptionList.Description term="Branch或Tag">{imageConfig.branch}</DescriptionList.Description>
          <DescriptionList.Description term="编译类型">{imageConfig.buildType}</DescriptionList.Description>
          <DescriptionList.Description term="服务端口">{imageConfig.serverPorts}</DescriptionList.Description>
        </DescriptionList>
      </Fragment>
    );
  }

  // 构建状态
  buildStateExtra = () => {
    const { ImageConfigDetailModel: { imageConfig, codeRepository } } = this.props;
    if (!imageConfig || !codeRepository) return '加载中...';
    let buildState = BuildStateMapper[imageConfig.buildState];
    if (!buildState) buildState = BuildStateMapper.error;
    return (
      <div style={{ paddingRight: 25 }}>
        <div className={styles.textSecondary}>构建状态</div>
        <div className={styles.heading} style={{ color: buildState.color }}>{buildState.label}</div>
      </div>
    );
  }

  // 审核操作
  action = () => {
    const { dispatch, getPageDataLoading } = this.props;
    return <Button type="primary" icon="reload" loading={getPageDataLoading} onClick={() => dispatch({ type: 'ImageConfigDetailModel/getPageData' })}>刷新</Button>;
  }

  // 初始化查看日志 xterm
  initShowBuildLogTerminal = () => {
    if (this.showBuildLogTerminal) return;
    const { showBuildLogTerminalId } = this.state;
    Terminal.applyAddon(fit);
    console.log('111');
    const xterm = new Terminal({ ...TerminalInit });
    console.log('222');
    xterm.open(document.getElementById(showBuildLogTerminalId));
    console.log('333');
    xterm.fit();
    console.log('444');
    this.showBuildLogTerminal = xterm;
    console.log('555');
    console.log(showBuildLogTerminalId);
  }

  setBuildLogs = (buildLogs) => {
    this.initShowBuildLogTerminal();
    console.log('666');
    this.showBuildLogTerminal.clear();
    console.log('777');
    this.showBuildLogTerminal.write(buildLogs.buildLogs);
    console.log('888');
    this.showBuildLogTerminal.fit();
    console.log('999');
  }

  render() {
    console.log('render');
    const { ImageConfigDetailModel, getPageDataLoading } = this.props; // dispatch,
    const { tabActiveKey, tabList, showBuildLogTerminalId } = this.state;
    // this.initShowBuildLogTerminal();
    // setTimeout(this.initShowBuildLogTerminal, 5000);
    return (
      <PageHeaderLayout
        title={this.title()}
        content={this.baseDetail()}
        action={this.action()}
        extraContent={this.buildStateExtra()}
        tabList={tabList}
        tabActiveKey={tabActiveKey}
        onTabChange={(key) => this.setState({ tabActiveKey: key })}
      >
        <Card loading={ImageConfigDetailModel.pageLoading || getPageDataLoading} bordered={false}>
          <div style={{ display: tabActiveKey === 'Info' ? 'block' : 'none' }}>
            <ProjectInfo
              codeRepository={ImageConfigDetailModel.codeRepository}
              imageConfig={ImageConfigDetailModel.imageConfig}
              showBuildLogs={(buildLogs) => {
                window.scrollTo(0, 0);
                this.setState({ tabActiveKey: 'BuildImageLog' });
                this.setBuildLogs(buildLogs);
              }}
            />
          </div>
          <div style={{ display: tabActiveKey === 'ImageList' ? 'block' : 'none' }}>
            ImageList
          </div>
          <div style={{ display: tabActiveKey === 'ContainerList' ? 'block' : 'none' }}>
            ContainerList
          </div>
          <div style={{ display: tabActiveKey === 'BuildImage' ? 'block' : 'none' }}>
            BuildImage
          </div>
          <div style={{ display: tabActiveKey === 'BuildImageHistory' ? 'block' : 'none' }}>
            BuildImageHistory
          </div>
          <div style={{ display: tabActiveKey === 'BuildImageLog' ? 'block' : 'none' }}>
            <div className={xtermStyles.terminal} id={showBuildLogTerminalId} style={{ height: 800, width: 1000 }} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
