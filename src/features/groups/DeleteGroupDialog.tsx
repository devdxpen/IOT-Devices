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
import { DeviceGroup } from "@/types/group";
import { useDeleteGroup } from "@/features/groups/hooks/useGroups";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteGroupDialogProps {
  group: DeviceGroup | null;
  open: boolean;
  onClose: () => void;
}

export function DeleteGroupDialog({
  group,
  open,
  onClose,
}: DeleteGroupDialogProps) {
  const { toast } = useToast();
  const deleteMutation = useDeleteGroup();

  const handleConfirm = async () => {
    if (!group) return;
    try {
      await deleteMutation.mutateAsync(group.id);
      toast({
        title: "Group Deleted",
        description: `"${group.name}" has been deleted successfully.`,
      });
      onClose();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete the group. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <strong>"{group?.name}"</strong>?
              This action cannot be undone.
            </p>
            {group && group.deviceCount > 0 && (
              <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                ⚠️ This group has{" "}
                <strong>
                  {group.deviceCount} device{group.deviceCount !== 1 && "s"}
                </strong>{" "}
                and{" "}
                <strong>
                  {group.activeUsers} active user
                  {group.activeUsers !== 1 && "s"}
                </strong>{" "}
                linked. They will be unlinked from this group.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Group"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
