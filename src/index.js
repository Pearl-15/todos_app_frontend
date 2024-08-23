import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import OwnAuthenticator from './OwnAuthenticator';
import Amplify from "aws-amplify";
import DEVConfig from "./Amplifyconfig";
Amplify.configure(DEVConfig)


ReactDOM.render(
<OwnAuthenticator />,document.getElementById("root"));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

