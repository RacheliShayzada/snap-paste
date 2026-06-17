import type { SnippetItem } from "../types/snippet";

export const SNIPPETS: SnippetItem[] = [
  { id: 1, title: "Greeting",        content: "Hello! How can I help you today?" },
  { id: 2, title: "Sign-off",        content: "Best regards,\nYour Name" },
  { id: 3, title: "Meeting Link",    content: "https://meet.example.com/my-room" },
  { id: 4, title: "Phone Number",    content: "+1 (555) 123-4567" },
  { id: 5, title: "Email Address",   content: "hello@example.com" },
  { id: 6, title: "Mailing Address", content: "123 Main St, Springfield, USA 12345" },
  { id: 7, title: "Out of Office",   content: "I'm currently out of office and will return on Monday." },
  { id: 8, title: "Thank You",       content: "Thank you for reaching out. I'll get back to you shortly." },
];
