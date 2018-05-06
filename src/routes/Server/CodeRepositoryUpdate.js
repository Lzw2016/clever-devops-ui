import React, { PureComponent } from 'react';
import { Modal, Form, Input, Row, Select } from 'antd';
import { LanguageArray, RepositoryTypeArray, AuthorizationTypeArray } from '../../utils/enum';
import styles from './CodeRepositoryUpdate.less';


@Form.create()
export default class CodeRepositoryUpdate extends PureComponent {
  render() {
    const { CodeRepositoryData, visible, confirmLoading, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal width={600} visible={visible} confirmLoading={confirmLoading} title="编辑服务代码仓库" okText="更新" onCancel={onCancel} onOk={onCreate} maskClosable={false} >
        <Form layout="inline" className={styles.form}>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="项目名称">
              {getFieldDecorator('projectName', {
                initialValue: CodeRepositoryData ? CodeRepositoryData.projectName : undefined,
                rules: [{ required: true, whitespace: true, message: '项目名称必填' }],
              })(
                <Input placeholder="请输入" />
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="项目语言">
              {getFieldDecorator('language', {
                initialValue: CodeRepositoryData ? CodeRepositoryData.language : undefined,
                rules: [{ required: true, message: '项目语言必填' }],
              })(
                <Select placeholder="请选择" allowClear={true}>
                  {LanguageArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
                </Select>
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="仓库类型">
              {getFieldDecorator('repositoryType', {
                initialValue: CodeRepositoryData ? CodeRepositoryData.repositoryType : undefined,
                rules: [{ required: true, message: '仓库类型必填' }],
              })(
                <Select placeholder="请选择" allowClear={true}>
                  {RepositoryTypeArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
                </Select>
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="代码仓库地址">
              {getFieldDecorator('repositoryUrl', {
                initialValue: CodeRepositoryData ? CodeRepositoryData.repositoryUrl : undefined,
                rules: [{ required: true, whitespace: true, message: '代码仓库地址必填' }],
              })(
                <Input placeholder="请输入" />
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="访问授权">
              {getFieldDecorator('authorizationType', {
                initialValue: CodeRepositoryData ? CodeRepositoryData.authorizationType : undefined,
                rules: [{ required: true, message: '访问授权必填' }],
              })(
                <Select placeholder="请选择" allowClear={true}>
                  {AuthorizationTypeArray.map(item => (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
                </Select>
              )}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="访问授权信息">
              {getFieldDecorator('authorizationInfo', {
                initialValue: CodeRepositoryData ? CodeRepositoryData.authorizationInfo : undefined,
              })(<Input.TextArea autosize={{ minRows: 3, maxRows: 6 }} placeholder="请输入" />)}
            </Form.Item>
          </Row>
          <Row gutter={{ md: 12, lg: 12, xl: 12 }}>
            <Form.Item label="项目描述">
              {getFieldDecorator('description', {
                initialValue: CodeRepositoryData ? CodeRepositoryData.description : undefined,
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
