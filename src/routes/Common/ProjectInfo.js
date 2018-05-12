import React, { PureComponent, Fragment } from 'react';
// import { Modal } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import { AuthorizationTypeMapper, LanguageMapper, RepositoryTypeMapper, BuildStateMapper } from '../../utils/enum';
// import TerminalComponent from './TerminalComponent';
// import classNames from 'classnames';
import styles from './ProjectInfo.less'

export default class ProjectInfo extends PureComponent {

  // 数据初始化
  componentDidMount() {
  }

  render() {
    const { codeRepository, imageConfig } = this.props;
    if (!codeRepository || !imageConfig) return '加载中...';
    let authorizationType = AuthorizationTypeMapper[codeRepository.authorizationType];
    if (!authorizationType) authorizationType = AuthorizationTypeMapper.error;
    let language = LanguageMapper[codeRepository.language];
    if (!language) language = LanguageMapper.error;
    let repositoryType = RepositoryTypeMapper[codeRepository.repositoryType];
    if (!repositoryType) repositoryType = RepositoryTypeMapper.error;
    let buildState = BuildStateMapper[imageConfig.buildState];
    if (!buildState) buildState = BuildStateMapper.error;
    return (
      <Fragment>
        <div className={styles.title}>服务代码仓库信息</div>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <td className={styles.tableLabel}>项目名称</td>
              <td className={styles.tableValue}>
                <Link to={`/server/repository/detail/${codeRepository.id}`}>{codeRepository.projectName}</Link>
              </td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>项目语言</td>
              <td className={styles.tableValue}>{language.label}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>仓库地址</td>
              <td className={styles.tableValue}>
                <a target="_blank" href={codeRepository.repositoryUrl}>{codeRepository.repositoryUrl}</a>
              </td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>仓库类型</td>
              <td className={styles.tableValue}>{repositoryType.label}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>访问授权</td>
              <td className={styles.tableValue}>{authorizationType.label}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>项目描述</td>
              <td className={styles.tableValue}>{codeRepository.description}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>创建时间</td>
              <td className={styles.tableValue}>{codeRepository.createDate}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>更新时间</td>
              <td className={styles.tableValue}>{codeRepository.updateDate}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ height: 18 }} />
        <div className={styles.title}>服务配置信息</div>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <td className={styles.tableLabel}>Branch或Tag</td>
              <td className={styles.tableValue}>{imageConfig.branch} (Commit ID={imageConfig.commitId})</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>编译类型</td>
              <td className={styles.tableValue}>{imageConfig.buildType}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>编译脚本</td>
              <td className={styles.tableValue}>{imageConfig.buildCmd}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>Dockerfile位置</td>
              <td className={styles.tableValue}>{imageConfig.dockerFilePath}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>服务域名</td>
              <td className={styles.tableValue}>
                <a target="_blank" href={`http://${imageConfig.serverUrl}`}>{imageConfig.serverUrl}</a>
              </td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>服务端口</td>
              <td className={styles.tableValue}>{imageConfig.serverPorts}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>服务默认数量</td>
              <td className={styles.tableValue}>{imageConfig.serverCount}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>构建状态</td>
              <td className={styles.tableValue}><span style={{ color: buildState.color }}>{buildState.label}</span></td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>Docker镜像ID</td>
              <td className={styles.tableValue}>{imageConfig.imageId}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>编译时间</td>
              <td className={styles.tableValue}>
                {`${imageConfig.buildStartTime} -- ${imageConfig.buildEndTime}`}
                <span className={styles.spanWidth15} />
                {(imageConfig.buildStartTime && imageConfig.buildEndTime) ? `(耗时: ${moment(imageConfig.buildEndTime).diff(moment(imageConfig.buildStartTime)) / 1000}秒)` : ''}
              </td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>编译日志</td>
              <td className={styles.tableValue}>
                <Link target="_blank" to={`/server/config/build-log/${imageConfig.serverUrl}`}>查看构建日志</Link>
              </td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>镜像说明</td>
              <td className={styles.tableValue}>{imageConfig.description}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>代码下载路径</td>
              <td className={styles.tableValue}>{imageConfig.codeDownloadPath}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>创建时间</td>
              <td className={styles.tableValue}>{imageConfig.createDate}</td>
            </tr>
            <tr>
              <td className={styles.tableLabel}>更新时间</td>
              <td className={styles.tableValue}>{imageConfig.updateDate}</td>
            </tr>
          </tbody>
        </table >
      </Fragment>
    );
  }
}
