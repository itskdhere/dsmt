import docker from "../lib/docker/sdk.js";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import fs from "fs";

import { ensureAbsolutePath } from "../lib/etc/utils.js";

export default async function importCmd(
  src: string,
  dst: string,
  options: any
) {
  if (options.volume && options.mount) {
    console.error(
      chalk.red(
        "Cannot use both --volume and --mount options at the same time."
      )
    );
    process.exit(1);
  }

  if (!options.volume && !options.mount) {
    if (dst.startsWith("/") || dst.startsWith("./") || dst.startsWith("../")) {
      options.mount = true;
      console.log(chalk.blue(`Auto-detected bind mount path: ${dst}`));
    } else {
      options.volume = true;
      console.log(chalk.blue(`Auto-detected volume name: ${dst}`));
    }
  }

  if (options.volume) {
    await importVolume(src, dst, options);
  } else if (options.mount) {
    await importMount(src, dst, options);
  }
}

async function importMount(src: string, dst: string, options: any) {
  const spinner = ora("Preparing to import to Docker bind mount...").start();
  try {
    const srcPath = ensureAbsolutePath(src);
    const dstPath = ensureAbsolutePath(dst);

    if (!fs.existsSync(srcPath)) {
      throw new Error(`Source file ${srcPath} does not exist`);
    }

    const name = path.basename(srcPath);

    spinner.text = `Importing from ${chalk.blue(
      srcPath
    )} to bind mount ${chalk.green(dstPath)}`;

    await docker.run({
      name: name,
      src: srcPath,
      dst: dstPath,
      cmd: ["tar", "xzf", `/src/${name}`, "-C", "/dst"],
      options,
    });

    spinner.succeed(
      `Successfully imported to bind mount at ${chalk.green(dstPath)}`
    );
  } catch (error) {
    spinner.fail(`Failed to import to bind mount: ${(error as Error).message}`);
    process.exit(1);
  }
}

async function importVolume(src: string, dst: string, options: any) {
  const spinner = ora("Preparing to import to Docker volume...").start();
  try {
    const srcPath = ensureAbsolutePath(src);
    const volumeName = dst;

    if (!fs.existsSync(srcPath)) {
      throw new Error(`Source file ${srcPath} does not exist`);
    }

    const name = path.basename(srcPath);

    spinner.text = `Importing from ${chalk.blue(
      srcPath
    )} to volume ${chalk.green(volumeName)}`;

    await docker.run({
      name: name,
      src: srcPath,
      dst: volumeName,
      cmd: ["tar", "xzf", `/src/${name}`, "-C", "/dst"],
      options,
    });

    spinner.succeed(
      `Successfully imported to volume ${chalk.green(volumeName)}`
    );
  } catch (error) {
    spinner.fail(`Failed to import to volume: ${(error as Error).message}`);
    process.exit(1);
  }
}
