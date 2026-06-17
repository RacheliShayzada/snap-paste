import type { SnippetItem } from "../../types/snippet";
import "./SnippetItem.css";

interface Props {
  item: SnippetItem;
  onClick: (content: string) => void;
}

export function SnippetItem({ item, onClick }: Props) {
  return (
    <li className="snippet-item" onClick={() => onClick(item.content)}>
      <span className="snippet-title">{item.title}</span>
      <span className="snippet-preview">{item.content}</span>
    </li>
  );
}
