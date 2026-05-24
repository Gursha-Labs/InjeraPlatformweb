import React, { useState } from "react";
import {
  createSubscription,
  deleteSubscription,
  getSubscriptions,
  updateSubscription,
} from "@/api/subscription";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

import {
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

type Subscription = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  duration_days: number;
  video_upload_limit: number;
  max_video_duration_seconds?: number;
  is_active: boolean;
  sort_order?: number;
};

export default function Subscription() {
  const queryClient = useQueryClient();

  const [openCreate, setOpenCreate] = useState(false);

  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    currency: "ETB",
    duration_days: "",
    video_upload_limit: "",
    max_video_duration_seconds: "",
    is_active: true,
    sort_order: "",
  });

  /* -------------------------------------------------------------------------- */
  /*                                   QUERY                                    */
  /* -------------------------------------------------------------------------- */

  const { data, isLoading, isError } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });
  console.log(data)

  const subscriptions = data?.data.data

  /* -------------------------------------------------------------------------- */
  /*                               CREATE MUTATION                              */
  /* -------------------------------------------------------------------------- */

  const createMutation = useMutation({
    mutationFn: createSubscription,

    onSuccess: () => {
      toast.success("Subscription created successfully");

      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });

      setOpenCreate(false);

      resetForm();
    },

    onError: () => {
      toast.error("Failed to create subscription");
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                               UPDATE MUTATION                              */
  /* -------------------------------------------------------------------------- */

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: any;
    }) => updateSubscription(id, data),

    onSuccess: () => {
      toast.success("Subscription updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });

      setSelectedSubscription(null);

      resetForm();
    },

    onError: () => {
      toast.error("Failed to update subscription");
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                               DELETE MUTATION                              */
  /* -------------------------------------------------------------------------- */

  const deleteMutation = useMutation({
    mutationFn: deleteSubscription,

    onSuccess: () => {
      toast.success("Subscription deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
    },

    onError: () => {
      toast.error("Failed to delete subscription");
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HELPERS                                   */
  /* -------------------------------------------------------------------------- */

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      currency: "ETB",
      duration_days: "",
      video_upload_limit: "",
      max_video_duration_seconds: "",
      is_active: true,
      sort_order: "",
    });
  };

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);

    setFormData({
      name: subscription.name || "",
      slug: subscription.slug || "",
      description: subscription.description || "",
      price: String(subscription.price || ""),
      currency: subscription.currency || "ETB",
      duration_days: String(subscription.duration_days || ""),
      video_upload_limit: String(
        subscription.video_upload_limit || "",
      ),
      max_video_duration_seconds: String(
        subscription.max_video_duration_seconds || "",
      ),
      is_active: subscription.is_active,
      sort_order: String(subscription.sort_order || ""),
    });
  };

  const payload = {
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    price: Number(formData.price),
    currency: formData.currency,
    duration_days: Number(formData.duration_days),
    video_upload_limit: Number(formData.video_upload_limit),
    max_video_duration_seconds: Number(
      formData.max_video_duration_seconds,
    ),
    is_active: formData.is_active,
    sort_order: Number(formData.sort_order),
  };

  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="animate-spin size-6" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load subscriptions
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   RETURN                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Subscription Management
        </h1>

        {/* CREATE */}
        <Dialog
          open={openCreate}
          onOpenChange={setOpenCreate}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Create Subscription
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                Create Subscription
              </DialogTitle>
            </DialogHeader>

            <SubscriptionForm
              formData={formData}
              setFormData={setFormData}
            />

            <Button
              disabled={createMutation.isPending}
              onClick={() =>
                createMutation.mutate(payload)
              }
            >
              {createMutation.isPending ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Uploads</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {subscriptions.length > 0 ? (
              subscriptions.map(
                (subscription: Subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {subscription.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {subscription.slug}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {subscription.price}
                    </TableCell>

                    <TableCell>
                      {subscription.duration_days} days
                    </TableCell>

                    <TableCell>
                      {
                        subscription.video_upload_limit
                      }
                    </TableCell>

                    <TableCell>
                      {subscription.is_active
                        ? "Active"
                        : "Inactive"}
                    </TableCell>

                    <TableCell>
                      {subscription.currency}
                    </TableCell>

                    <TableCell className="flex justify-end gap-2">
                      {/* UPDATE */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              handleEdit(subscription)
                            }
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-xl">
                          <DialogHeader>
                            <DialogTitle>
                              Update Subscription
                            </DialogTitle>
                          </DialogHeader>

                          <SubscriptionForm
                            formData={formData}
                            setFormData={setFormData}
                          />

                          <Button
                            disabled={
                              updateMutation.isPending
                            }
                            onClick={() => {
                              if (
                                !selectedSubscription
                              )
                                return;

                              updateMutation.mutate({
                                id: selectedSubscription.id,
                                data: payload,
                              });
                            }}
                          >
                            {updateMutation.isPending ? (
                              <Loader2 className="animate-spin size-4" />
                            ) : (
                              "Update"
                            )}
                          </Button>
                        </DialogContent>
                      </Dialog>

                      {/* DELETE */}
                      <Button
                        size="icon"
                        variant="destructive"
                        disabled={
                          deleteMutation.isPending
                        }
                        onClick={() =>
                          deleteMutation.mutate(
                            subscription.id,
                          )
                        }
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="animate-spin size-4" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ),
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10"
                >
                  No subscriptions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              FORM COMPONENT                                */
/* -------------------------------------------------------------------------- */

function SubscriptionForm({
  formData,
  setFormData,
}: any) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Name</Label>

        <Input
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Slug</Label>

        <Input
          value={formData.slug}
          onChange={(e) =>
            setFormData({
              ...formData,
              slug: e.target.value,
            })
          }
        />
      </div>

      <div className="space-y-2 col-span-2">
        <Label>Description</Label>

        <Input
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Price</Label>

        <Input
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Currency</Label>

        <Input
          value={formData.currency}
          onChange={(e) =>
            setFormData({
              ...formData,
              currency: e.target.value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Duration Days</Label>

        <Input
          type="number"
          value={formData.duration_days}
          onChange={(e) =>
            setFormData({
              ...formData,
              duration_days: e.target.value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Upload Limit</Label>

        <Input
          type="number"
          value={formData.video_upload_limit}
          onChange={(e) =>
            setFormData({
              ...formData,
              video_upload_limit: e.target.value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Max Video Duration</Label>

        <Input
          type="number"
          value={
            formData.max_video_duration_seconds
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              max_video_duration_seconds:
                e.target.value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Sort Order</Label>

        <Input
          type="number"
          value={formData.sort_order}
          onChange={(e) =>
            setFormData({
              ...formData,
              sort_order: e.target.value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Status</Label>

        <Select
          value={
            formData.is_active
              ? "active"
              : "inactive"
          }
          onValueChange={(value) =>
            setFormData({
              ...formData,
              is_active: value === "active",
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="active">
              Active
            </SelectItem>

            <SelectItem value="inactive">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}