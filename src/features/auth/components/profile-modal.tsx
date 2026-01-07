"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader, User, Mail, Calendar, AtSign } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { useGetCurrentUser } from "@/features/auth/api/use-get-current-user";
import { useUpdateProfile } from "@/features/auth/api/use-update-profile";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileModal = ({ open, onOpenChange }: ProfileModalProps) => {
  const { data: user, isLoading } = useGetCurrentUser();
  const updateMutation = useUpdateProfile();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
    }
  }, [user]);

  const handleSave = () => {
    const updates: { name?: string; username?: string } = {};

    if (name !== user?.name) {
      updates.name = name;
    }

    if (username !== user?.username) {
      updates.username = username;
    }

    if (Object.keys(updates).length > 0) {
      updateMutation.mutate(updates, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    } else {
      onOpenChange(false);
    }
  };

  const hasChanges = 
    name !== (user?.name || "") || 
    username !== (user?.username || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            User Profile
          </DialogTitle>
          <DialogDescription>
            View and manage your account information
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Email - Read only */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Mail className="size-4" />
                Email Address
              </Label>
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </div>

            <Separator />

            {/* Name - Editable */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="size-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="border-blue-500 focus-visible:ring-blue-500"
              />
            </div>

            {/* Username - Editable */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                <AtSign className="size-4" />
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="Enter a unique username"
                className="border-blue-500 focus-visible:ring-blue-500"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">
                Only lowercase letters, numbers, and underscores. Min 3 characters.
              </p>
            </div>

            <Separator />

            {/* Member Since - Read only */}
            {user?.emailVerified && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="size-4" />
                  Member Since
                </Label>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(user.emailVerified), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updateMutation.isPending || username.length < 3}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader className="size-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};