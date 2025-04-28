import axios from "axios";

import { IContainerArgs } from "../../types/docker.js";

export async function containerCreate({
  name,
  src,
  dst,
  cmd,
  image,
}: IContainerArgs): Promise<string> {
  const binds = [`${src}:/src`, `${dst}:/dst`];

  try {
    const createResponse = await axios({
      method: "POST",
      socketPath: "/var/run/docker.sock",
      url: `http://localhost/containers/create`,
      data: {
        Image: image,
        Tty: false,
        Cmd: cmd,
        HostConfig: {
          AutoRemove: true,
          Binds: binds,
        },
      },
    });
    if (!createResponse.data || !createResponse.data.Id) {
      throw new Error(
        "Failed to create container: Invalid response from Docker API"
      );
    }
    return createResponse.data.Id;
  } catch (error) {
    console.error("Failed to create Docker container:", error);
    throw error;
  }
}

export async function containerStart(containerId: string): Promise<void> {
  try {
    await axios({
      method: "POST",
      socketPath: "/var/run/docker.sock",
      url: `http://localhost/containers/${containerId}/start`,
    });
  } catch (error) {
    console.error(`Failed to start Docker container ${containerId}:`, error);
    await containerRemove(containerId).catch((removeError) =>
      console.error(
        `Failed to remove container ${containerId} after start failure:`,
        removeError
      )
    );
    throw error;
  }
}

export async function containerWait(containerId: string): Promise<number> {
  try {
    const response = await axios({
      method: "POST",
      socketPath: "/var/run/docker.sock",
      url: `http://localhost/containers/${containerId}/wait`,
    });
    if (response.data.StatusCode !== 0) {
      throw new Error(
        `Container ${containerId} exited with status code ${response.data.StatusCode}`
      );
    }
    return response.data.StatusCode;
  } catch (error) {
    console.error(`Failed to wait for Docker container ${containerId}:`, error);
    throw error;
  }
}

export async function containerRemove(containerId: string): Promise<void> {
  try {
    await axios({
      method: "DELETE",
      socketPath: "/var/run/docker.sock",
      url: `http://localhost/containers/${containerId}`,
    });
  } catch (error) {
    console.warn(`Failed to remove Docker container ${containerId}:`, error);
  }
}
