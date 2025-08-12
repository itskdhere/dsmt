/**
 * @description Create a container
 * `POST /containers/create`
 */
export interface IContainerCreateBody extends IContainerConfig {
  HostConfig: IHostConfig;
}

/**
 * @description Model - Configuration for a container that is portable between hosts.
 */
export interface IContainerConfig {
  /**
   * @description The name (or reference) of the image to use when creating the container, or which was used when the container was created.
   * @type {string}
   */
  Image: string;

  /**
   * @description Command to run specified as a string or an array of strings.
   * @type {string[]}
   */
  Cmd: string[];

  /**
   * @description Attach standard streams to a TTY, including `stdin` if it is not closed.
   * @type {boolean}
   * @default false
   */
  Tty: boolean;
}

/**
 * @description Model - Container configuration that depends on the host we are running on
 */
export interface IHostConfig {
  /**
   * @description Automatically remove the container when the container's process exits. This has no effect if `RestartPolicy` is set.
   * @type {boolean}
   * @default false
   */
  AutoRemove?: boolean;

  /**
   * @description A list of volume bindings for this container. Each volume binding is a string in one of these forms:
              - `host-src:container-dest[:options]` to bind-mount a host path
                into the container. Both `host-src`, and `container-dest` must
                be an _absolute_ path.
              - `volume-name:container-dest[:options]` to bind-mount a volume
                managed by a volume driver into the container. `container-dest`
                must be an _absolute_ path.

              `options` is an optional, comma-delimited list of:

              - `nocopy` disables automatic copying of data from the container
                path to the volume. The `nocopy` flag only applies to named volumes.
              - `[ro|rw]` mounts a volume read-only or read-write, respectively.
                If omitted or set to `rw`, volumes are mounted read-write.
              - `[z|Z]` applies SELinux labels to allow or deny multiple containers
                to read and write to the same volume.
                  - `z`: a _shared_ content label is applied to the content. This
                    label indicates that multiple containers can share the volume
                    content, for both reading and writing.
                  - `Z`: a _private unshared_ label is applied to the content.
                    This label indicates that only the current container can use
                    a private volume. Labeling systems such as SELinux require
                    proper labels to be placed on volume content that is mounted
                    into a container. Without a label, the security system can
                    prevent a container's processes from using the content. By
                    default, the labels set by the host operating system are not
                    modified.
              - `[[r]shared|[r]slave|[r]private]` specifies mount
                [propagation behavior](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt).
                This only applies to bind-mounted volumes, not internal volumes
                or named volumes. Mount propagation requires the source mount
                point (the location where the source directory is mounted in the
                host operating system) to have the correct propagation properties.
                For shared volumes, the source mount point must be set to `shared`.
                For slave volumes, the mount must be set to either `shared` or
                `slave`.
   * @type {string[]}
   */
  Binds?: string[];

  /**
   * @description Specification for mounts to be added to the container.
   * @type {IMount[]}
   */
  Mounts?: IMount[];
}

/**
 * @description Model - Specification for mounts to be added to the container.
 */
export interface IMount {
  /**
   * @description Container path.
   * @type {string}
   */
  Target: string;

  /**
   * @description Mount source (e.g. a volume name, a host path).
   * @type {string}
   */
  Source: string;

  /**
   * @description The mount type. Available types:
          - `bind` Mounts a file or directory from the host into the container. Must exist prior to creating the container.
          - `volume` Creates a volume with the given name and options (or uses a pre-existing volume with the same name and options). These are **not** removed when the container is removed.
          - `image` Mounts an image.
          - `tmpfs` Create a tmpfs with the given options. The mount source cannot be specified for tmpfs.
          - `npipe` Mounts a named pipe from the host into the container. Must exist prior to creating the container.
          - `cluster` a Swarm cluster volume
   * @type {"bind" | "volume" | "image" | "tmpfs" | "npipe" | "cluster"}
   */
  Type: "bind" | "volume" | "image" | "tmpfs" | "npipe" | "cluster";

  /**
   * @description Whether the mount should be read-only.
   * @type {boolean}
   */
  ReadOnly?: boolean;

  /**
   * @description The consistency requirement for the mount: `default`, `consistent`, `cached`, or `delegated`.
   * @type {"default" | "consistent" | "cached" | "delegated"}
   */
  Consistency?: "default" | "consistent" | "cached" | "delegated";
}
