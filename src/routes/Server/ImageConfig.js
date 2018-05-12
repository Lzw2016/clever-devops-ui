import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Card, Form, Table, Divider, Popconfirm, Row, Input, Select, Button, Badge, Popover } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ImageConfigAdd from './ImageConfigAdd';
import ImageConfigUpdate from './ImageConfigUpdate';
import { LanguageMapper, LanguageArray, RepositoryTypeArray, RepositoryTypeMapper, BuildStateArray, BuildTypeArray, BuildStateMapper, AuthorizationTypeMapper } from '../../utils/enum';
// import classNames from 'classnames';
import styles from './ImageConfig.less'

@connect(({ ImageConfigModel, loading }) => ({
  ImageConfigModel,
  quetyLoading: loading.effects['ImageConfigModel/findImageConfig'],
  addLoading: loading.effects['ImageConfigModel/addImageConfig'],
  updateLoading: loading.effects['ImageConfigModel/updateImageConfig'],
  getEditAllGitBranchLoading: loading.effects['ImageConfigModel/getEditAllGitBranch'],
}))
@Form.create()
export default class ImageConfig extends PureComponent {

  // 数据初始化
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'ImageConfigModel/findImageConfig' });
  }

  // 查询数据
  findImageConfig = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, formValues) => {
      if (err) return;
      dispatch({ type: 'ImageConfigModel/findImageConfig', payload: { ...formValues, pageNo: 0 } });
    });
  }

  // 表格数据过滤或跳页
  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, ImageConfigModel } = this.props;
    const queryParam = { ...ImageConfigModel.queryParam, pageNo: pagination.current, pageSize: pagination.pageSize };
    if (sorter.field) {
      queryParam.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({ type: 'ImageConfigModel/findImageConfig', payload: queryParam });
  }

  // 查询表单
  queryForm() {
    const { form: { getFieldDecorator }, ImageConfigModel: { queryParam } } = this.props;
    return (
      <Form onSubmit={this.findImageConfig} layout="inline" className={styles.queryForm}>
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
          <Form.Item label="代码地址">
            {getFieldDecorator('repositoryUrl', { initialValue: queryParam.repositoryUrl })(
              <Input placeholder="代码地址(模糊匹配)" />
            )}
          </Form.Item>
        </Row>
        <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
          <Form.Item label="代码分支">
            {getFieldDecorator('branch', { initialValue: queryParam.branch })(
              <Input placeholder="代码分支(模糊匹配)" />
            )}
          </Form.Item>
          <Form.Item label="代码CommitID">
            {getFieldDecorator('commitId', { initialValue: queryParam.commitId })(
              <Input placeholder="代码CommitID" />
            )}
          </Form.Item>
          <Form.Item label="编译方式">
            {getFieldDecorator('buildType', { initialValue: queryParam.buildType })(
              <Select placeholder="编译方式" allowClear={true}>
                {BuildTypeArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="编译脚本">
            {getFieldDecorator('buildCmd', { initialValue: queryParam.buildCmd })(
              <Input placeholder="编译脚本(模糊匹配)" />
            )}
          </Form.Item>
        </Row>
        <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
          <Form.Item label="构建状态">
            {getFieldDecorator('buildState', { initialValue: queryParam.buildState })(
              <Select placeholder="构建状态" allowClear={true}>
                {BuildStateArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="服务地址">
            {getFieldDecorator('serverUrl', { initialValue: queryParam.serverUrl })(
              <Input placeholder="服务地址(模糊匹配)" />
            )}
          </Form.Item>
          <Form.Item label="服务端口">
            {getFieldDecorator('serverPorts', { initialValue: queryParam.serverPorts })(
              <Input placeholder="服务端口(模糊匹配)" />
            )}
          </Form.Item>
          <Form.Item>
            <span className={styles.spanWidth25} />
            <Button type="primary" htmlType="submit">查询</Button>
            <span className={styles.spanWidth16} />
            <Button type="primary" onClick={this.addImageConfigShow}>新增</Button>
          </Form.Item>
        </Row>
      </Form >
    );
  }

  // 编辑 - 保存表单
  saveUpdateFormRef = (updateFormRef) => {
    this.updateFormRef = updateFormRef;
  }

  // 编辑 - 显示
  editImageConfigShow = (row) => {
    const { props: { dispatch }, updateFormRef: { props: { form } } } = this;
    form.resetFields();
    dispatch({ type: 'ImageConfigModel/save', payload: { editImageConfigData: row, editImageConfigShow: true, editAllGitBranch: [] } });
    const { authorizationInfo, authorizationType, repositoryUrl } = row;
    dispatch({ type: 'ImageConfigModel/getEditAllGitBranch', payload: { authorizationInfo, authorizationType, repositoryUrl } });
  }

  // 编辑 - 隐藏
  editImageConfigHide = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'ImageConfigModel/save', payload: { editImageConfigShow: false } });
  }

  // 编辑 - 确定更新
  updateImageConfig = () => {
    const { props: { dispatch, ImageConfigModel: { editImageConfigData } }, updateFormRef: { props: { form } } } = this;
    form.validateFields((err, values) => {
      if (err) return;
      dispatch({ type: 'ImageConfigModel/updateImageConfig', payload: { ...values, id: editImageConfigData.id } });
      form.resetFields();
    });
  }

  // 新增 - 保存表单
  saveAddFormRef = (addFormRef) => {
    this.addFormRef = addFormRef;
  }

  // 新增 - 显示
  addImageConfigShow = () => {
    const { props: { dispatch, ImageConfigModel: { repositoryData } }, addFormRef: { props: { form } } } = this;
    form.resetFields();
    if (!repositoryData || repositoryData.length <= 0) {
      dispatch({ type: 'ImageConfigModel/findCodeRepository', payload: { projectName: '' } });
    }
    dispatch({ type: 'ImageConfigModel/save', payload: { addImageConfigShow: true } });
  }

  // 新增 - 隐藏
  addImageConfigHide = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'ImageConfigModel/save', payload: { addImageConfigShow: false } });
  }

  // 新增 - 确定新增
  addImageConfig = () => {
    const { props: { dispatch }, addFormRef: { props: { form } } } = this;
    form.validateFields((err, values) => {
      if (err) return;
      dispatch({ type: 'ImageConfigModel/addImageConfig', payload: { ...values } });
      form.resetFields();
    });
  }

  render() {
    const { dispatch, ImageConfigModel, quetyLoading, addLoading, updateLoading, getEditAllGitBranchLoading } = this.props;
    // 表格数据列配置
    const columns = [
      {
        title: '项目名称', dataIndex: 'projectName', render: (val, record) => {
          let language = LanguageMapper[`${record.language}`];
          if (!language) language = LanguageMapper.error;
          let repositoryType = RepositoryTypeMapper[`${record.repositoryType}`];
          if (!repositoryType) repositoryType = RepositoryTypeMapper.error;
          let authorizationType = AuthorizationTypeMapper[`${record.authorizationType}`];
          if (!authorizationType) authorizationType = AuthorizationTypeMapper.error;
          const content = (
            <div>
              <div>
                <div className={styles.rowLabelCenter}>点击连接查看项目详情</div>
              </div>
              <div>
                <span className={styles.colLabel}>项目名称:</span>
                <span className={styles.colValue}>{record.projectName}</span>
              </div>
              <div>
                <span className={styles.colLabel}>项目语言:</span>
                <span className={styles.colValue}>{language.label}</span>
              </div>
              <div>
                <span className={styles.colLabel}>仓库类型:</span>
                <span className={styles.colValue}>{repositoryType.label}</span>
              </div>
              <div>
                <span className={styles.colLabel}>代码地址:</span>
                <span className={styles.colValue}>
                  <a target='_blank' href={record.repositoryUrl}>{record.repositoryUrl}</a>
                </span>
              </div>
              <div>
                <span className={styles.colLabel}>访问授权:</span>
                <span className={styles.colValue}>{authorizationType.label}</span>
              </div>
              <div>
                <span className={styles.colLabel}>创建时间:</span>
                <span className={styles.colValue}>{record.createDate}</span>
              </div>
            </div>
          );
          return (
            <Popover content={content} placement="right">
              <Link to={`/server/repository/detail/${record.repositoryId}`}>{val}</Link>
            </Popover>
          )
        },
      },
      { title: '服务域名', dataIndex: 'serverUrl', render: val => <a target='_blank' href={`http://${val}`}>{val}</a> },
      { title: '服务端口', dataIndex: 'serverPorts' },
      { title: '默认服务数', dataIndex: 'serverCount' },
      {
        title: '项目语言', dataIndex: 'language', render: val => {
          let language = LanguageMapper[`${val}`];
          if (!language) {
            language = LanguageMapper.error;
          }
          return language.label;
        },
      },
      { title: '代码分支', dataIndex: 'branch' },
      { title: '编译方式', dataIndex: 'buildType' },
      { title: 'Dockerfile', dataIndex: 'dockerFilePath' },
      {
        title: '构建状态', dataIndex: 'buildState', render: val => {
          let buildState = BuildStateMapper[`${val}`];
          if (!buildState) {
            buildState = BuildStateMapper.error;
          }
          return <Badge status={buildState.badgeStatus} text={buildState.label} />;
        },
      },
      { title: '上次构建时间', dataIndex: 'buildEndTime' },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (val, record) => (
          <div>
            <a onClick={() => this.editImageConfigShow(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除当前数据?" onConfirm={() => dispatch({ type: 'ImageConfigModel/deleteImageConfig', payload: record })} onCancel={null}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Link to={`/server/config/detail/${record.serverUrl}`}>详情</Link>
            <Divider type="vertical" />
            <Link target="_blank" to={`/server/config/build/${record.serverUrl}`}>构建</Link>
          </div>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <Spin size='large' delay={100} spinning={ImageConfigModel.pageLoading}>
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
              dataSource={ImageConfigModel.data}
              pagination={ImageConfigModel.pagination}
              onChange={this.handleTableChange}
            />
          </Card>
        </Spin>
        <ImageConfigUpdate
          wrappedComponentRef={this.saveUpdateFormRef}
          ImageConfigData={ImageConfigModel.editImageConfigData}
          allGitBranch={ImageConfigModel.editAllGitBranch}
          getAllGitBranchLoading={getEditAllGitBranchLoading}
          visible={ImageConfigModel.editImageConfigShow}
          confirmLoading={updateLoading}
          onCancel={this.editImageConfigHide}
          onCreate={this.updateImageConfig}
        />
        <ImageConfigAdd
          wrappedComponentRef={this.saveAddFormRef}
          ImageConfigData={ImageConfigModel.addImageConfigData}
          visible={ImageConfigModel.addImageConfigShow}
          confirmLoading={addLoading}
          onCancel={this.addImageConfigHide}
          onCreate={this.addImageConfig}
        />
      </PageHeaderLayout>
    );
  }
}
