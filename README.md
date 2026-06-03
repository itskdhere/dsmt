# DSMT

[![NPM Version](https://img.shields.io/npm/v/dsmt.svg?label=version&logo=semver)](https://www.npmjs.com/package/dsmt)
[![NPM Downloads](https://img.shields.io/npm/dm/dsmt.svg?logo=npm)](https://www.npmjs.com/package/dsmt)
[![License](https://img.shields.io/github/license/itskdhere/dsmt.svg?logo=github)](https://github.com/itskdhere/dsmt/blob/main/LICENSE)
[![Build Status](https://github.com/itskdhere/dsmt/actions/workflows/ci.yml/badge.svg)](https://github.com/itskdhere/dsmt/actions/workflows/ci.yml)

**Docker Storage Migration Tool (DSMT)** is a command-line utility for seamlessly exporting and importing Docker volumes and bind mounts.

## Overview

DSMT provides a simple way to:

- Export Docker volumes or bind mounts to compressed tarballs.
- Import compressed tarballs into Docker volumes or bind mounts.

This tool makes it easy to backup, restore, or migrate Docker storage across systems.

## Installation

### Global Installation

Choose your preferred package manager to install the CLI globally:

```bash
# npm
npm install -g dsmt

# yarn
yarn global add dsmt

# pnpm
pnpm add -g dsmt

# bun
bun add -g dsmt
```

### Run Directly

Or run directly without manual installation using:

```bash
# npx (npm)
npx dsmt <command> [args]

# bunx (bun)
bunx dsmt <command> [args]

# pnpm dlx
pnpm dlx dsmt <command> [args]

# yarn dlx
yarn dlx dsmt <command> [args]
```

## Usage

### Exporting Docker Storage

Export a Docker volume:

```bash
dsmt export volume_name /path/to/export/directory
```

Export a bind mount:

```bash
dsmt export /path/to/bind/mount /path/to/export/directory
```

### Importing Docker Storage

Import to a Docker volume:

```bash
dsmt import /path/to/tarball.tar.gz volume_name
```

Import to a bind mount:

```bash
dsmt import /path/to/tarball.tar.gz /path/to/bind/mount
```

## Options

Both commands support the following options:

- `-v, --volume`: Explicitly specify source/destination as a Docker volume
- `-b, --bind`: Explicitly specify source/destination as a bind mount

The tool will automatically detect the source/destination type in most cases, but you can use these flags to be explicit.

## Examples

```bash
# Export a volume named 'mongodb_data' to the current directory
dsmt export mongodb_data ./

# Import a tarball to a new volume
dsmt import ./mongodb_data.tar.gz new_mongodb_data

# Export a bind mount to the /backups directory
dsmt export /var/www/html /backups

# Import a tarball to a bind mount
dsmt import ./html.tar.gz /var/www/html
```

## Contribution

Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on contributing to this project.

## Security

Please refer to the [SECURITY.md](SECURITY.md) file for security-related issues and reporting.

## License

MIT © [itskdhere](https://github.com/itskdhere)

<br>
<p align="center">
  <a href="https://youtu.be/dQw4w9WgXcQ">🐳</a>
</p>
