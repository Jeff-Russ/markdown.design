
<div id="page"      style="display: none;"><!--md.design--></div>
<div id='home-url'  style="display: none;"><!--http://www.markdown.design--></div>
<div id='logo-url'  style="display: none;"><!--https://s3.amazonaws.com/jeffruss/img/JR_20px_wide.png--></div>

<div class="page-menu" id='On Github' style="display: none;"><!--https://github.com/Jeff-Russ/markdown.design--></div>
<div class="page-menu" id='Author'    style="display: none;"><!--http://www.markdown.design--></div>
<div class="page-menu" id='Example 1' style="display: none;"><!--http://www.markdown.design/?docs=bootstrap--></div>
<div class="page-menu" id='Example 2' style="display: none;"><!--http://www.markdown.design/?docs=rails--></div>

<div class="section" id='About'></div> 

# Markdown.design

a real-time web page generator assembled from simple markdown documents

### Description

Markdown.design take pre-existing links to markdown documents and renders them into 
full attractive web pages, complete with a generated table of contents, a modal 
window with links to important sections, and a second modal window with links to
other documents. 

Markdown.design is a single url that takes the url of a markdown document as a query 
string parameter. Therefore, url's to any permalink markdown document already 
exist for markdown.design without any setup. Since markdown.design renders the page in 
real-time, update to pages are done instantly when ever the original markdown 
file is modified. This makes deployment and editing take zero effort.  

It's eeeeeeeeeeasy!  

<p class='github-only'> Here is a sample:</p>

<img class='github-only' 
src='https://s3.amazonaws.com/markdown.design/mddesign_preview.png'>

Interested? Here is it's [home](http://www.markdown.design/?file=README) where you can
view this very same README.md with it's rendering.

Markdown.design is possible because of the RedCarpet Gem.

<div class="section" id='News'></div> 

### News - NEW QUIZMAKER!

