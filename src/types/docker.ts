export interface IDockerConnectionConfig {
  socketPath?: string;
  host?: string;
  port?: number;
}

export interface IContainerArgs {
  name: string;
  src: string;
  dst: string;
  cmd: string[];
  image?: string;
  options?: {
    [key: string]: any;
  };
}
