import React from 'react';
import { Dropdown, Menu, Button, Icon } from 'antd';
import { THEME_COLOR } from '../consts/theme';

class SelectTaskDropdown extends React.Component{
    
    handleMenuClick = (e)=>{
        console.log("Selected : ", e.key);
        this.props.onFilter(e.key);
    }
  

    render(){

        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="all">
                    All
                </Menu.Item>
                <Menu.Item key="done">
                    Done
                </Menu.Item>
                <Menu.Item key="not_done">
                    Not Done
                </Menu.Item>
            </Menu>
        )
        return(
            <div>
            <Dropdown overlay={menu} placement="bottomLeft">
                <Button style={{ color: THEME_COLOR.ORANGE, borderColor: THEME_COLOR.ORANGE}}>
                    Select Task <Icon type="down"></Icon>
                </Button>
            </Dropdown>
          </div>
        )
    }
}

export default SelectTaskDropdown;