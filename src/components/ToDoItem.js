
import React from 'react';
import { Button, Icon, Tag, Switch, Popconfirm, message } from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import { observer } from 'mobx-react';
import { todoStore } from '../store/todo';
import { toJS } from 'mobx';


const dateFormat = 'DD/MM/YY';

const StyledToDoCard = styled.div`
  border: 1.5px solid black;
  border-color: #f5ba13;
  padding: 10px;
  border-radius: 0.8rem; 

`;

const StyledSwitch = styled(Switch)`
  margin-inline-right: 40em;
  &.ant-switch-checked {
    background-color: #3ec166;
  }  
`

class ToDoItem extends React.Component {

  constructor(props){
    super(props);
    
  }

  handleEdit = async() => {
    let selectedToDoItem = {
      "id":this.props.id,
      "title": this.props.title,
      "content": this.props.content,
      "date": this.props.date,
      "status": this.props.status
    }
  
    todoStore.setSelectedToDoItem(selectedToDoItem);
    await this.props.onEdit(this.props.id);
  }

  handleDelete = () => {
    this.props.onDelete(this.props.id);
  };

  handleTaskDone = (e) => {
    console.log('target : ', e)

    let selectedToDoItem = {
      "id":this.props.id,
      "title": this.props.title,
      "content": this.props.content,
      "date": this.props.date,
      "status": this.props.status
    }
    todoStore.setSelectedToDoItem(selectedToDoItem);
    this.props.onChangeStatus(e, this.props.id);
  }

  setToDoItem = () =>{
    this.setState({
      todoItem: {
        "id": todoStore.selectedToDoItem.id,
        "title": todoStore.selectedToDoItem.title,
        "content": todoStore.selectedToDoItem.content,
        "status": todoStore.selectedToDoItem.status,
        "date": todoStore.selectedToDoItem.date
      },
    })
  }

  resetToDoItem = () => {
    this.setState({
      todoItem: {
        "id": "",
        "title": "",
        "content": "",
        "status": "",
        "date": ""
      },
    })
  }

  formatDate = (date) => {
    return (moment(date).format(dateFormat))
  }
  
  render() {
    // let todoItem = this.state.todoItem;
    let todoItem = this.props.todoItem;
    return (
      <StyledToDoCard>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {todoItem.status ? <Tag color="#3ec166">{todoItem.title}</Tag> : <Tag color="grey">{this.props.title}</Tag>}
          </div>

          <div>
            <StyledSwitch
              checked={todoItem.status}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              onChange={this.handleTaskDone}
            />
          </div>

        </div>
        
        <br></br>

        <Tag>{this.formatDate(todoItem.date)}</Tag>

        <p>{todoItem.content}</p>
        <Popconfirm
          title="Are you sure delete this todo?"
          onConfirm={this.handleDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" size="small" shape="circle">
          <Icon type="delete" />
          </Button>
        </Popconfirm>
        <Button onClick={this.handleEdit} type="primary" size="small" shape="circle">
          <Icon type="edit" />
        </Button>
      </StyledToDoCard>
    );
  }
}

export default observer(ToDoItem);

