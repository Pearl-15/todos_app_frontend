import React from 'react';
import {Button, Dropdown, Menu, Icon} from 'antd';
import { THEME_COLOR } from '../consts/theme';

class ExportCSVBtn extends React.Component{

    handleOnChange = (option) => {
        this.props.onChange(option);
    }
 
    render(){

        const menu = (
            <Menu>
                <Menu.Item onClick={() => this.handleOnChange("all")}>
                    <Icon type="export" />
                    All
                </Menu.Item>
                <Menu.Item onClick={() => this.handleOnChange("current_table")}>
                    <Icon type="export" />
                    Current Table
                </Menu.Item>
            </Menu>
        );
        return(
            <Dropdown overlay={menu} placement="bottomLeft">
                <Button style={{ color: THEME_COLOR.ORANGE, borderColor: THEME_COLOR.ORANGE}}>
                    <Icon type="export" />
                    Export CSV
                    <Icon type="down" />      
                </Button>
            </Dropdown>
        )
    }
}

export default ExportCSVBtn;