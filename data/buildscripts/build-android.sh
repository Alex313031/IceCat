#!/bin/bash
set -e

apt-get -q -y --force-yes install openjdk-7-jdk ant mercurial ccache
apt-get -q -y --force-yes build-dep firefox

export PATH=$PATH:$PWD/android-sdk-linux/tools:$PWD/android-sdk-linux/build-tools:$PWD/android-sdk-linux/platform-tools:/usr/local/bin

pushd ./l10n/compare-locales/
python setup.py build
python setup.py install
install -m 755 scripts/* /usr/local/bin
popd

apt-get -q -y --force-yes  install zip unzip yasm

rm -rf obj-android

cp ../../data/buildscripts/mozconfig-common .mozconfig
cat ../../data/buildscripts/mozconfig-android >> .mozconfig


rm extensions/gnu/abouticecat* -rf

export MOZILLA_DIR=$PWD

./mach build

pushd obj-android/mobile/android/locales
for loc in $(cat ../../../../mobile/android/locales/maemo-locales); do
  LOCALE_MERGEDIR=$PWD/merge-$loc make merge-$loc LOCALE_MERGEDIR=$PWD/merge-$loc
  make LOCALE_MERGEDIR=$PWD/merge-$loc chrome-$loc LOCALE_MERGEDIR=$PWD/merge-$loc
done
popd

./mach package

pkill adb
