import os from "os";
import path from "path";
import { detectWindowsDockerConnection } from "./windows.js";
import { detectMacDockerConnection } from "./macos.js";
import { detectLinuxDockerConnection } from "./linux.js";
import { testDockerConnection } from "./test.js";
import type { IDockerConnectionConfig } from "../../types/docker.js";

export function detectDockerConnection(): IDockerConnectionConfig {
  const platform = os.platform();

  switch (platform) {
    case "win32":
      return detectWindowsDockerConnection();
    case "darwin":
      return detectMacDockerConnection();
    case "linux":
      return detectLinuxDockerConnection();
    default:
      return detectLinuxDockerConnection();
  }
}

export async function getBestDockerConnection(): Promise<IDockerConnectionConfig> {
  const primaryConfig = detectDockerConnection();

  if (await testDockerConnection(primaryConfig)) {
    return primaryConfig;
  }

  const fallbackConfigs: IDockerConnectionConfig[] = [];

  // Platform-specific fallbacks
  if (os.platform() === "win32") {
    // Windows Docker Desktop named pipes
    fallbackConfigs.push(
      { socketPath: "\\\\.\\pipe\\dockerDesktopLinuxEngine" },
      { socketPath: "\\\\.\\pipe\\docker_engine" },
      { socketPath: "\\\\.\\pipe\\dockerWindowsEngine" },
      { host: "localhost", port: 2375 },
      { host: "localhost", port: 2376 }
    );
  } else if (os.platform() === "darwin") {
    // macOS specific paths
    fallbackConfigs.push(
      {
        socketPath: path.join(
          os.homedir(),
          ".docker",
          "desktop",
          "docker.sock"
        ),
      },
      { socketPath: path.join(os.homedir(), ".docker", "run", "docker.sock") },
      {
        socketPath: path.join(
          os.homedir(),
          ".colima",
          "default",
          "docker.sock"
        ),
      },
      { socketPath: "/var/run/docker.sock" },
      { host: "localhost", port: 2375 },
      { host: "localhost", port: 2376 }
    );
  } else {
    // Linux and other Unix-like systems
    fallbackConfigs.push(
      { socketPath: "/var/run/docker.sock" },
      {
        socketPath: path.join(
          os.homedir(),
          ".docker",
          "desktop",
          "docker.sock"
        ),
      },
      {
        socketPath: `/run/user/${
          process.getuid?.() || 1000
        }/podman/podman.sock`,
      },
      { host: "localhost", port: 2375 },
      { host: "localhost", port: 2376 }
    );
  }

  for (const config of fallbackConfigs) {
    if (await testDockerConnection(config)) {
      return config;
    }
  }

  throw new Error(
    `Failed to connect to Docker. Tried primary config: ${JSON.stringify(
      primaryConfig
    )} ` +
      `and ${fallbackConfigs.length} fallback configurations. ` +
      `Make sure Docker is running and accessible.`
  );
}
