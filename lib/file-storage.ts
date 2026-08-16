import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.env.UPLOAD_DIR || "data/uploads");
export async function saveUpload(key: string, file: File) {
  const target = path.resolve(root, key);
  if (!target.startsWith(root + path.sep)) throw new Error("Invalid upload path");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await file.arrayBuffer()));
  await writeFile(`${target}.type`, file.type || "application/octet-stream", "utf8");
  return key;
}
export async function readUpload(key: string) {
  const target = path.resolve(root, key);
  if (!target.startsWith(root + path.sep)) return null;
  try { return { data: await readFile(target), type: await readFile(`${target}.type`, "utf8").catch(() => "application/octet-stream") }; }
  catch { return null; }
}
