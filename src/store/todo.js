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
        this.selectedToDoItem = responseData.data
        yield this.getToDoList();
    });

    getToDoList = flow(function* () {
        const responseData = yield GetToDoList();
        console.log("response Data", responseData.data);
        if (responseData.data) {
            this.todoTable = responseData.data;
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
    setSelectedToDoItem: action,
    setViewType: action,
    addToDoItem: action,
    deleteToDoItem: action,
    updateToDoItem: action,
    getToDoList: action,
});

export const todoStore = new ToDo();

