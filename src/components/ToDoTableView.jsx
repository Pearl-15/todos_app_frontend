import { observer } from 'mobx-react';
import React from 'react';
import { CUSTOM_FORMAT, THEME_COLOR } from '../consts/theme';
import {Icon, Button, Tag, Table, Popconfirm, Input} from 'antd';
import {StyledSwitch} from './ToDoItem';
import moment from 'moment';
import {todoStore} from '../store/todo';
import {toJS} from 'mobx';
import styled from 'styled-components';
import { uiStore } from '../store/ui';

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: white;
    color: ${THEME_COLOR.ORANGE}; 
    font-weight: bold;
    font-style: italic;
    border-top: 2px solid;
    border-bottom: 2px solid;
    border-color: ${THEME_COLOR.ORANGE};
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
            pageSize: 10,
            searchText: '',
            searchedColumn: '',
            currentFilteredRows: []
        }
    }

    handleSizeChange = (current, pageSize) => {
        this.setState({
            pageSize: pageSize
        })
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined}} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: text =>
          this.state.searchedColumn === dataIndex && 
            text
      });
    
      handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
    
      handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
      };

    handleTableChange = (pagination, filters, sorter, extra) => {
        console.log("Current filtered rows:", extra.currentDataSource);
        this.setState({ currentFilteredRows: extra.currentDataSource });
    };


    render(){
    
        const cols = [
            {
            title: 'Title',
            dataIndex: 'title',
            width: '15%',
            key: 'title',
            className: 'ant-table-cell-title',
            ... this.getColumnSearchProps('title'),
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
                key: 'content',
                ... this.getColumnSearchProps('content'),
                render: content => {
                    return(
                        <span>{content}</span>
                    )
                }
            },
            {
                title: 'Start',
                dataIndex: 'created_at',
                width: '10%',
                key: 'created_at',
                sorter: (a, b) => a.created_at - b.created_at,
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
                filters: [
                    {
                        text: 'Done',
                        value:  true
                    },
                    {
                        text: 'Not Done',
                        value: false
                    }

                ],
                onFilter: (value, record) => {
                return record.is_done === value;
                },
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
            loading={{
                indicator: <Icon type="loading" style={{fontSize:56}}></Icon>,
                spinning: uiStore.isloading
              }}
            dataSource={this.props.filteredToDoTable} 
            columns={cols} 
            rowKey="id"
            onChange={this.handleTableChange}
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