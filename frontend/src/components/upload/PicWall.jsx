import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Upload from './Upload'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const grid = 2;
const picWidth = 300;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // padding: grid * 2,
    // margin: `0 0 ${grid}px 0`,
    margin: `2px 0px`,
    // change background color if dragging
    // background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: picWidth,
});

class PicWall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const items = reorder(this.props.fileList, result.source.index, result.destination.index);
        this.props.onChangePicWall(items);
    }


    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        const PictureWallWrapper = styled.div`
                // display: flex;
                grid-template-columns: repeat(3, 150px);
                grid-gap: 8px;
            `;

        const PictureWallUpload = styled.div`
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: ${picWidth}px;
                height: ${picWidth}px;
                border: 1px dashed #DDD;
                border-radius: 4px;
                cursor: pointer;
                &:hover {
                border: 1px dashed ${(props) => props.theme.color.primary};
                }
            `;

        const PictureItem = styled.div`
                width: ${picWidth}px;
                height:auto;
                object-fit: cover;
                position: relative;
                .picture-item__delete-button {
                    display: none;
                }
                &:hover {
                    .picture-item__delete-button {
                    display: flex;
                    }
                }
            `;

        const DeleteButtonMask = styled.div`
                position: absolute;
                background: #1d1010aa;
                color: #FFF;
                cursor: pointer;
                width: 100%;
                height: 100%;
                left: 0px;
                top: 0px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

        return (
            <PictureWallWrapper>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {this.props.fileList.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                            >
                                                <PictureItem>
                                                    <img src={item.imageUrl} alt=""
                                                        width={picWidth} height={'auto'} style={{ objectFit: 'cover' }} />
                                                    <DeleteButtonMask
                                                        className="picture-item__delete-button"
                                                        onClick={() => this.props.handleDeleteItem(item.id)}
                                                    >
                                                        <DeleteOutlineIcon />
                                                    </DeleteButtonMask>
                                                </PictureItem>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <Upload
                    accept='image/,.jpg,.png,.jpeg'
                    multiple
                    onChange={this.props.handleOnPreview}
                >
                    <PictureWallUpload>
                        <div style={{ fontSize: 32 }}>＋</div>
                        <div>上傳照片</div>
                    </PictureWallUpload>
                </Upload>

            </PictureWallWrapper>
        );
    }
}

export default PicWall;