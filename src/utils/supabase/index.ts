import { createClient } from "@supabase/supabase-js";
import { env } from "@/env.mjs";
import { v4 as uuid } from "uuid";

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_API_KEY
);

export async function uploadImage(file: File, userId: number) {
  const { data, error } = await supabase.storage
    .from("files")
    .upload(`avatars/${userId}`, file, {
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("files").getPublicUrl(data.path);

  if (error) {
    throw error;
  }

  return publicUrl;
}

export async function uploadFileToStorage(file: File): Promise<{
  name: string;
  type: string;
  url: string;
  path: string;
}> {
  console.log(file);
  const fileType = file.type.split("/")[0] as string;
  const fileId = uuid() as string;
  console.log(fileType);

  const { data, error } = await supabase.storage
    .from("files")
    .upload(`${fileType}/${fileId}`, file, {
      upsert: false,
      contentType: file.type,
    });
  console.log(data, error);
  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("files").getPublicUrl(data.path);

  return {
    name: file.name,
    type: file.type,
    url: publicUrl,
    path: data.path,
  };
}
