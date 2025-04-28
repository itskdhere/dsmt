#! /usr/bin/env node

import exportCmd from "./cmd/export.js";
import importCmd from "./cmd/import.js";
import { Command } from "commander";

const program = new Command();

program
  .name("dsmt")
  .description("Docker Storage Migration Tool")
  .version("0.1.0");

program
  .command("export")
  .argument("<src>", "volume name or bind mount path")
  .argument("<dst>", "path to export to")
  .option("-v, --volume", "Volume")
  .option("-m, --mount", "Mount")
  .description("Export a Docker Volume or Bind Mount to a Tarball")
  .action(async (src, dst, options) => await exportCmd(src, dst, options));

program
  .command("import")
  .argument("<src>", "path to import from")
  .argument("<dst>", "volume name or bind mount path")
  .option("-v, --volume", "Volume")
  .option("-m, --mount", "Mount")
  .description("Import a Docker Volume or Bind Mount from a Tarball")
  .action(async (src, dst, options) => await importCmd(src, dst, options));

program.parse(process.argv);
