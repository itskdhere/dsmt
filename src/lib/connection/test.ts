import os from "os";
import http from "http";
import { createNamedPipeAgent } from "./npipe.js";
import { IDockerConnectionConfig } from "../../types/docker.js";

export async function testDockerConnection(
  config: IDockerConnectionConfig
): Promise<boolean> {
  try {
    if (config.socketPath) {
      // Handle Windows named pipes specially
      if (os.platform() === "win32" && config.socketPath.includes("pipe")) {
        return await testWindowsNamedPipe(config.socketPath);
      } else {
        // Unix socket connection
        const axios = (await import("axios")).default;
        const axiosConfig = {
          method: "GET" as const,
          url: "http://localhost/_ping",
          socketPath: config.socketPath,
          timeout: 5000,
        };
        const response = await axios(axiosConfig);
        return response.status === 200 && response.data === "OK";
      }
    } else if (config.host && config.port) {
      // TCP connection
      const axios = (await import("axios")).default;
      const axiosConfig = {
        method: "GET" as const,
        baseURL: `http://${config.host}:${config.port}`,
        url: "/_ping",
        timeout: 5000,
      };
      const response = await axios(axiosConfig);
      return response.status === 200 && response.data === "OK";
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

export async function testWindowsNamedPipe(pipePath: string): Promise<boolean> {
  if (os.platform() !== "win32") {
    return false;
  }

  return new Promise((resolve) => {
    const agent = createNamedPipeAgent(pipePath);

    const options = {
      agent: agent,
      hostname: "localhost",
      port: 80,
      path: "/_ping",
      method: "GET",
      timeout: 5000,
    };

    const req = http.request(options, (res: any) => {
      let data = "";
      res.on("data", (chunk: any) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(res.statusCode === 200 && data.trim() === "OK");
      });
    });

    req.on("error", () => {
      resolve(false);
    });

    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });

    req.setTimeout(5000);
    req.end();
  });
}
