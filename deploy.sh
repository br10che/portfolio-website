#!/bin/sh
# Upload the website to the VPS.
# Run from this folder:  ./deploy.sh
#
# rsync copies only files that changed. --delete removes files from the
# server that no longer exist here, so the server always matches this folder.
# The --exclude lines keep private or internal files OFF the public server.

rsync -avz --delete \
  --exclude 'CLAUDE.md' \
  --exclude 'deploy.sh' \
  --exclude 'README.md' \
  --exclude '.gitignore' \
  --exclude 'styleguide.html' \
  --exclude '.DS_Store' \
  --exclude '.git' \
  ./ vps:/var/www/violasanyan.com/
