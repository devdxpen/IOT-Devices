"use client";

import { useState } from "react";
import { ViewMode } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Layers,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Template {
  id: string;
  name: string;
  description: string;
  canvasCount: number;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published";
}

const mockTemplates: Template[] = [
  {
    id: "tpl-1",
    name: "Factory Floor Monitor",
    description: "Real-time monitoring template for factory environments",
    canvasCount: 3,
    createdAt: "2026-01-15",
    updatedAt: "2026-02-20",
    status: "published",
  },
  {
    id: "tpl-2",
    name: "Smart Building Dashboard",
    description: "Energy and HVAC monitoring for smart buildings",
    canvasCount: 2,
    createdAt: "2026-02-01",
    updatedAt: "2026-02-25",
    status: "draft",
  },
  {
    id: "tpl-3",
    name: "Agriculture Sensor Panel",
    description: "Soil moisture and weather tracking for farms",
    canvasCount: 4,
    createdAt: "2026-02-10",
    updatedAt: "2026-02-24",
    status: "published",
  },
  {
    id: "tpl-4",
    name: "Fleet Tracking Overview",
    description: "Vehicle GPS and health monitoring dashboard",
    canvasCount: 1,
    createdAt: "2026-02-18",
    updatedAt: "2026-02-26",
    status: "draft",
  },
];

export default function TemplateManagementPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockTemplates.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ? true : t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Template Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage IoT dashboard templates with the visual canvas
            editor
          </p>
        </div>
        <Button
          onClick={() => router.push("/template-management/create")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mt-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center border rounded-lg overflow-hidden ml-auto">
          <button
            onClick={() => setViewMode("card")}
            className={`p-2 ${viewMode === "card" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Templates Grid/List */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {filtered.map((template) => (
            <div
              key={template.id}
              className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() =>
                router.push(`/template-management/create?id=${template.id}`)
              }
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center text-blue-600">
                  <Layers className="h-5 w-5" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {template.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {template.canvasCount} canvas
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    template.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {template.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden mt-4">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Description</th>
                <th className="text-left p-3 font-medium">Canvas</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Updated</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((template) => (
                <tr
                  key={template.id}
                  className="border-t hover:bg-muted/30 cursor-pointer"
                  onClick={() =>
                    router.push(`/template-management/create?id=${template.id}`)
                  }
                >
                  <td className="p-3 font-medium">{template.name}</td>
                  <td className="p-3 text-muted-foreground truncate max-w-[200px]">
                    {template.description}
                  </td>
                  <td className="p-3">{template.canvasCount}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        template.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {template.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {template.updatedAt}
                  </td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-1 rounded hover:bg-muted"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

