#!/bin/bash
set -e

export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

apt-get -q -y --force-yes  install zip unzip yasm mkisofs

rm -rf obj-mac

cp ../../data/buildscripts/mozconfig-common .mozconfig
cat ../../data/buildscripts/mozconfig-mac >> .mozconfig

./mach build
./mach package

