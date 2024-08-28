import React from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import moment from 'moment';
import { todoStore } from '../store/todo';
import { observer } from 'mobx-react';
import { CUSTOM_FORMAT } from '../consts/theme';
import { toJS } from 'mobx';

const { TextArea } = Input;

const dateFormat = 'DD/MM/YY HH:mm';

const today = moment();

function disabledDate(current) {
  /// Check if the current date is before today
  return current && current < moment().startOf('day');
}


class ToDoForm extends React.Component {

  componentWillUnmount() {
    console.log('Component Will Unmount')
    this.props.form.resetFields();
  }


  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form From FormComponent: ', values);
        this.props.onOk(values);

        if (!this.props.form.getFieldValue('id')) {

          //can't use resetFields() as hidden field status & date will be setback to empty, so that need to manually set 
          const { setFieldsValue } = this.props.form;
          setFieldsValue({
            title: "",
            content: "",
            created_at: "",
            is_done: false,
          });
        }
      }
    });
  };

  handleCancel = async (e) => {
    e.preventDefault();
    this.props.onCancel();
  }

  render() {
    const { getFieldDecorator, getFieldError } = this.props.form;
    const titleError = getFieldError('title');
    const contentError = getFieldError('content');
    let todoItem = toJS(todoStore.selectedToDoItem);
    if(todoItem["created_at"]){
      console.log("Have Created At key ")
      console.log(moment(todoItem.created_at));
    }else{
      console.log("No Created At key ")
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label='Date'>
          {getFieldDecorator('created_at', 
          {
            initialValue: todoItem["created_at"] ? moment(todoItem["created_at"] * 1000) : moment(new Date()),
            rules: [{ required: true, message: 'Please select date!' }],
          })(<DatePicker format={CUSTOM_FORMAT.DATE} disabledDate={disabledDate} />)}
        </Form.Item>
        <Form.Item label='Title' validateStatus={titleError ? 'error' : ''} help={titleError || ''}>
          {getFieldDecorator('title', {
            initialValue: todoItem.title || "",
            rules: [{ required: true, message: 'Please input todo title!' }, { max: 20, message: 'Title must not exceed 20 characters!' },],
          })(
            <Input
              placeholder='Title...'
            />)}
        </Form.Item>
        <Form.Item label='Content' validateStatus={contentError ? 'error' : ''} help={contentError || ''}>
          {getFieldDecorator('content', {
            initialValue: todoItem.content || "",
            rules: [{ required: true, message: 'Please input todo content' }],
          })(
            <TextArea
              placeholder='Content...'
            />)}
        </Form.Item>
        <Form.Item style={{ display: 'none' }}>
          {getFieldDecorator('is_done', {
            initialValue: todoItem.is_done || false,
          })(<Input type="hidden" />)}
        </Form.Item>
        <Form.Item style={{ display: 'none' }}>
          {getFieldDecorator('id', {
            initialValue: todoItem.id || ""
          }
          )(<Input type="hidden" />)}
        </Form.Item>
        <Form.Item>
          <Button type="default" onClick={this.handleCancel}>
            Cancel
          </Button>
          <span style={{ margin: '0 8px' }}></span>
          <Button type="primary" htmlType="submit">
            Ok
          </Button>
        </Form.Item>       
      </Form>
    
    );
  }
}

const WrappedForm = Form.create({name: 'form_component'})(ToDoForm);

export default (observer(WrappedForm));
