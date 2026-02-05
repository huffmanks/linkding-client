import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { GlobeIcon, ImageIcon, ShieldIcon } from "lucide-react";

import { linkdingFetch } from "@/lib/api";
import { useSettingsStore } from "@/lib/store";
import { cn, getRelativeTimeString, joinUrlPath } from "@/lib/utils";
import type { Asset, Bookmark } from "@/types";

import ActionDropdown from "@/components/blocks/bookmark/action-dropdown";
import BookmarkFavicon from "@/components/blocks/bookmark/bookmark-favicon";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface BookmarkGridViewProps {
  bookmarks: Bookmark[];
  handleOpenSheet: (bookmark: Bookmark) => void;
  handleOpenChange: (open: boolean) => void;
}

export default function BookmarkGridView({
  bookmarks,
  handleOpenSheet,
  handleOpenChange,
}: BookmarkGridViewProps) {
  return (
    <div className="grid gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="gap-4 pt-0 pb-4">
          <CardImage bookmark={bookmark} />
          <CardHeader className="px-3">
            <CardTitle className="min-w-0">
              <a
                className="decoration-primary hover:decoration-primary/70 focus-visible:decoration-primary/70 hover:text-primary/70 focus-visible:text-primary/70 flex items-center gap-2 underline underline-offset-4 transition-colors outline-none"
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer">
                <BookmarkFavicon bookmark={bookmark} />
                <h2 className="truncate text-sm font-medium">{bookmark.title}</h2>
              </a>
            </CardTitle>
            <CardDescription className="space-y-1">
              {bookmark?.description && (
                <p className="text-muted-foreground mb-2 line-clamp-2 text-xs">
                  {bookmark.description}
                </p>
              )}
              <p className={cn("text-foreground text-xs", !bookmark?.description && "mt-2")}>
                {getRelativeTimeString(new Date(bookmark.date_added))}
              </p>
            </CardDescription>
            <CardAction>
              <ActionDropdown
                triggerButtonClassName="-mt-1.5"
                bookmark={bookmark}
                handleOpenSheet={handleOpenSheet}
                handleOpenChange={handleOpenChange}
              />
            </CardAction>
          </CardHeader>
          <CardContent className="mt-auto px-3">
            <section className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Badge size="icon" variant="outline">
                      {bookmark.shared ? (
                        <GlobeIcon className="text-primary" />
                      ) : (
                        <ShieldIcon className="text-primary" />
                      )}
                    </Badge>
                  }></TooltipTrigger>
                <TooltipContent>
                  <p>{bookmark.shared ? "Public" : "Private"}</p>
                </TooltipContent>
              </Tooltip>

              <Badge variant="secondary">{bookmark.is_archived ? "Archived" : "Active"}</Badge>

              {bookmark?.tag_names &&
                bookmark.tag_names.map((tag) => (
                  <Badge
                    key={tag}
                    render={
                      <Link
                        className="hover:bg-muted! hover:text-primary/80 focus-visible:bg-muted! focus-visible:text-primary/80 transition-colors outline-none"
                        to="/dashboard/tags/$tagName"
                        params={{ tagName: tag }}
                        onClick={(e) => e.stopPropagation()}>
                        #{tag}
                      </Link>
                    }></Badge>
                ))}
            </section>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CardImage({ bookmark }: { bookmark: Bookmark }) {
  const { data, isLoading } = useQuery({
    queryKey: ["assets", bookmark.id],
    queryFn: () => linkdingFetch<{ results: Asset[] }>(`bookmarks/${bookmark.id}/assets`),
  });

  const linkdingUrl = useSettingsStore((state) => state.linkdingUrl);

  const assets = useMemo(() => {
    if (isLoading || !data?.results) return null;

    let image = bookmark?.preview_image_url;

    if (!image) {
      const latestImage = data.results
        .filter((item) => item.content_type?.startsWith("image/"))
        .sort((a, b) => b.date_created.localeCompare(a.date_created))[0];

      if (latestImage) {
        image = joinUrlPath(linkdingUrl, `/assets/${latestImage.id}`);
      }
    }

    if (!image) return null;

    return { image };
  }, [data?.results, isLoading]);

  return (
    <a
      className="block overflow-hidden rounded-t-lg transition-opacity outline-none hover:opacity-50 focus-visible:opacity-50"
      tabIndex={-1}
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer">
      {assets?.image ? (
        <img
          className="bg-muted h-40 w-full rounded-t-lg object-cover"
          src={assets.image}
          alt={bookmark.title}
        />
      ) : (
        <div className="bg-muted flex aspect-21/9 h-40 w-full items-center justify-center rounded-t-lg">
          <ImageIcon className="stroke-muted-foreground size-8 stroke-1" />
        </div>
      )}
    </a>
  );
}
