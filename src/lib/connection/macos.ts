import os from "os";
import path from "path";
import { parseDockerHost } from "./parser.js";
import { isSocketAccessible } from "./checks.js";
import type { IDockerConnectionConfig } from "../../types/docker.js";

export function detectMacDockerConnection(): IDockerConnectionConfig {
  const socketPaths = [
    // Docker Desktop for Mac
    path.join(os.homedir(), ".docker", "desktop", "docker.sock"),
    path.join(os.homedir(), ".docker", "run", "docker.sock"),
    // Standard Unix socket
    "/var/run/docker.sock",
    // Colima
    path.join(os.homedir(), ".colima", "default", "docker.sock"),
    // Podman Desktop
    path.join(
      os.homedir(),
      ".local",
      "share",
      "containers",
      "podman",
      "machine",
      "podman.sock"
    ),
  ];

  for (const socketPath of socketPaths) {
    if (isSocketAccessible(socketPath)) {
      return { socketPath };
    }
  }

  const dockerHost = process.env.DOCKER_HOST;
  if (dockerHost) {
    return parseDockerHost(dockerHost);
  }

  return { socketPath: "/var/run/docker.sock" };
}
