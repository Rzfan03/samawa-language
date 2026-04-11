#!/bin/bash

BINARY_NAME="sl"
SOURCE_PATH="$(pwd)/sl"
TARGET_PATH="/usr/local/bin/$BINARY_NAME"

install_compiler() {
    if [ ! -f "$SOURCE_PATH" ]; then
        echo "Error: '$BINARY_NAME' binary not found in this directory."
        exit 1
    fi

    chmod +x "$SOURCE_PATH"
    sudo ln -sf "$SOURCE_PATH" "$TARGET_PATH"

    if [ -L "$TARGET_PATH" ]; then
        echo "Success! You can now use 'sl' anywhere."
    else
        echo "Installation failed."
    fi
}

uninstall_compiler() {
    if [ -L "$TARGET_PATH" ] || [ -f "$TARGET_PATH" ]; then
        sudo rm "$TARGET_PATH"
        echo "Successfully uninstalled."
    else
        echo "Not installed."
    fi
}

if [ "$1" == "install" ]; then
    install_compiler
elif [ "$1" == "uninstall" ]; then
    uninstall_compiler
else
    echo "Usage: ./install.sh [install|uninstall]"
fi