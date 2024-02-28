// Copyright 2019 Johannes Marbach
//
// This file is part of "LibrifyJS: libgen.me", hereafter referred
// to as the program.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

(() => {
    let searchField = document.querySelector('input')
    if (!searchField) {
        console.error('LibrifyJS: Could not locate search field')
        return
    }

    connectSearchField()
    connectCollectionLinks()

    function connectSearchField() {
        searchField.addEventListener('keyup', event => {
            if (event.keyCode !== 13) {
                return
            }
            event.preventDefault()
            document.location.href = LibrifyJS_LibgenMe.createSearchUrl(searchField.value, 'all', 1, 0)
        })
    }

    function connectCollectionLinks() {
        let links = document.querySelectorAll('div.categories a.urls')
        if (!links) {
            console.warn('LibrifyJS: Could not locate collection links')
            return
        }
        links[0].classList.add('active')
        for (let i = 0; i < links.length; ++i) {
            let collection = i === 0 ? 'all' : links[i].textContent.trim()
            links[i].addEventListener('click', function(event) {
                event.preventDefault()
                document.location.href = LibrifyJS_LibgenMe.createSearchUrl(searchField.value, collection, 1, 0)
            })
        }
    }
})()
