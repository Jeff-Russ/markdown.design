 /*~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~*\
|        docview_topbar.js  part of markdown.design                             |
|        By Jeff Russ       https://github.com/Jeff-Russ                        |
 \._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~./

INTER-FILE INTERDEPENDENCIES:
    VARS READ:      window.currHashName    window.prevHash      window.nextHash
    FUNCS DEFINED: Just look down there

LINT VALIDATOR SETTINGS:
    TOLERATE: multi vars, this
    FUDGE... first line number is 1
    Global variables...   $, window, document, location, scrollBy   */

"use strict";

////// FUNCTIONS USED ONLY IN THIS DOCUMENT /////////////////////////////////////

// determine if & how to populate Pages & Section menus
function findMenuSources() {

    var makePageMenu = true, $pages, pageMenuSrc,
            makeSectionMenu = true, $sections, sectionMenuSrc,
            sectionSize = $('.section').size(),
            h1Size = $('h1').size(), h2Size = $('h2').size(),
            h3Size = $('h3').size(), h4Size = $('h4').size();

    // if .md has hidden tags with .page-menu
    if ($('.page-menu').size() > 1) {
        // For populating the Page Menu (on left, right of leftmost button):
        pageMenuSrc = 'comments';
        $pages = $('.page-menu');
        // For populating the Section Menu (center button, between < and >):
        if (sectionSize > 1) { // if .md has hidden tags with .section
            sectionMenuSrc = 'comments';
            $sections = $('.section');
        } else if (h1Size > 1 && h1Size < 12) {    // or h1's?
            sectionMenuSrc = 'headers';
            $sections = $('h1');
        } else if (h2Size > 1 && h2Size < 12) {     // maybe h2's?
            sectionMenuSrc = 'headers';
            $sections = $('h2');
        } else {
            makeSectionMenu = false;
         // EVERTHING FALE'D. NO SECTION MENU!
        }
    // Now we'll try the next levels up. before we tried .page-menu comments for
    // the Page Menu but that failed so we will try h1's for the Page Menu and
    // h2's for the Section menu:
    } else if (h1Size > 1 && h1Size < 12) {
        pageMenuSrc = 'headers';
        $pages = $('h1');

        if (sectionSize > 1) {
            sectionMenuSrc = 'comments';
            $sections = $('.section');
        } else if (h2Size > 1 && h2Size < 12) {
            sectionMenuSrc = 'headers';
            $sections = $('h2');
        } else if (h3Size > 1 && h3Size < 12) {
            sectionMenuSrc = 'headers';
            $sections = $('h3');
        } else {
            makeSectionMenu = false;
   // EVERTHING FALE'D. NO SECTION MENU!
        }
    // One more levels up. H1's failed for the Page Menu so we'll try h1's,
    // with h3's as the Section Menu:
    } else if (h2Size > 1 && h2Size < 12) {
        pageMenuSrc = 'headers';
        $pages = $('h2');

        if (sectionSize > 1) {
            sectionMenuSrc = 'comments';
            $sections = $('.section');
        } else if (h3Size > 1 && h3Size < 12) {
            sectionMenuSrc = 'headers';
            $sections = $('h3');
        } else if (h4Size > 1 && h4Size < 12) {
            sectionMenuSrc = 'headers';
            $sections = $('h4');
        } else {
            makeSectionMenu = false;
// EVERTHING FALE'D. NO SECTION MENU!
        }
    } else {
        makePageMenu = false; // EVERTHING FALE'D. NO PAGE MENU!
    }

    return [makePageMenu, $pages, pageMenuSrc,
            makeSectionMenu, $sections, sectionMenuSrc];
}

function populateWithBtns($source, $destination, menuSource) {
    var chunk1 = "<div class='col-xs-4' style='background-color:inherit;'><a class='dismiss btn btn-xlarge btn-";
    var chunk2 = " btn-ghosty modal-link' href='";
    var btnColors = ["info", "success", "warning", "danger", "primary"];

    var i = 0;

    switch (menuSource) {
    case 'comments':
        window.update("Populating from comments:<br />");
        $source.each(function () {
            var str = $(this).attr('id');
            str = window.tersify(str);
            $destination.append(chunk1 + btnColors[i] + chunk2 +
                    $(this).comments().html() + "'>" + str + "</a></div>");
            i = (i + 1) % 5;
        });
        break;
    case 'headers':
        $source.each(function () {
            var str = $(this).text();
            str = window.tersify(str);
            $destination.append(chunk1 + btnColors[i] + chunk2 +
                    $(this).attr('id') + "'>" + str + "</a></div>");
            i = (i + 1) % 5;
        });
        break;
    }
}

//  CLOSES ANY MODAL WINDOW. HANDY! ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~____
window.close_modal = function () {
    $("button[data-dismiss='modal']").trigger("click");
};

//  SET VARIABLES NEEDED BY TOPBAR ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~
window.updateTopbar = function () {
    // set target for prev and next buttons on topbar
    $(".prev-btn").attr('href', window.prevHash);
    $(".next-btn").attr('href', window.nextHash);

    var pageName = $("#page").comments().html(); // get page name from md comment
    if (pageName === undefined) {
        pageName = window.getDocName();
    }
    $('#page-button').text(pageName); // set text on page btn

    var sectionName;
    if (window.currHashName === undefined) {
        var currLocInToc = window.jQactiveTocAnchor.text();
        sectionName = window.tersify(currLocInToc);
    } else {
        sectionName = window.currHashName;
    }

    $('#section-button').text(window.currHashName); // set section btn text
    document.title = pageName + ' - ' + sectionName; // set browser tab title
};


//  POPULATE PAGE SELECTION MODAL ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~_
window.populateModalMenus = function () {
    var arr = findMenuSources();
    var makePageMenu = arr[0], $pages = arr[1], pageMenuSrc = arr[2],
            makeSectionMenu = arr[3], $sections = arr[4], sectionMenuSrc = arr[5];

    if (!makePageMenu) {
        $('#page-button').addClass('hidden');
    }
    if (!makeSectionMenu) {
        $('#section-button').addClass('hidden');
        $(".prev-btn").addClass('hidden');
        $(".next-btn").addClass('hidden');
    }
    var chunk1 = "<div class='col-xs-4' style='background-color:inherit;'>"
                + "<a class='dismiss btn btn-xlarge btn-danger "
                + "btn-ghosty modal-link' href='",
        numOfPages,
        numOfSections;
    if (makePageMenu) {
        numOfPages = $pages.size();
        if (numOfPages === 1) {
            $('#page-menu').prepend("<div class='col-xs-2'>");
        }
        $('#page-menu').append(chunk1 + window.HomeUrl + "'>" + 'Home' + "</a></div>");
        populateWithBtns($pages, $('#page-menu'), pageMenuSrc);
    }
    if (makeSectionMenu) {
        numOfSections = $sections.size();
        if (numOfSections === 1) {
            $('#section-menu').prepend("<div class='col-xs-2'>");
        }
        $('#section-menu').append(chunk1 + window.HomeUrl + "'>" + 'Home' + "</a></div>");
        populateWithBtns($sections, $('#section-menu'), sectionMenuSrc);
    }
    // Notice the .dismiss class we added above.
    // Below makes them also close the modal:
    $('.dismiss').on('click', function () {
        $("button[data-dismiss='modal']").trigger("click");
    });

};