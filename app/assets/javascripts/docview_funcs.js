 /*~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~._.~~._.~~._.~~._.~~._.~~._~~._.~~*\
|        docview_funcs.js   part of markdown.design                             |
|        By Jeff Russ       https://github.com/Jeff-Russ                        |
 \._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.*/

/*
INTER-FILE INTERDEPENDENCIES:
     VARS SET:      window.jQtopViewElem      window.currHashName
                         window.prevHash          window.nextHash
     READ AND SET:  window.jQactiveTocAnchor
     VARS READ:     window.tocFollow          window.jQtocAnchors

     FUNCS CALLED:  window.determineSection() window.updateTopbar()
                         window.updateToc()
     FUNCS DEFINED: Just look down there

LINT VALIDATOR SETTINGS:
    TOLERATE: multi vars, this
    FUDGE... first line number is 1
    Global variables...   $, window, document, location, scrollBy   */

"use strict";

//  CLICK LISTENER FOR TOC ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
window.onTocClick = function (e) {
    // e == object that raised the event
    e.preventDefault();       // bypass clicked <a>'s native bahavior
    $(document).off("scroll");// remove event handler on scroll

    var target = this.hash;
    var $target = $(target);
    $("html, body").stop().animate({
        'scrollTop': $target.offset().top - window.topOffset
    }, 100, 'swing', function () {
        window.location.hash = target;
    });

    window.jQtopViewElem = $target;
    window.determineSection();
    window.updateTopbar();
    window.updateToc();
};

//  TOC SHOW/HIDE BUTTONS LISTENER  ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.
window.onTocShowBtnClick = function () {
    window.jQtocBtn.toggleClass('on');
    if (window.jQtocBtn.hasClass('on')) {
        window.showToc = true;
        $('#toc-btn-img').css('opacity', '0.9');
        window.toggleSidebar();
        window.tocFollowBtnState();
    } else {
        window.showToc = false;
        $('#toc-btn-img').css('opacity', '0.4');
        window.toggleSidebar();
        window.tocFollow = false;
        $('#toc-follow-img').css('opacity', '0.4');
    }
};

//  TOC FOLLOW BUTTONS LISTENER  ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~.
window.onTocFollowBtnClick = function () {
    $(this).toggleClass('on');
    window.tocFollowBtnState();
};

window.tocFollowBtnState = function () {
    if (window.jQtocFollowBtn.hasClass('on')) {
        window.tocFollow = true;
        $('#toc-follow-img').css('opacity', '.9');
        window.findNewPosition();
    } else {
        window.tocFollow = false;
        $('#toc-follow-img').css('opacity', '.4');
    }
};

//  FIND NEW POSITION IN READER ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
window.findNewPosition = function () {
    var calibrate = window.topOffset * -1,
        winHeight = $(window).height() - calibrate,
        winTop = $(document).scrollTop() + calibrate,
        winBottom = winTop + winHeight,
        $candidate,
        rerun = true;

    // Iterate all <a> descendant of <nav> (the links to locations)
    window.jQtocAnchors.each(function () {
        if (rerun) {
            var $thisLink = $(this);                        // toc link item
            var $thisRefElem = $($thisLink.attr("href"));   // corresponding target
            var thisRefElPos = $thisRefElem.position().top; // target of link

            if (thisRefElPos < winTop) {
                $candidate = $thisRefElem;
            } else if (thisRefElPos < winBottom && thisRefElPos > winTop) {
                window.jQtopViewElem = $thisRefElem;
                rerun = false;
            } else {
                window.jQtopViewElem = $candidate;
                rerun = false;
            }
        }
    });

    var pos = window.jQtopViewElem.position().top - winTop;
    pos = pos / winHeight * 100;
    pos = Math.round(pos);

    if (pos < 0) {
        window.update(" | " + pos + "% ");
    }
    window.update("  | " + ($candidate.position().top - winTop));
    window.determineSection();
    window.updateTopbar();
    window.updateToc();
};

