import path from "path";
import { volumeList } from "../docker/volume.js";

export function ensureAbsolutePath(p: string): string {
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
}

export async function volumeExists(name: string): Promise<boolean> {
  try {
    const volumes = await volumeList();
    return volumes.map((v) => v.Name).includes(name);
  } catch (error) {
    return false;
  }
}
