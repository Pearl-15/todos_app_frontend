import { API } from "aws-amplify";
import { myInit } from "./api";
let apiName = "todoapi"

export const DeleteToDoItem = (id)=>{

    const path = `/todos/${id}`
    return API.del(apiName,path,myInit)
}