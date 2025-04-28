import { IContainerArgs } from "../../types/docker.js";

const image = "busybox:latest";

import {
  containerCreate,
  containerStart,
  containerWait,
  containerRemove,
} from "./container.js";
import { imageList, imagePull } from "./image.js";

export async function run({ name, src, dst, cmd }: IContainerArgs) {
  const localImages = await imageList();
  const isImageFound = localImages.some(
    (localImage: string) => localImage === image
  );

  if (!isImageFound) {
    await imagePull(image);
  }

  const containerId = await containerCreate({ name, src, dst, cmd, image });
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
};

export default docker;
