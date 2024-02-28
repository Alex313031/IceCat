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

    let params = getParamsFromUrl()

    prefillSearchField()
    connectSearchField()
    connectCollectionLinks()
    startSearch()

    function getParamsFromUrl() {
        let params = new URLSearchParams(document.location.search)
        return {
            term: params.has('search') ? decodeURIComponent(params.get('search')) : '',
            collection: params.has('collection') ? decodeURIComponent(params.get('collection')) : 'all',
            currentPage: params.has('currentPage') ? parseInt(decodeURIComponent(params.get('currentPage'))) || 1 : 1,
            perPage: params.has('perPage') ? parseInt(decodeURIComponent(params.get('perPage'))) || 0 : 0
        }
    }

    function prefillSearchField() {
        searchField.value = params.term
    }

    function connectSearchField() {
        searchField.addEventListener('keyup', event => {
            if (event.keyCode !== 13) {
                return
            }
            event.preventDefault()
            document.location.href = LibrifyJS_LibgenMe.createSearchUrl(searchField.value, params.collection, 1, 0)
        })
    }

    function connectCollectionLinks() {
        let links = document.querySelectorAll('div.categories a.urls')
        if (!links) {
            console.warn('LibrifyJS: Could not locate collection links')
            return
        }
        for (let i = 0; i < links.length; ++i) {
            let collection = i === 0 ? 'all' : links[i].textContent.trim()
            if (collection === params.collection) {
                links[i].classList.add('active')
            } else {
                links[i].classList.remove('active')
            }
            links[i].addEventListener('click', function(event) {
                event.preventDefault()
                document.location.href = LibrifyJS_LibgenMe.createSearchUrl(searchField.value, collection, 1, 0)
            })
        }
    }

    function startSearch() {
        if (!params.term) {
            return
        }
        let container = getContainer()
        if (!container) {
            return
        }
        container.innerHTML = "Loading..."
        fetch(createRequest())
            .then(response => response.json())
            .catch(onSearchError)
            .then(json => onSearchSuccess(json))
    }

    function createRequest() {
        return new Request(createRequestUrl(), {
            "credentials": "omit",
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })
    }

    function createRequestUrl() {
        return `https://books.libgen.me/search`
            + `?search=${encodeURIComponent(params.term)}`
            + `&page=${encodeURIComponent(params.currentPage)}`
            + `&sort=0`
            + `&perPage=${encodeURIComponent(params.perPage)}`
            + `&year[]=0`
            + `&collection=${encodeURIComponent(params.collection)}`
    }

    function onSearchError(error) {
        console.error(`LibrifyJS: Search failed - ${error}`)
    }

    function onSearchSuccess(json) {
        let container = getContainer()
        if (!container) {
            return
        }
        container.innerHTML = ""
        let results = json['books']
        if (!results) {
            return
        }
        results.forEach(result => {
            container.insertAdjacentHTML('beforeend', getResultHtml(result))
        })
        console.log('a')
        console.log(json)
        console.log(getFooterHtml(json['pages']))
        console.log('b')
        container.insertAdjacentHTML('afterend', getFooterHtml(json['pages']))
    }

    function getContainer() {
        let container = document.querySelector('div.search_content')
        if (!container) {
            console.error('LibrifyJS: Could not locate search content container')
            return null
        }
        return container
    }

    function getResultHtml(result) {
        let pictureStyle = `background: rgba(0, 0, 0, 0) url(&quot;https://covers.libgen.me/cover/${result.id}&quot;) no-repeat scroll center center / cover;`
            + ` width: 145px; height: 180px;`
        return `
            <div class="book_item">
                <div class="picture" style="${pictureStyle}"></div>
                <div class="book_item_content">
                    <div class="book_item_title">
                        <h4>${result.title}</h4>
                    </div>
                    <p>${result.author} | ${result.year}</p>
                    <div style="margin-top: 15px;"></div> <small>ID: ${result.id}</small> <small>language: ${result.language}</small>
                    <small>size: ${parseInt(result.filesize) / 1024} KB</small> <small>type: ${result.extension}</small> <small>year: ${result.year}</small>
                    <div class="controls">
                        <a href="https://libgen.me/item?id=${result.id}">open</a>
                        <a href="https://libgen.me/links?id=${result.id}">links</a>
                    </div>
                </div>
            </div>
            <hr/>`
    }

    function getFooterHtml(totalPages) {
        return `
            <div class="pagination">
                <div class="pages" style="text-align: center;">
                    ${params.currentPage} OF ${totalPages}
                    <a style="${params.currentPage === 1 ? 'display: none;' : ''}"
                        href="${LibrifyJS_LibgenMe.createSearchUrl(params.term, params.collection, params.currentPage - 1, params.perPage)}">&lt;</a>
                    <a style="${params.currentPage === totalPages ? 'display: none;' : ''}"
                        href="${LibrifyJS_LibgenMe.createSearchUrl(params.term, params.collection, params.currentPage + 1, params.perPage)}">&gt;</a>
                </div>
            </div>`
    }
})()
