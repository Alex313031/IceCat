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
    loadItem()

    function loadItem() {
        let params = new URLSearchParams(window.location.search)
        if (!params.has('id')) {
            console.error('LibrifyJS: Could not locate ID in query string')
            return
        }

        fetch(createRequest(params.get('id')))
            .then(response => response.json())
            .catch(onLoadError)
            .then(json => onLoadSuccess(json))
    }

    function createRequest(id) {
        return new Request(`https://books.libgen.me/book/${id}`, {
            "credentials": "omit",
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })
    }

    function onLoadError(error) {
        console.error(`LibrifyJS: Loading failed - ${error}`)
    }

    function onLoadSuccess(json) {
        let loadingCantainer = document.querySelector('div.loading_layout')
        if (!loadingCantainer) {
            console.error('LibrifyJS: Could not locate loading container')
            return
        }
        loadingCantainer.style = 'display: block; width: auto; height: auto; padding-left: 20px; padding-right: 20px; overflow-wrap: anywhere;'
        loadingCantainer.innerHTML = getItemHtml(json)
    }

    function getItemHtml(json) {
        let result = ''
        for (let key in json) {
            if (json.hasOwnProperty(key)) {
                result += `<div>${key}: ${json[key]}</div><br/>`
            }
          }
        return result
    }
})()
