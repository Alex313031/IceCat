This is the README file for the GNU IceCat distribution.

Copyright (C) 2014-2019 Ruben Rodriguez <ruben@gnu.org>
Copyright (C) 2006, 2007, 2008, 2010, 2011, 2012, 2014 Free Software Foundation, Inc.

Copying and distribution of this file, with or without modification,
are permitted in any medium without royalty provided the copyright
notice and this notice are preserved.

The goal of the IceCat project is to provide a completely free version
of the popular mozilla source code.  It is part of Gnuzilla, the
umbrella project analogous to Mozilla.  The base Mozilla code is free
but it supports and suggests using non-free plugins and other modules.
GNU IceCat is completely free, and suggests only free plugins to
users. If you aren't aware of the rationale and goals of the Free
Software Movement, please take a look at this page:
http://www.gnu.org/philosophy/

To report problems, request changes, or other discussion, please use the
public mailing list bug-gnuzilla@gnu.org.  This is an open list, feel
free to subscribe or view the archives at
http://lists.gnu.org/mailman/listinfo/bug-gnuzilla.

The Gnuzilla and IceCat home page:  http://www.gnu.org/software/gnuzilla
The sources are hosted on Savannah: http://savannah.gnu.org/projects/gnuzilla


BUILD FROM TARBALL
==================
From the released IceCat source tarball, you can build it by running:

# replace objdir with whatever path you want
 mkdir objdir
 cd objdir
# replace srcdir with the path where you unpacked the source tarball
 srcdir/configure --with-l10n-base=srcdir/l10n
 make

Be sure you have installed the needed libraries.  If you want to tune
the configuration process you can change the default setup using the
file .mozconfig.

The default configuration of IceCat uses the following libraries:
libpango libpangoxft libpangoft2 libfreetype libxft libgtk2 libx11

Refer to your distro help as needed if the configure script fails to
find them.

To build a langpack:

 cd objdir/browser/locales
 make langpack-$LANG LOCALE_MERGEDIR=.

The xpi file is created at tempBuildDir/dist/linux-x86_64/xpi

CROSSCOMPILING FOR WINDOWS, ANDROID AND MACOS
=============================================

You can use the scripts at data/buildscripts to build the toolchains
and binary packages for the listed platforms. The scripts are made
to work on Debian-based systems.

INSTALL
=======
When you have it built you can install it with:

 make install

If you want to install in a staging directory, you can do this:

 make install DESTDIR=/foo/bar

Or if you want to package the results, you can run

 cd objdir/browser/installer
 make

This generates a binary tarball at objdir/dist

LICENSING
=========
Because we hope and want our privacy enhancements to be picked up by
Mozilla itself, we are keeping the same tri-licensing scheme for
Gnuzilla/IceCat as Mozilla uses: MPL/GPL/LGPL.

CONTRIBUTORS AND HELP
=====================
The maintainer of GNU IceCat is Ruben Rodriguez <ruben@gnu.org>.
We thank the Hitflip team (http://www.hitflip.de/special/gnu) for the logos.

Additional contributors are most welcome.
