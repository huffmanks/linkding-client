import { useState } from "react";

import { LockIcon, Share2Icon } from "lucide-react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SharedButtonProps {
  title: string;
  text: string;
  url: string;
  isShared: boolean;
}

export default function SharedButton({ title, text, url, isShared }: SharedButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  async function handleShare() {
    setIsSharing(true);
    const shareData = {
      title,
      text,
      url,
    };

    try {
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      }
    } finally {
      setIsSharing(false);
    }
  }
  return (
    <>
      {isShared ? (
        <Button
          variant="ghost"
          size="icon-xs"
          disabled={isSharing}
          nativeButton={false}
          className="border-border size-5.5 cursor-pointer rounded-full border"
          onClick={handleShare}
          render={
            <Badge size="icon" variant="outline">
              <Share2Icon className="text-primary" />
            </Badge>
          }
        />
      ) : (
        <Tooltip>
          <TooltipTrigger
            className="size-5.5"
            render={
              <Badge size="icon" variant="outline">
                <LockIcon className="text-primary" />
              </Badge>
            }
          />
          <TooltipContent>
            <p>Private</p>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
}
