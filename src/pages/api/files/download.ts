import fs from "fs";
import os from "os";
import path from "path";

import { downloadFileFromStorage } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

const fsPromises = fs.promises;
const homeDir = os.homedir();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const path = req.query.path as string;
    const file = await downloadFileFromStorage(path);

    if (file instanceof Error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    const isSaved = await saveFile(file);
    if (isSaved instanceof Error || !isSaved) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "File downloaded" });
  }
}
async function saveFile(file: { data: Blob; fileName: string }) {
  const blob = file.data;
  const buffer = Buffer.from(await blob.arrayBuffer());
  const fileExt = file.data.type.split("/")[1] as string;

  return await fsPromises
    .writeFile(
      path.join(homeDir, `/Downloads/${file.fileName}.${fileExt ?? "txt"}`),
      buffer
    )
    .then(() => true)
    .catch((err: Error) => err);
}
