import './App.css';

import React from 'react';
import ToDoTable from './components/ToDoTable';
import HeaderSection from './components/HeaderSection';
import { Hub } from 'aws-amplify';
import { Layout } from "antd";
import FooterSection from './components/FooterSection';
// import './customize.scss'; // Adjust the path to match your SCSS file's location

const {Content} = Layout;



class App extends React.Component{

  constructor(props) {
    super(props);
    Hub.listen("auth", this, "stateListener");
    this.state = {
      isUserDataReady: false
    };
  }

  onHubCapsule(capsule) {
    console.log("onHubCapsule method")
    const { channel, payload } = capsule;
    if (channel === "auth") {
      this.onAuthEvent(payload);
    }
  }

  onAuthEvent(payload) {
    console.log("auth event", payload);

    if (payload["event"] === "UserDataReady") {
      this.setState({
        isUserDataReady: true
      });
      // this.props.history.push("/home")
    } else if (payload["event"] === "signOut") {
      this.setState({
        isUserDataReady: false
      });
      // this.props.history.push("/home")
    }
  }

  render(){
    return (
      <div>
      { this.state.isUserDataReady && 
        <>
          <Layout>
              <HeaderSection />
                <Content>
                  <ToDoTable />
                </Content>
                  <FooterSection />
          </Layout>
          </>
        }
      </div>
    );}
 }

export default App;
