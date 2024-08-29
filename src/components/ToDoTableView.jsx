import { observer } from 'mobx-react';
import React from 'react';
import { CUSTOM_FORMAT, THEME_COLOR } from '../consts/theme';
import {Icon, Button, Tag, Table, Popconfirm} from 'antd';
import {StyledSwitch} from './ToDoItem';
import moment from 'moment';
import {todoStore} from '../store/todo';
import {toJS} from 'mobx';
import styled from 'styled-components';

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: white;
    color: ${THEME_COLOR.ORANGE}; 
    font-weight: bold;
    font-style: italic;
    border-top: 2px solid ${THEME_COLOR.ORANGE};
    border-bottom: 2px solid ${THEME_COLOR.ORANGE};
  }

  .ant-table-tbody > tr:nth-child(odd) {
    background-color: ${THEME_COLOR['LIGHT-GREY']} ;
  }

  .ant-table-cell-title {
    padding-left: 20px; 
  }
`;

class ToDoTableView extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            pageSize: 10
        }
    }

    handleSizeChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize
        })
    }
    render(){
    
        const cols = [
            {
            title: 'Title',
            dataIndex: 'title',
            width: '15%',
            key: 'title',
            className: 'ant-table-cell-title',
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
                width: '40%',
                key: 'content'
            },
            {
                title: 'Start',
                dataIndex: 'created_at',
                width: '10%',
                key: 'created_at',
                render: created_at => {
                    return (
                        <Tag color="green">{moment.unix(created_at).format(CUSTOM_FORMAT.DATE)}</Tag>
                    )
                }
                
            },  
            {
                title: 'End',
                dataIndex: 'updated_at',
                width: '10%',
                key: 'updated_at',
                render: (updated_at, record) => {
                    if(record.is_done === true && updated_at){
                        return (
                            <Tag color="red">{moment.unix(updated_at).format(CUSTOM_FORMAT.DATE)}</Tag>
                        )
                    }
                }
            },
            {
                title: 'Is Done ?',
                dataIndex: 'is_done',
                width: '5%',
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
                width: '5%',
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
            <div style={{ marginTop: '10px'}}>
            <StyledTable
            dataSource={this.props.filteredToDoTable} 
            columns={cols} 
            rowKey="id"
            onEdit={this.props.onEdit}
            onDelete={this.props.onDelete}
            onChangeStatus={this.props.onChangeStatus}
            pagination={{
                pageSize: this.state.pageSize,
                showSizeChanger: true,
                onShowSizeChange: this.handleSizeChange
            }}
            >
            </StyledTable>
            </div>
        )
    }
}

export default observer(ToDoTableView);