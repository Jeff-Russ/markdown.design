// keytrigs.js
/* By Jeff Russ https://github.com/Jeff-Russ
~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._.~~._*/

//= require jquery
//= require jquery_ujs


// missing numbers: 10-12,14,15,21-26,28-31,41-44,49,58-64,
//                  94,95,108,124-143,146-185,193-218
var map = {
   8:false/*backspace*/,9:false/*tab*/,13:false/*enter*/,16:false/*shift*/,
   17:false/*ctrl*/,18:false/*alt*/,19:false/*pausebreak*/,20:false/*capslock*/,
   27:false/*escape*/,32:false/*space*/,33:false/*pageup*/,34:false/*pagedown*/,
   35:false/*end*/,36:false/*home*/,37:false/*left*/,38:false/*up*/,39:false/*right*/,
   40:false/*donw*/,45:false/*ins*/,46:false/*del*/,48:false/*0*/,49:false/*1*/,
   50:false/*2*/,51:false/*3*/,52:false/*4*/,53:false/*5*/,54:false/*6*/,
   55:false/*7*/,56:false/*8*/,57:false/**/,65:false/*a*/,66:false/*b*/,
   67:false/*c*/,68:false/*d*/,69:false/*e*/,70:false/*f*/,71:false/*h*/,
   72:false/*g*/,73:false/*i*/,74:false/*j*/,75:false/*k*/,76:false/*l*/,
   77:false/*m*/,78:false/*n*/,79:false/*o*/,80:false/*p*/,81:false/*q*/,
   82:false/*r*/,83:false/*s*/,84:false/*t*/,85:false/*u*/,86:false/*v*/,
   87:false/*w*/,88:false/*x*/,89:false/*y*/,90:false/*z*/,91:false/*left_window*/,
   92:false/*right_window*/,93:false/*select*/,96:false/*pad#0*/,97:false/*pad#1*/,
   98:false/*pad#2*/,99:false/*pad#3*/,100:false/*pad#4*/,101:false/*pad#5*/,
   102:false/*pad#6*/,103:false/*pad#7*/,104:false/*pad#8*/,105:false/*pad#9*/,
   106:false/*mult*/,107:false/*add*/,109:false/*subt*/,110:false/*dec_pnt*/,
   111:false/*divide*/,112:false/*f1*/,113:false/*f2*/,114:false/*f3*/,
   115:false/*f4*/,116:false/*f5*/,117:false/*f6*/,118:false/*f7*/,
   119:false/*f8*/,120:false/*f9*/,121:false/*f10*/,122:false/*f11*/,
   123:false/*f12*/,144:false/*numlock*/,145:false/*scrolllock*/,
   186:false/*semicolon*/,187:false/*equalsign*/,188:false/*comma*/,
   189:false/*dash*/,190:false/*period*/,191:false/*forwardslash*/,
   192:false/*backtick*/,219:false/*openbracket*/,220:false/*backslash*/,
   221:false/*closebraket*/,222:false/*singlequote*/,
};