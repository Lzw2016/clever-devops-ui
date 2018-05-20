import React, { PureComponent, Fragment } from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Spin, Card, Form, Table, Row, Input, Select, Button, Popover, Tag, Divider, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { bitToMB } from '../../utils/fmt';
import { DevopsFlagArray, LanguageArray } from '../../utils/enum';
// import classNames from 'classnames';
import styles from './ImageList.less'

@connect(({ ImageListModel, loading }) => ({
  ImageListModel,
  quetyLoading: loading.effects['ImageListModel/findImage'],
}))
@Form.create()
export default class ImageList extends PureComponent {

  // 数据初始化
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'ImageListModel/findImage' });
  }

  // 查询数据
  findImage = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, formValues) => {
      if (err) return;
      dispatch({ type: 'ImageListModel/findImage', payload: { ...formValues } });
    });
  }

  // 查询表单
  queryForm() {
    const { form: { getFieldDecorator }, ImageListModel: { queryParamProxy } } = this.props;
    return (
      <Form onSubmit={this.findImage} layout="inline" className={styles.queryForm}>
        <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
          <Form.Item label="所有镜像">
            {getFieldDecorator('allImages', { initialValue: queryParamProxy.allImages })(
              <Select placeholder="所有镜像" allowClear={false}>
                <Select.Option key="true" value="true">所有镜像</Select.Option>
                <Select.Option key="false" value="false">中间层镜像</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Devops构建">
            {getFieldDecorator('DevopsFlag', { initialValue: queryParamProxy.DevopsFlag })(
              <Select placeholder="Devops构建" allowClear={true}>
                {DevopsFlagArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="项目语言">
            {getFieldDecorator('Language', { initialValue: queryParamProxy.Language })(
              <Select placeholder="项目语言" allowClear={true}>
                {LanguageArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="服务域名">
            {getFieldDecorator('ServerUrl', { initialValue: queryParamProxy.ServerUrl })(
              <Input placeholder="服务域名" />
            )}
          </Form.Item>
          <Form.Item>
            <span className={styles.spanWidth25} />
            <Button type="primary" htmlType="submit">查询</Button>
          </Form.Item>
        </Row>
      </Form >
    );
  }

  remove = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'ImageListModel/remove', payload: record });
  }

  render() {
    const { ImageListModel, quetyLoading } = this.props;
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
          return <span style={{ color: '#108ee9', cursor: 'pointer' }}>{text}</span>;
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
          if (!val || !val.DevopsFlag || val.DevopsFlag !== 'true') {
            return '-';
          }
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
              <span style={{ color: '#108ee9', cursor: 'pointer' }}>{val.ServerUrl}</span>
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
              <Divider type="vertical" />
              <Popconfirm title="确定删除当前镜像?" onConfirm={() => this.remove(record)} onCancel={null}>
                <a>删除</a>
              </Popconfirm>
            </Fragment>
          );
          // return <Link target="_blank" to={{ pathname: `/server/config/build-log/${record.serverUrl}`, search: stringify({ logId: record.id }) }}>构建日志</Link>;
        },
      },
    ];
    return (
      <PageHeaderLayout>
        <Spin size='large' delay={100} spinning={ImageListModel.pageLoading}>
          <Card bordered={false}>
            <div>
              {this.queryForm()}
            </div>
            <Table
              size="middle"
              bordered={true}
              rowKey={record => record.Id}
              columns={columns}
              loading={quetyLoading}
              dataSource={ImageListModel.data}
              pagination={false}
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
