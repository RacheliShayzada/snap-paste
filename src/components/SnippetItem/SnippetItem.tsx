import { useState, useEffect, useRef } from "react";
import type { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "@hello-pangea/dnd";
import type { SnippetItem as SnippetItemType } from "../../types/snippet";
import "./SnippetItem.css";

const GripIcon = () => (
  <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
    <circle cx="3" cy="3.5" r="1.4"/>
    <circle cx="7" cy="3.5" r="1.4"/>
    <circle cx="3" cy="8"   r="1.4"/>
    <circle cx="7" cy="8"   r="1.4"/>
    <circle cx="3" cy="12.5" r="1.4"/>
    <circle cx="7" cy="12.5" r="1.4"/>
  </svg>
);

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

interface Props {
  item: SnippetItemType;
  onClick: (content: string) => void;
  onEdit: (item: SnippetItemType) => void;
  onDelete: (id: number) => void;
  isActive?: boolean;
  // Drag-and-drop props (optional — omitted when search is active)
  innerRef?: (element: HTMLElement | null) => void;
  draggableProps?: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;
}

export function SnippetItem({ item, onClick, onEdit, onDelete, isActive, innerRef, draggableProps, dragHandleProps, isDragging }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  return (
    <li
      className={`snippet-item${isDragging ? " snippet-item--dragging" : ""}${isActive ? " snippet-item--active" : ""}`}
      onClick={() => { if (!isDragging) onClick(item.content); }}
      ref={innerRef}
      data-active={isActive ? "true" : undefined}
      {...draggableProps}
    >
      {dragHandleProps && (
        <div
          className="snippet-drag-handle"
          {...dragHandleProps}
          onClick={(e) => e.stopPropagation()}
        >
          <GripIcon />
        </div>
      )}
      <div className="snippet-body">
        <span className="snippet-title">{item.title}</span>
        <span className="snippet-preview">{item.content}</span>
      </div>

      <div
        className="snippet-menu-wrapper"
        ref={wrapperRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="snippet-menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
          title="Options"
        >
          ⋮
        </button>

        {menuOpen && (
          <div className="snippet-dropdown">
            <button
              className="snippet-dropdown-item"
              onClick={() => { onEdit(item); setMenuOpen(false); }}
            >
              <EditIcon /> Edit
            </button>
            <button
              className="snippet-dropdown-item snippet-dropdown-delete"
              onClick={() => { onDelete(item.id); setMenuOpen(false); }}
            >
              <TrashIcon /> Delete
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
