import { API } from "aws-amplify";
import { myInit } from "./api";
let apiName = "todoapi"


export const UpdateToDoItem = (id, todoItem)=>{

    const path = `/todos/${id}`
    let myInitN = {
        ...myInit,
        "body": todoItem
    }
   
    return API.put(apiName,path, myInitN) 
}