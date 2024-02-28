#!/bin/bash
set -e
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

apt-get -q -y --yes --force-yes install libmpfrc++-dev libmpc-dev zlib1g-dev

WD=$HOME/mingw-w64-build
rm -rf $WD
mkdir $WD

cd $WD
wget http://ftp.gnu.org/gnu/binutils/binutils-2.24.tar.bz2
tar -jxf binutils-2.24.tar.bz2
wget https://ftp.gnu.org/gnu/gcc/gcc-4.9.1/gcc-4.9.1.tar.bz2
tar -jxf gcc-4.9.1.tar.bz2
git clone git://git.code.sf.net/p/mingw-w64/mingw-w64
cd mingw-w64
#git checkout 5db531
#git checkout 7268caece9b4cb33ff698306e51140b11d7656b0
#git checkout master
git checkout a883b47a45ff74ced41dfbd9f748d5c2c61f3c01
cd ..
git clone https://git.torproject.org/builders/tor-browser-bundle.git
PATCHES=$WD/tor-browser-bundle/gitian/patches

# Building binutils
cd $WD
cd binutils-2.24
sed 's/= extern_rt_rel_d;/= extern_rt_rel_d;\n  memset (extern_rt_rel_d, 0, PE_IDATA5_SIZE);/' -i ld/pe-dll.c
patch -p1 < $PATCHES/enable-reloc-section-ld.patch
patch -p1 < $PATCHES/peXXigen.patch
cd ..
mkdir binutils-2.24-build32 && cd binutils-2.24-build32
../binutils-2.24/configure --prefix=/usr/local/ --target=i686-w64-mingw32 --disable-multilib
make -j7
make install

# Building mingw-w64
cd $WD
mkdir mingw-w64-headers32 && cd mingw-w64-headers32
../mingw-w64/mingw-w64-headers/configure --host=i686-w64-mingw32 --prefix=/usr/local/i686-w64-mingw32/ --enable-sdk=all --enable-secure-api --enable-idl
make install

# First stage of gcc compilation
cd $WD
# Linking libgcc against msvcrt is hard-coded...
sed 's/msvcrt/msvcr100/' -i $WD/gcc-4.9.1/gcc/config/i386/t-mingw-w32 $WD/gcc-4.9.1/libgcc/config/i386/t-mingw32
mkdir gcc-4.9.1-mingw32 && cd gcc-4.9.1-mingw32
# LDFLAGS_FOR_TARGET does not work for some reason. Thus, we take
# CFLAGS_FOR_TARGET.
export CFLAGS_FOR_TARGET="-Wl,--nxcompat -Wl,--dynamicbase"
../gcc-4.9.1/configure --prefix=/usr/local/ --target=i686-w64-mingw32 --with-gnu-ld --with-gnu-as --enable-languages=c,c++ --disable-multilib
make all-gcc -j7
make install-gcc

# Building mingw-w64-crt32
cd $WD
mkdir mingw-w64-crt32 && cd mingw-w64-crt32
../mingw-w64/mingw-w64-crt/configure --host=i686-w64-mingw32 --prefix=/usr/local/i686-w64-mingw32/
make -j7
make install

# Building widl32
cd $WD
mkdir widl32 && cd widl32
../mingw-w64/mingw-w64-tools/widl/configure --prefix=/usr/local --target=i686-w64-mingw32
make -j7
make install

# Second stage of gcc compilation
cd $WD
cd gcc-4.9.1-mingw32
make -j7
make install
mkdir -p /usr/local/gcclibs
cp i686-w64-mingw32/libssp/.libs/libssp-0.dll /usr/local/gcclibs
cp i686-w64-mingw32/libgcc/shlib/libgcc_s_sjlj-1.dll /usr/local/gcclibs

echo DONE
