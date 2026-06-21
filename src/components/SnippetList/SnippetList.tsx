import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { SnippetItem as SnippetItemType } from "../../types/snippet";
import { SnippetItem } from "../SnippetItem/SnippetItem";
import "./SnippetList.css";

interface Props {
  items: SnippetItemType[];
  onItemClick: (content: string) => void;
  onEdit: (item: SnippetItemType) => void;
  onDelete: (id: number) => void;
  onReorder?: (sourceIndex: number, destIndex: number) => void;
}

export function SnippetList({ items, onItemClick, onEdit, onDelete, onReorder }: Props) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    onReorder?.(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="snippet-list">
        {(provided) => (
          <ul
            className="snippet-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={String(item.id)}
                index={index}
                isDragDisabled={!onReorder}
              >
                {(provided, snapshot) => (
                  <SnippetItem
                    item={item}
                    onClick={onItemClick}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    innerRef={provided.innerRef}
                    draggableProps={provided.draggableProps}
                    dragHandleProps={onReorder ? provided.dragHandleProps : null}
                    isDragging={snapshot.isDragging}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
