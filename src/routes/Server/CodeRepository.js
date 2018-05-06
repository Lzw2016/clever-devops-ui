import React, { PureComponent } from 'react';
import { Card, Form, Table, Divider, Popconfirm, Spin, Row, Select, Input, Button } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { AuthorizationTypeMapper, LanguageMapper, RepositoryTypeMapper, LanguageArray, RepositoryTypeArray, AuthorizationTypeArray } from '../../utils/enum';
// import classNames from 'classnames';
import styles from './CodeRepository.less'

@connect(({ CodeRepositoryModel, loading }) => ({
  CodeRepositoryModel,
  quetyLoading: loading.effects['CodeRepositoryModel/findCodeRepository'],
}))
@Form.create()
export default class CodeRepository extends PureComponent {

  // 数据初始化
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'CodeRepositoryModel/findCodeRepository' });
  }

  // 查询数据
  findCodeRepository = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, formValues) => {
      if (err) return;
      dispatch({ type: 'CodeRepositoryModel/findCodeRepository', payload: { ...formValues, pageNo: 0 } });
    });
  }

  // 表格数据过滤或跳页
  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, CodeRepositoryModel } = this.props;
    const queryParam = { ...CodeRepositoryModel.queryParam, pageNo: pagination.current, pageSize: pagination.pageSize };
    if (sorter.field) {
      queryParam.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({ type: 'CodeRepositoryModel/findCodeRepository', payload: queryParam });
  }

  // 查询表单
  queryForm() {
    const { form: { getFieldDecorator }, CodeRepositoryModel: { queryParam } } = this.props;
    return (
      <Form onSubmit={this.findCodeRepository} layout="inline" className={styles.queryForm}>
        <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
          <Form.Item label="项目名称">
            {getFieldDecorator('projectName', { initialValue: queryParam.projectName })(
              <Input placeholder="项目名称(模糊匹配)" />
            )}
          </Form.Item>
          <Form.Item label="项目语言">
            {getFieldDecorator('language', { initialValue: queryParam.language })(
              <Select placeholder="项目语言" allowClear={true}>
                {LanguageArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="仓库类型">
            {getFieldDecorator('repositoryType', { initialValue: queryParam.repositoryType })(
              <Select placeholder="仓库类型" allowClear={true}>
                {RepositoryTypeArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="访问授权">
            {getFieldDecorator('authorizationType', { initialValue: queryParam.authorizationType })(
              <Select placeholder="访问授权" allowClear={true}>
                {AuthorizationTypeArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
              </Select>
            )}
          </Form.Item>
          <Form.Item className={styles.formItemButton}>
            <Button type="primary" htmlType="submit">查询</Button>
          </Form.Item>
        </Row>
      </Form >
    );
  }

  render() {
    const { dispatch, CodeRepositoryModel, quetyLoading } = this.props;
    // 表格数据列配置
    const columns = [
      { title: '项目名称', dataIndex: 'projectName', key: 'projectName', render: (val, record) => (<Link to={`/server/repository/detail/${record.id}`}>{val}</Link>) },
      { title: '项目语言', dataIndex: 'language', key: 'language', render: val => LanguageMapper[val].label },
      { title: '仓库类型', dataIndex: 'repositoryType', key: 'repositoryType', render: val => RepositoryTypeMapper[val].label },
      { title: '代码仓库地址', dataIndex: 'repositoryUrl', key: 'repositoryUrl', render: val => <a target="_blank" href={val}>{val}</a> },
      { title: '访问授权', dataIndex: 'authorizationType', key: 'authorizationType', render: val => AuthorizationTypeMapper[val].label },
      { title: '创建时间', dataIndex: 'createDate', key: 'createDate' },
      {
        title: '操作',
        align: 'center',
        render: (val, record) => (
          <div>
            <a onClick={() => this.setUpdateCodeRepositoryModalShow(true, record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除当前数据?" onConfirm={() => dispatch({ type: 'CodeRepositoryModel/deleteRepository', payload: record })} onCancel={null}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => dispatch({ type: 'CodeRepositoryModel/testConnect', payload: record })}>连接测试</a>
          </div>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <Spin size='large' delay={100} spinning={CodeRepositoryModel.pageLoading}>
          <Card bordered={false}>
            <div>
              {this.queryForm()}
            </div>
            <Table
              size="middle"
              bordered={true}
              rowKey={record => record.id}
              columns={columns}
              loading={quetyLoading}
              dataSource={CodeRepositoryModel.data}
              pagination={CodeRepositoryModel.pagination}
              onChange={this.handleTableChange}
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
