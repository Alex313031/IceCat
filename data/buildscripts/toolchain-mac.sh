set -e 

WD=mac-build

#export CCACHE_DIR=$HOME/ccache/mac-amd64
#export CC="ccache gcc"
#export CXX="ccache g++"

apt-get -q -y --force-yes install cmake rsync zlib1g-dev libssl-dev mkisofs

rm -rf $WD
mkdir $WD
cd $WD
#wget http://ppa.launchpad.net/flosoft/cross-apple/ubuntu/pool/main/a/apple-uni-sdk-10.6/apple-uni-sdk-10.6_20110407-0.flosoft1_i386.deb
#wget http://ppa.launchpad.net/flosoft/cross-apple/ubuntu/pool/main/a/apple-uni-sdk-10.6/apple-uni-sdk-10.6_20110407-0.flosoft1_amd64.deb
wget https://people.torproject.org/~mikeperry/mirrors/sources/MacOSX10.7.sdk.tar.gz
tar -xzvf MacOSX10.7.sdk.tar.gz
mkdir -p /usr/lib/apple/SDKs 
mv MacOSX10.7.sdk /usr/lib/apple/SDKs
#dpkg -i *.deb

wget https://mingw-and-ndk.googlecode.com/files/multiarch-darwin11-cctools127.2-gcc42-5666.3-llvmgcc42-2336.1-Linux-120724.tar.xz
unp multiarch-darwin*
rm apple-osx/man -rf
cp apple-osx/* /usr/local/ -a
# For OpenSSL
ln -sf /usr/local/bin/apple-osx-gcc /usr/local/bin/i686-apple-darwin11-cc
#For gmp, need to trick it so it knows we're doing a 64 bit build
for i in /usr/local/bin/i686-apple-darwin11-*; do j=`echo $i | sed 's/i686/x86_64/'`; ln -fs $i $j; done;

wget https://people.torproject.org/~mikeperry/mirrors/sources/x86_64-apple-darwin10.tar.xz
unp x86_64-apple-darwin10.tar.xz
cp x-tools/x86_64-apple-darwin10/* /usr/local/ -a
# FIXME: path hacks:
mkdir -p /System/Library/ || true
ln -fs /usr/lib/apple/SDKs/MacOSX10.7.sdk /usr/lib/apple/SDKs/MacOSX10.5.sdk
ln -fs /usr/lib/apple/SDKs/MacOSX10.7.sdk /usr/lib/apple/SDKs/MacOSX10.5.sdk
ln -fs /usr/lib/apple/SDKs/MacOSX10.7.sdk/System/Library/Frameworks/ /System/Library/
ln -fs /usr/lib/apple/SDKs/MacOSX10.7.sdk/System/Library/PrivateFrameworks/ /System/Library/
ln -fs /usr/lib/apple/SDKs/MacOSX10.7.sdk/usr/lib/libstdc++.6.dylib /usr/lib/apple/SDKs/MacOSX10.7.sdk/usr/lib/libstdc++.dylib

git clone https://git.torproject.org/builders/tor-browser-bundle.git
git clone https://github.com/vasi/libdmg-hfsplus.git
cd libdmg-hfsplus
git checkout dfd5e5cc3dc1191e37d3c3a6118975afdd1d7014
git am ../tor-browser-bundle/gitian/patches/libdmg.patch
cmake CMakeLists.txt
cd dmg
make
cp dmg /usr/local/bin
