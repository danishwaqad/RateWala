"use client";

import { useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn, formatCategoryLabel, slugify } from "@/lib/utils";
import type { CategoryOption } from "@/lib/data/categories";

interface CategoryComboboxProps {
  options: CategoryOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  addNewPrefix: string;
}

export interface CategoryComboboxHandle {
  commitPending: () => string;
}

export const CategoryCombobox = forwardRef<CategoryComboboxHandle, CategoryComboboxProps>(
  function CategoryCombobox(
    { options, value, onChange, placeholder, disabled, addNewPrefix },
    ref
  ) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const queryRef = useRef(query);
  const optionsRef = useRef(options);

  queryRef.current = query;
  optionsRef.current = options;

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    return options.find((o) => o.value === value)?.label ?? formatCategoryLabel(value);
  }, [options, value]);

  const displayValue = open ? query : selectedLabel;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [options, query]);

  const normalizedQuery = slugify(query);
  const showAddNew =
    query.trim().length > 0 &&
    !options.some(
      (o) =>
        o.value === normalizedQuery || o.label.toLowerCase() === query.trim().toLowerCase()
    );

  const resolveCategory = (text: string): string => {
    const trimmed = text.trim();
    if (!trimmed) return "";
    const normalized = slugify(trimmed);
    const match = optionsRef.current.find(
      (o) => o.label.toLowerCase() === trimmed.toLowerCase() || o.value === normalized
    );
    return match ? match.value : normalized;
  };

  const commitQuery = (text: string) => {
    const resolved = resolveCategory(text);
    if (resolved) {
      onChange(resolved);
    } else {
      onChange("");
    }
    setOpen(false);
    setQuery("");
    return resolved;
  };

  useImperativeHandle(
    ref,
    () => ({
      commitPending: () => {
        if (queryRef.current.trim()) {
          return commitQuery(queryRef.current);
        }
        return value;
      },
    }),
    [value, onChange]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        if (queryRef.current.trim()) {
          commitQuery(queryRef.current);
        } else {
          setOpen(false);
          setQuery("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onChange]);

  const selectOption = (slug: string) => {
    onChange(slug);
    setOpen(false);
    setQuery("");
  };

  const addNew = () => {
    commitQuery(query);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => {
          setOpen(true);
          setQuery(selectedLabel || formatCategoryLabel(value));
        }}
        onChange={(e) => {
          const text = e.target.value;
          setQuery(text);
          setOpen(true);
          const resolved = resolveCategory(text);
          onChange(resolved);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (showAddNew || query.trim()) {
              addNew();
            } else if (filtered.length === 1) {
              selectOption(filtered[0].value);
            }
          }
          if (e.key === "Escape") {
            setOpen(false);
            setQuery("");
          }
        }}
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-background py-1 text-sm shadow-md">
          {filtered.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={cn(
                  "flex w-full px-3 py-2 text-left hover:bg-muted",
                  value === opt.value && "bg-teal/10 text-teal font-medium"
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(opt.value)}
              >
                {opt.label}
              </button>
            </li>
          ))}
          {showAddNew && (
            <li className="border-t">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-teal hover:bg-muted"
                onMouseDown={(e) => e.preventDefault()}
                onClick={addNew}
              >
                <Plus className="h-4 w-4 shrink-0" />
                {addNewPrefix} &quot;{query.trim()}&quot;
              </button>
            </li>
          )}
          {filtered.length === 0 && !showAddNew && (
            <li className="px-3 py-2 text-muted-foreground">No matches</li>
          )}
        </ul>
      )}
    </div>
  );
  }
);

CategoryCombobox.displayName = "CategoryCombobox";

export type { CategoryOption };
