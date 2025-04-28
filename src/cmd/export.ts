import docker from "../lib/docker/sdk.js";
import chalk from "chalk";
import ora from "ora";
import path from "path";

import { ensureAbsolutePath } from "../lib/etc/utils.js";

export default async function exportCmd(
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
    if (src.startsWith("/") || src.startsWith("./") || src.startsWith("../")) {
      options.mount = true;
      console.log(chalk.blue(`Auto-detected bind mount path: ${src}`));
    } else {
      options.volume = true;
      console.log(chalk.blue(`Auto-detected volume name: ${src}`));
    }
  }

  if (options.volume) {
    await exportVolume(src, dst, options);
  } else if (options.mount) {
    await exportMount(src, dst, options);
  }
}

async function exportMount(src: string, dst: string, options: any) {
  const spinner = ora("Preparing to export Docker bind mount...").start();
  try {
    const srcPath = ensureAbsolutePath(src);
    const dstPath = ensureAbsolutePath(dst);
    const name = path.basename(srcPath);

    spinner.text = `Exporting bind mount from ${chalk.blue(
      srcPath
    )} to ${chalk.green(dst)}`;

    await docker.run({
      name: name,
      src: srcPath,
      dst: dstPath,
      cmd: ["tar", "czf", `/dst/${name}.tar.gz`, "-C", "/src", "."],
      options,
    });

    spinner.succeed(
      `Successfully exported bind mount to ${chalk.green(dstPath)}`
    );
  } catch (error) {
    spinner.fail(`Failed to export bind mount: ${(error as Error).message}`);
    process.exit(1);
  }
}

async function exportVolume(src: string, dst: string, options: any) {
  const spinner = ora("Preparing to export Docker volume...").start();
  try {
    const volumeName = src;
    const dstPath = ensureAbsolutePath(dst);
    const name = path.basename(src);

    spinner.text = `Exporting volume ${chalk.blue(src)} to ${chalk.green(
      dstPath
    )}`;

    await docker.run({
      name: name,
      src: volumeName,
      dst: dstPath,
      cmd: ["tar", "czf", `/dst/${name}.tar.gz`, "-C", "/src", "."],
      options,
    });

    spinner.succeed(`Successfully exported volume to ${chalk.green(dstPath)}`);
  } catch (error) {
    spinner.fail(`Failed to export volume: ${(error as Error).message}`);
    process.exit(1);
  }
}
