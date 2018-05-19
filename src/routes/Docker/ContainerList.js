import React, { PureComponent, Fragment } from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Spin, Card, Form, Table, Divider, Popconfirm, Row, Input, Select, Button, Badge, Popover, Icon, Tag, Menu, Dropdown } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { bitToMB } from '../../utils/fmt';
import { ContainerStateArray, DevopsFlagArray, LanguageArray, ContainerStateMapper } from '../../utils/enum';
// import classNames from 'classnames';
import styles from './ContainerList.less'

@connect(({ ContainerListModel, loading }) => ({
  ContainerListModel,
  quetyLoading: loading.effects['ContainerListModel/findContainers'],
}))
@Form.create()
export default class ContainerList extends PureComponent {

  // 数据初始化
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'ContainerListModel/findContainers' });
  }

  // 查询数据
  findContainers = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, formValues) => {
      if (err) return;
      dispatch({ type: 'ContainerListModel/findContainers', payload: { ...formValues } });
    });
  }

  // 查询表单
  queryForm() {
    const { form: { getFieldDecorator }, ContainerListModel: { queryParamProxy } } = this.props;
    return (
      <Form onSubmit={this.findContainers} layout="inline" className={styles.queryForm}>
        <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
          <Form.Item label="容器状态">
            {getFieldDecorator('withStatus', { initialValue: queryParamProxy.withStatus })(
              <Select placeholder="容器状态" allowClear={true}>
                {ContainerStateArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
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

  start = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: 'ContainerListModel/start', payload: record });
  }

  render() {
    const { dispatch, ContainerListModel, quetyLoading } = this.props;
    // 表格数据列配置
    const columns = [
      {
        title: '容器名', dataIndex: 'Names', render: (val, record) => {
          return val.map((item, index) => (
            <Fragment key={item}>
              {index > 0 ? <br /> : ''}
              <span style={{ color: '#108ee9', cursor: 'pointer' }}>{item}</span>
            </Fragment>
          ));
        },
      },
      {
        title: 'Label信息', dataIndex: 'Labels', render: val => {
          if (!val.DevopsFlag || val.DevopsFlag !== 'true') {
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
      {
        title: '容器状态', dataIndex: 'State', render: (val, record) => {
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
        title: '镜像名', dataIndex: 'Image', render: val => {
          if (lodash.startsWith(val, 'sha256:') && val.length === 71) {
            return val.substring(7, 19);
          }
          return val;
        },
      },
      {
        title: 'IP地址', dataIndex: 'NetworkSettings', render: val => {
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
        title: '端口映射', dataIndex: 'Ports', render: val => {
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
      { title: '容器大小', dataIndex: 'SizeRootFs', render: val => `${bitToMB(val)}MB` },
      { title: '创建时间', dataIndex: 'Created', render: val => moment.unix(val).format('YYYY-MM-DD HH:mm:ss') },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (val, record) => {
          const menu = (
            <Menu>
              {lodash.indexOf(['created', 'exited'], record.State) !== -1 ? (
                <Menu.Item key="0">
                  <a onClick={() => this.start(record)}>启动</a>
                </Menu.Item>
              ) : ''}
              {lodash.indexOf(['running'], record.State) !== -1 ? (
                <Menu.Item key="1">
                  <a onClick={null}>停止</a>
                </Menu.Item>
              ) : ''}
              {lodash.indexOf(['running', 'paused', 'restarting'], record.State) !== -1 ? (
                <Menu.Item key="2">
                  <a onClick={null}>强制停止</a>
                </Menu.Item>
              ) : ''}
              {lodash.indexOf(['running', 'exited', 'paused'], record.State) !== -1 ? (
                <Menu.Item key="3">
                  <a onClick={null}>重启</a>
                </Menu.Item>
              ) : ''}
              <Menu.Divider />
              {lodash.indexOf(['running'], record.State) !== -1 ? (
                <Menu.Item key="4">
                  <a onClick={null}>暂停</a>
                </Menu.Item>
              ) : ''}
              {lodash.indexOf(['paused'], record.State) !== -1 ? (
                <Menu.Item key="5">
                  <a onClick={null}>继续</a>
                </Menu.Item>
              ) : ''}
              <Menu.Divider />
              <Menu.Item key="6">
                <a onClick={null}>删除</a>
              </Menu.Item>
            </Menu>
          );
          return (
            <Fragment>
              <a onClick={null}>详情</a>
              <Divider type="vertical" />
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" href="#">
                  操作<Icon type="down" />
                </a>
              </Dropdown>
            </Fragment>
          );
          // return <Link target="_blank" to={{ pathname: `/server/config/build-log/${record.serverUrl}`, search: stringify({ logId: record.id }) }}>构建日志</Link>;
        },
      },
    ];
    return (
      <PageHeaderLayout>
        <Spin size='large' delay={100} spinning={ContainerListModel.pageLoading}>
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
              dataSource={ContainerListModel.data}
              pagination={false}
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
