import React from 'react';
import { Button, Modal } from 'antd';
import styled from 'styled-components';
import 'antd/dist/antd.css';
import { THEME_COLOR } from '../consts/theme';

const StyledButton = styled(Button)`
font-weight: bold;

  &:hover {
    background-color: #f5ba13;
    border-color: #f5ba13;
    color: white;
  }
`;

export const StyledModal = styled(Modal)`
 .ant-modal-body{
    background-color: ${THEME_COLOR.WHEAT};
 }
 .ant-form-item-label{
    font-weight: bold;
 }
 .ant-input{
    border-radius: 0.5rem;
 }
`;



class AddToDoButton extends React.Component {

  handleAddToDo = ()=>{
    this.props.onAdd();
  }  
  render(){
   
    return (
        <div>
        <StyledButton type="primary" onClick={this.handleAddToDo}>
          Add ToDo
        </StyledButton> 
        </div>
    );
  }
}
export default AddToDoButton;
