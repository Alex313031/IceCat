#!/bin/bash

set -e

for extension in librejs librejs-usps-compatibility submit-me privacy-redirect javascript-restrictor librifyjs-libgen-me-repack; do

  rm -rf /tmp/update-extension
  mkdir /tmp/update-extension
  (cd /tmp/update-extension
   wget -q -O extension.xpi  https://addons.mozilla.org/firefox/downloads/latest/$extension/addon-$extension-latest.xpi
   unzip -q extension.xpi
   rm extension.xpi)

  if [ -f /tmp/update-extension/install.rdf ]; then
    ID=$(grep em:id /tmp/update-extension/install.rdf |sed 's/.*<em:id>//; s/<.*//' |head -n1)
  fi
  if [ -f /tmp/update-extension/manifest.json ]; then
    ID=$(grep '"id":' /tmp/update-extension/manifest.json |head -n1|cut -d \" -f 4)
  fi

  [ $extension = "use-google-drive-with-librejs" ] && ID="google_drive@0xbeef.coffee"
  [ -z $ID ] && ID=$extension"@extension"

  rm -rf extensions/$ID
  mv /tmp/update-extension extensions/$ID

  echo updated $extension
done

find extensions -name cose.manifest -delete
find extensions -name cose.sig -delete
