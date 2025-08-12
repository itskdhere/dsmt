import { dockerClient } from "../connection/client.js";
import { IContainerCreateBody } from "../../types/container.js";

export async function containerCreate(
  name: string,
  { Image, Cmd, Tty = false, HostConfig }: IContainerCreateBody
): Promise<string> {
  try {
    const createResponse = await dockerClient(
      `/containers/create${name ? `?name=${name}` : ""}`,
      {
        method: "POST",
        data: {
          Image,
          Cmd,
          Tty,
          HostConfig,
        } as IContainerCreateBody,
      }
    );
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
    await dockerClient(`/containers/${containerId}/start`, {
      method: "POST",
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
    const response = await dockerClient(`/containers/${containerId}/wait`, {
      method: "POST",
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
    await dockerClient(`/containers/${containerId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn(`Failed to remove Docker container ${containerId}:`, error);
  }
}
