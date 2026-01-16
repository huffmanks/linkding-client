export default function EmptyDescription({
  name,
  isTag = false,
}: {
  name: string;
  isTag?: boolean;
}) {
  return (
    <p>
      <span>You haven’t added any bookmarks to </span>
      <code className="bg-muted text-foreground rounded-md px-1.5 py-0.5 text-xs">
        {isTag && "#"}
        {name}
      </code>
      <span>. Browse your bookmarks or create a new one to get started.</span>
    </p>
  );
}
