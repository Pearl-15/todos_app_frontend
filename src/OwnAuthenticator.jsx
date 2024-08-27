import {
    Authenticator,
    SignIn,
  } from "aws-amplify-react";
  
import React, { Component } from "react";
import App from "./App";
import { Auth, Hub } from "aws-amplify";
import { authStore } from "./store/auth";
import { myInit } from "./API/api";
import {Row, Col} from "antd";
import { THEME_COLOR } from "./consts/theme";
import favicon from "./favicon.png";

class OwnAutheticator extends Component{
    constructor(props){
        super(props);
        this.state = {
          isAuthenticated: false
        }
    }

    handleAuthStateChange = (state) => {
        
        console.log("State ", state)
        if (state === "signedIn"){
            this.setState({
              isAuthenticated: true
            })
            Auth.currentSession()
            Auth.currentAuthenticatedUser({
                bypassCache: true
            })
            .then( authData => {
                console.log("authData", authData);
            
                
                authStore.setEmail(
                    authData["signInUserSession"]["idToken"]["payload"]["email"]
                );
                authStore.setUsername(authData["username"]);
        
                let jwtToken =
                    authData["signInUserSession"]["accessToken"]["jwtToken"];
                localStorage.setItem("jwtToken", "AWS " + jwtToken);

                let cognitoJWTToken = authData["signInUserSession"]["idToken"]["jwtToken"];
                localStorage.setItem("cognitoJWTToken",cognitoJWTToken)

                myInit.headers.Authorization =  cognitoJWTToken
                console.log("myInit",myInit)
                Hub.dispatch("auth", { event: "UserDataReady" }, "Auth");

                
            })
        }else {
          this.setState({
            isAuthenticated: false
          })
        }
    }

    render(){
        return(
            <div>
              <Row type="flex" justify="space-between" align="middle" style={{height: '100vh' }}>
                {this.state.isAuthenticated 
                ? 
                <Col span={24}>
                  <App></App>
                </Col>
                :
                <>
                <Col span={16} 
                style= {{
                  background: 'white', 
                  height: '100vh',  
                  textAlign: 'center',
                  alignContent: 'center'
                  }}>
                  <h1 style={{ fontStyle: 'italic'}}>Turn To-Dos into Dones...</h1>
                  <img
                    src={favicon}
                    alt="favicon"
                  />
                </Col>
                <Col span={8} 
                  style={{
                    background: THEME_COLOR.ORANGE,
                    height: '100vh',
                    textAlign: 'center',
                    alignContent: 'center'
                  }}
                >
                  <Authenticator
                  theme={customTheme}
                  hideDefault={true}
                  // signUpConfig={signUpConfig}
                  onStateChange={this.handleAuthStateChange}
                  >
                  <SignIn />
                  </Authenticator>
                </Col>
                </>
                }
              </Row>
                
            </div>
        )
    }
  }

  export default OwnAutheticator;

  const customTheme = {
    button: {
        backgroundColor: '#4096ff',
        fontWeight: 'bold'
    },
    sectionHeader: {color: '#f5ba13'}
  }

  const signUpConfig = {
    hideAllDefaults: true,
    signUpFields: [
      {
        label: 'Email',
        key: 'email',
        required: true,
        displayOrder: 1,
        type: 'string',
      },
      {
        label: 'Password',
        key: 'password',
        required: true,
        displayOrder: 2,
        type: 'password',
      },
    ],
  };