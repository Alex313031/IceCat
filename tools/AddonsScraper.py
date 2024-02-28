#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#    Copyright (C) 2014  Rubén Rodríguez <ruben@gnu.org>
#
#    This program is free software; you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation; either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program; if not, write to the Free Software
#    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA
#
#
#    This package parses https://addons.mozilla.org and generates a database
#    listing the addons that are under a valid license. addons.mozilla.org is
#    itself licensed as "CC Attribution Share-Alike v3.0 or any later version."
#    Note that screenshots get licensed under the same license as the program.
#
#    To run, install mysql-server, python-mysqldb and python-beautifulsoup
#

#####################################################################
#
# This program is obsolete.
# 
# AddonsScraper.py (a web scraper) has been superseded by
# https://savannah.gnu.org/projects/directory
# that has implemented the addons.mozilla.org (AMO) API
# (https://addons-server.readthedocs.io/en/latest/topics/api/addons.html)
# script that I wrote to sync AMO with
# https://directory.fsf.org/wiki/Collection:IceCat
#
# The binary release of IceCat already uses
# https://directory.fsf.org/wiki/Collection:IceCat in 
# IceCat -> Tools -> Add-ons (about:addons) -> Get Add-ons
# 
# Besides, AddonsScraper.py is broken. It's better to delete it than
# maintaining it in my opinion.
# 
# -- David Hedlund
#
#####################################################################

import re
import sys
import urllib2
import BeautifulSoup

server="https://addons.mozilla.org"
parsepages=2 #Number of pages per category to parse
dbuser="root"
dbpass=""

validlicenses = ['http://www.gnu.org/licenses/gpl-3.0.html',
'http://www.gnu.org/licenses/gpl-2.0.html',
'http://www.gnu.org/licenses/lgpl-3.0.html',
'http://www.gnu.org/licenses/lgpl-2.1.html',
'http://www.opensource.org/licenses/bsd-license.php',
'http://www.opensource.org/licenses/mit-license.php',
'http://www.mozilla.org/MPL/MPL-1.1.html',
'http://www.mozilla.org/MPL/2.0/']

categories = ['alerts-updates', 'appearance', 'bookmarks', 'download-management', 'feeds-news-blogging', 'games-entertainment', 'language-support', 'photos-music-videos', 'privacy-security', 'search-tools', 'shopping', 'social-communication', 'tabs', 'web-development', 'other']

def normalink(string):
    return re.sub('\?.*', '', string)

def parselist(url):
    print "PARSING LIST: " + url
    l = []
    request =  urllib2.Request(url)
    response = urllib2.urlopen(request)
    soup = BeautifulSoup.BeautifulSoup(response)
    for infodiv in soup.findAll('div',{'class':'info'}):
        for h3 in infodiv.findAll('h3'):
            for link in h3.findAll('a'):
                l.append(re.sub('\?.*', '', link['href']))
    return l


def parsepage(url, category):
    request =  urllib2.Request(url)
    response = urllib2.urlopen(request)
    soup = BeautifulSoup.BeautifulSoup(response)
    try:
        licenseli =  soup.findAll('li',{'class':'source-license'})[0]
        license = licenseli.findAll('a')[0]['href']
        if license not in validlicenses:
            if license[0] == "h":
                print "INVALID LICENSE: " + license
            return 0
    except:
        return 0
    name = re.sub('/$','', normalink(url))
    name = re.sub('.*/','', name)
    id = soup.findAll('div',{'id':'addon'})[0]['data-id']
    prettyname = soup.findAll(attrs={"property":"og:title"})[0]['content']
    description = soup.findAll(attrs={"property":"og:description"})[0]['content']
    rating = soup.findAll(attrs={"itemprop":"ratingValue"})[0]['content']
    popularity = soup.findAll(attrs={"itemprop":"interactionCount"})[0]['content']
    popularity = re.sub('UserDownloads:', '', popularity)
    htmldescription =  soup.findAll('div',{'id':'addon-description'})[0]
    icon = normalink(soup.findAll(attrs={"property":"og:image"})[0]['content'])
    screenshots = []
    try:
        previewdiv = soup.findAll('ul',{'id':'preview'})[0]
        for a in previewdiv.findAll('a'):
            screenshots.append(normalink(a['href']))
    except:
        pass
    tmp=""
    for value in screenshots:
        tmp+=value+' '
        screenshots=tmp
    version =  soup.findAll('span',{'class':'version-number'})[0].text
    addondiv = soup.findAll('div',{'id':'addon'})[0]
    addonp = addondiv.findAll('p',{'class':'install-button'})[0]
    button = addonp.findAll('a')[0]
    downloadlink = server + normalink(button['href'])
    try:
        homelink = soup.findAll('a',{'class':'home'})[1]['href']
        homelink = re.sub('.*//','http://',homelink)
    except:
        homelink = ""
    try:
        supportlink = soup.findAll('a',{'class':'support'})[0]['href']
        supportlink = re.sub('.*//','http://',supportlink)
    except:
        supportlink = ""

    versioninfo = unicode(soup.findAll('div',{'class':'desc prose'})[0])
    versiontime = soup.findAll('time')[0].text
    filesize = soup.findAll('span',{'class':'filesize'})[0].text
 
    htmldescription = unicode(htmldescription)
    description = unicode(description)
    prettyname = unicode(prettyname)
    description = re.sub('\'', '\\\'', description)
    htmldescription = re.sub('\'', '\\\'', htmldescription)
    versioninfo = re.sub('\'', '\\\'', versioninfo)
    prettyname = re.sub('\'', '\\\'', prettyname)

    sql = "INSERT INTO addons (\
id, name, prettyname, description, htmldescription, icon, screenshots, version, versioninfo, versiontime, filesize, rating, popularity, homelink, supportlink, downloadlink, license, category \
) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');" % (\
id, name, prettyname, description, htmldescription, icon, screenshots, version, versioninfo, versiontime, filesize, rating, popularity, homelink, supportlink, downloadlink, license, category)
    print sql.encode('utf-8').strip()

sql = """DROP DATABASE IF EXISTS addons;
CREATE DATABASE addons CHARACTER SET utf8 COLLATE utf8_general_ci;
USE addons;
CREATE TABLE addons(
id INT PRIMARY KEY,
name VARCHAR(50),
prettyname VARCHAR(50),
description TEXT,
htmldescription TEXT,
icon VARCHAR(255),
screenshots TEXT,
version VARCHAR(20),
versioninfo TEXT,
versiontime VARCHAR(40),
filesize VARCHAR(10),
rating VARCHAR(10),
popularity INT,
downloadlink VARCHAR(255),
homelink VARCHAR(255),
supportlink VARCHAR(255),
retrievedlink VARCHAR(255),
license VARCHAR(255),
category VARCHAR(20)
);
"""

print sql

"""
for category in categories:
    links=[]
    for page in range(1,1+parsepages):
        links = links + parselist(server + "/en-US/firefox/extensions/" + category + "/?sort=popular&page="+str(page))
    for link in links:
        parsepage(server+link, category)
"""
#tests
#parsepage("https://addons.mozilla.org/en-US/firefox/addon/adblock-plus/", "test")
#parsepage("https://addons.mozilla.org/en-US/firefox/addon/what-about/", "test")
#parsepage("https://addons.mozilla.org/en-US/firefox/addon/noscript/", "test")

for item in [394968, 1865, 3829, 722, 1843, 201, 748, 3456, 220, 60, 59 ]:
    parsepage(("https://addons.mozilla.org/en-US/firefox/addon/%s" % item) , "test")

