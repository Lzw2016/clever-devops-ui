import React, { PureComponent, Fragment } from 'react';
// import { Link } from 'dva/router';
// import { stringify } from 'qs';
import lodash from 'lodash';
import moment from 'moment';
import { Table, Tooltip, Tag, Popover, Divider, Badge } from 'antd';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { bitToMB } from '../../utils/fmt';
import { ContainerStateMapper } from '../../utils/enum';
// import classNames from 'classnames';
import styles from './ContainerList.less'

export default class ContainerList extends PureComponent {

  render() {
    const { quetyLoading, data } = this.props;
    // 表格数据列配置
    const columns = [
      {
        title: 'Names', dataIndex: 'Names', render: (val, record) => {
          // <span style={{ color: '#108ee9', cursor: 'pointer' }}>{item}</span>
          // <Tag color="#108ee9">{item}</Tag>
          return (
            <Tooltip title={record.Id} placement="right" overlayClassName={styles.tooltipWidth}>
              {val.map((item, index) => (
                <Fragment key={item}>
                  {index > 0 ? <br /> : ''}
                  <span style={{ color: '#108ee9', cursor: 'pointer' }}>{item}</span>
                </Fragment>
              ))}
            </Tooltip>
          );
        },
      },
      {
        title: 'State', dataIndex: 'State', render: (val, record) => {
          let state = ContainerStateMapper[val];
          if (!state) state = ContainerStateMapper.error;
          return (
            <Fragment>
              <Tag color={state.color}>{state.label}</Tag>
              <Divider type="vertical" />
              <Badge status={state.badgeStatus} text={record.Status} />
            </Fragment>
          );
        },
      },
      {
        title: 'Image', dataIndex: 'Image', render: val => {
          if (lodash.startsWith(val, 'sha256:') && val.length === 71) {
            return val.substring(7, 19);
          }
          return val;
        },
      },
      {
        title: 'IP Address', dataIndex: 'NetworkSettings', render: val => {
          const ips = [];
          if (val.Networks) {
            const networks = lodash.valuesIn(val.Networks);
            networks.forEach(item => ips.push(item.IPAddress));
          }
          return (
            <Fragment>
              {ips.map((item, index) => (
                <Fragment key={item}>
                  {index > 0 ? <br /> : ''}
                  <span>{item}</span>
                </Fragment>
              ))}
            </Fragment>
          );
        },
      },
      {
        title: 'Published Ports', dataIndex: 'Ports', render: val => {
          const ports = [];
          val.forEach(item => {
            const mapping = { publicPort: undefined, privatePort: undefined };
            if (item.IP && item.PublicPort && item.PublicPort !== 0) {
              mapping.publicPort = `${item.IP}:${item.PublicPort}`;
            }
            mapping.privatePort = `${item.PrivatePort}${item.Type ? '/' : ''}${item.Type ? item.Type : ''}`
            ports.push(mapping);
          });
          return (
            <Fragment>
              {ports.map((item, index) => (
                <Fragment key={item.privatePort}>
                  {index > 0 ? <br /> : ''}
                  <span>{item.publicPort ? `${item.publicPort} -> ` : ''}{item.privatePort}</span>
                </Fragment>
              ))}
            </Fragment>
          );
        },
      },
      {
        title: 'Labels', dataIndex: 'Labels', render: val => {
          const content = (
            <div>
              <div>
                <span className={styles.colLabel}>项目名:</span>
                <span className={styles.colValue}>{val.ProjectName} ({val.Language})</span>
              </div>
              <div>
                <span className={styles.colLabel}>服务域名:</span>
                <span className={styles.colValue}>{val.ServerUrl}:{val.ServerPorts}</span>
              </div>
              <div>
                <span className={styles.colLabel}>代码地址:</span>
                <span className={styles.colValue}>
                  <a target='_blank' href={val.RepositoryUrl}>{val.RepositoryType} - {val.RepositoryUrl}</a>
                </span>
              </div>
              <div>
                <span className={styles.colLabel}>Branch:</span>
                <span className={styles.colValue}>{val.Branch}</span>
              </div>
              <div>
                <span className={styles.colLabel}>CommitID:</span>
                <span className={styles.colValue}>{val.CommitId}</span>
              </div>
            </div>
          );
          return (
            <Popover content={content} placement="top">
              <span style={{ color: '#108ee9', cursor: 'pointer' }}>{val.ProjectName}</span>
            </Popover>
          );
        },
      },
      { title: 'SizeRootFs', dataIndex: 'SizeRootFs', render: val => `${bitToMB(val)}MB` },
      { title: 'Created', dataIndex: 'Created', render: val => moment.unix(val).format('YYYY-MM-DD HH:mm:ss') },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (val, record) => {
          console.log(record);
          return '-';
          // return <Link target="_blank" to={{ pathname: `/server/config/build-log/${record.serverUrl}`, search: stringify({ logId: record.id }) }}>构建日志</Link>;
        },
      },
    ];
    return (
      <Fragment>
        <Table
          size="middle"
          bordered={true}
          rowKey={record => record.Id}
          columns={columns}
          loading={quetyLoading}
          dataSource={data}
          pagination={false}
        // onChange={this.handleTableChange}
        />
      </Fragment>
    );
  }
}
