export default function truncateText(text: string, left: number, right: number): string {
  if (left + right >= text.length) {
    return text;
  }
  return text.slice(0, left) + '...' + text.slice(-right);
}