
import React from 'react';
import { Button, Icon, Tag, Switch, Popconfirm, message } from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import { observer } from 'mobx-react';
import { todoStore } from '../store/todo';
import { CUSTOM_FORMAT, THEME_COLOR } from '../consts/theme';


const dateFormat = 'DD/MM/YY';

const StyledToDoCard = styled.div`
  border: 1.5px solid black;
  border-color: ${THEME_COLOR.ORANGE};
  padding: 10px;
  border-radius: 0.8rem; 

`;

export const StyledSwitch = styled(Switch)`
  margin-inline-right: 40em;
  &.ant-switch-checked {
    background-color: ${THEME_COLOR.GREEN};
  }  
`

class ToDoItem extends React.Component {

  constructor(props){
    super(props);
    
  }

  handleEdit = async() => {
    let currentItem = this.props.todoItem;
    todoStore.setSelectedToDoItem(currentItem);
    await this.props.onEdit(currentItem.id);
  }

  handleDelete = () => {
    this.props.onDelete(this.props.todoItem.id);
  };

  handleTaskDone = (e) => {
    console.log('target : ', e)
    let currentItem = this.props.todoItem;
    todoStore.setSelectedToDoItem(currentItem);
    this.props.onChangeStatus(e, currentItem.id);
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
            {todoItem.is_done ? <Tag color={THEME_COLOR.GREEN}>{todoItem.title}</Tag> : <Tag color="grey">{todoItem.title}</Tag>}
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
        
        <Tag color="green">Start: {moment.unix(todoItem.created_at).format(CUSTOM_FORMAT.DATE)}</Tag>

        {(todoItem.is_done === true && todoItem.updated_at)
        &&
        <Tag color="red">End: {moment.unix(todoItem.updated_at).format(CUSTOM_FORMAT.DATE)}</Tag>
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

