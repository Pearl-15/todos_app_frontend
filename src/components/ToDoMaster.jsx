import React from 'react';
import { Col, Row, Spin, message, Switch, Divider, Icon, Table, Tag, Button, Popconfirm } from "antd";
import moment from 'moment';
import SelectTaskDropdown from './SelectTaskDropdown';
import AddToDoButton, { StyledModal } from './AddToDoButton';
import ToDoForm from './ToDoForm';
import { todoStore } from '../store/todo';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { uiStore } from '../store/ui';
import { THEME_COLOR } from '../consts/theme';
import ToDoCardView from './ToDoCardView';
import ToDoTableView from './ToDoTableView';

const filter = (selectedTask, todoTable) => {
    let selectedStatus;
    if (selectedTask === "completed") {
        selectedStatus = true
    } else if (selectedTask === "uncompleted") {
        selectedStatus = false
    } else {
        selectedStatus = ""
    }
    // Use filter() to filter the todoTable based on selectedStatus
    const filteredItems = todoTable.filter((todoItem) => {
        if (selectedStatus !== "") {
            return todoItem.is_done === selectedStatus;
        }
        return todoItem

    });

    return filteredItems;

}

class ToDoMaster extends React.Component {

    constructor(props) {
        super(props);
        this.reactTable = "";
        this.state = {
            filteredToDoTable: [],
            selectedTask: "",
            isFormVisible: false
        }
    }

    showToDoForm = async (todoItemId) => {

        // add to do 
        if(!todoItemId){
            this.setState({
                isFormVisible: true
            });
            todoStore.setSelectedToDoItem();
        }else{
        // edit to do
               //to render based on state change 
            //    const targetItem = this.state.filteredToDoTable.find((item) => item.id === todoItemId);
                let targetItem = todoStore.selectedToDoItem;
                console.log("selected todo item is ", targetItem.title);
               const dateMoment = moment(targetItem.created_at).unix(); //convert date(string) to
               this.setState({
                   isFormVisible: true
               });   
               targetItem.created_at = dateMoment;
               todoStore.setSelectedToDoItem(targetItem)
               console.log("OnEdit : ", todoItemId);
        }         
    }

    handleDelete = async (todoItemId) => {
        try {
            await todoStore.deleteToDoItem(todoItemId);
            this.setState({
                filteredToDoTable: this.state.filteredToDoTable.filter((todoItem) => {
                    return todoItem.id !== todoItemId;
                })
            });
            message.warning('ToDo has been delected successfully.')
        } catch (e) {
            message.error('Delete unsuccessful, something is wrong, please try again!');
            console.log('Component Error: ', e.message);
        }

    }
    handleOk = async (values) => {

        if (!values.id) {
            //if AddToDoOK
            try {
                values["date"] = values["date"];
                await todoStore.addToDoItem(values);
                await this.handleTaskFilter(this.state.selectedTask);
                this.handleCancel();
                await message.success('New ToDo has been added successfully', 2);

            } catch (e) {
                message.error('Add ToDo unsuccessful, something is wrong, please try again!');
                console.log('Component Error: ', e);
            }


        } else {
            //if EditToDoOK
            try {
                await todoStore.updateToDoItem(values.id,values);
                await this.handleTaskFilter(this.state.selectedTask);
                this.handleCancel(values);
                message.success('ToDo has been edited successfully', 2);
            } catch (e) {
                message.error('Edit unsuccessful, something is wrong, please try again!');
                console.log('Component Error: ', e.message);
            }
        }

        todoStore.setSelectedToDoItem();
    }

    handleCancel = () => {
        this.setState({ isFormVisible: false });
    };

    handleChangeStatus = async (updatedStatus, todoItemId) => {
        try {
            await todoStore.updateToDoItem(todoItemId, updatedStatus);
            await this.handleTaskFilter(this.state.selectedTask);
            message.success("Status has been changed successfully.")
        } catch (e) {
            message.error("Status change unsuccessful, please try again.");
            console.log('Component Error: ', e.message);
        }
    }

    handleTaskFilter = async (selectedTask) => {

        //to fix the asynchronous of setState issue use callback function
        this.setState({
            selectedTask: selectedTask,
        }, () => {
            const filteredItems = filter(this.state.selectedTask, todoStore.todoTable);
            this.setState({
                filteredToDoTable: filteredItems
            });
        });
    }

    async componentDidMount() {
        console.log("ToDoTable : componetDidMount")
        uiStore.setIsLoading(true);
        try {
            await todoStore.getToDoList();
            this.setState({
                filteredToDoTable: todoStore.todoTable,
                selectedTask: "all",
            });
            uiStore.setIsLoading(false);
        } catch (error) {
            console.log('Component Error : ', error.message);
            uiStore.setIsLoading(false);
            message.error('Something weng wrong, please try again!');     
        }
    }

    componentWillUnmount(){
        this.setState(
        {
                filteredToDoTable: [],
                selectedTask: "",
                isFormVisible: false,
        }
        )
    }



    handleViewChange = (e) => {
        console.log("handle view change ", e)
        if(e === true){
            todoStore.setViewType("card")
        }else{
            todoStore.setViewType("table")
        }
       
    }  
    
    render() {
    
        console.log(toJS(todoStore.todoTable))
        let isTableView = (todoStore.viewType === "table" ? true : false)
          
        return (
            <div>
                <Row>
                    <Col span={8}>
                        <AddToDoButton onAdd={this.showToDoForm} />
                    </Col>
                    <Col span={16} >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Switch defaultChecked onChange={this.handleViewChange} checkedChildren="card view" unCheckedChildren="table view" ></Switch> 
                        <Divider type="vertical"></Divider>
                            <span style={{ marginRight: '8px', color: 'white', backgroundColor: THEME_COLOR.ORANGE, padding: '4.5px 12px', borderRadius: '0.2rem', fontWeight: 'bold' }}>Select Task</span>
                            <SelectTaskDropdown onFilter={this.handleTaskFilter} />
                        </div>
                    </Col>
                </Row>

                {uiStore.isloading 
                ?
                <>
                    <div style={{ textAlign: "center", margin: "30%" }}>
                        <Spin tip="Loading..."></Spin>
                    </div>
                </> 
                :                   
                <>
                    {isTableView ? 
                    <ToDoTableView 
                        filteredToDoTable = {this.state.filteredToDoTable}
                        onDelete={this.handleDelete}
                        onEdit={this.showToDoForm}
                        onChangeStatus={this.handleChangeStatus}
                    />
                    
                        
                    :

                    <ToDoCardView 
                        filteredToDoTable={this.state.filteredToDoTable}
                        onDelete={this.handleDelete}
                        onEdit={this.showToDoForm}
                        onChangeStatus={this.handleChangeStatus}
                    />                   
                        }

                        <StyledModal
                            title="Edit ToDo"
                            visible={this.state.isFormVisible}
                            footer={null}
                            closable={false}
                        >

                            <ToDoForm
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                todoItem={todoStore.selectedToDoItem}
                            />

                        </StyledModal>

                </>}
            </div>

        )
    }
}

export default observer(ToDoMaster);