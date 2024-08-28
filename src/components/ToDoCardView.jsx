import React from 'react';
import ToDoItem from './ToDoItem';
import {Row, Col} from 'antd';
import { observer } from 'mobx-react';


class ToDoCardView extends React.Component {
    render(){
        return(
            <div>
            <Row gutter={[16, 20]}>

            {this.props.filteredToDoTable.map((todoItem) => {
                console.log("todoitem.content", todoItem.content)
                return (

                    <Col span={6} key={todoItem.id}>
                        <ToDoItem
                            todoItem={todoItem}
                            onDelete={this.props.onDelete}
                            onEdit={this.props.onEdit}
                            onChangeStatus={this.props.onChangeStatus}
                        />
                    </Col>
                )
                })
            }
            </Row>

            </div>
        )
    }
}

export default observer(ToDoCardView);