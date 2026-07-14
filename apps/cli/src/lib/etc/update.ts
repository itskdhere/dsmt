import os from "os";
import path from "path";
import chalk from "chalk";
import axios from "axios";
import fs from "fs/promises";
import { spawn } from "child_process";
import { existsSync, realpathSync } from "fs";

const CACHE_DIR = path.join(os.homedir(), ".dsmt");
const CACHE_FILE = path.join(CACHE_DIR, "update-cache.json");

let resolvedArgv1 = process.argv[1];

if (resolvedArgv1) {
  try {
    resolvedArgv1 = realpathSync(resolvedArgv1);
  } catch {}
}

interface UpdateCache {
  lastCheck: number;
  latestVersion: string;
}

function isNewerVersion(current: string, latest: string): boolean {
  if (!latest) return false;

  const currParts = current.replace(/^v/, "").split(".").map(Number);
  const lateParts = latest.replace(/^v/, "").split(".").map(Number);

  for (let i = 0; i < Math.max(currParts.length, lateParts.length); i++) {
    const currVal = currParts[i] || 0;
    const lateVal = lateParts[i] || 0;
    if (lateVal > currVal) return true;
    if (lateVal < currVal) return false;
  }

  return false;
}

function getGlobalInstallCommand(): string | null {
  const argv1 = resolvedArgv1;
  if (!argv1) return null;

  const home = os.homedir();
  const appData = process.env.APPDATA || "";
  const localAppData = process.env.LOCALAPPDATA || "";

  const normalizedPath = path.resolve(argv1).toLowerCase();

  const yarnGlobalDir =
    process.platform === "win32"
      ? path.join(localAppData, "Yarn", "Data", "global", "node_modules")
      : path.join(home, ".config", "yarn", "global", "node_modules");

  if (normalizedPath.startsWith(path.resolve(yarnGlobalDir).toLowerCase())) {
    return "yarn global add dsmt@latest";
  }

  const pnpmGlobalDir =
    process.platform === "win32"
      ? path.join(localAppData, "pnpm", "global")
      : process.platform === "darwin"
        ? path.join(home, "Library", "pnpm", "global")
        : path.join(home, ".local", "share", "pnpm", "global");

  if (normalizedPath.includes(path.resolve(pnpmGlobalDir).toLowerCase())) {
    return "pnpm add -g dsmt@latest";
  }

  const bunGlobalDir = path.join(
    home,
    ".bun",
    "install",
    "global",
    "node_modules"
  );
  if (normalizedPath.startsWith(path.resolve(bunGlobalDir).toLowerCase())) {
    return "bun add -g dsmt@latest";
  }

  const npmGlobalDir =
    process.platform === "win32"
      ? path.join(appData, "npm", "node_modules")
      : process.env.PREFIX
        ? path.join(process.env.PREFIX, "lib", "node_modules")
        : "/usr/local/lib/node_modules";

  const altNpmGlobalDir =
    process.platform === "win32" ? "" : "/usr/lib/node_modules";

  if (
    normalizedPath.startsWith(path.resolve(npmGlobalDir).toLowerCase()) ||
    (altNpmGlobalDir &&
      normalizedPath.startsWith(path.resolve(altNpmGlobalDir).toLowerCase()))
  ) {
    return "npm install -g dsmt@latest";
  }

  const execName = path.basename(process.execPath).toLowerCase();
  const isNodeOrBun = execName.startsWith("node") || execName.startsWith("bun");
  if (isNodeOrBun && normalizedPath.includes("node_modules")) {
    if (normalizedPath.includes("yarn")) return "yarn global add dsmt@latest";
    if (normalizedPath.includes("pnpm")) return "pnpm add -g dsmt@latest";
    if (normalizedPath.includes("bun")) return "bun add -g dsmt@latest";
    return "npm install -g dsmt@latest";
  }

  return null;
}

