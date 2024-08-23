import {
    Authenticator,
    SignIn,
    ConfirmSignIn,
    RequireNewPassword,
    VerifyContact,
    ForgotPassword,
    TOTPSetup
  } from "aws-amplify-react";
  
import React, { Component } from "react";
import App from "./App";
import Amplify, { Auth, Hub } from "aws-amplify";
import { observer } from "mobx-react";
import { authStore } from "./store/auth";
import { myInit } from "./API/api";


class OwnAutheticator extends Component{
    constructor(props){
        super(props);
    }

    handleAuthStateChange = (state) => {
        
        console.log("State ", state)
        if (state === "signedIn"){
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
        }
    }

    render(){
        return(
            <div>
                <Authenticator
                theme={customTheme}
                // hideDefault={true}
                signUpConfig={signUpConfig}
                onStateChange={this.handleAuthStateChange}
                >
                <App />
                {/* <SignIn /> */}
                </Authenticator>
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