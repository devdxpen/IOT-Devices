import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useDeviceConfig,
  DeviceTag as Tag,
} from "../../contexts/DeviceConfigContext";

export function DeviceTagsTab() {
  const { config, setTags } = useDeviceConfig();
  const { tags } = config!;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<number | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Tag>>({});

  const handleOpenAdd = () => {
    setEditingTag(null);
    setFormData({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData(tag);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.tagNo || !formData.deviceId) {
      toast.error("Tag No and Device ID are required.");
      return;
    }

    if (editingTag) {
      setTags(
        tags.map((t: Tag) =>
          t.id === editingTag.id ? ({ ...t, ...formData } as Tag) : t,
        ),
      );
      toast.success("Tag updated successfully");
    } else {
      setTags([...tags, { ...formData, id: Date.now() } as Tag]);
      toast.success("Tag added successfully");
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (tagToDelete !== null) {
      setTags(tags.filter((t: Tag) => t.id !== tagToDelete));
      toast.success("Tag deleted successfully");
      setTagToDelete(null);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-800">
          Tag Configuration
        </h2>
        <Button
          onClick={handleOpenAdd}
          className="bg-[#1ea1f2] hover:bg-[#1a90da] text-white h-9 px-4 rounded-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Tag
        </Button>
      </div>

      <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-600 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wide">Tag No</th>
                <th className="px-6 py-4 font-medium tracking-wide">
                  Device ID
                </th>
                <th className="px-6 py-4 font-medium tracking-wide">
                  Function Code
                </th>
                <th className="px-6 py-4 font-medium tracking-wide">
                  Tag Address
                </th>
                <th className="px-6 py-4 font-medium tracking-wide">
                  Data Type
                </th>
                <th className="px-6 py-4 font-medium tracking-wide">
                  Decimal Point
                </th>
                <th className="px-6 py-4 font-medium tracking-wide">
                  No Of Digits
                </th>
                <th className="px-6 py-4 font-medium tracking-wide">Endian</th>
                <th className="px-6 py-4 font-medium tracking-wide text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tags.map((tag: Tag) => (
                <tr
                  key={tag.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {tag.tagNo}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{tag.deviceId}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {tag.functionCode}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="font-mono text-xs bg-slate-100 rounded-sm px-2 py-1">
                      {tag.tagAddress}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{tag.dataType}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {tag.decimalPoint}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{tag.noOfDigits}</td>
                  <td className="px-6 py-4 text-slate-600">{tag.endian}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      onClick={() => handleOpenEdit(tag)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-[#1ea1f2]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setTagToDelete(tag.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {tags.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No tags configured. Click "Add New Tag" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-slate-100">
            <DialogTitle className="text-xl font-medium text-slate-800">
              {editingTag ? "Edit Tag" : "Add New Tag"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 p-6">
            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Tag No
              </Label>
              <Input
                value={formData.tagNo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tagNo: e.target.value })
                }
                placeholder="e.g. TAG-001"
                className="bg-[#fafafa] border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Device ID
              </Label>
              <Input
                value={formData.deviceId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, deviceId: e.target.value })
                }
                placeholder="e.g. SLV-1"
                className="bg-[#fafafa] border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Function Code
              </Label>
              <Select
                value={formData.functionCode || ""}
                onValueChange={(v) =>
                  setFormData({ ...formData, functionCode: v })
                }
              >
                <SelectTrigger className="bg-[#fafafa] border-slate-200">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FC1 - Read Coils">
                    FC1 - Read Coils
                  </SelectItem>
                  <SelectItem value="FC2 - Read Discrete">
                    FC2 - Read Discrete
                  </SelectItem>
                  <SelectItem value="FC3 - Read Holding">
                    FC3 - Read Holding
                  </SelectItem>
                  <SelectItem value="FC4 - Read Input">
                    FC4 - Read Input
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Tag Address
              </Label>
              <Input
                value={formData.tagAddress || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tagAddress: e.target.value })
                }
                placeholder="40001"
                className="bg-[#fafafa] border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Data Type
              </Label>
              <Select
                value={formData.dataType || ""}
                onValueChange={(v) => setFormData({ ...formData, dataType: v })}
              >
                <SelectTrigger className="bg-[#fafafa] border-slate-200">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Int16">Int16</SelectItem>
                  <SelectItem value="UInt16">UInt16</SelectItem>
                  <SelectItem value="Float32">Float32</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Decimal Point
              </Label>
              <Input
                type="number"
                value={formData.decimalPoint || ""}
                onChange={(e) =>
                  setFormData({ ...formData, decimalPoint: e.target.value })
                }
                placeholder="0"
                className="bg-[#fafafa] border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                No Of Digits
              </Label>
              <Input
                type="number"
                value={formData.noOfDigits || ""}
                onChange={(e) =>
                  setFormData({ ...formData, noOfDigits: e.target.value })
                }
                placeholder="4"
                className="bg-[#fafafa] border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-normal text-slate-600">
                Endian
              </Label>
              <Select
                value={formData.endian || ""}
                onValueChange={(v) => setFormData({ ...formData, endian: v })}
              >
                <SelectTrigger className="bg-[#fafafa] border-slate-200">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Big Endian">Big Endian</SelectItem>
                  <SelectItem value="Little Endian">Little Endian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50">
            <Button
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              className="bg-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#1ea1f2] hover:bg-[#1a90da] text-white"
            >
              Save Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={tagToDelete !== null}
        onOpenChange={(open) => !open && setTagToDelete(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tag
              configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