function displayUpdateBanner(current: string, latest: string) {
  const isWindows = process.platform === "win32";
  const globalCmd = getGlobalInstallCommand();

  const installCmd =
    globalCmd ||
    (isWindows
      ? "irm https://dsmt.itskdhere.com/install.ps1 | iex"
      : "curl -fsSL https://dsmt.itskdhere.com/install.sh | sh");

  const boxWidth = 70;
  const contentWidth = boxWidth - 4; // 66

  const centerText = (text: string, rawLength: number) => {
    const totalPadding = Math.max(0, contentWidth - rawLength);
    const padStart = Math.floor(totalPadding / 2);
    const padEnd = totalPadding - padStart;
    return " ".repeat(padStart) + text + " ".repeat(padEnd);
  };

  const line1Text = `Update available: ${chalk.dim(current)} → ${chalk.green(latest)}`;
  const line1Len = `Update available: ${current} → ${latest}`.length;

  const line2Text = `Run the script command below to update:`;
  const line2Len = line2Text.length;

  const line3Text = chalk.cyan(installCmd);
  const line3Len = installCmd.length;

  const border = chalk.yellow("─".repeat(boxWidth - 2));

  console.log();
  console.log(chalk.yellow(`┌${border}┐`));
  console.log(
    `${chalk.yellow("│")} ${centerText(line1Text, line1Len)} ${chalk.yellow("│")}`
  );
  console.log(
    `${chalk.yellow("│")} ${centerText(line2Text, line2Len)} ${chalk.yellow("│")}`
  );
  console.log(
    `${chalk.yellow("│")} ${centerText(line3Text, line3Len)} ${chalk.yellow("│")}`
  );
  console.log(chalk.yellow(`└${border}┘`));
  console.log();
}

function spawnBackgroundCheck() {
  try {
    const exec = process.execPath;
    const args: string[] = [];

    const argv1 = resolvedArgv1;
    const isDev =
      argv1 &&
      (argv1.endsWith(".js") ||
        argv1.endsWith(".ts") ||
        argv1.includes("node_modules"));

    if (isDev && argv1) {
      args.push(argv1);
    }
    args.push("_check-update");

    const child = spawn(exec, args, {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    child.unref();
  } catch {}
}

export async function checkForUpdates(currentVersion: string) {
  try {
    if (!existsSync(CACHE_DIR)) {
      await fs.mkdir(CACHE_DIR, { recursive: true });
    }

    let cache: UpdateCache = { lastCheck: 0, latestVersion: currentVersion };
    if (existsSync(CACHE_FILE)) {
      try {
        const data = await fs.readFile(CACHE_FILE, "utf-8");
        cache = JSON.parse(data);
      } catch {}
    }

    if (isNewerVersion(currentVersion, cache.latestVersion)) {
      displayUpdateBanner(currentVersion, cache.latestVersion);
    }

    const maxTime = 60 * 60 * 1000; // 1h
    const timeDiff = Date.now() - cache.lastCheck;
    if (timeDiff > maxTime || timeDiff < 0) {
      cache.lastCheck = Date.now();
      await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
      spawnBackgroundCheck();
    }
  } catch {}
}

export async function performUpdateCheck() {
  try {
    const response = await axios.get(
      "https://api.github.com/repos/itskdhere/dsmt/releases/latest",
      {
        headers: {
          "User-Agent": "dsmt-cli",
        },
        timeout: 5000,
      }
    );

    if (response.status === 200 && response.data?.tag_name) {
      const latestVersion = response.data.tag_name.replace(/^v/, "");

      if (!existsSync(CACHE_DIR)) {
        await fs.mkdir(CACHE_DIR, { recursive: true });
      }

      let cache: UpdateCache = { lastCheck: Date.now(), latestVersion };
      if (existsSync(CACHE_FILE)) {
        try {
          const fileData = await fs.readFile(CACHE_FILE, "utf-8");
          const existing = JSON.parse(fileData);
          cache = { ...existing, latestVersion, lastCheck: Date.now() };
        } catch {}
      }

      await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
    }
  } catch {}
}
