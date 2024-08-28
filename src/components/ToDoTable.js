import React from 'react';
import ToDoItem from './ToDoItem';
import ToDoButton from './ToDoButton';
import { Col, Row, Spin, message, Switch, Divider, Icon, Table, Tag, Button, Popconfirm } from "antd";
import moment from 'moment';
import SelectTaskDropdown from './SelectTaskDropdown';
import { StyledModal } from './ToDoButton';
import ToDoForm from './ToDoForm';
import { todoStore } from '../store/todo';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { uiStore } from '../store/ui';
import { THEME_COLOR } from '../consts/theme';
import { StyledSwitch } from './ToDoItem';

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

class ToDoTable extends React.Component {

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

        const cols = [
            {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (title, record) => {
                let tagColor = (record.is_done === true ? THEME_COLOR.GREEN : "grey");
                return (
                    <Tag color={tagColor}>{title}</Tag>
                )
            }
            } ,
            {
                title: 'Content',
                dataIndex: 'content',
                key: 'content'
            },
            {
                title: 'Start Date',
                dataIndex: 'created_at',
                key: 'created_at',
                render: created_at => {
                    return (
                        <Tag>{moment.unix(created_at).format("DD/MM/YY HH:mm")}</Tag>
                    )
                }
                
            },  
            {
                title: 'End Date',
                dataIndex: 'updated_at',
                key: 'updated_at',
                render: (updated_at, record) => {
                    if(record.is_done === true && updated_at){
                        return (
                            <Tag>{moment.unix(updated_at).format("DD/MM/YY HH:mm")}</Tag>
                        )
                    }
                }
            },
            {
                title: 'Is Done ?',
                dataIndex: 'is_done',
                key: 'is_done',
                render: (is_done, record) => {
                   return(
                    
                    <StyledSwitch
                    checked={is_done}
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="close" />}
                    onChange={(checked) => this.handleChangeStatus(checked, record.id)}
                    />
                   )
                }
            },
            {
                title: 'Edit/Delete',
                key: 'edit/delete',
                render: (edit_delete, record) => {
                    return(
                    <>
                    <Button 
                        onClick={()=>  {
                        console.log("edit button has been click at",toJS(record));
                        todoStore.setSelectedToDoItem(record)
                        this.showToDoForm(record.id)}
                        }  
                        type="primary" 
                        size="small" 
                        shape="circle">
                        <Icon type="edit">
                        </Icon>
                    </Button>
                    <Popconfirm
                    title="Are you sure delete this todo?"
                    onConfirm={()=> this.handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                    >
                    <Button type="danger" size="small" shape="circle">
                    <Icon type="delete" />
                    </Button>
                    </Popconfirm>
                    </>
                    )
                }
            }   
        ];
    
        console.log(toJS(todoStore.todoTable))
        let isTableView = (todoStore.viewType === "table" ? true : false)
          
        return (
            <div>
                <Row>
                    <Col span={8}>
                        <ToDoButton onAdd={this.showToDoForm} />
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
                    <Table dataSource={this.state.filteredToDoTable} columns={cols} rowKey="id">

                    </Table>
                    
                        
                    :
                        
                    <Row gutter={[16, 20]}>

                        {this.state.filteredToDoTable.map((todoItem) => {

                            // const dateMoment = moment(todoItem.created_at);
                            console.log("todoitem.content", todoItem.content)
                            return (

                                <Col span={6} key={todoItem.id}>
                                    <ToDoItem
                                        todoItem={todoItem}
                                        onDelete={this.handleDelete}
                                        onEdit={this.showToDoForm}
                                        onChangeStatus={this.handleChangeStatus}
                                    />
                                </Col>
                            )
                        })}
                    </Row>

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

export default observer(ToDoTable);