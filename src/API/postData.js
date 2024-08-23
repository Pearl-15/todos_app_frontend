import { API } from "aws-amplify";
import { myInit } from "./api";
const apiName = "todoapi"

export const AddToDoItem = (newToDo)=>{

    const path = `/create`
    let myInitN = {
        ...myInit,
        "body": newToDo
      }
  
    return API.post(apiName, path, myInitN);

}

