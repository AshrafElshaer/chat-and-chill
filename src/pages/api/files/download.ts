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
    // console.log(file);
    if (file instanceof Error) {

      return res.status(500).json({ message: "Internal Server Error" });
    }
    const isSaved = await saveFile(file);
    if (!isSaved) {

      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "OK" });
  }
}
async function saveFile(file: Blob) {
  const blob = file;
  const buffer = Buffer.from(await blob.arrayBuffer());
  console.log(buffer);
  try {
    const isSaved = await fsPromises.writeFile(
      path.join(homeDir, `/Downloads/${file.name}`),
      buffer
    );
    // console.log(isSaved);
    return true;
  } catch (e) {
    return false;
  }
}
