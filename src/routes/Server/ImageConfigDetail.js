import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Spin, Button } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ProjectInfo from '../Common/ProjectInfo';
import ImageList from '../Common/ImageList';
import ContainerList from '../Common/ContainerList';
import ImageBuildLogList from '../Common/ImageBuildLogList';
import { AuthorizationTypeMapper, BuildStateMapper } from '../../utils/enum';
// import classNames from 'classnames';
import styles from './ImageConfigDetail.less';

@connect(({ ImageConfigDetailModel, loading }) => ({
  ImageConfigDetailModel,
  getPageDataLoading: loading.effects['ImageConfigDetailModel/getPageData'],
  findImageDataLoading: loading.effects['ImageConfigDetailModel/findImageData'],
  findContainerDataLoading: loading.effects['ImageConfigDetailModel/findContainerData'],
  findImageBuildLogLoading: loading.effects['ImageConfigDetailModel/findImageBuildLog'],
}))
export default class ImageConfigDetail extends PureComponent {

  state = {
    tabActiveKey: 'Info',
    tabList: [
      { key: 'Info', tab: '项目信息' },
      { key: 'ImageList', tab: '镜像列表' },
      { key: 'ContainerList', tab: '容器列表' },
      { key: 'BuildImageHistory', tab: '构建历史' },
    ],
  };

  // 数据初始化
  componentDidMount() {
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
            <Link to={`/server/repository/detail/${codeRepository.id}`}>{codeRepository.projectName}</Link>
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

  // 操作
  action = () => {
    const { dispatch, getPageDataLoading } = this.props;
    return <Button type="primary" icon="reload" loading={getPageDataLoading} onClick={() => dispatch({ type: 'ImageConfigDetailModel/getPageData' })}>刷新</Button>;
  }

  // 创建容器
  createContainer = (image) => {
    if (image && image.Labels && image.Labels.ImageConfigId) {
      const { dispatch } = this.props;
      dispatch({ type: 'ImageConfigDetailModel/createContainer', payload: { imageConfigId: image.Labels.ImageConfigId } })
    }
  }

  render() {
    const { dispatch, ImageConfigDetailModel, getPageDataLoading, findImageDataLoading, findContainerDataLoading, findImageBuildLogLoading } = this.props;
    const { tabActiveKey, tabList } = this.state;
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
        <Spin size='large' delay={100} spinning={ImageConfigDetailModel.pageLoading}>
          <Card loading={getPageDataLoading} bordered={false}>
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
              <ImageList
                quetyLoading={findImageDataLoading}
                data={ImageConfigDetailModel.imageData}
                createContainer={(image) => this.createContainer(image)}
              />
            </div>
            <div style={{ display: tabActiveKey === 'ContainerList' ? 'block' : 'none' }}>
              <ContainerList
                quetyLoading={findContainerDataLoading}
                data={ImageConfigDetailModel.containerData}
              />
            </div>
            <div style={{ display: tabActiveKey === 'BuildImageHistory' ? 'block' : 'none' }}>
              <ImageBuildLogList
                dispatch={dispatch}
                quetyLoading={findImageBuildLogLoading === undefined ? false : findImageBuildLogLoading}
                queryParam={ImageConfigDetailModel.queryBuildLogParam}
                data={ImageConfigDetailModel.buildLogData}
                pagination={ImageConfigDetailModel.buildLogPagination}
              />
            </div>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