Markdown.design now has a DIY quiz-maker!!! Thanks to the 
[Mother Jones newsquiz depo](https://github.com/motherjones/newsquiz) you can 
make a quiz with a Google Spreadsheet and open it as a quiz in this web app. 

**EXAMPLE:**

    https://private-jeff-russ.c9users.io/?quiz=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc

[Here](https://github.com/motherjones/newsquiz#set-up-a-google-spreadsheet) is 
how to set up the spreadsheet. Once you have that you simply go to 
`http://www.markdown.design/` or where ever this app is deployed and add the key 
seen on Google Docs to the end of the URL in a paramter called `quiz`. For 
example, if your key is 

    0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc

the address of your quiz already exists at 

    http://www.markdown.design/?quiz=0Arenb9rAosmbdG5GWHFXbWJlN1hTR2ZmN3lZMVZkOHc
    
It's a bit long this is free for you so deal with it.;p 

<div class="section" id='Instructions'></div> 

### Instructions

<br /><div class="section" id="URL's"></div> 

#### 1. The URL

**BEWARE** This app is constantly changing. For the authority on url's, have one 
generated [here](http://markdown.design/)

The base URL you will use for your pages is http://www.markdown.design/.
Or you can feel free to re-deploy from the source to a new location. For instruction 
on that, refer to my [Ruby on Rails How-To](http://www.jeffruss.com/?docs=rails)
, which is created using markdown.design!

For each page you will append a parameter to the URL in one of the formats:  
    
`?docs=AMAZONAWS-BUCKET-NAME.FILENAME` 
`?doch=AMAZONAWS-BUCKET-NAME.FILENAME` 
`?gh=USERNAME/PROJECTNAME/BRANCH/FILENAME`  
`?ghrm=USERNAME/PROJECTNAME` 
`?https=ADDRESS-EXCLUDING-HTTPS://`  
`?http=ADDRESS-EXCLUDING-HTTP://`  
`?url=FULL-ADDRESS`  

The `docs`, `doch` and `pages` parameters prepends `https://s3.amazonaws.com/` and appends `.md`
The `gh` parameter prepends `https://raw.githubusercontent.com/` and appends `.md`
The `ghrm` parameter prepends the same and appends `/master/README.md` and appends `.md`

For example, if you have a bucket called `bucket` with a file in it called `sample.md` 
your custome address for this is:  
  
`http://www.markdown.design/?docs=bucket/sample`  # with table of contents
`http://www.markdown.design/?doch=bucket/sample`  # with table of contents but hidden
`http://www.markdown.design/?pages=bucket/sample` # without table of contents

If you have the file in a folder within the bucket, your custom address would 
reflect this.  
  
Using other formats would provide you with addresses like these:

`http://www.markdown.design/?ghrm=Jeff-Russ/markdown.design/`
`http://www.markdown.design/?https=/www.example/sample.md`  
`http://www.markdown.design/?http=/www.example/sample.md`  
`http://www.markdown.design/?url=https://www.example/sample.md` 

These addresses are longer but they allow you to use hosting other than Amazon's. 

<br />

<div class="section" id='TOC'></div> 

#### 2. The Table of Contents

The table of content on the right sidbar is automatically generated from the 
headers (indicated with pound signs) in your markdown. It as you scroll through 
content, the active location will be highlighed in the TOC and the TOC will scroll 
if the active location is out of site.  

Each TOC entry is a link to a new url (via hash) so you can reference these links 
elsewhere. These links are used to generate the transport controls which are the 
rightmost three items on the top navbar.

<br />
<div class="section" id='Menu Bar'></div> 

#### 3. Section Menu

I you click the button between < and > you will get a modal window that shows a 
menu of important locations in the page. This is important for long documents. 
These entries are not generated automatically. You should plant divs in your 
markdown at these important spots. The class of all of these must be `section` 
and the id will be the name displayed in the Modal window and it's button (which 
shows the current section). Example:

    <div class="section" id='Grids'></div> 

Do not add `style="display: none;` to these!  

<br />

#### 4. Prev and Next Transport Buttons

The previous and next buttons will automatically send the viewer to the neighboring 
sections, all of this is set with Javascripts! To the left of the three transport 
controls is another button which pops out a modal window displaying some external 
links. This is called the page menu.

<br />

#### 5. The Page Menu

You can populate the page menu with links to anywhere by adding to a header in your 
markdown file. The entries will be invisible divs with the class `page-menu` and 
with id's reflecting the desired labels. Example:

    <div class="page-menu" id='Boostrap' style="display: none;"><!--http://www.jeffruss.com/?docs=bootstrap.md--></div>
    <div class="page-menu" id='Rails'    style="display: none;"><!--http://www.jeffruss.com/?docs=rails.md--></div>

<br />
<div class="section" id='Assets'></div> 

#### 6. Other Assets

Here is an example of what should go on the very top of your markdown file:

    <div id="page"      style="display: none;"><!-- markdown.design --></div>
    <div id='home-url'  style="display: none;"><!-- https://github.com/Jeff-Russ/markdown.design --></div>
    <div id='logo-url'  style="display: none;"><!-- https://s3.amazonaws.com/jeffruss/img/JR_20px_wide.png --></div>

The `<div id="page"` tag provides the name you want to appear on the browser tab 
and on the page menu button. Notice that it's provided in the comment! 
`<div id='home-url'` provides a link to whatever you consider to be the home page. 
It will be a link on the leftmost top navbar button as well as the first entry 
of both the Page Menu and the Section Menu (added automatically). 

<br /><div class="section" id='The .md'></div> 

#### 7. Markdown Hosting

This app has been tested with Google Drive and Amazon AWS S3. It works on both 
but Amazon AWS is preferable. Google Drive has some issues with link addresses 
changing after the file was modified, but if you are not planning on tweaking 
things often that might not be an issue. My prefered setup is a bucket with AWS, 
a Mac with Cyberduck FTP and browsing the files in the bucket, opening them in 
Sublime Text to edit them. When I hit save, the live site is automatically updated. 

### Recomendations

The way markdown.design shares a common url makes it easy for the authors identities 
to get muddled up, which could be a good wiki-like quality or it could be a bad. 
I recommend putting all of your md files in a folder/bucket with your name so it 
appears in the web address. Another more obvious option is to place your name 
promenently in the page content. This is a very open format so do as you wish.  

I also do not recommend doing your editing on the active page's primary address's
corresponding md file. I make a duplicate file for each public one with an 
underscore starting the file name. I keep them both public and in the some location 
so I can flip back and forth but adding and deleting the underscore in the URL 
bar. 

I have a browser open with the underscored version open, cyberduck open and 
connected to Amazon AWS. I edit the underscored file directly on the server and 
have the browser auto-refresh the page every 15 seconds with a Chrome Extension.
Everytime I save in my editor I'll see the change within 15 seconds. 

When I am ready I'll copy all of the _file.md to file.md and save it. Done.

<br /><div class="section" id='News'></div> 

### Known Issues & General Updates

**Major Issues**

1. Modal menus auto-populated from headers don't point to valid destinations.
2. actually, Modal menus are always pointing incorrectly
3. prev button not workin

**Minor Issues**

1. Strange grey bar in code blocks appears on mobile devices.

**Fixed/Added in this most recent commit** 

1. Now using Puma server
2. modularized controller/helper code

<!--1. Better support for non-toc pages!-->

**plans**

1. Add support for Dropbox
2. Add support for Amazon Cloudfront
3. Add support for html in addition to markdown
4. Add FORMail
5. Replace reading of comments via jquery with serverside parsing of custom
   commands between some sort of flag delimiters. For example:

        <|  menu1-btn-text menu1-btn-link-or-hash newtab |>
        <|| menu2-btn-text menu2-btn-link-or-hash newtab ||>
        
    each of the above has non-render-in-place versions
        
        <|- |>   <||- ||> 
        
        
        <|LL left-topbar-btn-txt-or-image-url http://link.com newtab LL|>
        
    also:
        
        <|LC LC|>
        <|LR LR|>
        <|RL RL|>
        <|RC RC|>
        <|RR RR|>

**canceled plans**

1. Add erb support  