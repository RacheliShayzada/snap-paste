import { useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { SnippetItem as SnippetItemType } from "../../types/snippet";
import { SnippetItem } from "../SnippetItem/SnippetItem";
import "./SnippetList.css";

interface Props {
  items: SnippetItemType[];
  activeIndex?: number;
  onItemClick: (content: string) => void;
  onEdit: (item: SnippetItemType) => void;
  onDelete: (id: number) => void;
  onReorder?: (sourceIndex: number, destIndex: number) => void;
}

export function SnippetList({ items, activeIndex = -1, onItemClick, onEdit, onDelete, onReorder }: Props) {
  const listRef = useRef<HTMLUListElement | null>(null);

  // Keep the keyboard-highlighted row visible inside the scroll container.
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeIndex]);

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
            ref={(el) => { provided.innerRef(el); listRef.current = el; }}
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
                    isActive={index === activeIndex}
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
