


<div id="page"      style="display: none;"><!-- LivePage-md --></div>
<div id='home-url'  style="display: none;"><!-- https://github.com/Jeff-Russ/LivePage-md --></div>
<div id='logo-url'  style="display: none;"><!-- https://s3.amazonaws.com/shared-img-res/JR%20logo/JR_20px_wide.png --></div>

<div class="page-menu" id='Boostrap' style="display: none;"><!--http://www.howto.jeffruss.com/md/show?aws=bootstrap.md--></div>
<div class="page-menu" id='Rails'    style="display: none;"><!--http://www.howto.jeffruss.com/md/show?aws=rails.md--></div>

<div class="section" id='Welcome'></div> 


# LivePage-md

a real-time web page generator assembled from simple markdown documents

### Description

LivePage-md take pre-existing links to markdown documents and renders them into 
full attractive web pages, complete with a generated table of contents, a modal 
window with links to important sections, and a second modal window with links to
other documents. 

LivePage-md is a single url that takes the url of a markdown document as a query 
string parameter. Therefore, url's to any permalink markdown document already 
exist for LivePage-md without any setup. Since LivePage-md renders the page in 
real-time, update to pages are done instantly when ever the original markdown 
file is modified. This makes deployment and editing take zero effort.  

It's eeeeeeeeeeasy!  

<p class='github-only'> Here is a sample:</p>

<img class='github-only' 
src='https://shared-img-res.s3.amazonaws.com/livepage_heroku/LivePage-md_preview.png'>

Interested? Here is it's [home](https://private-jeff-russ.c9users.io/?file=README) where you can
view this very same README.md with it's rendering.

LivePage-md is possible because of the RedCarpet Gem.

### Instructions

<br />

#### 1. The URL

The base URL you will use for your pagest is http://livepage-md.herokuapp.com/.
Or you can feel free to re-deploy from the source to a new location. For instruction 
on that, refer to my [Ruby on Rails How-To](http://www.howto.jeffruss.com/?aws=jeffruss/rails)
, which is created using LivePage-md!

For each page you will append a parameter to the URL in one of the formats:  
    
`?aws=AMAZONAWS-BUCKET-NAME.FILENAME`  
`?github=USERNAME/PROJECTNAME/BRANCH/FILENAME`  
`?https=ADDRESS-EXCLUDING-HTTPS://`  
`?http=ADDRESS-EXCLUDING-HTTP://`  
`?url=FULL-ADDRESS`  

The `aws` parameter prepends `https://s3.amazonaws.com/`  
The `github` parameter prepends `https://raw.githubusercontent.com/`

For example, if you have a bucket called `bucket` with a file in it called `sample.md` 
your custome address for this is:  
  
`http://livepage-md.herokuapp.com/bucket/sample.md`  

If you have the file in a folder within the bucket, your custom address would 
reflect this.  
  
Using the other formats would provide you with addresses like these:

`http://livepage-md.herokuapp.com/?github=Jeff-Russ/LivePage-md/master/README.md`
`http://livepage-md.herokuapp.com/?https=/www.example/sample.md`  
`http://livepage-md.herokuapp.com/?http=/www.example/sample.md`  
`http://livepage-md.herokuapp.com/?url=https://www.example/sample.md` 

These addresses are longer but they allow you to use hosting other than Amazon's. 

<br />

#### 2. The Table of Contents

The table of content on the right sidbar is automatically generated from the 
headers (indicated with pound signs) in your markdown. It as you scroll through 
content, the active location will be highlighed in the TOC and the TOC will scroll 
if the active location is out of site.  

Each TOC entry is a link to a new url (via hash) so you can reference these links 
elsewhere. These links are used to generate the transport controls which are the 
rightmost three items on the top navbar.

<br />

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

    <div class="page-menu" id='Boostrap' style="display: none;"><!--http://www.howto.jeffruss.com/md/show?aws=bootstrap.md--></div>
    <div class="page-menu" id='Rails'    style="display: none;"><!--http://www.howto.jeffruss.com/md/show?aws=rails.md--></div>

<br />

#### 6. Other Assets

Here is an example of what should go on the very top of your markdown file:

    <div id="page"      style="display: none;"><!-- LivePage-md --></div>
    <div id='home-url'  style="display: none;"><!-- https://github.com/Jeff-Russ/LivePage-md --></div>
    <div id='logo-url'  style="display: none;"><!-- https://s3.amazonaws.com/shared-img-res/JR%20logo/JR_20px_wide.png --></div>

The `<div id="page"` tag provides the name you want to appear on the browser tab 
and on the page menu button. Notice that it's provided in the comment! 
`<div id='home-url'` provides a link to whatever you consider to be the home page. 
It will be a link on the leftmost top navbar button as well as the first entry 
of both the Page Menu and the Section Menu (added automatically). 

<br />

#### 7. Markdown Hosting

This app has been tested with Google Drive and Amazon AWS S3. It works on both 
but Amazon AWS is preferable. Google Drive has some issues with link addresses 
changing after the file was modified, but if you are not planning on tweaking 
things often that might not be an issue. My prefered setup is a bucket with AWS, 
a Mac with Cyberduck FTP and browsing the files in the bucket, opening them in 
Sublime Text to edit them. When I hit save, the live site is automatically updated. 

### Recomendations

The way LivePage-md shares a common url makes it easy for the authors identities 
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

### Known Issues & General Updates

**Current Issues**  

1. strange grey bar in code blocks appears on Android  

**Fixed/Added in this most recent commit** 

1. massive overhaul of all javascript in preparation for other page formats

**To Do**

1. support other, non outlined page formats i.e. normal web page
2. remove grey bar in code blocks  

** canceled plans **
1. add html and erb support  
2. give topbar adaptive height depending on device.  
3. give TOC adaptive top margin depending on height of contents. 