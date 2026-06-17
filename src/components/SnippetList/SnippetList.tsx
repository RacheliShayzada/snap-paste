import type { SnippetItem as SnippetItemType } from "../../types/snippet";
import { SnippetItem } from "../SnippetItem/SnippetItem";
import "./SnippetList.css";

interface Props {
  items: SnippetItemType[];
  onItemClick: (content: string) => void;
}

export function SnippetList({ items, onItemClick }: Props) {
  return (
    <ul className="snippet-list">
      {items.map((item) => (
        <SnippetItem key={item.id} item={item} onClick={onItemClick} />
      ))}
    </ul>
  );
}
