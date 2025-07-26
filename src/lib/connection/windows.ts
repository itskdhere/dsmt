import fs from "fs";
import os from "os";
import path from "path";
import { execSync } from "child_process";
import { parseDockerHost } from "./parser.js";
import { isNamedPipeAccessible } from "./checks.js";
import type { IDockerConnectionConfig } from "../../types/docker.js";

export function detectWindowsDockerConnection(): IDockerConnectionConfig {
  // Check if DOCKER_HOST environment variable is set to a named pipe
  const dockerHost = process.env.DOCKER_HOST;
  if (dockerHost && dockerHost.startsWith("npipe:")) {
    return parseDockerHost(dockerHost);
  }

  // Check if Docker context is set to a named pipe
  try {
    const contextName = execSync("docker context show", {
      encoding: "utf8",
    }).trim();
    const contextInfo = JSON.parse(
      execSync(`docker context inspect ${contextName}`, { encoding: "utf8" })
    );

    if (
      contextInfo &&
      contextInfo[0] &&
      contextInfo[0].Endpoints &&
      contextInfo[0].Endpoints.docker
    ) {
      const dockerEndpoint = contextInfo[0].Endpoints.docker.Host;
      if (dockerEndpoint && dockerEndpoint.startsWith("npipe:")) {
        return parseDockerHost(dockerEndpoint);
      }
    }
  } catch (error) {
    console.debug("Could not detect Docker context:", error);
  }

  // Common Docker Desktop named pipe paths
  const namedPipePaths = [
    "\\\\.\\pipe\\dockerDesktopLinuxEngine", // Docker Desktop Linux containers
    "\\\\.\\pipe\\docker_engine", // Default Docker engine
    "\\\\.\\pipe\\dockerWindowsEngine", // Docker Desktop Windows containers
  ];

  // Check if any named pipe exists
  for (const pipePath of namedPipePaths) {
    if (isNamedPipeAccessible(pipePath)) {
      return { socketPath: pipePath };
    }
  }

  // Check if Docker Desktop is installed
  const dockerDesktopPaths = [
    path.join(os.homedir(), "AppData", "Roaming", "Docker", "settings.json"),
    path.join(os.homedir(), "AppData", "Local", "Docker", "settings.json"),
  ];

  const isDockerDesktopInstalled = dockerDesktopPaths.some((p) => {
    try {
      return fs.existsSync(p);
    } catch {
      return false;
    }
  });

  if (isDockerDesktopInstalled) {
    // Return the most common Docker Desktop pipe
    return { socketPath: "\\\\.\\pipe\\dockerDesktopLinuxEngine" };
  }

  // Fallback to TCP for other Docker implementations on Windows
  return {
    host: "localhost",
    port: 2375,
  };
}
