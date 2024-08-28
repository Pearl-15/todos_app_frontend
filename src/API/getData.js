import { API } from "aws-amplify";
import { myInit } from "./api";

let apiName = "todoapi"

export const GetToDoList = ()=>{    

    const path = `/list`; 
    return API.get(apiName, path,myInit);
    // let response = {data: []}
    // return response

    // const response = {data:[
    //     {
    //         "is_done": true,
    //         "updated_at": 1724690000,
    //         "content": "testing time ",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724689414,
    //         "id": "07df3d04-6446-11ef-8ab3-5a9941a42741",
    //         "title": "D2"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS VPC",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724709800,
    //         "id": "0e2b6ba2-644f-11ef-b2f1-b2ecde7ac056",
    //         "title": "D39"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS Lambda",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724689414,
    //         "id": "14bcc3ea-644e-11ef-86b2-1ee3f5b0afe0",
    //         "title": "D20"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS NCAL",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724709880,
    //         "id": "1a9c1940-644f-11ef-b2f1-b2ecde7ac056",
    //         "title": "D40"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS Athena",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724689420,
    //         "id": "1ed178b2-644e-11ef-86b2-1ee3f5b0afe0",
    //         "title": "D21"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS Auora Serverless",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724699420,
    //         "id": "2db6f37a-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D22"
    //     },
    //     {
    //         "content": "iiii me my mine",
    //         "is_done": false,
    //         "updated_at": 1724745364,
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724745362,
    //         "id": "36ef1144-6448-11ef-981c-e60309d7df23",
    //         "title": "Day 31"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS IAM",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724699990,
    //         "id": "3bfeecd0-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D23"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS Key Managment Service",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724700000,
    //         "id": "4fa1688a-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D24"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS EC2",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724700020,
    //         "id": "5a2fc6f2-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D25"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS Cloudfront",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724700220,
    //         "id": "6761b16e-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D26"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS Route 53",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724700320,
    //         "id": "70459f02-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D27"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS Sage Maker",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724700520,
    //         "id": "7f86ee30-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D28"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS AI assistance Q",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724700620,
    //         "id": "8d9e5a76-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D29"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "hahah",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724743532,
    //         "id": "91a33596-6445-11ef-8ab3-5a9941a42741",
    //         "title": "D1"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS ecosystem",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724700820,
    //         "id": "9724687e-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D30"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS Bill managment",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724701000,
    //         "id": "b7dd8e88-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D31"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS S3",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724702000,
    //         "id": "c3e99ec4-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D32"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS Cognito",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724703000,
    //         "id": "d0611646-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D33"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS SNS",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724704000,
    //         "id": "d7635d6e-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D34"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "ok",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724745346,
    //         "id": "db185d6a-6449-11ef-8f87-8e110c692098",
    //         "title": "ok"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS SQS",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724705000,
    //         "id": "dbf6de82-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D35"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS S3 Glacier",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724706000,
    //         "id": "e4d8e464-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D36"
    //     },
    //     {
    //         "content": "description xxx ",
    //         "is_done": true,
    //         "updated_at": 1724742063,
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724815469,
    //         "id": "e9ccb67e-6423-11ef-95b2-e25da5b1b53b",
    //         "title": "D 2X"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS EC2 Storage Instance",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724707000,
    //         "id": "f03bdd16-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D37"
    //     },
    //     {
    //         "content": "testing new payload with updated key",
    //         "is_done": true,
    //         "updated_at": 1724740459,
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724728,
    //         "id": "fc727626-6421-11ef-bccc-066462781d46",
    //         "title": "D 3XX"
    //     },
    //     {
    //         "is_done": false,
    //         "content": "Learn AWS DynamoDB DAX",
    //         "user_id": "9438d428-2081-7051-182b-b86627c80b7a",
    //         "created_at": 1724709000,
    //         "id": "fdc1e16a-644e-11ef-b2f1-b2ecde7ac056",
    //         "title": "D38"
    //     }
    // ]}
    // return response
}

export const GetToDoItem = (id) =>{
    const path = `/todos/${id}`;
    return API.get(apiName, path, myInit);
}

