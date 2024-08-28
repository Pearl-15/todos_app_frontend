import React from 'react';
import styled from 'styled-components';
import { Layout, Button, Row, Col, Avatar, Divider } from "antd";
import { Auth } from 'aws-amplify';
import { authStore } from '../store/auth';
import { THEME_COLOR } from '../consts/theme';
const { Header } = Layout;



const StyledHeader = styled(Header)`
    background-color: ${THEME_COLOR.ORANGE};
    margin: auto -20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
    color: #fff;
    font-size: x-large;
    font-weight: bold;
`
class HeaderSection extends React.Component{

    handleLogOut = () => {
        console.log("Log out has been clicked");
        localStorage.removeItem("lastActiveTimeStamp");
        Auth.signOut()
        .then(data => console.log(data))
        .catch(err => console.log(err));
    }
    render(){  
        let user_email = authStore.email || "";
        let avator_name = String(user_email.charAt(0)).toUpperCase();  
        return(
        <StyledHeader> 
                <Row>
                    <Col span={20}>
                    To Do List
                    </Col>
                    <Col span={4} style={{textAlign: 'right'}}>
                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                        {avator_name}
                    </Avatar>
                    <Divider type="vertical"></Divider>
                    <Button 
                    onClick={() => this.handleLogOut()} 
                    ghost 
                    style={{ borderColor: '#fff', color: '#fff' }}
                    >
                    Logout
                    </Button>
                    </Col>
                </Row>
        </StyledHeader>
        )
    }
}

export default HeaderSection;