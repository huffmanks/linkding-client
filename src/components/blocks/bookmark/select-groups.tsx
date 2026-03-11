import {
  ARCHIVE_BULK_SELECT_OPTIONS,
  DELETE_BULK_SELECT_OPTIONS,
  READ_BULK_SELECT_OPTIONS,
  SHARE_BULK_SELECT_OPTIONS,
} from "@/lib/constants";

import { SelectGroup, SelectItem, SelectLabel, SelectSeparator } from "@/components/ui/select";

export default function SelectGroups() {
  return (
    <>
      <SelectGroup>
        <SelectLabel className="sr-only">Mark as read/unread</SelectLabel>
        {READ_BULK_SELECT_OPTIONS.map((item) => (
          <SelectItem key={item.value} value={item.value} className="cursor-pointer">
            {item.label}
          </SelectItem>
        ))}
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel className="sr-only">Share/Unshare</SelectLabel>
        {SHARE_BULK_SELECT_OPTIONS.map((item) => (
          <SelectItem key={item.value} value={item.value} className="cursor-pointer">
            {item.label}
          </SelectItem>
        ))}
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel className="sr-only">Archive/Unarchive</SelectLabel>
        {ARCHIVE_BULK_SELECT_OPTIONS.map((item) => (
          <SelectItem key={item.value} value={item.value} className="cursor-pointer">
            {item.label}
          </SelectItem>
        ))}
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel className="sr-only">Delete</SelectLabel>
        {DELETE_BULK_SELECT_OPTIONS.map((item) => (
          <SelectItem
            key={item.value}
            value={item.value}
            className="text-destructive cursor-pointer">
            {item.label}
          </SelectItem>
        ))}
      </SelectGroup>
      <SelectSeparator />
    </>
  );
}
