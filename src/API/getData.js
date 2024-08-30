import { API } from "aws-amplify";
import { myInit } from "./api";

let apiName = "todoapi"

export const GetToDoList = ()=>{    

    const path = `/list`; 
    return API.get(apiName, path,myInit);
}

export const GetToDoItem = (id) =>{
    const path = `/todos/${id}`;
    return API.get(apiName, path, myInit);
}

