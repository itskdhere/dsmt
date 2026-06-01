import { dockerClient } from "../connection/client.js";
import {
  IVolume,
  IVolumeListResponse,
  IVolumeCreateOptions,
} from "../../types/volume.js";

export async function volumeList() {
  try {
    const response = await dockerClient("/volumes", {
      method: "GET",
    });

    const data: IVolumeListResponse = response.data;

    const volumes = data.Volumes.map((vol: any) => {
      return {
        Name: vol.Name,
        Driver: vol.Driver,
        Mountpoint: vol.Mountpoint,
      };
    });

    return volumes;
  } catch (error) {
    console.error("Failed to list Docker volumes:", error);
    throw error;
  }
}

export async function volumeCreate({ Name, Driver }: IVolumeCreateOptions) {
  if (!Name) {
    throw new Error("Volume name is required for creation.");
  }
  if (!Driver) {
    Driver = "local";
  }

  try {
    const response = await dockerClient("/volumes/create", {
      method: "POST",
      data: {
        Name,
        Driver,
      } as IVolumeCreateOptions,
    });
    const data: IVolume = response.data;
    return data;
  } catch (error) {
    console.error(`Failed to create Docker volume ${Name}:`, error);
    throw error;
  }
}
