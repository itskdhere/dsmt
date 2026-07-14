#! /usr/bin/env node

import exportCmd from "./cmd/export.js";
import importCmd from "./cmd/import.js";
import migrateCmd from "./cmd/migrate.js";
import { Command } from "commander";

const program = new Command();

program
  .name("dsmt")
  .description("Docker Storage Migration Tool")
  .version("0.3.3");

program
  .command("export")
  .argument("<src>", "volume name or bind mount path")
  .argument("<dst>", "path to export to")
  .option("-v, --volume", "Volume")
  .option("-b, --bind", "Bind Mount")
  .description("Export a Docker Volume or Bind Mount to a Tarball")
  .action(async (src, dst, options) => await exportCmd(src, dst, options));

program
  .command("import")
  .argument("<src>", "path to import from")
  .argument("<dst>", "volume name or bind mount path")
  .option("-v, --volume", "Volume")
  .option("-b, --bind", "Bind Mount")
  .description("Import a Docker Volume or Bind Mount from a Tarball")
  .action(async (src, dst, options) => await importCmd(src, dst, options));

program
  .command("migrate")
  .argument("<src>", "source volume name or bind mount path")
  .argument("<dst>", "destination volume name or bind mount path")
  .option("--sv, --src-volume", "Source is a Volume")
  .option("--sb, --src-bind", "Source is a Bind Mount")
  .option("--dv, --dst-volume", "Destination is a Volume")
  .option("--db, --dst-bind", "Destination is a Bind Mount")
  .description(
    "Migrate data directly from a source (volume or bind mount) to a destination (volume or bind mount)"
  )
  .action(async (src, dst, options) => await migrateCmd(src, dst, options));

program.parse(process.argv);
