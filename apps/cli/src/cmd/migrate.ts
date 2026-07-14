import docker from "../lib/docker/sdk.js";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import fs from "fs";

import { ensureAbsolutePath } from "../lib/etc/utils.js";
import { IMount } from "../types/container.js";

const image = "busybox:latest";

interface IMigrateOptions {
  srcVolume?: boolean;
  srcBind?: boolean;
  dstVolume?: boolean;
  dstBind?: boolean;
}

export default async function migrateCmd(
  src: string,
  dst: string,
  options: IMigrateOptions
) {
  let isSrcVolume = false;
  let isSrcBind = false;
  let isDstVolume = false;
  let isDstBind = false;

  if (options.srcVolume) isSrcVolume = true;
  if (options.srcBind) isSrcBind = true;
  if (options.dstVolume) isDstVolume = true;
  if (options.dstBind) isDstBind = true;

  if (isSrcVolume && isSrcBind) {
    console.error(
      chalk.red(
        "Cannot use both --src-volume and --src-bind options at the same time."
      )
    );
    process.exit(1);
  }

  if (isDstVolume && isDstBind) {
    console.error(
      chalk.red(
        "Cannot use both --dst-volume and --dst-bind options at the same time."
      )
    );
    process.exit(1);
  }

  if (!isSrcVolume && !isSrcBind) {
    if (src.includes("/") || src.includes("\\")) {
      isSrcBind = true;
      console.log(chalk.blue(`Auto-detected source bind mount path: ${src}`));
    } else {
      isSrcVolume = true;
      console.log(chalk.blue(`Auto-detected source volume name: ${src}`));
    }
  }

  if (!isDstVolume && !isDstBind) {
    if (dst.includes("/") || dst.includes("\\")) {
      isDstBind = true;
      console.log(
        chalk.blue(`Auto-detected destination bind mount path: ${dst}`)
      );
    } else {
      isDstVolume = true;
      console.log(chalk.blue(`Auto-detected destination volume name: ${dst}`));
    }
  }

  await runMigration(src, dst, {
    isSrcVolume,
    isSrcBind,
    isDstVolume,
    isDstBind,
  });
}

async function runMigration(
  src: string,
  dst: string,
  types: {
    isSrcVolume: boolean;
    isSrcBind: boolean;
    isDstVolume: boolean;
    isDstBind: boolean;
  }
) {
  const srcName = types.isSrcVolume ? `volume ${src}` : `bind mount ${src}`;
  const dstName = types.isDstVolume ? `volume ${dst}` : `bind mount ${dst}`;

  const spinner = ora(
    `Preparing to migrate from ${chalk.blue(srcName)} to ${chalk.green(dstName)}...`
  ).start();

  try {
    const mounts: IMount[] = [];
    if (types.isSrcVolume) {
      mounts.push({
        Type: "volume",
        Source: src,
        Target: "/src",
        ReadOnly: true,
      });
    } else {
      const srcPath = ensureAbsolutePath(src);
      if (!fs.existsSync(srcPath)) {
        throw new Error(`Source path ${srcPath} does not exist`);
      }
      mounts.push({
        Type: "bind",
        Source: srcPath,
        Target: "/src",
        ReadOnly: true,
      });
    }

    if (types.isDstVolume) {
      mounts.push({
        Type: "volume",
        Source: dst,
        Target: "/dst",
      });
    } else {
      const dstPath = ensureAbsolutePath(dst);
      const dstDir = path.dirname(dstPath);
      if (!fs.existsSync(dstDir)) {
        fs.mkdirSync(dstDir, { recursive: true });
      }
      if (!fs.existsSync(dstPath)) {
        fs.mkdirSync(dstPath, { recursive: true });
      }
      mounts.push({
        Type: "bind",
        Source: dstPath,
        Target: "/dst",
      });
    }

    spinner.text = `Migrating data from ${chalk.blue(srcName)} to ${chalk.green(
      dstName
    )}...`;

    const containerName = `dsmt-migrate-${Date.now()}`;
    await docker.run({
      name: containerName,
      rm: true,
      mounts,
      image,
      cmdArgs: ["sh", "-c", "tar -C /src -cf - . | tar -C /dst -xf -"],
    });

    spinner.succeed(
      `Successfully migrated from ${chalk.blue(srcName)} to ${chalk.green(dstName)}`
    );
  } catch (error) {
    spinner.fail(`Failed to migrate: ${(error as Error).message}`);
    process.exit(1);
  }
}
