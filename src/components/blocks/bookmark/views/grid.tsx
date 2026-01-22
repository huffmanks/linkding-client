import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { EllipsisVerticalIcon, GlobeIcon, ImageIcon, ShieldIcon } from "lucide-react";

import { linkdingFetch } from "@/lib/api";
import { cn, getRelativeTimeString } from "@/lib/utils";
import type { Asset, Bookmark } from "@/types";

import BookmarkFavicon from "@/components/bookmark-favicon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
}

export default function BookmarkGridView({ bookmarks, handleOpenSheet }: BookmarkGridViewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bookmarks.map((bookmark) => (
        <Card
          key={bookmark.id}
          className="group/card has-[[data-sheet-trigger]:focus-visible]:ring-primary/20 has-[[data-sheet-trigger]:hover]:ring-primary/20 cursor-pointer gap-4 pt-0 pb-4 transition-all has-[[data-sheet-trigger]:focus-visible]:opacity-50 has-[[data-sheet-trigger]:focus-visible]:ring-1 has-[[data-sheet-trigger]:hover]:opacity-50 has-[[data-sheet-trigger]:hover]:ring-1">
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
              <Button
                variant="ghost"
                size="icon-sm"
                className="-mt-1.5 cursor-pointer"
                onClick={() => handleOpenSheet(bookmark)}>
                <EllipsisVerticalIcon className="size-4" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent
            tabIndex={0}
            role="button"
            data-sheet-trigger
            className="mt-auto cursor-pointer px-3 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpenSheet(bookmark);
              }
            }}
            onClick={() => handleOpenSheet(bookmark)}>
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
                  <Link
                    key={tag}
                    className="group outline-none"
                    to="/dashboard/tags/$tagName"
                    params={{ tagName: tag }}
                    onClick={(e) => e.stopPropagation()}>
                    <Badge
                      className="group-hover:bg-muted group-focus-visible:bg-muted group-hover:text-primary/80 group-focus-visible:text-primary/80 transition-colors outline-none"
                      onClick={(e) => e.stopPropagation()}>
                      #{tag}
                    </Badge>
                  </Link>
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

  const assets = useMemo(() => {
    if (isLoading || !data?.results) return null;

    let image = bookmark?.preview_image_url;

    if (!image) {
      const latestImage = data.results
        .filter((item) => item.content_type?.startsWith("image/"))
        .sort((a, b) => b.date_created.localeCompare(a.date_created))[0];

      if (latestImage) {
        image = `${import.meta.env.VITE_LINKDING_URL}/assets/${latestImage.id}`;
      }
    }

    if (!image) return null;

    return { image };
  }, [data?.results, isLoading]);

  return (
    <a
      className="block overflow-hidden rounded-t-lg transition-opacity outline-none group-has-[[data-sheet-trigger]:focus-visible]/card:opacity-100 group-has-[[data-sheet-trigger]:hover]/card:opacity-100 hover:opacity-50 focus-visible:opacity-50"
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
