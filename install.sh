#!/bin/bash
set -e

REPO="Samawa-Language/samawa-language"
BINARY_NAME="sl"
INSTALL_DIR="/usr/local/bin"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

step()   { echo -e "${CYAN}▸${NC} $1"; }
ok()     { echo -e "${GREEN}✓${NC} $1"; }
fail()   { echo -e "${RED}✗${NC} $1"; exit 1; }

detect_platform() {
  os="$(uname -s)"
  arch="$(uname -m)"

  case "$os" in
    Linux*)  platform="linux" ;;
    Darwin*) platform="darwin" ;;
    MINGW*|MSYS*|CYGWIN*) platform="win32" ;;
    *)       fail "Unsupported OS: $os" ;;
  esac

  case "$arch" in
    x86_64|amd64)  arch="x64" ;;
    aarch64|arm64) arch="arm64" ;;
    *)             fail "Unsupported architecture: $arch" ;;
  esac

  if [ "$platform" = "win32" ]; then
    TARGET="sl-${platform}-${arch}.exe"
  else
    TARGET="sl-${platform}-${arch}"
  fi
}

get_latest_version() {
  curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
    | grep '"tag_name"' | sed -E 's/.*"v?([^"]+)".*/\1/'
}

install_binary() {
  local version="$1"
  local url="https://github.com/${REPO}/releases/download/v${version}/${TARGET}"
  local tmp_file
  tmp_file="$(mktemp)"

  step "Downloading ${TARGET} v${version}..."
  curl -fsSL "$url" -o "$tmp_file" || fail "Download failed. Check if v${version} exists for your platform."

  step "Installing to ${INSTALL_DIR}/${BINARY_NAME}..."
  chmod +x "$tmp_file"
  sudo mv "$tmp_file" "${INSTALL_DIR}/${BINARY_NAME}"

  ok "Installed ${BINARY_NAME} v${version}"
}

uninstall() {
  if [ -f "${INSTALL_DIR}/${BINARY_NAME}" ] || [ -L "${INSTALL_DIR}/${BINARY_NAME}" ]; then
    sudo rm "${INSTALL_DIR}/${BINARY_NAME}"
    ok "Uninstalled ${BINARY_NAME}"
  else
    fail "${BINARY_NAME} is not installed."
  fi
}

show_usage() {
  echo "SamaLang Compiler Installer"
  echo ""
  echo "Usage:"
  echo "  curl -fsSL https://raw.githubusercontent.com/${REPO}/main/install.sh | bash"
  echo ""
  echo "Options:"
  echo "  (no args)    Install latest version"
  echo "  uninstall    Remove ${BINARY_NAME}"
  echo "  version      Show installed version"
}

# Main
case "${1:-install}" in
  install)
    echo -e "\x1b[1mSamaLang Compiler — Installer\x1b[0m\n"
    detect_platform
    step "Detected platform: ${TARGET}"
    VERSION="$(get_latest_version)" || fail "Failed to fetch latest version"
    install_binary "$VERSION"
    echo ""
    step "Run 'sl --help' to get started"
    ;;
  uninstall)
    uninstall
    ;;
  version)
    "${INSTALL_DIR}/${BINARY_NAME}" --version 2>/dev/null || echo "Not installed"
    ;;
  *)
    show_usage
    ;;
esac
