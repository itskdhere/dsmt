import axios from "axios";

export async function imageList(): Promise<string[]> {
  try {
    const response = await axios({
      method: "GET",
      socketPath: "/var/run/docker.sock",
      url: `http://localhost/images/json`,
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
    const response = await axios({
      method: "POST",
      socketPath: "/var/run/docker.sock",
      url: `http://localhost/images/create?fromImage=${image}`,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to pull Docker image ${image}:`, error);
    throw error;
  }
}
