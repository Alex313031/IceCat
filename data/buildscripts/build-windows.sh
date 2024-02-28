#!/bin/bash
set -e

export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

apt-get -q -y --force-yes  install zip unzip yasm

rm -rf obj-windows

cp ../../data/buildscripts/mozconfig-common .mozconfig
cat ../../data/buildscripts/mozconfig-windows >> .mozconfig

./mach build
./mach package
