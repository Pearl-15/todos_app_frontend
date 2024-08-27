
import React from 'react';
import { Button, Icon, Tag, Switch, Popconfirm, message } from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import { observer } from 'mobx-react';
import { todoStore } from '../store/todo';
import { toJS } from 'mobx';
import { THEME_COLOR } from '../consts/theme';


const dateFormat = 'DD/MM/YY';

const StyledToDoCard = styled.div`
  border: 1.5px solid black;
  border-color: ${THEME_COLOR.ORANGE};
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
      "created_at": this.props.created_at,
      "is_done": this.props.is_done
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
      "created_at": this.props.created_at,
      "is_done": this.props.is_done
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
        "created_at": todoStore.selectedToDoItem.created_at,
        "is_done": todoStore.selectedToDoItem.is_done
      },
    })
  }

  resetToDoItem = () => {
    this.setState({
      todoItem: {
        "id": "",
        "title": "",
        "content": "",
        "created_at": "",
        "is_done": ""
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
            {todoItem.is_done ? <Tag color="#3ec166">{todoItem.title}</Tag> : <Tag color="grey">{this.props.title}</Tag>}
          </div>

          <div>
            <StyledSwitch
              checked={todoItem.is_done}
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              onChange={this.handleTaskDone}
            />
          </div>

        </div>
        
        <br></br>
        
        <Tag color="green">Start: {moment.unix(todoItem.created_at).format("DD/MM/YY HH:mm")}</Tag>

        {(todoItem.is_done === true && todoItem.updated_at)
        &&
        <Tag color="red">End: {moment.unix(todoItem.updated_at).format("DD/MM/YY HH:mm")}</Tag>
        }

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

