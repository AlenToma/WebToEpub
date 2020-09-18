"use strict";

parserFactory.register("foxteller.com", function () { return new FoxtellerParser() });


class FoxtellerParser extends Parser {
    constructor() {
        super();
    }

    clampSimultanousFetchSize() {
        return 1;
    }

    async getChapterUrls(dom) {
        return [...dom.querySelectorAll(".card li a")]
            .map(link => util.hyperLinkToChapter(link))
    };

    extractTitleImpl(dom) {
        return dom.querySelector(".novel-title > h2");
    };


    removeUnwantedElementsFromContentElement(element) {
        util.removeChildElementsMatchingCss(element, "button, nav, div#comments");
        super.removeUnwantedElementsFromContentElement(element);
    }


    findChapterTitle(dom) {
        return dom.querySelector(".page-header > h2").innerText;
    }


    findCoverImageUrl(dom) {
        return util.getFirstImgSrc(dom, ".novel-featureimg");
    }

    static decrypt(data) {
        var n;
        return (n = (n = (n = (n = (n = (n = (n = data).replace(/%Ra&/g, "A")).replace(/%Rc&/g, "B")).replace(/%Rb&/g, "C")).replace(/%Rd&/g, "D")).replace(/%Rf&/g, "E")).replace(/%Re&/g, "F"),
            decodeURIComponent(Array.prototype.map.call(atob(n), function (e) {
                return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2)
            }).join("")));
    }

    findContent(dom) {
        var novRegex = /.*?novel_id'\s?:\s?'([\w\s]+)'/i
        var chapRegex = /.*?chapter_id'\s?:\s?'([\w\s]+)'/i

        var x1 = undefined;
        var x2 = undefined;
        var html = dom.head.innerText;
        x1 = html.match(novRegex)[1]
        x2 = html.match(chapRegex)[1]
        var result = undefined;
        $.ajax({
            method: "POST",
            url: "https://www.foxteller.com/aux_dem",
            data: { x1: x1, x2: x2 },
            async: false
        })
            .done(function (msg) {
                result =document.createElement("div")
                result.innerHTML = FoxtellerParser.decrypt(msg.aux);
            }).fail(function (e) {
                console.log(e);

            });
        return result;
    };
}