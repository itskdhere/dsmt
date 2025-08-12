import { IDockerRunOptions } from "../../types/docker.js";

import {
  containerCreate,
  containerStart,
  containerWait,
  containerRemove,
} from "./container.js";
import { imageList, imagePull } from "./image.js";
import { volumeCreate, volumeList } from "./volume.js";
import { IHostConfig } from "../../types/container.js";

/**
 * @description Create and run a new container from an image
 * @param options - Options for running the container
 */
export async function run(options: IDockerRunOptions) {
  const { name, rm, mounts, volumes, tty, image, cmdArgs } = options;

  let hostConfig: IHostConfig = {
    AutoRemove: rm,
    Binds: volumes?.map((v) => `${v.Name}:${v.Mountpoint}`),
    Mounts: mounts?.map((m) => ({
      Type: m.Type,
      Source: m.Source,
      Target: m.Target,
      ReadOnly: m.ReadOnly,
      Consistency: m.Consistency,
    })),
  };

  const containerId = await containerCreate(name, {
    HostConfig: hostConfig,
    Tty: tty || false,
    Image: image,
    Cmd: cmdArgs,
  });

  await containerStart(containerId);

  await containerWait(containerId);
}

const docker = {
  run,
  containerCreate,
  containerStart,
  containerWait,
  containerRemove,
  imageList,
  imagePull,
  volumeList,
  volumeCreate,
};

export default docker;
