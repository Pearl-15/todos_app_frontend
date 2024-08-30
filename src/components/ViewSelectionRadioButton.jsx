import React from "react";
import {Radio} from "antd";


class ViewSelectionRadioButton extends React.Component{

    handleViewChange = (e) => {
        this.props.onChange(e.target.value);
    }
    render(){
        return(
            <Radio.Group defaultValue="card" buttonStyle="solid" onChange={this.handleViewChange} >
                <Radio.Button value="card" >Card View</Radio.Button>
                <Radio.Button value="table">Table View</Radio.Button>
            </Radio.Group>
        )
    }
}

export default ViewSelectionRadioButton;

