import { IMount } from "./container.js";
import { IVolume } from "./volume.js";

export interface IDockerConnectionConfig {
  socketPath?: string;
  host?: string;
  port?: number;
}

export interface IDockerRunOptions {
  name: string;
  rm: boolean;
  volumes?: IVolume[];
  mounts?: IMount[];
  tty?: boolean;
  image: string;
  cmdArgs: string[];
}
