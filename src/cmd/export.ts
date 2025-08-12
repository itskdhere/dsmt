import docker from "../lib/docker/sdk.js";
import chalk from "chalk";
import ora from "ora";
import path from "path";

import { ensureAbsolutePath } from "../lib/etc/utils.js";

const image = "busybox:latest";

export default async function exportCmd(
  src: string,
  dst: string,
  options: any
) {
  if (options.volume && options.bind) {
    console.error(
      chalk.red("Cannot use both --volume and --bind options at the same time.")
    );
    process.exit(1);
  }

  if (!options.volume && !options.bind) {
    if (src.includes("/") || src.includes("\\")) {
      options.bind = true;
      console.log(chalk.blue(`Auto-detected bind mount path: ${src}`));
    } else {
      options.volume = true;
      console.log(chalk.blue(`Auto-detected volume name: ${src}`));
    }
  }

  if (options.volume) {
    await exportVolume(src, dst);
  } else if (options.bind) {
    await exportBind(src, dst);
  }
}

async function exportBind(src: string, dst: string) {
  const spinner = ora("Preparing to export Docker bind mount...").start();
  try {
    const srcPath = ensureAbsolutePath(src);
    const dstPath = ensureAbsolutePath(dst);
    const name = path.basename(srcPath);

    spinner.text = `Exporting bind mount from ${chalk.blue(
      srcPath
    )} to ${chalk.green(dst)}`;

    await docker.run({
      name: `dsmt-export-${name}`,
      rm: true,
      mounts: [
        {
          Type: "bind",
          Source: srcPath,
          Target: "/src",
        },
        {
          Type: "bind",
          Source: dstPath,
          Target: "/dst",
        },
      ],
      image: image,
      cmdArgs: ["tar", "czf", `/dst/${name}.tar.gz`, "-C", "/src", "."],
    });

    spinner.succeed(
      `Successfully exported bind mount to ${chalk.green(dstPath)}`
    );
  } catch (error) {
    spinner.fail(`Failed to export bind mount: ${(error as Error).message}`);
    process.exit(1);
  }
}

async function exportVolume(src: string, dst: string) {
  const spinner = ora("Preparing to export Docker volume...").start();
  try {
    const volumeName = src;
    const dstPath = ensureAbsolutePath(dst);
    const name = path.basename(src);

    spinner.text = `Exporting volume ${chalk.blue(src)} to ${chalk.green(
      dstPath
    )}`;

    await docker.run({
      name: `dsmt-export-${name}`,
      rm: true,
      mounts: [
        {
          Type: "volume",
          Source: volumeName,
          Target: "/src",
        },
        {
          Type: "bind",
          Source: dstPath,
          Target: "/dst",
        },
      ],
      image,
      cmdArgs: ["tar", "czf", `/dst/${name}.tar.gz`, "-C", "/src", "."],
    });

    spinner.succeed(`Successfully exported volume to ${chalk.green(dstPath)}`);
  } catch (error) {
    spinner.fail(`Failed to export volume: ${(error as Error).message}`);
    process.exit(1);
  }
}
