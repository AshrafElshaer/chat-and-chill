import { createClient } from "@supabase/supabase-js";
import { env } from "@/env.mjs";

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_API_KEY
);

export async function uploadImage(file: File, userId: number) {
  const { data, error } = await supabase.storage
    .from("images")
    .upload(`avatars/${userId}`, file, {
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from("images").getPublicUrl(data.path);

  if (error) {
    throw error;
  }

  return publicUrl;
}
