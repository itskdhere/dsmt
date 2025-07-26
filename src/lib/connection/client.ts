import os from "os";
import chalk from "chalk";
import axios, { AxiosRequestConfig } from "axios";
import { createNamedPipeAgent } from "./npipe.js";
import { getBestDockerConnection } from "./optimal.js";
import { IDockerConnectionConfig } from "../../types/docker.js";

export async function dockerClient(
  endpoint: string,
  options: Partial<AxiosRequestConfig> = {}
) {
  const dockerConfig = await initializeDockerConnection();
  const config = createDockerAxiosConfig(dockerConfig, endpoint, options);
  return axios(config);
}

export async function initializeDockerConnection(): Promise<IDockerConnectionConfig> {
  try {
    const dockerConfig = await getBestDockerConnection();
    return dockerConfig;
  } catch (error) {
    console.error(
      chalk.red("Failed to connect to Docker:"),
      (error as Error).message
    );
    console.error(chalk.yellow("Make sure Docker is running and accessible."));
    process.exit(1);
  }
}

function createDockerAxiosConfig(
  dockerConfig: IDockerConnectionConfig,
  endpoint: string,
  options: Partial<AxiosRequestConfig> = {}
): AxiosRequestConfig {
  // const dockerConfig = getDockerConfig();

  const config: AxiosRequestConfig = {
    ...options,
    url: `http://localhost${endpoint}`,
  };

  if (dockerConfig.socketPath) {
    // Handle Windows named pipes differently
    if (os.platform() === "win32" && dockerConfig.socketPath.includes("pipe")) {
      // For Windows named pipes, we need to use a custom HTTP agent
      config.httpAgent = createNamedPipeAgent(dockerConfig.socketPath);
      config.baseURL = "http://localhost";
    } else {
      // Unix socket
      config.socketPath = dockerConfig.socketPath;
    }
  } else if (dockerConfig.host && dockerConfig.port) {
    // TCP connection
    config.baseURL = `http://${dockerConfig.host}:${dockerConfig.port}`;
  } else {
    throw new Error("Invalid Docker connection configuration");
  }

  return config;
}
