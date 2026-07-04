<h1 align="center">
  <img src="apps/web/public/icon.png" alt="DSMT Logo" width="82">
  <br>
  <b>DSMT</b>
</h1>

<h3 align="center">
  Docker Storage Migration Tool
</h3>

<p align="center">
  A fast, dependency-free command-line utility for Import and Export Docker Volumes and Bind Mounts on Windows, Linux and macOS.
</p>

<br>

<p align="center">
  <a href="https://dsmt.itskdhere.com"><img src="https://img.shields.io/badge/Docs-dsmt.itskdhere.com-blue?logo=gitbook&logoColor=white" alt="Docs"></a>
  <a href="https://www.npmjs.com/package/dsmt"><img src="https://img.shields.io/badge/NPM-dsmt-red?logo=npm" alt="NPM"></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/dsmt"><img src="https://img.shields.io/npm/v/dsmt.svg?logo=semver&label=Version" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/dsmt"><img src="https://img.shields.io/npm/dm/dsmt.svg?logo=npm&label=Downloads" alt="NPM Downloads"></a>
  <a href="https://github.com/itskdhere/dsmt/actions/workflows/ci.yml"><img src="https://github.com/itskdhere/dsmt/actions/workflows/ci.yml/badge.svg" alt="CI Status"></a>
  <a href="https://github.com/itskdhere/dsmt/actions/workflows/release.yml"><img src="https://github.com/itskdhere/dsmt/actions/workflows/release.yml/badge.svg" alt="Release Status"></a>
</p>

---

## 🔍 Overview

DSMT provides a simple way to:

- Export Docker volumes or bind mounts to compressed tarballs.
- Import compressed tarballs into Docker volumes or bind mounts.

This tool makes it easy to backup, restore, or migrate Docker storage across systems.

---

## ⚡ Features

- **Cross-Platform**: Pre-compiled standalone binaries for Windows, Linux and macOS (supporting both **x64** and **ARM64**).
- **Flexible Installation**: Install via package managers (NPM, Yarn, PNPM, Bun), quick Bash / PowerShell scripts, or direct standalone binary downloads.
- **Isolated Operations**: Runs compression and restoration inside temporary, isolated Docker containers to guarantee compatibility and system isolation.
- **Auto-Detection**: Automatically determines whether path/name parameters refer to a Docker Volume or Host Bind Mount, with manual overrides.
- **Native Engine Connection**: Auto-detects and integrates with the local Container Engine (Docker, Podman, Colima, Orbstack etc.) via Unix sockets or Windows Named Pipes.

---

## 🚀 Installation

### 1. Quick Install Scripts (Recommended)

Install the pre-compiled binary instantly and add it to your PATH using our quick install scripts:

#### Windows (PowerShell)

```powershell
irm https://dsmt.itskdhere.com/install.ps1 | iex
```

#### Linux / macOS (cURL & Bash)

```bash
curl -fsSL https://dsmt.itskdhere.com/install.sh | sh
```

---

### 2. Package Managers

If you already have a Node.js or Bun environment, you can install the CLI globally:

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

#### Or Run Directly (No Install)

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

---

### 3. Pre-compiled Standalone Binaries

Download standalone binaries directly from the [GitHub Releases](https://github.com/itskdhere/dsmt/releases) page. No runtimes required.

- **Windows**: `dsmt-windows-x64.exe`, `dsmt-windows-arm64.exe`
- **Linux**: `dsmt-linux-x64`, `dsmt-linux-arm64`
- **macOS**: `dsmt-macos-x64`, `dsmt-macos-arm64`

---

## 📖 Usage & Commands

### 📤 Exporting Docker Storage

Exports a Docker Volume or local directory to a compressed `.tar.gz` archive.

```bash
# Export a Docker Volume
dsmt export volume_name /path/to/export/directory

# Export a local directory (Bind Mount)
dsmt export /path/to/local/directory /path/to/export/directory
```

### 📥 Importing Docker Storage

Imports files from a compressed `.tar.gz` archive back into a Docker Volume or local directory. If a destination Docker volume does not exist, DSMT will automatically create it.

```bash
# Import into a Docker Volume
dsmt import /path/to/tarball.tar.gz volume_name

# Import into a local directory (Bind Mount)
dsmt import /path/to/tarball.tar.gz /path/to/local/directory
```

### ⚙️ Command Options

Both `export` and `import` commands support the following overrides:

- `-v, --volume`: Force DSMT to treat the parameter as a Docker Volume (disables auto-detection).
- `-b, --bind`: Force DSMT to treat the parameter as a Host Bind Mount (disables auto-detection).

---

## 💡 Examples

```bash
# Export a volume named 'mongodb_data' to the current directory
dsmt export mongodb_data ./

# Import a tarball to a new volume
dsmt import ./mongodb_data.tar.gz new_mongodb_data

# Export a bind mount to the /backups directory
dsmt export /var/www/html /backups

# Import a tarball to a bind mount
dsmt import ./html.tar.gz /var/www/html

# Force treating destination as bind mount (skips volume check)
dsmt import -b ./backup.tar.gz ./restored_folder
```

---

## 🛠️ Development

This project is organized as a Turborepo monorepo:

- `apps/cli/`: The core DSMT CLI utility.
- `apps/web/`: A Next.js landing page & interactive CLI documentation site.
- `packages/ui/`: Shared UI components and styles.
- `packages/eslint-config/` & `packages/tsconfig/`: Shared development configurations.

### Development Setup

First, make sure you have [Bun](https://bun.com) installed.

```bash
# Clone the repository
git clone https://github.com/itskdhere/dsmt.git
cd dsmt

# Install all workspace dependencies
bun install

# Build workspace packages & CLI
bun run build

# Link the CLI globally for local testing
bun run link

# Start development dev servers/watchers
bun run dev

# Run linting across the monorepo
bun run lint

# Unlink the package when done
bun run unlink
```

---

## 🔭 Contribution & Security

Please refer to:

- [CONTRIBUTING.md](CONTRIBUTING.md) for local development workflows and guidelines.
- [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## 📄 License

MIT © [itskdhere](https://github.com/itskdhere)

<br>
<p align="center">
  <a href="https://youtu.be/dQw4w9WgXcQ">🐳</a>
</p>
