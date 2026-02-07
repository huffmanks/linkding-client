export default function CodeSpan({ text }: { text: string }) {
  return (
    <code className="text-foreground from-background to-primary rounded bg-linear-to-b from-25% px-0.5 py-px">
      {text}
    </code>
  );
}
