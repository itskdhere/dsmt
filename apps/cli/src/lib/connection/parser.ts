import { IDockerConnectionConfig } from "../../types/docker.js";

export function parseDockerHost(dockerHost: string): IDockerConnectionConfig {
  try {
    if (dockerHost.startsWith("npipe:")) {
      const pipePath = dockerHost.replace("npipe:////./pipe/", "\\\\.\\pipe\\");
      return { socketPath: pipePath };
    }

    const url = new URL(dockerHost);

    switch (url.protocol) {
      case "unix:":
        return { socketPath: url.pathname };
      case "tcp:":
        return {
          host: url.hostname || "localhost",
          port: parseInt(url.port) || 2376,
        };
      case "npipe:":
        return { socketPath: url.pathname };
      default:
        throw new Error(`Unsupported protocol: ${url.protocol}`);
    }
  } catch (error) {
    console.warn(`Failed to parse DOCKER_HOST "${dockerHost}":`, error);
    return { socketPath: "/var/run/docker.sock" };
  }
}
