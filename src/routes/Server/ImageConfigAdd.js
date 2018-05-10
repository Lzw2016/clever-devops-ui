import React, { PureComponent } from 'react';
import { Modal, Form, Input, Row, Select, InputNumber, Spin } from 'antd';
import { BuildTypeArray } from '../../utils/enum';
import styles from './ImageConfigAdd.less';

@Form.create()
export default class ImageConfigAdd extends PureComponent {
  render() {
    const { ImageConfigData, allGitBranch, getAllGitBranchLoading, visible, confirmLoading, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    // 设置默认值
    if (ImageConfigData) {
      if (!ImageConfigData.dockerFilePath) ImageConfigData.dockerFilePath = './Dockerfile';
      if (!ImageConfigData.buildCmd) ImageConfigData.buildCmd = 'clean package -Dmaven.test.skip=true';
      if (!ImageConfigData.serverCount) ImageConfigData.serverCount = 5;
      if (!ImageConfigData.serverPorts) ImageConfigData.serverPorts = '9066';
    }
    return (
      <Modal width={600} visible={visible} confirmLoading={confirmLoading} title="新增服务配置" okText="新增" onCancel={onCancel} onOk={onCreate} maskClosable={false} >
        <Form layout="inline" className={styles.form}>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="项目名称">
              {getFieldDecorator('projectName', {
                initialValue: ImageConfigData ? ImageConfigData.projectName : undefined,
                rules: [{ required: true, whitespace: true, message: '项目名称必填' }],
              })(
                <Select placeholder="请输入" allowClear={true} />
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="服务域名">
              {getFieldDecorator('serverUrl', {
                initialValue: ImageConfigData ? ImageConfigData.serverUrl : undefined,
                rules: [{ required: true, whitespace: true, message: '服务域名必填' }],
              })(
                <Input placeholder="请输入" />
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="版本分支">
              {getFieldDecorator('branch', {
                initialValue: ImageConfigData ? ImageConfigData.branch : undefined,
                rules: [{ required: true, message: '版本分支必填' }],
              })(
                <Select placeholder="请选择" allowClear={true} showSearch={false} notFoundContent={getAllGitBranchLoading ? <Spin size="small" /> : null}>
                  <Select.OptGroup label="Branch">
                    {allGitBranch
                      .filter(item => item.branch.indexOf('refs/heads/') !== -1)
                      .map(item => (<Select.Option key={item.commitId} value={item.branch}>{item.branch}</Select.Option>))}
                  </Select.OptGroup>
                  <Select.OptGroup label="Tag">
                    {allGitBranch
                      .filter(item => item.branch.indexOf('refs/tags/') !== -1)
                      .map(item => (<Select.Option key={item.commitId} value={item.branch}>{item.branch}</Select.Option>))}
                  </Select.OptGroup>
                </Select>
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="Dockerfile位置">
              {getFieldDecorator('dockerFilePath', {
                initialValue: ImageConfigData ? ImageConfigData.dockerFilePath : undefined,
                rules: [{ required: true, whitespace: true, message: 'Dockerfile位置必填' }],
              })(
                <Input placeholder="请输入" />
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="编译类型">
              {getFieldDecorator('buildType', {
                initialValue: ImageConfigData ? ImageConfigData.buildType : undefined,
                rules: [{ required: true, message: '编译类型必填' }],
              })(
                <Select placeholder="请选择" allowClear={true}>
                  {BuildTypeArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
                </Select>
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="编译脚本">
              {getFieldDecorator('buildCmd', {
                initialValue: ImageConfigData ? ImageConfigData.buildCmd : undefined,
                rules: [{ required: true, whitespace: true, message: '编译脚本必填' }],
              })(
                <Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入" />
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="服务数量">
              {getFieldDecorator('serverCount', {
                initialValue: ImageConfigData ? ImageConfigData.serverCount : undefined,
                rules: [{ required: true, type: 'number', whitespace: true, message: '服务数量必填' }],
              })(
                <InputNumber min={1} max={10} placeholder="请输入" />
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="服务端口">
              {getFieldDecorator('serverPorts', {
                initialValue: ImageConfigData ? ImageConfigData.serverPorts : undefined,
                rules: [{ required: true, whitespace: true, message: '服务端口必填' }],
              })(
                <Input placeholder="多个用“,”分隔" />
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="项目描述">
              {getFieldDecorator('description', {
                initialValue: ImageConfigData ? ImageConfigData.description : undefined,
                rules: [{ whitespace: true, max: 200, message: '不能超过200个字符' }],
              })(
                <Input.TextArea autosize={{ minRows: 1, maxRows: 3 }} placeholder="请输入" />
              )}
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    );
  }
}
