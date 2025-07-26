import os from "os";
import path from "path";
import { parseDockerHost } from "./parser.js";
import { isSocketAccessible } from "./checks.js";
import type { IDockerConnectionConfig } from "../../types/docker.js";

export function detectLinuxDockerConnection(): IDockerConnectionConfig {
  const socketPaths = [
    "/var/run/docker.sock", // Standard Docker socket
    path.join(os.homedir(), ".docker", "desktop", "docker.sock"), // Rootless Docker
    // Podman
    `/run/user/${process.getuid?.() || 1000}/podman/podman.sock`,
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
