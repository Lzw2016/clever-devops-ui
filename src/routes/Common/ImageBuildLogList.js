import React, { PureComponent, Fragment } from 'react';
import { Link } from 'dva/router';
import { stringify } from 'qs';
import { Table, Form, Row, Input, Select, Button, Badge } from 'antd';
import { BuildStateArray, BuildStateMapper } from '../../utils/enum';
// import classNames from 'classnames';
import styles from './ImageBuildLogList.less'

@Form.create()
export default class ImageBuildLogList extends PureComponent {

  // 数据初始化
  componentDidMount() {
  }

  // 查询数据
  findImageBuildLog = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, formValues) => {
      if (err) return;
      dispatch({ type: 'ImageConfigDetailModel/findImageBuildLog', payload: { ...formValues, pageNo: 0 } });
    });
  }

  // 表格数据过滤或跳页
  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const queryParam = { ...this.props.queryParam, pageNo: pagination.current, pageSize: pagination.pageSize };
    if (sorter.field) {
      queryParam.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({ type: 'ImageConfigDetailModel/findImageBuildLog', payload: queryParam });
  }

  // 查询表单
  queryForm() {
    const { form: { getFieldDecorator }, queryParam } = this.props;
    return (
      <Form onSubmit={this.findImageBuildLog} layout="inline" className={styles.queryForm}>
        <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
          <Form.Item label="代码CommitID" className={styles.formInput300}>
            {getFieldDecorator('commitId', { initialValue: queryParam.commitId })(
              <Input placeholder="代码CommitID" />
            )}
          </Form.Item>
          <Form.Item label="编译脚本">
            {getFieldDecorator('buildCmd', { initialValue: queryParam.buildCmd })(
              <Input placeholder="编译脚本(模糊匹配)" />
            )}
          </Form.Item>
          <Form.Item label="构建状态">
            {getFieldDecorator('buildState', { initialValue: queryParam.buildState })(
              <Select placeholder="构建状态" allowClear={true}>
                {BuildStateArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">查询</Button>
          </Form.Item>
        </Row>
      </Form >
    );
  }

  render() {
    const { quetyLoading, data, pagination } = this.props;
    // 表格数据列配置
    const columns = [
      { title: '项目名称', dataIndex: 'projectName' },
      // { title: '代码仓库地址', dataIndex: 'repositoryUrl' },
      // { title: 'Branch', dataIndex: 'branch' },
      { title: 'CommitID', dataIndex: 'commitId' },
      { title: '编译方式', dataIndex: 'buildType' },
      { title: '服务端口', dataIndex: 'serverPorts' },
      {
        title: '构建状态', dataIndex: 'buildState', render: val => {
          let buildState = BuildStateMapper[`${val}`];
          if (!buildState) {
            buildState = BuildStateMapper.error;
          }
          return <Badge status={buildState.badgeStatus} text={buildState.label} />;
        },
      },
      { title: '镜像名称', dataIndex: 'imageName' },
      { title: 'Docker镜像ID', dataIndex: 'imageId' },
      { title: '开始构建时间', dataIndex: 'buildStartTime' },
      { title: '结束构建时间', dataIndex: 'buildEndTime' },
      {
        title: '操作',
        align: 'center',
        key: 'action',
        render: (val, record) => {
          return <Link target="_blank" to={{ pathname: `/server/config/build-log/${record.serverUrl}`, search: stringify({ logId: record.id }) }}>构建日志</Link>;
        },
      },
    ];
    return (
      <Fragment>
        <div>
          {this.queryForm()}
        </div>
        <Table
          size="middle"
          bordered={true}
          rowKey={record => record.id}
          columns={columns}
          loading={quetyLoading}
          dataSource={data}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
      </Fragment>
    );
  }
}
