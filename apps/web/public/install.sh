#!/bin/sh
set -e

# Detect OS
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
case "$OS" in
  linux)
    PLATFORM="linux"
    ;;
  darwin)
    PLATFORM="macos"
    ;;
  *)
    echo "Error: Unsupported OS: $OS" >&2
    exit 1
    ;;
esac

# Detect Architecture
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64)
    BINARY_ARCH="x64"
    ;;
  arm64|aarch64)
    BINARY_ARCH="arm64"
    ;;
  *)
    echo "Error: Unsupported architecture: $ARCH" >&2
    exit 1
    ;;
esac

BINARY_NAME="dsmt-${PLATFORM}-${BINARY_ARCH}"
DOWNLOAD_URL="https://github.com/itskdhere/dsmt/releases/latest/download/${BINARY_NAME}"

# Create a temporary directory for the download
TMP_DIR="$(mktemp -d)"
clean_up() {
  rm -rf "$TMP_DIR"
}
trap clean_up EXIT INT TERM

echo "Downloading latest dsmt binary for ${PLATFORM} (${BINARY_ARCH})..."

# Download binary
if command -v curl >/dev/null 2>&1; then
  curl -fsSL "$DOWNLOAD_URL" -o "$TMP_DIR/dsmt"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "$TMP_DIR/dsmt" "$DOWNLOAD_URL"
else
  echo "Error: curl or wget is required to run this script." >&2
  exit 1
fi

# Set execute permissions
chmod +x "$TMP_DIR/dsmt"

# Installation destination
INSTALL_DIR="/usr/local/bin"

if [ -w "$INSTALL_DIR" ]; then
  mv "$TMP_DIR/dsmt" "$INSTALL_DIR/dsmt"
  echo "Successfully installed dsmt to $INSTALL_DIR/dsmt"
else
  # Check if we can use sudo (in case stdin is a tty and sudo exists)
  if command -v sudo >/dev/null 2>&1 && [ -t 0 ]; then
    echo "Installing to $INSTALL_DIR requires administrative privileges. Requesting sudo..."
    sudo mv "$TMP_DIR/dsmt" "$INSTALL_DIR/dsmt"
    echo "Successfully installed dsmt to $INSTALL_DIR/dsmt (using sudo)"
  else
    # Fallback to local user directory
    LOCAL_BIN="$HOME/.local/bin"
    mkdir -p "$LOCAL_BIN"
    mv "$TMP_DIR/dsmt" "$LOCAL_BIN/dsmt"
    echo "Successfully installed dsmt to $LOCAL_BIN/dsmt"
    
    # Check if $LOCAL_BIN is in PATH
    case ":$PATH:" in
      *:"$LOCAL_BIN":*)
        ;;
      *)
        echo ""
        echo "WARNING: $LOCAL_BIN is not in your PATH."
        echo "Please add it to your shell configuration (e.g. ~/.bashrc or ~/.zshrc):"
        echo "  export PATH=\"\$PATH:$LOCAL_BIN\""
        ;;
    esac
  fi
fi
