import type { SnippetItem as SnippetItemType } from "../../types/snippet";
import { SnippetItem } from "../SnippetItem/SnippetItem";
import "./SnippetList.css";

interface Props {
  items: SnippetItemType[];
  onItemClick: (content: string) => void;
  onEdit: (item: SnippetItemType) => void;
  onDelete: (id: number) => void;
}

export function SnippetList({ items, onItemClick, onEdit, onDelete }: Props) {
  return (
    <ul className="snippet-list">
      {items.map((item) => (
        <SnippetItem
          key={item.id}
          item={item}
          onClick={onItemClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
