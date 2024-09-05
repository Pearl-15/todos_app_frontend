import React from 'react';
import { Col, Row, Spin, message, Divider } from "antd";
import moment from 'moment';
import SelectTaskDropdown from './SelectTaskDropdown';
import AddToDoButton, { StyledModal } from './AddToDoButton';
import ToDoForm from './ToDoForm';
import { todoStore } from '../store/todo';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { uiStore } from '../store/ui';
import { CUSTOM_FORMAT, THEME_COLOR } from '../consts/theme';
import ToDoCardView from './ToDoCardView';
import ToDoTableView from './ToDoTableView';
import { handleExportData } from '../utils/utils';
import ExportCSVBtn from './ExportCSVBtn';
import ViewSelectionRadioButton from './ViewSelectionRadioButton';

const filter = (selectedTask, todoTable) => {
    let selectedStatus;
    if (selectedTask === "done") {
        selectedStatus = true
    } else if (selectedTask === "not_done") {
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
            isFormVisible: false,
            mode: "",
        }
        this.formRef = React.createRef();
    }

    showToDoForm = async (todoItemId) => {

        // add to do 
        if(!todoItemId){
            this.setState({
                isFormVisible: true,
                mode: "new",
            });
            todoStore.setSelectedToDoItem();
        }else{
        // edit to do
               //to render based on state change 
            //    const targetItem = this.state.filteredToDoTable.find((item) => item.id === todoItemId);
                let targetItem = todoStore.selectedToDoItem;
                console.log("selected todo item is ", targetItem.title);
               this.setState({
                   isFormVisible: true, 
                   mode: "edit",
               });   
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

    handleOk = async(values) => {
        todoStore.setSaving(true);

        if (this.state.mode === "new") {
            //if AddToDoOK
            try {
                console.log("values date", values["created_at"]);
                console.log('Is moment object:', moment.isMoment(values["created_at"])); 
                await todoStore.addToDoItem(values);
                message.success('New ToDo has been added successfully', 2);
                this.formRef.props.form.resetFields();
                this.handleCancel();
                this.handleTaskFilter(this.state.selectedTask);
                todoStore.setSaving(false);

            } catch (e) {
                message.error('Add ToDo unsuccessful, something is wrong, please try again!');
                console.log('Component Error: ', e);
            }


        } else  if(this.state.mode === "edit"){
            //if EditToDoOK
            try {
                    await todoStore.updateToDoItem(values.id,values);
                    message.success('ToDo has been edited successfully', 2);
                    this.handleTaskFilter(this.state.selectedTask);
                    todoStore.setSaving(false);
                    this.handleCancel(values);
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


    handleViewChange = (selectedView) => {
        console.log("handle view change ", )
        todoStore.setViewType(selectedView);    
    }  

    handleExportCSV = (selectedOption) => {
        let data;
        let date_str = moment().format(CUSTOM_FORMAT.DATE);
        data = this.handleDataTransfer(selectedOption);
        let fileName = date_str +'_' + selectedOption;
        handleExportData(data,fileName);
    }

    handleDataTransfer = (selectedOption) => {
        let sortedData;
        let export_data;
        switch(selectedOption){
            case "all":
                sortedData = todoStore.todoTable; 
                break;
            case "current_table":
                sortedData = todoStore.currentFilterdRows;
                break;
            default:
                break;
        }
    
        if (!sortedData || !Array.isArray(sortedData)) return [];
        
        export_data = sortedData.map((item, idx) => {
            return {
                "Title": `"${item["title"]}"`,
                "content": `"${item["content"]}"`,
                "Start": moment.unix(item["created_at"]).format(CUSTOM_FORMAT.DATE),
                "End": item["updated_at"] ? moment.unix(item["updated_at"]).format(CUSTOM_FORMAT.DATE) : "",
                "Is Done?": (item["is_done"] === true ? "Done" : "Not Done"),
            };
        });  

        return export_data;
    };

    componentWillUnmount(){
        this.setState(
        {
                filteredToDoTable: [],
                selectedTask: "",
                isFormVisible: false,
        }
        )
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
                        {!isTableView && 
                        <SelectTaskDropdown onFilter={this.handleTaskFilter} />
                        }
                        {isTableView &&
                        <ExportCSVBtn
                        onChange={this.handleExportCSV}
                        >
                        </ExportCSVBtn>
                        }
                        <Divider type="vertical"></Divider>
                        <ViewSelectionRadioButton onChange={this.handleViewChange}/>
                        </div>
                    </Col>
                </Row>

                {uiStore.isloading 
                ?
                <>
                    <div style={{ textAlign: "center", margin: "20%" }}>
                        <Spin tip="Loading..."></Spin>
                    </div>
                </> 
                :                   
                <>
                    {isTableView ? 
                    <ToDoTableView 
                        filteredToDoTable = {todoStore.todoTable}
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
                            title={this.state.mode === "new" ? "New To Do" : "Edit To Do"}
                            visible={this.state.isFormVisible}
                            footer={null}
                            closable={false}
                        >

                            <ToDoForm
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                key={todoStore.selectedToDoItem.id}
                                isSaving={todoStore.isSaving}
                                wrappedComponentRef={(inst) => (this.formRef = inst)}
                            />

                        </StyledModal>

                </>}
            </div>

        )
    }
}

export default observer(ToDoMaster);