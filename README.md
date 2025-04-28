# Docker Storage Migration Tool (DSMT)

A command-line utility for seamlessly exporting and importing Docker volumes and bind mounts.

## Overview

DSMT (Docker Storage Migration Tool) provides a simple way to:

- Export Docker volumes or bind mounts to compressed tarballs
- Import tarballs into Docker volumes or bind mounts

This tool makes it easy to backup, restore, or migrate Docker storage across systems.

## Installation

```bash
npm install -g dsmt
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
- `-m, --mount`: Explicitly specify source/destination as a bind mount

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

## Development

```bash
# Clone the repository
git clone https://github.com/itskdhere/dsmt.git
cd dsmt

# Install dependencies
npm install

# Run the development build
npm run dev
```

## License

MIT © [itskdhere](https://github.com/itskdhere)
