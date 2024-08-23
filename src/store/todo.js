import { observable, decorate, action, flow } from "mobx";
import { AddToDoItem } from '../API/postData';
import { UpdateToDoItem } from '../API/updateData';
import { DeleteToDoItem } from '../API/deleteData';
import { GetToDoItem, GetToDoList } from "../API/getData";

class ToDo {
    todoTable = [];
    selectedToDoItem = {};

    setSelectedToDoItem = (targetItem) => {
        if (!targetItem) {
            this.selectedToDoItem = {};
            return
        }
        this.selectedToDoItem = targetItem;
    };

    addToDoItem = flow(function* (newToDo) {
        newToDo.status = false;
        console.log("$$$ todo ", newToDo);
        const responseData = yield AddToDoItem(newToDo);
        console.log('ToDo added successfully:', responseData);
        yield this.getToDoList();
    });

    deleteToDoItem = flow(function* (todoItemId) {
        const responseData = yield DeleteToDoItem(todoItemId);
        console.log('ToDo deleted successfully');   
        yield this.getToDoList();
        console.log("this.todoTable ", this.todoTable);
    });

    updateToDoItem = flow(function* (id, updatedTodoItem) {
        const todoItem = this.todoTable.find((item) => item.id === id);
        let responseData;
        if(typeof updatedTodoItem ==='boolean'){
            const updatedStatus = { status: updatedTodoItem };
            responseData = yield UpdateToDoItem(id, updatedStatus);
        }else{
            responseData = yield UpdateToDoItem(id, updatedTodoItem);   
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
    setSelectedToDoItem: action,
    addToDoItem: action,
    deleteToDoItem: action,
    updateToDoItem: action,
    getToDoList: action,
});

export const todoStore = new ToDo();

