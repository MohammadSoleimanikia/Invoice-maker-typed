// features/profile/hooks/useEditProfile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { User, UserUpdate } from "@/features/auth/types/user.type";
import { apiFetch } from "@/features/shared/lib/api";

export function useEditProfile(profile: User, onSuccess?: () => void) {
    const queryClient = useQueryClient();

    const form = useForm<UserUpdate>({
        defaultValues: {
            first_name: profile.first_name,
            last_name: profile.last_name,
            store_name: profile.profile.store_name,
            store_description: profile.profile.store_description,
            store_address: profile.profile.store_address,
            insta_link: profile.profile.insta_link,
            hexcolor: profile.profile.hexcolor,
        },
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async ({
            data,
            logoFile,
        }: {
            data: UserUpdate;
            logoFile: File | null;
        }) => {
            const formData = new FormData();
            if (data.first_name !== undefined)
                formData.append("first_name", data.first_name);
            if (data.last_name !== undefined)
                formData.append("last_name", data.last_name);
            if (data.store_name != null)
                formData.append("store_name", data.store_name);
            if (data.store_description != null)
                formData.append("store_description", data.store_description);
            if (data.store_address != null)
                formData.append("store_address", data.store_address);
            if (data.insta_link != null)
                formData.append("insta_link", data.insta_link);
            if (data.hexcolor !== undefined)
                formData.append("hexcolor", data.hexcolor);
            if (logoFile !== null) formData.append("logo", logoFile);

            return apiFetch("/account/profile/", {
                method: "PATCH",
                body: formData,
            });
        },
        onSuccess: () => {
            toast.success("پروفایل با موفقیت ویرایش شد!");
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            onSuccess?.();
        },
        onError: (err: any) => {
            const message =
                err?.message ?? "خطایی رخ داد، لطفاً دوباره تلاش کنید";
            form.setError("root", { type: "server", message });
        },
    });

    return { form, mutateAsync, isPending };
}
