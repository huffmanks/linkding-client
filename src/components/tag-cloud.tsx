import { Link } from "@tanstack/react-router";

import { Badge } from "./ui/badge";

export default function TagCloud({ tags }: { tags: string[] }) {
  return (
    <div className="bg-accent/30 rounded-lg border-2 border-dashed p-3 transition-colors outline-none select-none">
      <div className="flex flex-wrap items-center gap-1">
        {tags.map((tag) => (
          <Badge
            key={tag}
            render={
              <Link to="/dashboard/tags/$tagName" params={{ tagName: tag }}>
                {tag}
              </Link>
            }
          />
        ))}
      </div>
    </div>
  );
}
