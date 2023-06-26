#!/bin/sh

APPNAME=DynaMaker
BUNDLEID=com.jmakxd.DynaMaker
COPYRIGHT="Copyright © 2019-2023 omegaPi"
OUTDIR=build

cd "$(dirname "$0")"
echo "Building App Bundle..."
./app/node_modules/.bin/electron-packager ./app/ \
    --app-bundle-id="$BUNDLEID" \
    --executable-name="$APPNAME" \
    --icon=./app/DynaMaker-macOS.png \
    --app-copyright="$COPYRIGHT" \
    --ignore=".*\.ico" --ignore=".*\.icns" --ignore="DynaMaker-macOS.png" \
    --overwrite --platform=darwin --arch=all --out="$OUTDIR"
echo "Signing App Bundle..."
codesign --sign - --deep --force "$OUTDIR"/dynamaker-darwin-universal/"$APPNAME".app
echo "Creating DMG image..."
create-dmg --overwrite "$OUTDIR"/dynamaker-darwin-universal/"$APPNAME".app build/ || true
[ -f build/*dmg ] || echo "Failed to create dmg, do you have create-dmg installed?"
