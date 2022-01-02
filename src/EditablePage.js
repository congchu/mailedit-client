import { useEffect, useState } from 'react';
import EditableBlock from './EditableBlock';
import uid from './utils/uid';
import fetchedData from './data.json';

import styled from 'styled-components';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const EditPage = () => {
  // const initialBlock = { id: uid(), html: '', tag: 'p', flag: 'false' };
  const [blocks, setBlocks] = useState(fetchedData);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(null);
  const [commandAction, setCommandAction] = useState(null);

  // block의 길이가 달라진다 === 블럭의 추가나 삭제가 이루어진다 === 다음 블럭이나 이전 블럭으로 focus가 필요하다
  useEffect(() => {
    console.log('block length changed');
    if (commandAction === 'Enter') {
      // focus to new block
      focusNewBlock(currentBlockIndex);
    } else if (commandAction === 'Backspace') {
      // focus to previous block
      focusPrevBlock(currentBlockIndex);
    }
  }, [blocks.length]);

  const updatePageHandler = (updatedBlock) => {
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
      flag: updatedBlock.flag,
    };
    setBlocks(updatedBlocks);
  };

  function focusNewBlock(prevBlock) {
    console.log('focus to new block' + prevBlock);
    const blockId = blocks[prevBlock + 1].id;
    const newBlock = document.querySelector(`.${blockId}`);
    if (newBlock) {
      newBlock.focus();
    }
  }
  function focusPrevBlock(nextBlock) {
    console.log('focus to prev block' + nextBlock);
  }

  const addBlockHandler = (currentBlock) => {
    setCommandAction(currentBlock.command);
    const newBlock = { id: uid(), html: '', tag: 'p', flag: 'false' };
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    setCurrentBlockIndex(index);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    setBlocks(updatedBlocks);
  };

  const deleteBlockHandler = (currentBlock) => {
    setCommandAction(currentBlock.command);
    const previousBlock = currentBlock.ref.previousElementSibling;
    if (previousBlock) {
      const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
      setCurrentBlockIndex(index);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
    }
  };

  const updateBlockHandler = (currentBlock) => {
    const { startPoint, endPoint } = currentBlock;
    const targetHtml = currentBlock.html;
    // 쪼개지는 범위에 따라 빈 string에 대한 핸들링 필요
    const prevHtml = targetHtml.substring(0, startPoint);
    const newHtml = targetHtml.substring(startPoint, endPoint);
    const nextHtml = targetHtml.substring(endPoint);
    const updatedBlocks = [...blocks];
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);

    if (prevHtml.length === 0 && nextHtml.length === 0) {
      updatedBlocks[index] = {
        ...updatedBlocks[index],
        flag: 'true',
      };
    } else if (prevHtml.length === 0 && nextHtml.length !== 0) {
      const updateBlock = { id: uid(), html: newHtml, tag: 'p', flag: 'true' };
      const newBlock = { id: uid(), html: nextHtml, tag: 'p', flag: 'false' };
      updatedBlocks.splice(index, 1, updateBlock);
      updatedBlocks.splice(index + 1, 0, newBlock);
    } else if (prevHtml.length !== 0 && nextHtml.length === 0) {
      const updateBlock = {
        id: uid(),
        html: prevHtml,
        tag: 'p',
        flag: 'false',
      };
      const newBlock = { id: uid(), html: newHtml, tag: 'p', flag: 'true' };
      updatedBlocks.splice(index, 1, updateBlock);
      updatedBlocks.splice(index + 1, 0, newBlock);
    } else if (prevHtml.length !== 0 && nextHtml.length !== 0) {
      const updateBlock = {
        id: uid(),
        html: prevHtml,
        tag: 'p',
        flag: 'false',
      };
      updatedBlocks.splice(index, 1, updateBlock);
      const newBlock = { id: uid(), html: newHtml, tag: 'p', flag: 'true' };
      updatedBlocks.splice(index + 1, 0, newBlock);
      const nextBlock = { id: uid(), html: nextHtml, tag: 'p', flag: 'false' };
      updatedBlocks.splice(index + 2, 0, nextBlock);
    }
    setBlocks(updatedBlocks);
  };

  // 드래그 앤 드랍 시 배열 내 순서 재배치
  const handleDndChange = (result) => {
    if (!result.destination) return;

    const items = [...blocks];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
  };

  return (
    <DragDropContext onDragEnd={handleDndChange}>
      <Droppable droppableId="todosDroppable">
        {(provided) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {blocks.map(({ id, tag, html, flag }, index) => (
              <Draggable key={id} draggableId={id} index={index}>
                {(provided) => (
                  <Wrapper
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    key={id}
                  >
                    <DragBtn>↕️</DragBtn>
                    <EditableBlock
                      id={id}
                      tag={tag}
                      html={html}
                      flag={flag}
                      updatePage={updatePageHandler}
                      addBlock={addBlockHandler}
                      deleteBlock={deleteBlockHandler}
                      updateBlock={updateBlockHandler}
                    />
                  </Wrapper>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 450px;
  min-height: 580px;
  margin: 24px;
  padding-top: 24px;
  border: 1px solid black;
  border-radius: 2px;
  background: #ffffff;
`;

const DragBtn = styled.div`
  height: 100%;
  margin-left: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default EditPage;
