"use client";

import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DashboardMetricCard {
  id: string;
  label: string;
  value: string;
  icon: React.ElementType;
  iconClassName: string;
}

export function DashboardMetrics({
  cards,
  columnsClassName = "xl:grid-cols-6",
}: {
  cards: DashboardMetricCard[];
  columnsClassName?: string;
}) {
  return (
    <section className={`grid gap-4 sm:grid-cols-2 ${columnsClassName}`}>
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.id} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-md ${card.iconClassName}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="text-4xl leading-none font-semibold text-slate-900">
                    {card.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

export function YearSelect({
  defaultValue = "2025",
}: {
  defaultValue?: "2024" | "2025" | "2026";
}) {
  return (
    <Select defaultValue={defaultValue}>
      <SelectTrigger className="h-9 min-w-24 border-slate-200 bg-white text-sm">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="2024">2024</SelectItem>
        <SelectItem value="2025">2025</SelectItem>
        <SelectItem value="2026">2026</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function DashboardTableFooter({
  total = 657,
  showCount = 5,
}: {
  total?: number;
  showCount?: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Show</span>
        <Select defaultValue={String(showCount)}>
          <SelectTrigger className="h-8 min-w-[60px] border-slate-200 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
        <span>of {total}</span>
      </div>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">
              <MoreHorizontal className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function AvatarGroup({
  names,
  extraCount = 0,
}: {
  names: string[];
  extraCount?: number;
}) {
  return (
    <div className="flex items-center">
      {names.map((name, index) => (
        <Avatar
          key={name}
          className={`h-8 w-8 border-2 border-white ${index !== 0 ? "-ml-2" : ""}`}
        >
          <AvatarImage src="/avatar.jpg" alt={name} />
          <AvatarFallback className="text-xs">
            {name
              .split(" ")
              .map((part) => part.charAt(0))
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      ))}
      {extraCount > 0 && (
        <span className="-ml-2 inline-flex h-8 items-center rounded-full border-2 border-white bg-slate-100 px-2 text-xs text-slate-600">
          +{extraCount}
        </span>
      )}
    </div>
  );
}
