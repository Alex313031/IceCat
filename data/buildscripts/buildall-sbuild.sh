#!/bin/bash

# This script expects a Trisquel sbuild environment, such as the one provided by https://gitlab.trisquel.org/trisquel/trisquel-builder/-/blob/master/sbuild-create.sh

set -e
set -x

if [ $# != 1 ]; then
  echo E: pass the source dir as parameter
  exit 1
fi

SRCDIR=$(readlink -f $1)
VERSION=$(echo $1|sed 's|.*icecat-||')
ROOTDIR=$(readlink -f $SRCDIR/../../)
OUTPUT=$ROOTDIR/output
BUILDROOT=/var/lib/sbuild/build
BUILDDIR=$BUILDROOT/gnuzilla/output/icecat-$VERSION
BUILDDIST=nabia

sudo rm -rf $BUILDROOT/gnuzilla
cp -a $ROOTDIR $BUILDROOT/gnuzilla


function buildpackage(){
cat << EOF > $BUILDROOT/run.sh
set -e
set -x

apt update
apt-get build-dep -y --force-yes firefox 

cd /build/gnuzilla/output/icecat-$VERSION

bash ../../data/buildscripts/build-${1}.sh

rm /build/run.sh

EOF

env -i sudo schroot --directory / -c $BUILDDIST-$3 -- bash  /build/run.sh
}

#buildpackage windows $BUILDDIST amd64 |tee  windows.log 2>&1
#buildpackage mac $BUILDDIST amd64 |tee mac.log 2>&1
#buildpackage gnulinux $BUILDDIST i386 |tee gnulinux-i386.log 2>&1
#sudo mv $SRCDIR/obj-gnulinux $SRCDIR/obj-gnulinux-i386
buildpackage gnulinux $BUILDDIST amd64 |tee gnulinux-amd64.log 2>&1
sudo mv $BUILDDIR/obj-gnulinux $BUILDDIR/obj-gnulinux-amd64
#buildpackage android $BUILDDIST amd64  |tee android.log 2>&1

rm $OUTPUT/binaries -rf
mkdir $OUTPUT/binaries

#cp $1/obj-windows/dist/icecat*.zip $OUTPUT/binaries
#cp $1/obj-mac/dist/icecat/icecat*.dmg $OUTPUT/binaries
cp $BUILDDIR/obj-gnulinux*/dist/icecat*.bz2 $OUTPUT/binaries
#cp $1/obj-android/dist/icecat*.apk $OUTPUT/binaries
cp -a $BUILDDIR/obj-gnulinux-amd64/dist/linux-x86_64/xpi/ $OUTPUT/binaries/langpacks
rename 's/linux/gnulinux/' $OUTPUT/binaries/*

sudo rm -rf $BUILDROOT/gnuzilla
