import React, { PureComponent, Fragment } from 'react';
// import { Link } from 'dva/router';
// import { stringify } from 'qs';
import lodash from 'lodash';
import moment from 'moment';
import { Table, Tooltip, Tag, Popover, Divider } from 'antd';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { bitToMB } from '../../utils/fmt';
// import classNames from 'classnames';
import styles from './ImageList.less'

export default class ImageList extends PureComponent {

  render() {
    const { quetyLoading, data, createContainer } = this.props;
    // 表格数据列配置
    const columns = [
      {
        title: 'ID', dataIndex: 'Id', render: val => {
          let text = '';
          if (lodash.startsWith(val, 'sha256:')) {
            text = val.substring(7, 19);
          } else {
            text = val.substring(0, 12);
          }
          return (
            <Tooltip title={val} placement="right" overlayClassName={styles.tooltipWidth}>
              <span style={{ color: '#108ee9', cursor: 'pointer' }}>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: 'Tags', dataIndex: 'RepoTags', render: val => {
          return (
            <Fragment>
              {val.map((item, index) => (
                <Fragment key={item}>
                  {index > 0 ? <br /> : ''}
                  <Tag color="#108ee9">{item}</Tag>
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
      { title: 'Size', dataIndex: 'Size', render: val => `${bitToMB(val)}MB` },
      { title: 'Created', dataIndex: 'Created', render: val => moment.unix(val).format('YYYY-MM-DD HH:mm:ss') },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (val, record) => {
          return (
            <Fragment>
              <a onClick={null}>详情</a>
              {createContainer && lodash.isFunction(createContainer) ? (
                <Fragment>
                  <Divider type="vertical" />
                  <a onClick={() => createContainer(record)}>创建容器</a>
                </Fragment>
              ) : ''}
            </Fragment>
          );
          // return <a onClick={null}>详情</a>;
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