//  DETERMINE SECTION ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._
window.determineSection = function () {
    /* needs window.jQtopViewElem and sets the following globals for use elsewhere:
    window.currHashName; window.prevHash; window.nextHash; */

    var $prevSection, $nextSection,
            activeTocId,  // the id top viewed div in reader that starts with toc_
            $firstSection = $('.section').first(),
            $lastSection = $('.section').last();

    if (window.jQtopViewElem.hasClass("section")) {
        window.currHashName = window.jQtopViewElem.attr('id');
        if (window.jQtopViewElem === $firstSection) {
            $prevSection = window.jQtopViewElem;
            $nextSection = window.jQtopViewElem.nextAll('.section');
        } else if (window.jQtopViewElem === $lastSection) {
            $prevSection = window.jQtopViewElem.prevAll('.section');
            $nextSection = window.jQtopViewElem;
        } else {
            $prevSection = window.jQtopViewElem.prevAll('.section');
            $nextSection = window.jQtopViewElem.nextAll('.section');
        }
        activeTocId = window.jQtopViewElem.nextAll('[id^="toc_"]').attr('id');

    } else {
        var $lastTocTarget = $('[id^="toc_"]').last();
        if (window.jQtopViewElem === $lastTocTarget) {
            $nextSection = $firstSection;    // wrap around to top
        } else {
            $nextSection = window.jQtopViewElem.nextAll('.section');
        }
        $prevSection = window.jQtopViewElem.prevAll('.section');
        window.currHashName = $prevSection.attr('id');

        activeTocId = window.jQtopViewElem.attr('id');
    }
    var prevSectionName = $prevSection.attr('id');
    var nextSectionName = $nextSection.attr('id');

    window.prevHash = '#' + prevSectionName;
    window.nextHash = '#' + nextSectionName;

    var activeAnchorHash = '#' + activeTocId;
    window.jQactiveTocAnchor = $('a[href="' + activeAnchorHash + '"]', '#toc');
};

var currScroll; // global only to retain value between calls (only used here)

//  ACTIVE LINK AND AUTO SCROLL OF TOC ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~_
window.updateToc = function () {
    // needs window.jQtocAnchors and $activeTocAnchor
    // and sets the following for use elsewhere:
    window.jQtocAnchors.attr('id', 'toc-inactive');
    window.jQactiveTocAnchor.attr('id', 'toc-active');

    if (window.tocFollow) {
        var activeElement = document.getElementById("toc-active");
        var activePos = activeElement.offsetTop;
        var sidebarHeight = document.getElementById('sidebar').offsetHeight;
        var sidebarUpper = sidebarHeight * 0.3;
        var offset = activePos - sidebarUpper;
        var tocElem = document.getElementById("toc");
        var tocHeight = tocElem.height;
        var maxOffset = tocHeight - sidebarHeight;

        if (offset > maxOffset) {
            offset = maxOffset;
        } else {
            offset = offset;
        }

        if ((activePos > sidebarHeight * 0.95) ||
                (currScroll < activePos + sidebarUpper)) {
            $('#sidebar').stop();
            $('#sidebar').animate({scrollTop: offset}, 300);
            currScroll = offset;
        } else {
            $('#sidebar').stop();
        }
    }
};

//  TOGGLE SIDEBAR ON AND OFF ~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~
window.toggleSidebar = function () {
    if (window.showToc) {
        $('#reader').css('width', '64%').css('padding-right', '2%');
        $('#sidebar').css('display', 'inline-block');
        $('.mono').css('white-space', 'pre').css('overflow', 'scroll');
        $('#toc-btn').addClass('on');

        $('.topbar').addClass('topbar-toc').removeClass('topbar');
        $('.LL-7').addClass('LL-7-toc').removeClass('LL-7');
        $('.LR-7').addClass('LR-7-toc').removeClass('LR-7');
        $('.CL-7').addClass('CL-7-toc').removeClass('CL-7');
        $('.CC-7').addClass('CC-7-toc').removeClass('CC-7');
        $('.CR-7').addClass('CR-7-toc').removeClass('CR-7');
        $('.RL-7').addClass('RL-7-toc').removeClass('RL-7');
        $('.RR-7').addClass('RR-7-toc').removeClass('RR-7');
    } else {
        $('#reader').css('width', '96%');
        $('#sidebar').css('display', 'none');
        $('.mono').css('white-space', 'pre-wrap').css('overflow', 'initial');
        $('#toc-btn').removeClass('on');

        $('.topbar-toc').addClass('topbar').removeClass('topbar-toc');
        $('.LL-7-toc').addClass('LL-7').removeClass('LL-7-toc');
        $('.LR-7-toc').addClass('LR-7').removeClass('LR-7-toc');
        $('.CL-7-toc').addClass('CL-7').removeClass('CL-7-toc');
        $('.CC-7-toc').addClass('CC-7').removeClass('CC-7-toc');
        $('.CR-7-toc').addClass('CR-7').removeClass('CR-7-toc');
        $('.RL-7-toc').addClass('RL-7').removeClass('RL-7-toc');
        $('.RR-7-toc').addClass('RR-7').removeClass('RR-7-toc');
    }
};