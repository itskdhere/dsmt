import fs from "fs";
import os from "os";

export function isSocketAccessible(socketPath: string): boolean {
  try {
    const stats = fs.statSync(socketPath);
    return stats.isSocket();
  } catch {
    return false;
  }
}

export function isNamedPipeAccessible(pipePath: string): boolean {
  if (os.platform() !== "win32") {
    return false;
  }

  try {
    const stats = fs.statSync(pipePath);
    return stats.isFIFO();
  } catch {
    return false;
  }
}
