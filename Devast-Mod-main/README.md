# Devast-Mod-main

This is the core modded web client for devast.io. It contains all the required files (HTML, JS, CSS, Media) to run a modified version of the game client locally.

## Features

- **Custom Skins**: Modified graphics and assets (located in `img/`).
- **Custom Audio**: Replacement sound files and music tracks (located in `audio/`).
- **Modified JavaScript**: The core game logic injected with new features and mod panels.
- **Admin Interface**: Provides an `admin.html` dashboard intended for server-level mod actions or bot controls.

## Usage

To use this client, simply serve this directory on a local web server (e.g., using `python3 -m http.server`, Live Server for VSCode, or `http-server` via npm) and navigate to `index.html` or `extension_index.html`. 

_Note: This logic is also packaged into a more convenient browser extension form factor in [devastmod-extension-main](../devastmod-extension-main)._
