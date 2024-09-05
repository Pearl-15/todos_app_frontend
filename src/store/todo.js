import { observable, decorate, action, flow } from "mobx";
import { AddToDoItem } from '../API/postData';
import { UpdateToDoItem } from '../API/updateData';
import { DeleteToDoItem } from '../API/deleteData';
import { GetToDoItem, GetToDoList } from "../API/getData";
import moment from 'moment';

class ToDo {
    todoTable = [];
    selectedToDoItem = {};
    viewType = "";
    currentFilterdRows = [];
    isSaving = false;

    setSelectedToDoItem = (targetItem) => {
        if (!targetItem) {
            this.selectedToDoItem = {};
            return
        }
        this.selectedToDoItem = targetItem;
    };

    setViewType = (viewType) =>{
        this.viewType = viewType;
    }

    setCurrentFilteredRows = (currentTable) =>{
        this.currentFilterdRows = currentTable;
    }

    setSaving = (isSaving) => {
        this.isSaving = isSaving;
    }

    addToDoItem = flow(function* (todoItem) {

       const newTodo = {
            created_at : todoItem["created_at"].unix(),
            title: todoItem["title"],
            content: todoItem["content"],
            is_done: false,
        }

        console.log("add todo item payload ", newTodo);
        const responseData = yield AddToDoItem(newTodo);
        console.log('ToDo added successfully:', responseData);
        yield this.getToDoList();
    });

    deleteToDoItem = flow(function* (todoItemId) {
        const responseData = yield DeleteToDoItem(todoItemId);
        console.log('ToDo deleted successfully');   
        yield this.getToDoList();
        console.log("this.todoTable ", this.todoTable);
    });

    updateToDoItem = flow(function* (id, updatedValues) {
        let responseData;
        if(typeof updatedValues ==='boolean'){
            const updatedStatus = { is_done: updatedValues,updated_at: moment().unix() };

            responseData = yield UpdateToDoItem(id, updatedStatus);
        }else{
            updatedValues["updated_at"] = moment().unix();
            updatedValues["created_at"] = updatedValues["created_at"].unix();
            responseData = yield UpdateToDoItem(id, updatedValues);   
        }
        console.log('Edited Successfully in DB: ', responseData);
        yield this.getToDoList();
    });

    getToDoList = flow(function* () {
        const responseData = yield GetToDoList();
        console.log("response Data", responseData.data);
        if (responseData.data) {
            const sortedToDos = responseData.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            this.todoTable = sortedToDos;
        }
    });

    getToDoItem = flow(function* (){
        const responseData = yield GetToDoItem();
        console.log("Get Todo Item ", responseData.data);
        if (responseData.data){
            this.selectedToDoItem = responseData.data
        }
    })

}

decorate(ToDo, {
    todoTable: observable,
    selectedToDoItem: observable,
    viewType: observable,
    currentFilterdRows: observable,
    isSaving: observable,
    setSelectedToDoItem: action,
    setViewType: action,
    setCurrentFilteredRows: action,
    setSaving: action,
    addToDoItem: action,
    deleteToDoItem: action,
    updateToDoItem: action,
    getToDoList: action,
});

export const todoStore = new ToDo();

