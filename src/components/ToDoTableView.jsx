import { observer } from 'mobx-react';
import React from 'react';
import { THEME_COLOR } from '../consts/theme';
import {Icon, Button, Tag, Table, Popconfirm} from 'antd';
import {StyledSwitch} from './ToDoItem';
import moment from 'moment';
import {todoStore} from '../store/todo';
import {toJS} from 'mobx';

class ToDoTableView extends React.Component{
    render(){
    
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
                    onChange={(checked) => this.props.onChangeStatus(checked, record.id)}
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
                        this.props.onEdit(record.id)}
                        }  
                        type="primary" 
                        size="small" 
                        shape="circle">
                        <Icon type="edit">
                        </Icon>
                    </Button>
                    <Popconfirm
                    title="Are you sure delete this todo?"
                    onConfirm={()=> this.props.onDelete(record.id)}
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
        return(

            <Table 
            dataSource={this.props.filteredToDoTable} 
            columns={cols} 
            rowKey="id"
            onEdit={this.props.onEdit}
            onDelete={this.props.onDelete}
            onChangeStatus={this.props.onChangeStatus}
            >
            </Table>
        )
    }
}

export default observer(ToDoTableView);