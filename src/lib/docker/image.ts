import { dockerClient } from "../connection/client.js";

export async function imageList(): Promise<string[]> {
  try {
    const response = await dockerClient("/images/json", {
      method: "GET",
    });
    return response.data
      .map((image: any) => image.RepoTags)
      .filter((tags: string[] | null) => tags)
      .flat();
  } catch (error) {
    console.error("Failed to list Docker images:", error);
    throw error;
  }
}

export async function imagePull(image: string) {
  try {
    const response = await dockerClient(`/images/create?fromImage=${image}`, {
      method: "POST",
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to pull Docker image ${image}:`, error);
    throw error;
  }
}
