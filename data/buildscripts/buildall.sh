#!/bin/bash

set -e
set -x

if [ $# != 1 ]; then
  echo E: pass the source dir as parameter
  exit 1
fi

SRCDIR=$PWD/$1

function buildpackage(){
cat << EOF > $SRCDIR/run.sh
set -e
set -x

mkdir -p $HOME/ccache/$1-$3 || true
export CCACHE_DIR=$HOME/ccache/$1-$3
mkdir $SRCDIR/../../toolchains || true
cd $SRCDIR/../../toolchains
sh ../data/buildscripts/toolchain-${1}.sh

apt-get install -y --force-yes mercurial
cd /usr/local/src
hg clone http://hg.mozilla.org/l10n/compare-locales/
cd compare-locales/
hg checkout RELEASE_3_3_0
python setup.py install
cp /usr/local/bin/compare* /usr/bin

cd $SRCDIR
sh ../../data/buildscripts/build-${1}.sh
EOF

env -i TERM=screen sudo HOME=/home/ruben BUILDDIST=$2 ARCH=$3 pbuilder execute $SRCDIR/run.sh
}

#buildpackage windows belenos amd64 |tee  windows.log 2>&1
#buildpackage mac belenos amd64 |tee mac.log 2>&1
buildpackage gnulinux flidas i386 |tee gnulinux-i386.log 2>&1
sudo mv $SRCDIR/obj-gnulinux $SRCDIR/obj-gnulinux-i386
buildpackage gnulinux flidas amd64 |tee gnulinux-amd64.log 2>&1
sudo mv $SRCDIR/obj-gnulinux $SRCDIR/obj-gnulinux-amd64
#buildpackage android belenos amd64  |tee android.log 2>&1

rm binaries -rf
mkdir binaries/langpacks -p
#cp $1/obj-windows/dist/icecat*.zip binaries
#cp $1/obj-mac/dist/icecat/icecat*.dmg binaries
cp $1/obj-gnulinux*/dist/icecat*.bz2 binaries
#cp $1/obj-android/dist/icecat*.apk binaries
cp $1/obj-gnulinux-amd64/dist/linux-x86_64/xpi/* binaries/langpacks
rename 's/linux/gnulinux/' binaries/*
