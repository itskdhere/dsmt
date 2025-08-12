/**
 * @description Model - Interface representing a Docker Volume.
 */
export interface IVolume {
  /**
   * @description Name of the volume
   * @type {string}
   */
  Name: string;

  /**
   * @description Name of the volume driver used by the volume
   * @type {string}
   */
  Driver: string;

  /**
   * @description Mount path of the volume on the host
   * @type {string}
   */
  Mountpoint: string;
}

/**
 * @description Model - Volume list response
 * `GET /volumes`
 */
export interface IVolumeListResponse {
  /**
   * @description List of volumes
   * @type {IVolume[]}
   */
  Volumes: IVolume[] | [];
}

/**
 * @description Volume configuration
 */
export interface IVolumeCreateOptions {
  /**
   * @description Name of the volume to create. If not specified, Docker generates a name.
   * @type {string}
   */
  Name: string;

  /**
   * @description Name of the volume driver to use.
   * @type {string}
   * @default "local"
   */
  Driver?: string;
}
