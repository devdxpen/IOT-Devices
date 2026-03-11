"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Trash2,
  Eye,
  Pencil,
  SlidersHorizontal,
  LayoutList,
  LayoutGrid,
  ArrowUpDown,
  Loader2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchTemplates,
  getTemplateStats,
  deleteTemplate,
} from "@/lib/mock-api/templates";
import type { Template } from "@/types/template";

type TabType = "local" | "global";
type SortField =
  | "templateName"
  | "templateCode"
  | "typeOfTemplate"
  | "activationDate"
  | "status"
  | "brandName";
type SortDir = "asc" | "desc";
type ViewMode = "list" | "grid";

export default function SettingsTemplatesPage() {
  const router = useRouter();

  // Data
  const [templates, setTemplates] = useState<Template[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState<TabType>("local");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>("templateName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Request Global Modal State
  const [requestGlobalModalOpen, setRequestGlobalModalOpen] = useState(false);
  const [requestGlobalTemplateId, setRequestGlobalTemplateId] = useState<
    string | null
  >(null);
  const [requestGlobalMessage, setRequestGlobalMessage] = useState("");
  const [isSubmittingGlobalRequest, setIsSubmittingGlobalRequest] =
    useState(false);

  // Load data when tab changes
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      setSelected(new Set());
      setCurrentPage(1);
      try {
        const [data, statsData] = await Promise.all([
          fetchTemplates(activeTab),
          getTemplateStats(activeTab),
        ]);
        if (mounted) {
          setTemplates(data);
          setStats(statsData);
        }
      } catch {
        toast.error("Failed to load templates.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [activeTab]);

  // Filter + Sort
  const filteredSorted = useMemo(() => {
    let result = templates.filter((t) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.templateName.toLowerCase().includes(q) ||
        t.templateCode.toLowerCase().includes(q) ||
        t.brandName.toLowerCase().includes(q) ||
        t.templateTags.some((tag) => tag.toLowerCase().includes(q))
      );
    });

    result.sort((a, b) => {
      const aVal = a[sortField] ?? "";
      const bVal = b[sortField] ?? "";
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [templates, search, sortField, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filteredSorted.length / pageSize);
  const paginatedData = filteredSorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(paginatedData.map((t) => t.id)));
    } else {
      setSelected(new Set());
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id);
    else next.delete(id);
    setSelected(next);
  };

  const handleDeleteSelected = () => {
    setTemplates((prev) => prev.filter((t) => !selected.has(t.id)));
    toast.success(`${selected.size} template(s) deleted.`);
    setSelected(new Set());
  };

  const handleRequestGlobal = async () => {
    if (!requestGlobalTemplateId) return;
    setIsSubmittingGlobalRequest(true);
    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === requestGlobalTemplateId
          ? { ...t, globalStatus: "request_for_global" as const }
          : t,
      ),
    );
    if (activeTab === "local") {
      setStats((prev) => ({ ...prev, inactive: prev.inactive + 1 }));
    }
    toast.success("Request sent to make template global.");
    setIsSubmittingGlobalRequest(false);
    setRequestGlobalModalOpen(false);
    setRequestGlobalMessage("");
    setRequestGlobalTemplateId(null);
  };

  const handleCloneTemplate = (template: Template) => {
    toast.success(`"${template.templateName}" cloned to your local workspace.`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label={
            activeTab === "local"
              ? "Total Local Templates"
              : "Total Global Templates"
          }
          value={stats.total.toLocaleString()}
          colorClass="border-[#2596be] bg-blue-50/50"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          label={activeTab === "local" ? "Global Live" : "Active Global"}
          value={stats.active.toLocaleString()}
          colorClass="border-emerald-400 bg-emerald-50/50"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          label={activeTab === "local" ? "Pending Requests" : "Inactive Global"}
          value={stats.inactive.toLocaleString()}
          colorClass="border-red-400 bg-red-50/50"
          iconBg="bg-red-100"
          iconColor="text-red-500"
        />
      </div>

      {/* Toolbar: Tabs + Search + Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Left: Local/Global Tabs */}
        <div className="flex items-center gap-0">
          <button
            onClick={() => setActiveTab("local")}
            className={`px-5 py-2.5 text-sm font-semibold rounded-l-md border transition-colors ${
              activeTab === "local"
                ? "bg-[#2596be] text-white border-[#2596be]"
                : "text-slate-600 border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            Local Templates
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={`px-5 py-2.5 text-sm font-semibold rounded-r-md border-t border-b border-r transition-colors ${
              activeTab === "global"
                ? "bg-[#2596be] text-white border-[#2596be]"
                : "text-slate-600 border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            Global Templates
          </button>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-10 w-52 bg-white border-slate-200 text-sm"
            />
          </div>

          <Button
            onClick={() => router.push("/settings/templates/create")}
            className="h-10 bg-[#2596be] hover:bg-[#1e7c9e] text-white gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Template
          </Button>

          {selected.size > 0 && (
            <Button
              variant="outline"
              onClick={handleDeleteSelected}
              className="h-10 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 gap-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => toast.info("Filters coming soon!")}
            className="h-10 border-slate-200 text-slate-600 hover:bg-slate-50 gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>

          {/* View Toggle */}
          <div className="flex border border-slate-200 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 transition-colors ${
                viewMode === "list"
                  ? "bg-[#2596be] text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-[#2596be] text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#2596be]" />
          </div>
        ) : (
          <table className="w-full text-sm min-w-[1100px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-3 w-10">
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((t) => selected.has(t.id))
                    }
                    onCheckedChange={(c) => toggleSelectAll(c === true)}
                    className="border-slate-300"
                  />
                </th>
                <SortableHeader
                  label="Template"
                  field="templateName"
                  currentField={sortField}
                  currentDir={sortDir}
                  onSort={toggleSort}
                />
                <SortableHeader
                  label="Code"
                  field="templateCode"
                  currentField={sortField}
                  currentDir={sortDir}
                  onSort={toggleSort}
                />
                <th className="p-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Tags
                </th>
                <SortableHeader
                  label="Type"
                  field="typeOfTemplate"
                  currentField={sortField}
                  currentDir={sortDir}
                  onSort={toggleSort}
                />
                <SortableHeader
                  label="Brand / Model"
                  field="brandName"
                  currentField={sortField}
                  currentDir={sortDir}
                  onSort={toggleSort}
                />
                <SortableHeader
                  label="Activation"
                  field="activationDate"
                  currentField={sortField}
                  currentDir={sortDir}
                  onSort={toggleSort}
                />
                <SortableHeader
                  label="Status"
                  field="status"
                  currentField={sortField}
                  currentDir={sortDir}
                  onSort={toggleSort}
                />
                <th className="p-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Global
                </th>
                <th className="p-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-slate-500">
                    No {activeTab} templates found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((tpl) => (
                  <tr
                    key={tpl.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Checkbox */}
                    <td className="p-3">
                      <Checkbox
                        checked={selected.has(tpl.id)}
                        onCheckedChange={(c) =>
                          toggleSelect(tpl.id, c === true)
                        }
                        className="border-slate-300"
                      />
                    </td>

                    {/* Template Name + Version */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                          <span className="text-amber-600 text-xs">📷</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">
                            {tpl.templateName}
                          </p>
                          <p className="text-xs text-slate-400">
                            v{tpl.version}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="p-3">
                      <code className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono">
                        {tpl.templateCode}
                      </code>
                    </td>

                    {/* Tags */}
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {tpl.templateTags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 border-slate-200 text-slate-500 bg-slate-50 font-normal"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {tpl.templateTags.length > 2 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 border-slate-200 text-slate-500 bg-slate-50 font-normal cursor-help"
                              >
                                +{tpl.templateTags.length - 2}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                              {tpl.templateTags.slice(2).join(", ")}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="p-3 text-slate-600 text-xs whitespace-nowrap">
                      {tpl.typeOfTemplate}
                    </td>

                    {/* Brand + Model */}
                    <td className="p-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">
                          {tpl.brandName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {tpl.modelNo}
                        </p>
                      </div>
                    </td>

                    {/* Activation Date */}
                    <td className="p-3 text-slate-600 text-xs whitespace-nowrap">
                      {tpl.activationDate}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <StatusBadge status={tpl.status} />
                    </td>

                    {/* Global */}
                    <td className="p-3">
                      <GlobalBadge globalStatus={tpl.globalStatus} />
                    </td>

                    {/* Actions */}
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        {activeTab === "global" ? (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="p-1.5 rounded-md text-[#2596be] hover:bg-blue-50 transition-colors mr-1"
                                  onClick={() => handleCloneTemplate(tpl)}
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Clone to Local</TooltipContent>
                            </Tooltip>
                            <button
                              className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            {tpl.globalStatus === "local_only" && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="p-1.5 rounded-md text-[#2596be] hover:bg-blue-50 transition-colors mr-1"
                                    onClick={() => {
                                      setRequestGlobalTemplateId(tpl.id);
                                      setRequestGlobalModalOpen(true);
                                    }}
                                  >
                                    <ArrowUpDown className="w-4 h-4 rotate-90" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Request Global</TooltipContent>
                              </Tooltip>
                            )}
                            <button
                              className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded-md text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              title="Edit"
                              onClick={() =>
                                router.push(
                                  `/settings/templates/${tpl.id}/edit`,
                                )
                              }
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete"
                              onClick={async () => {
                                const success = await deleteTemplate(tpl.id);
                                if (success) {
                                  setTemplates((prev) =>
                                    prev.filter((t) => t.id !== tpl.id),
                                  );
                                  toast.success("Template deleted.");
                                } else {
                                  toast.error("Failed to delete template.");
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && filteredSorted.length > 0 && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <span>Show</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[70px] h-8 bg-white border-slate-200 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>
              of{" "}
              <span className="font-medium text-slate-800">
                {filteredSorted.length}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹ Previous
            </button>
            {Array.from(
              { length: Math.min(totalPages, 3) },
              (_, i) => i + 1,
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm rounded-md border transition-colors ${
                  currentPage === page
                    ? "bg-[#2596be] text-white border-[#2596be]"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            {totalPages > 3 && <span className="px-1 text-slate-400">...</span>}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next ›
            </button>
          </div>
        </div>
      )}

      {/* Request Global Confirmation Modal */}
      <Dialog
        open={requestGlobalModalOpen}
        onOpenChange={setRequestGlobalModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Global Publishing</DialogTitle>
            <DialogDescription>
              Making a template global allows it to be used across all linked
              accounts and tenants. An administrator will review your request.
            </DialogDescription>
          </DialogHeader>
          <div className="grid py-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-slate-700"
              >
                Message to Admin (Optional)
              </label>
              <Textarea
                id="message"
                placeholder="Explain why this template should be made global..."
                value={requestGlobalMessage}
                onChange={(e) => setRequestGlobalMessage(e.target.value)}
                className="col-span-3 resize-none focus-visible:ring-[#2596be]"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRequestGlobalModalOpen(false);
                setRequestGlobalMessage("");
                setRequestGlobalTemplateId(null);
              }}
              disabled={isSubmittingGlobalRequest}
              className="text-slate-600 border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequestGlobal}
              disabled={isSubmittingGlobalRequest}
              className="bg-[#2596be] hover:bg-[#1e7c9e] text-white"
            >
              {isSubmittingGlobalRequest && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────
function StatCard({
  label,
  value,
  colorClass,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  colorClass: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-lg border-l-4 border p-5 bg-white shadow-sm ${colorClass}`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}
      >
        <span className={`text-xl ${iconColor}`}>📊</span>
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

// ─── Sortable Table Header ────────────────────────────────
function SortableHeader({
  label,
  field,
  currentField,
  currentDir,
  onSort,
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  currentDir: SortDir;
  onSort: (field: SortField) => void;
}) {
  const isActive = currentField === field;
  return (
    <th
      onClick={() => onSort(field)}
      className="p-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide cursor-pointer hover:text-slate-900 transition-colors select-none"
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={`w-3 h-3 ${isActive ? "text-[#2596be]" : "text-slate-300"}`}
        />
      </div>
    </th>
  );
}

// ─── Status Badge ─────────────────────────────────────────
function StatusBadge({ status }: { status: Template["status"] }) {
  const config = {
    active: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Active",
    },
    draft: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      label: "Draft",
    },
    inactive: {
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
      label: "Inactive",
    },
  };
  const c = config[status];
  return (
    <Badge
      variant="outline"
      className={`${c.bg} ${c.text} ${c.border} hover:${c.bg} text-[11px] font-medium`}
    >
      {c.label}
    </Badge>
  );
}

// ─── Global Badge ─────────────────────────────────────────
function GlobalBadge({
  globalStatus,
}: {
  globalStatus: Template["globalStatus"];
}) {
  if (globalStatus === "global_live") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[11px]"
      >
        Global Live
      </Badge>
    );
  }
  if (globalStatus === "request_for_global") {
    return (
      <Badge
        variant="outline"
        className="border-[#2596be]/30 bg-blue-50 text-[#2596be] hover:bg-blue-50 text-[11px]"
      >
        Request for global
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-50 text-[11px]"
    >
      Local Only
    </Badge>
  );
}
