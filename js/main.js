/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// SHARED VARIABLES

// Default to not showing debug messages in the console
let report = () => {};
let error = () => {};

// Number of miliseconds to wait before retrying something
const retryIn = 100;

// Number of miliseconds to wait before trying something (usually b/c el not loaded in DOM yet)
const tryIn = 100;

// Maximun number of times we should retry something
const retryAttempts = 30;
const retryAttemptsFew = 4;

// Things to check on view change or later
const check = {
  theme: true,
  readingPane: false,
  inboxSections: true, // Can delete when I delete inboxSections check
  moles: false,
  popout: false,
  categories: false,
};

const el = {
  html: document.documentElement,
  style: null,
  oneGoogleRing: null,
  gsuiteLogo: null,
  topLeftButtons: null,
  menuButton: null,
  backButton: null,
  closeButton: null,
  closeSearch: null,
  alert: null,
  alertMsg: null,
  alertAction: null,
  refreshButton: null,
};

// Selectors we have to find via traversing the DOM
const trickyElements = {
  oneGoogleRing: {
    selector: '#gb div path[d$="02,28.27z"]',
    parent: 2,
    suffix: " svg",
  },
  gsuiteLogo: {
    selector:
      'div[href*="SignOutOptions"] img[src*="cpanel"], div[href*="SignOutOptions"] img[src*="admin.google"]',
    parent: 1,
  },
  topLeftButtons: { selector: 'path[d*="2H3v2zm0"]', parent: 3 },
  menuButton: { selector: 'path[d*="2H3v2zm0"]', parent: 2 },
  backButton: { selector: '#gb div > svg > path[d*="1-1.41L7.83"]', parent: 2 },
  closeButton: { selector: '#gb div > svg > path[d*="6.41L17.59"]', parent: 2 },
  closeSearch: {
    selector: '#gb form button > svg > path[d*="6.41L17.59"]',
    parent: 2,
  },
  refreshButton: {
    selector: '.G-atb .G-Ni div[act="20"][role="button"]',
    parent: 1,
  },
};

// Regexs used by url.js and localstorage.js
const regex = {
  msg: /\/[A-Za-z]{28,}(\?compose=(new|[A-Za-z]{28,}))?$/,
  search: /#search|#advanced-search|#create-filter|#section_query/, // |#label TODO: should a label count as a search? System labels?
  label: /#label|#starred|#snoozed|#sent|#outbox|#drafts|#imp|#chats|#scheduled|#all|#spam|#trash/,
  titleEmail: /[a-z0-9\.]{6,30}\@[\w-.]{1,63}\.[a-z]{2,24} - (Gmail|[^@]+)$/,
  titleEnd: / - (Gmail|[^@]+)$/,
};

// User agent for sniffing browsers
const UA = navigator.userAgent;

// Current View: are in one of these views
const is = {
  simplifyOn: true,
  loading: true,
  msg: false,
  msgOpen: false,
  list: false,
  inbox: false,
  search: false,
  label: false,
  settings: false,
  popout: false,
  print: false,
  original: false,
  tabbedInbox: null,
  readingPane: false,
  readingPaneType: "",
  readingPaneSize: "500px",
  delegate: location.pathname.indexOf("/mail/b/") >= 0,
  safari: /Safari/.test(UA) && !/Chrome/.test(UA),
  windows: navigator.platform.indexOf("Win") > -1,
  mac: navigator.platform.indexOf("Mac") > -1,
  chromeCanary: / Chrome\/90/.test(UA),
};

// Get user number from URL
const userNum = location.pathname.match(/\/[u|b]\/\d/)[0].substr(-1);
const u = is.delegate ? "b" + userNum : userNum;

// Hash tag for view to go to when closing a view
// TODO: Delete this if I switched to an array
const close = {
  msg: "#inbox",
  search: "#inbox",
  settings: "#inbox",
};

// Cached states and paremeters from localStorage
let simplify = {};

// Gmail interface language code
const lang = document.documentElement.lang || "en";

// Google Inbox categories that aren't visible in Gmail
const categories = {
  Finance: "#search/category%3Afinance",
  Purchases: "#search/category%3Apurchases",
  Trips: "#search/label%3Atrips",
};

// Default parameters & element selectors
const defaultParam = {
  version: "9",
  theme: "lightTheme",
  themeBgColor: "",
  themeBgImgUrl: "",
  themeBgImgPos: "",
  navOpen: true,
  density: "lowDensity",
  debug: false,
  firstTimeWelcome: true,

  readingPane: false,
  readingPaneWidth: "var(--content-width)",
  readingPaneType: "unknown", // unknown | nPane | vPane | hPane

  textButtons: null,
  chat: null, // left_roster, right_roster, off
  rhsChat: null,
  addOnsOpen: null,
  otherExtensions: null,

  // SASS variables and selectors
  // TODO: Maybe break this out into something I auto-generate when
  //       building the extension. Maybe declarations.js > sass.js which
  //       has sass.variables and sass.declarations
  sass: {
    version: "19",

    // Bars selectors
    accountButton: "a[href*='SignOutOptions']",
    accountWrapper: "div[href*='SignOutOptions']",
    backButton: ".gb_zc.gb_Cc.gb_Fa",
    bar: ".G-atb",
    btnRefresh: "div[aria-label='Refresh'], .nu, div[act='20']",
    gsuiteLogo: ".gb_oa, div[href*='SignOutOptions'] img[src*='cpanel']",
    listActions: ".aqK",
    listPage: ".aqJ",
    searchInput: "#gb input[name='q']",
    searchFocused: ".gb_af", // TODO This changes often; build listner for search focused
    topLeftButtons: ".gb_2c.gb_9c.gb_ad",
    menuButton: ".gb_Bc, div[aria-label='Main menu']",
    msgActions: ".iH",
    msgPage: ".adF",
    oneGoogleRing: ".gb_3a svg", // TODO This changes often
    pagination: ".ar5",
    paginationCount: ".amH",
    paginationButtons: ".Di",
    settingsGear: ".FI",
    supportButton: ".zo",
    readingPaneToggle: ".readingPaneToggle", // ".apF, .apG",
    inputTools: ".aBS",
    offline: ".bvE, .bvI, .bvD",
    appSwitcher: "#gbwa",
    chatStatus: ".Yb",

    // Other Extensions (oe) menu bar icons
    oeMixMax: ".mixmax-appbar",
    oeBoomerang: "#b4g_manage",
    oeStreak: ".streak__topNav",
    oeSortd: ".openSortdIcon",
    oeGmass: "#gmassbutton",
    oeMailtrack: "#mailtrack-menu-opener",
    oeFlowcrypt: "#flowcrypt_new_message_button",
    oePauseGmail: ".cloudhq__app_iconImg_badge",
    oeCopper: ".pw-shadow-host-widget:not(.main-ember-application)",
    oeHubspot: ".app-level-toolbar-icon",
    oeYesware: ".yw-launchpad-container",
    oeSalesforce: "#sfdc-mailapp-container",
    oeDrag: "header .inboxsdk__button_iconImg[src$='Drag-icon.svg']",
    oeInboxWhenReady: "#iwr_wrap_action_buttons",

    // List view selectors
    listTop: ".BltHke",
    list: ".ae4",
    listInner: ".Cp",
    tabs: ".aKh",
    tab: ".aAy",
    oneBox: ".bX",
    selectAll: ".ya",
    newBadge: ".aDG",
    searchChips: ".G6",
    msg: ".zA",
    msgRead: ".yO",
    msgActive: ".aps",
    msgSelected: ".x7",
    msgSnippet: ".y2",
    msgSnoozed: ".cL",
    msgAttachment: ".yf",
    msgAdLabel: ".a3x",
    msgAdAria: "img[aria-label='Why this ad?']",
    checkbox: ".xY",
    allLists: "div[role='main'] .ae4 .Cp:not(.adverts)",
    currentList:
      "div[role='main'] .ae4:not([style*='none']) .Cp ~ .Cp:not(.adverts)",
    menuSnooze: "div.brx[role='menu']",
    scanAllEmails:
      "div[gh='tl'] .ae4:not([style*='none']) .Cp ~ .Cp:not(.adverts) .zA, div.ae4[gh='tl'] .Cp ~ .Cp:not(.adverts) .zA",
    scanNotGroupedEmails:
      "div[gh='tl'] .ae4:not([style*='none']) .Cp ~ .Cp:not(.adverts) .zA:not([date]), div.ae4[gh='tl'] .Cp ~ .Cp:not(.adverts) .zA:not([date])",
    currentListToGroup:
      "div[gh='tl'] .ae4:not([style*='none']) .Cp ~ .Cp:not(.adverts) tbody:not(:empty), div.ae4[gh='tl'] .Cp ~ .Cp:not(.adverts) tbody:not(:empty)",
    scanListsUnobserved:
      "div[gh='tl'] .ae4 .Cp ~ .Cp:not(.adverts):not(.SOFC), div.ae4[gh='tl'] .Cp ~ .Cp:not(.adverts):not(.SOFC)",

    // Main selectors
    footer: ".aeG, .pfiaof",
    themeBg: ".wl",
    themeBgImg: ".a4t",

    // Nav selectors
    nav: ".aeN",
    navItems: ".wT",
    navItemsScrolled: ".ajj", // This is above .wT but inside .aeN
    navClosed: ".bhZ",
    inboxLink: ".aeN .aim a[href*='#inbox']",
    unreadCount: ".bsU",
    composeHover: ".bym",
    composeButton: ".z0",
    composeInner: ".L3",
    chatAndMeet: ".akc",
    chatSection: ".aND",
    chatRoster: "div[gh='c']",
    chatNew: ".Xa.wT",

    // Conversation view selectors
    conversation: ".Bs",
    messages: "div[role='list']",
    message: ".gs",
    msgCollapsed: ".gs.gt",
    msgHeader: ".gE",
    msgSnippet: ".g6",
    msgBody: ".a3s",
    composeBody: ".Am",

    // Composer selectors
    composeMolesTop: ".dw",
    composeMoles: ".dw .no",
    composeMinimize: ".Hm .Hk, .Hm .Hl, .Hm img[alt='Minimize']",
    composeMolePopout: ".Hm .Hq, .Hm img[alt='Pop-out']",
    composeMoleOpen: ".dw .Hl, .dw img[aria-label='Minimize']",
    composePopoutTop: ".aSs",
    composePopout: ".aSt",
    composeInlineReply: "div[role='list'] .ip",

    // Add ons selectors
    addOnsLauncher: ".bAw",
    addOnsToggle: ".brC-dA-I-Jw",
    addOnsPane: ".bq9",
  },
};



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// DATES - For parsing international dates

// prettier-ignore
const monthNamesAll = {
  cs: ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"],
  el: ["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "en-GB": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["ene","feb","mar","abr","may","jun","jul","ago","sept","oct","nov","dic"],
  "es-419": ["ene.","feb.","mar.","abr.","may.","jun.","jul.","ago.","sept.","oct.","nov.","dic."],
  da: ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"],
  de: ["Jan.","Feb.","März","Apr.","Mai","Juni","Juli","Aug.","Sept.","Okt.","Nov.","Dez."],
  fi: ["tammik","helmik","maalisk","huhtik","toukok","kesäk","heinäk","elok","syysk","lokak","marrask","jouluk"],
  fr: ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."],
  "fr-CA": ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."],
  hu: ["jan","febr","márc","ápr","máj","jún","júl","aug","szept","okt","nov","dec"],
  id: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
  it: ["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"],
  ja: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
  ko: ["일월","이월","삼월","사월","오월","유월","칠월","팔월","구월","시월","십일월","십이월"],
  nl: ["jan.","feb.","mrt.","apr.","mei","jun.","jul.","aug.","sep.","okt.","nov.","dec."],
  no: ["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des"],
  pl: ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"],
  sv: ["jan.","feb.","mars","apr.","maj","juni","juli","aug.","sep.","okt.","nov.","dec."],
  "pt-BR": ["jan.","fev.","mar.","abr.","mai.","jun.","jul.","ago.","set.","out.","nov.","dez."],
  "pt-PT": ["jan.","fev.","mar.","abr.","mai.","jun.","jul.","ago.","set.","out.","nov.","dez."],
  ru: ["янв.","февр.","мар.","апр.","мая","июн.","июл.","авг.","сент.","окт.","нояб.","дек."],
  tr: ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"],
  uk: ["січ.","лют.","бер.","квіт.","трав.","черв.","лип.","серп.","вер.","жовт.","лист.","груд."],
  "zh-CN": ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
  "zh-HK": ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
  "zh-TW": ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
};

// Initialize months to be for the current interface language
const monthNames = monthNamesAll[lang];

// Dates functionality
const dates = {
  now: null,
  today: null,
  day: null,
  month: null,
  year: null,
  yesterday: null,
  lastMon: null,
  prevMonth: [],

  isStale() {
    return new Date().getDate() !== this.day;
  },

  update() {
    if (dates.isStale()) {
      this.now = new Date();
      this.day = this.now.getDate();
      this.month = this.now.getMonth();
      this.year = this.now.getFullYear();
      this.today = new Date(this.year, this.month, this.day);
      this.yesterday = new Date(this.today - 86400000);
      this.lastMon = new Date(this.today);
      this.lastMon.setDate(
        this.lastMon.getDate() - ((this.lastMon.getDay() + 6) % 7)
      );
      this.prevMonth[0] = new Date(this.year, this.month, 1);
      this.prevMonth[1] = new Date(this.year, this.month - 1, 1);
      this.prevMonth[2] = new Date(this.year, this.month - 2, 1);
      this.prevMonth[3] = new Date(this.year, this.month - 3, 1);
      return true;
    } else {
      return false;
    }
  },

  parse(dateStr, lang = "en") {
    if (!dateStr) {
      error("dates.parse with empty string", dateStr);
      return false;
    }

    let DD,
      MM,
      YYYY,
      monthStr = null;

    switch (lang) {
      case "en":
      case "en-GB":
        return new Date(dateStr);

      case "cs":
        [, DD, MM, YYYY] = dateStr.replace(/\./g, "").split(" ", 4);
        break;

      case "da":
      case "fi":
        [, DD, monthStr, YYYY] = dateStr.replace(/\./g, "").split(" ", 4);
        break;

      case "es":
      case "fr":
      case "fr-CA":
      case "id":
      case "it":
      case "nl":
      case "ru":
      case "sv":
        [, DD, monthStr, YYYY] = dateStr.split(" ", 4);
        break;

      case "es-419":
        [, DD, , monthStr, , YYYY] = dateStr.split(" ");
        break;

      case "hu":
        [YYYY, monthStr, DD] = dateStr.split(".,")[0].split(". ");
        break;

      case "de":
      case "el":
      case "pl":
      case "uk":
        [DD, monthStr, YYYY] = dateStr.split(", ", 2)[1].split(" ");
        break;

      case "no":
        [, DD, monthStr, YYYY] = dateStr.split(", ")[0].split(". ");
        break;

      case "pt-BR":
        [, DD, , monthStr, , YYYY] = dateStr.split(" ");
        break;

      case "pt-PT":
        [DD, MM, YYYY] = dateStr.split(", ")[1].split("/");
        break;

      case "tr":
        [DD, monthStr, YYYY] = dateStr.split(" ", 3);
        break;

      case "ja":
      case "zh-CN":
      case "zh-HK":
      case "zh-TW":
        [YYYY, MM, DD] = dateStr.split(/\D/g, 3);
        break;

      case "ko":
        [YYYY, , MM, , DD] = dateStr.split(/\D/g, 5);
        break;
    }

    // Extract the month number if the month is a string
    if (monthStr !== null) {
      MM = monthNames.indexOf(monthStr) + 1;
    }

    // Return date with 1am time
    return new Date(YYYY, MM - 1, DD, "1");
  },
};

// Initialize dates
dates.update();



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// UTILITIES

// Toggles custom style and returns latest state
function toggleSimplify() {
  is.simplifyOn = el.html.classList.toggle("simplify");
  chrome.runtime.sendMessage({
    action: "toggle_simplify",
    isOn: is.simplifyOn,
  });
}

// Activate page action button
chrome.runtime.sendMessage({ action: "activate_page_action" });

// Make and return element(s) for appending to the DOM
const make = (type, attrs, ...children) => {
  var node = document.createElement(type);
  for (let prop in attrs) {
    if (!attrs.hasOwnProperty(prop)) continue;
    if (attrs[prop] != undefined) node[prop] = attrs[prop];
  }
  const append = (child) => {
    if (Array.isArray(child)) return child.forEach(append);
    if (typeof child == "string") child = document.createTextNode(child);
    if (child) node.appendChild(child);
  };
  children.forEach(append);
  return node;
};

// Shorthand for getting first matching element; returns Node
const get = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelector(selector);
  } else {
    return parent.querySelector(selector);
  }
};

// Shorthand for getting elements; returns NodeList
const gets = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelectorAll(selector);
  } else {
    return parent.querySelectorAll(selector);
  }
};

// Shorthand for getting number of elements given a provided selector
const count = (selector, parent = "") => {
  if (parent === "") {
    return document.querySelectorAll(selector).length;
  } else {
    return parent.querySelectorAll(selector).length;
  }
};

// Get the computed style of an element
const getStyle = (elem, property) => {
  try {
    let computedStyle = "";
    if (elem instanceof Node) {
      computedStyle = getComputedStyle(elem).getPropertyValue(property);
    } else if (el[elem] instanceof Node) {
      computedStyle = getComputedStyle(el[elem]).getPropertyValue(property);
    } else if (simplify[u].sass[elem]) {
      computedStyle = getComputedStyle(
        get(simplify[u].sass[elem])
      ).getPropertyValue(property);
    } else {
      computedStyle = getComputedStyle(get(elem)).getPropertyValue(property);
    }
    return computedStyle;
  } catch (error) {
    return false;
  }
};

// Shorthand for getting element based on structure in localStorage
const getEl = (elemName) => {
  if (el[elemName] instanceof Node) {
    return el[elemName];
  }

  let elem = findElement(elemName);
  if (elem) {
    el[elemName] = elem;
    return elem;
  } else {
    return false;
  }
};

const getButton = (action) => {
  switch (action) {
    case "y":
    case "e":
    case "archive":
      return get('div[gh="tm"] div[act="7"], div[gh="tm"] div[act="13"]');
    case "!":
    case "isSpam":
      return get('div[gh="tm"] div[act="9"]');
    case "#":
    case "Backspace":
    case "Delete":
    case "delete":
      return get('div[gh="tm"] div[act="10"]');
    case "I":
    case "read":
      return get('div[gh="tm"] div[act="1"]');
    case "U":
    case "unread":
      return get('div[gh="tm"] div[act="2"]');
    case "b":
    case "snooze":
      return get('div[gh="tm"] div[act="290"]');
    case "T":
    case "task":
      return get('div[gh="tm"] div[act="95"]');
    case "v":
    case "move":
      return get('div[gh="tm"] div.ns[role="button"]');
    case "l":
    case "label":
      return get('div[gh="tm"] div.mw[role="button"]');
    default:
      return false;
  }
};

// Return true if element has any class (array)
const hasAnyClass = (classNames, element = el.html) => {
  return classNames.some((className) => element.classList.contains(className));
};

// Find element based on selector, traversing parentELements, and any extra selectors
const findElement = (elemName) => {
  let elem = get(trickyElements[elemName].selector);
  let parentLevel = trickyElements[elemName].parent || 0;
  let suffix = trickyElements[elemName].suffix || "";

  if (elem) {
    while (parentLevel > 0) {
      elem = elem.parentElement;
      parentLevel -= 1;
    }
    if (suffix) {
      elem = elem.querySelector(suffix);
    }
    elem.classList.add(elemName);
    return elem;
  } else {
    return false;
  }
};

// Add an ID to an element
const addId = (elemName, id = "") => {
  const elem = findElement(elemName);
  if (elem) {
    elem.id = id === "" ? elemName : id;
  } else {
    report("Could not find element", elemName);
  }
};

// Test if something is of a type
function isString(string) {
  return Object.prototype.toString.call(string) === "[object String]";
}
function isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}

// Simulate clicking on an element
const clickOn = (elem, withShift = false) => {
  const dispatchMouseEvent = (target, type) => {
    const event = new MouseEvent(type, {
      view: window,
      bubbles: true,
      cancelable: true,
      shiftKey: withShift,
    });
    target.dispatchEvent(event);
  };
  dispatchMouseEvent(elem, "mouseover");
  dispatchMouseEvent(elem, "mousedown");
  dispatchMouseEvent(elem, "click");
  dispatchMouseEvent(elem, "mouseup");
  dispatchMouseEvent(elem, "mouseout");
  report("Clicked on", elem);
};

// Handle messages from background script that
// supports page action to toggle Simplify on/off
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Toggle Simplify on / off
  if (message.action === "toggle_simplify") {
    const isNowToggled = toggleSimplify();
    sendResponse({ toggled: isNowToggled });
    report("util.js", sender.id);
  }

  // Tracker was blocked by tracker.js
  // TODO: Use sass variables for .G2
  else if (message.action === "tracker_blocked") {
    // Hide trackers in the DOM
    let msgTrackers = gets(`*[src*='${message.url}']`);
    msgTrackers.forEach((tracker) => {
      tracker.classList.add("emailTracker");
      tracker.closest(".G2").classList.add("hasTracker");
    });

    // Remove flag if all trackers are in quoted text of message
    gets(".G2.hasTracker").forEach((message) => {
      if (
        count(".emailTracker", message) ===
        count(".gmail_quote .emailTracker", message)
      ) {
        message.classList.remove("hasTracker");
      }
    });

    // Init tracker badget again in case message was expanded adding new star
    conversation.initTrackerBadge();
    report("Simplify blocked a tracker", message, msgTrackers);
  }

  // Handle call to show details from popup menu
  // else if (message.action === "show_details") {
  //   showSimplifyDetails();
  // }

  // Return details
  else if (message.action === "report_issue") {
    reportIssue(true);
  }

  // Handle call to disable Simplify from popup menu
  else if (message.action === "disable_simplify") {
    toggleSimplify();
  }

  // Something else (not expected)
  else {
    report(message);
  }
});

// Show report issue dialog
const reportIssue = (instant = false) => {
  let msg = "Simplify v." + chrome.runtime.getManifest().version;
  if (instant) {
    alerts.show(msg, "Report issue instant");
  } else {
    alerts.show(msg, "Report issue");
  }
};

// Get system report
const getSimplifyDetails = () => {
  let config =
    `Simplify v.${chrome.runtime.getManifest().version}` +
    ` - Configuration: ${el.html.classList.value.split(" ").sort().join(" ")}` +
    ` - System: ${navigator.userAgent} - Window: ` +
    `${window.outerWidth} x ${window.outerHeight} (` +
    `${Math.round((window.outerWidth / window.innerWidth) * 100)}` +
    `pct zoom) - Language: ${lang}`;

  return config.replace(/;/g, "");
};

// Show Simplify Welcome
const showSimplifyWelcome = () => {
  if (document.body) {
    // Build out of box experience
    // prettier-ignore
    let welcomeDialog = make("div", { id: "welcomeToSimplify", className: "wtsS1" },
      make("div", { className: "wtsContent screen1" }, 
        make("div", { className: "simplifyLogo" }),
        make("p", { className: "wtsTitle" }, "The new Simplify \u2014 making Gmail even more simple, capable, and respectful"),
        make("button", { className: "startTrial" }, "TRY IT NOW FOR FREE"),
        make("p", { className: "wtsDisclaimer" }, "1-month trial - No commitment – No credit card"),
        make("p", { className: "wtsUninstall" }, "As low as $2/mo after. More details...")
      ),
      make("div", { className: "wtsContent screen2" }, 
        make("div", { className: "profileArrow" },
          make("p", { }, "Settings, help, toggles, and add-ons under here"),
          make("button", { }, "Got it"),
        ),
      ),
      make("div", { className: "wtsContent screen3" }, 
        make("div", { className: "wtsKeyShortcuts" },
          make("p", { className: "wtsTitle" }, "Get around faster with keyboard shortcuts"),
          make("div", { className: "wtsKeys" },
            make("div", { className: "wtsKey" }, "↑"),
            make("div", { className: "wtsLabel" }, "Previous message in list"),
            make("div", { className: "wtsKey" }, "↓"),
            make("div", { className: "wtsLabel" }, "Next message in list"),
            make("div", { className: "wtsKey" }, "⏎"),
            make("div", { className: "wtsLabel" }, "Open message"),
            make("div", { className: "wtsKey wtsEscKey" }, "ESC"),
            make("div", { className: "wtsLabel" }, "Return to inbox"),
            make("div", { className: "wtsKey" }, "?"),
            make("div", { className: "wtsLabel" }, "See all shortcuts")
          ),
          make("button", { }, "Vroom Vroom"),
        ),
      ),
      make("div", { className: "wtsContent screen4" }, 
        make("div", { className: "profileArrow" },
          make("p", { }, "Last thing \u2014 Click on the Simplify logo for options, pricing, and more"),
          make("p", { className: "wtsDisclaimer" }, "It might be hidden in your extensions menu"),
          make("button", { }, "Let's go!"),
        ),
      )
    );

    // Attach it to the body
    document.body.appendChild(welcomeDialog);

    // Progress through screens as you click
    let welcome = get("#welcomeToSimplify");
    welcome.addEventListener("click", (e) => {
      if (welcome.classList.contains("wtsS1")) {
        welcome.classList.remove("wtsS1");
        welcome.classList.add("wtsS2");
      } else if (welcome.classList.contains("wtsS2")) {
        welcome.classList.remove("wtsS2");
        welcome.classList.add("wtsS3");
      } else if (welcome.classList.contains("wtsS3")) {
        welcome.classList.remove("wtsS3");
        welcome.classList.add("wtsS4");
      } else {
        welcome.classList.remove("wtsShow");
        local.update("firstTimeWelcome", false);
      }
    });

    // Open link to pricing article if you click to read more
    get("#welcomeToSimplify .wtsUninstall").addEventListener("click", (e) => {
      // chrome.runtime.sendMessage({ action: "manage_extensions" });
      // welcome.classList.remove("wtsShow");
      window.open("https://on.simpl.fyi/p/pricing-v2");
      e.stopPropagation();
    });
  } else {
    setTimeout(showSimplifyWelcome, 500);
  }
};



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// LOCAL STORAGE

const local = {
  init() {
    if (localStorage.simplify) {
      simplify = JSON.parse(localStorage.simplify);
    }

    // Initialize paremeters for userNum if they don't exist
    if (typeof simplify[u] === "undefined") {
      simplify[u] = defaultParam;
      localStorage.simplify = JSON.stringify(simplify);
    }

    // Reset the localStorage if it is an older version
    if (isNaN(parseFloat(simplify[u].version))) {
      local.reset(true);
    } else if (
      parseFloat(simplify[u].version) < parseFloat(defaultParam.version)
    ) {
      local.reset();
    }

    // Reset the localStorage.sass if it is an older version
    if (isNaN(parseFloat(simplify[u].sass.version))) {
      local.resetSass();
    } else if (
      parseFloat(simplify[u].sass.version) <
      parseFloat(defaultParam.sass.version)
    ) {
      local.resetSass();
    }

    if (simplify[u].debug) {
      // Point global variable to user
      // selectors = simplify[u].sass;

      // Initialize debug function if enabled in Simplify settings
      report = console.log.bind(window.console);
      error = console.error.bind(window.console);
    }

    report("Simplify cached variables loaded from localStorage");
  },

  // Write to local prefs and localStorage object
  update(key, value = "") {
    if (value !== "") {
      let param = key.split(".");
      if (param[1]) {
        simplify[u][param[0]][param[1]] = value;
      } else {
        simplify[u][param[0]] = value;
      }
    }
    localStorage.simplify = JSON.stringify(simplify);
  },

  // Reset local storage
  reset(totalReset = false) {
    if (totalReset) {
      console.log("Total reset of Simplify localStorage");
      localStorage.removeItem("simplify");
      simplify = {};
    } else {
      console.log("Partial reset of localStorage");
    }
    simplify[u] = defaultParam;
    localStorage.simplify = JSON.stringify(simplify);
  },

  // Reset sass variables in local storage
  resetSass() {
    console.log("Reset Sass variables in Simplify localStorage");
    simplify[u].sass = defaultParam.sass;
    localStorage.simplify = JSON.stringify(simplify);
  },
};

// Initialize localStorage and simplify global variable
local.init();



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// SIMPLIFY PREFERENCES

// Global variable for Simplify Preferences
let preferences = {};

// Apply setting
const applyPreferences = (prefs) => {
  Object.keys(prefs).forEach((key) => {
    preferences[key] = prefs[key];

    switch (key) {
      case "invertAddons":
        if (preferences.invertAddons) {
          el.html.classList.add("invertAddons");
        } else {
          el.html.classList.remove("invertAddons");
        }
        break;

      case "invertCompose":
        if (preferences.invertCompose) {
          el.html.classList.add("invertCompose");
        } else {
          el.html.classList.remove("invertCompose");
        }
        break;

      case "sendLater":
        if (preferences.sendLater) {
          el.html.classList.add("sendLater");
        } else {
          el.html.classList.remove("sendLater");
        }
        break;

      case "dateGroup":
        if (preferences.dateGroup) {
          el.html.classList.add("dateGroup");
          lists.scan();
        } else {
          el.html.classList.remove("dateGroup");
        }
        break;

      case "inboxZeroBg":
        report("Inbox zero background changed");
        el.html.classList.remove(
          "izBgDefault",
          "izBg1",
          "izBg2",
          "izBg3",
          "izBg4",
          "izBg5",
          "izBgOff"
        );

        if (preferences.inboxZeroBg === "default") {
          el.html.classList.add("izBgDefault");
        } else if (preferences.inboxZeroBg === "light-mountain") {
          el.html.classList.add("izBg1");
        } else if (preferences.inboxZeroBg === "dark-mountain") {
          el.html.classList.add("izBg2");
        } else if (preferences.inboxZeroBg === "aqua-beach") {
          el.html.classList.add("izBg3");
        } else if (preferences.inboxZeroBg === "cat") {
          el.html.classList.add("izBg4");
        } else if (preferences.inboxZeroBg === "dog") {
          el.html.classList.add("izBg5");
        } else if (preferences.inboxZeroBg === "none") {
          el.html.classList.add("izBgOff");
        }
        break;

      case "listWidth":
        report("List width preference applied");
        el.html.classList.remove(
          "listWidthMd",
          "listWidthLg",
          "listWidthXLg",
          "listWidthXXLg",
          "listWidthFull"
        );
        if (preferences.listWidth === "960") {
          el.html.classList.add("listWidthMd");
        } else if (preferences.listWidth === "1100") {
          el.html.classList.add("listWidthLg");
        } else if (preferences.listWidth === "1250") {
          el.html.classList.add("listWidthXLg");
        } else if (preferences.listWidth === "1400") {
          el.html.classList.add("listWidthXXLg");
        } else if (preferences.listWidth === "full") {
          el.html.classList.add("listWidthFull");
        }
        break;

      case "msgWidth":
        report("Message width preference applied");
        el.html.classList.remove(
          "msgWidthSm",
          "msgWidthMd",
          "msgWidthLg",
          "msgWidthXLg",
          "msgWidthXXLg",
          "msgWidthFull"
        );
        if (preferences.msgWidth === "850") {
          el.html.classList.add("msgWidthSm");
        } else if (preferences.msgWidth === "960") {
          el.html.classList.add("msgWidthMd");
        } else if (preferences.msgWidth === "1100") {
          el.html.classList.add("msgWidthLg");
        } else if (preferences.msgWidth === "1250") {
          el.html.classList.add("msgWidthXLg");
        } else if (preferences.msgWidth === "1400") {
          el.html.classList.add("msgWidthXXLg");
        } else if (preferences.msgWidth === "full") {
          el.html.classList.add("msgWidthFull");
        }
        break;

      case "invertMessages":
        if (is.msg) conversation.hasHtmlEmail();
        break;

      case "minimizeChat":
        if (preferences.minimizeChat) {
          el.html.classList.add("minimizeChat");
        } else {
          el.html.classList.remove("minimizeChat");
          el.html.classList.remove("chatOpen");
        }
        break;

      case "showChat":
        if (preferences.showChat) {
          el.html.classList.add("showChat");
        } else {
          el.html.classList.remove("showChat");
        }
        break;

      case "hideSignatures":
        if (preferences.hideSignatures) {
          el.html.classList.add("hideSignatures");
        } else {
          el.html.classList.remove("hideSignatures");
        }
        break;

      case "hideUnreadCount":
        if (preferences.hideUnreadCount) {
          el.html.classList.add("hideUnreads");
        } else {
          el.html.classList.remove("hideUnreads");
        }
        break;

      case "hideTitleUnreadCount":
        if (preferences.hideTitleUnreadCount) {
          observers.title.start();
          observers.title.check();
        } else {
          observers.title.disconnect();
          if (is.inbox) {
            let refreshButton = get('div[gh="tm"] div[act="20"]');
            if (refreshButton) {
              clickOn(refreshButton);
              document.activeElement.blur();
            }
          }
        }
        break;

      case "favicon":
        let favicon = "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico";
        if (preferences.favicon) {
          favicon = chrome.runtime.getURL("img/icons/favicon-24.ico");
        }
        let linkEl = get('link[rel="shortcut icon"]');
        if (linkEl) {
          linkEl.href = favicon;
        } else {
          setTimeout(() => {
            applyPreferences({ favicon: preferences.favicon });
          }, 1000);
        }
        break;

      case "addCategories":
        if (preferences.addCategories) {
          nav.addCategories();
        } else {
          gets(".aim[data-category]").forEach((category) => {
            category.remove();
          });
        }
        break;

      case "hideTabIcons":
        if (preferences.hideTabIcons) {
          el.html.classList.add("hideTabIcons");
        } else {
          el.html.classList.remove("hideTabIcons");
        }
        break;

      case "hideSelectRefresh":
        if (preferences.hideSelectRefresh) {
          el.html.classList.add("hideSelectRefresh");
        } else {
          el.html.classList.remove("hideSelectRefresh");
        }
        break;

      case "debug":
        if (preferences.debug) {
          el.html.classList.add("debug");

          // Add the binding to console.log
          report = console.log.bind(window.console);
          error = console.error.bind(window.console);
        } else {
          el.html.classList.remove("debug");

          // Remove the binding to console.log
          report = () => {};
          error = () => {};
        }
        // Cache state in localStorage
        local.update("debug", preferences.debug);
        break;

      case "hideListCount":
        if (preferences.hideListCount) {
          el.html.classList.add("hideListCount");
        } else {
          el.html.classList.remove("hideListCount");
        }
        break;

      case "hideMsgCount":
        if (preferences.hideMsgCount) {
          el.html.classList.add("hideMsgCount");
        } else {
          el.html.classList.remove("hideMsgCount");
        }
        break;

      case "reverseMsgs":
        if (preferences.reverseMsgs) {
          el.html.classList.add("reverseMsgs");
        } else {
          el.html.classList.remove("reverseMsgs");
        }
        break;

      case "matchFontSize":
        if (preferences.matchFontSize) {
          el.html.classList.add("matchFontSize");
        } else {
          el.html.classList.remove("matchFontSize");
        }
        break;

      case "composeActions":
        if (preferences.composeActions) {
          el.html.classList.add("composeActions");
        } else {
          el.html.classList.remove("composeActions");
        }
        break;

      case "caImage":
        if (preferences.caImage) {
          el.html.classList.add("caI");
        } else {
          el.html.classList.remove("caI");
        }
        break;

      case "caLink":
        if (preferences.caLink) {
          el.html.classList.add("caL");
        } else {
          el.html.classList.remove("caL");
        }
        break;

      case "caDrive":
        if (preferences.caDrive) {
          el.html.classList.add("caD");
        } else {
          el.html.classList.remove("caD");
        }
        break;

      case "caEmoji":
        if (preferences.caEmoji) {
          el.html.classList.add("caE");
        } else {
          el.html.classList.remove("caE");
        }
        break;

      case "caSig":
        if (preferences.caSig) {
          el.html.classList.add("caS");
        } else {
          el.html.classList.remove("caS");
        }
        break;

      case "caConfid":
        if (preferences.caConfid) {
          el.html.classList.add("caC");
        } else {
          el.html.classList.remove("caC");
        }
        break;

      case "caCount":
        if (preferences.caCount >= 0) {
          // Remove old className (/.ca\d/)
          let oldVal = el.html.classList.value
            .split(" ")
            .filter((item) => item.match(/ca\d/))[0];
          if (oldVal) {
            el.html.classList.remove(oldVal);
          }

          // Add new className
          el.html.classList.add("ca" + preferences.caCount);
        }
        break;

      case "composeFormat":
        if (preferences.composeFormat) {
          el.html.classList.add("composeFormat");
        } else {
          el.html.classList.remove("composeFormat");
        }
        break;

      case "cfUndo":
        if (preferences.cfUndo) {
          el.html.classList.add("cfZ");
        } else {
          el.html.classList.remove("cfZ");
        }
        break;

      case "cfFont":
        if (preferences.cfFont) {
          el.html.classList.add("cfF");
        } else {
          el.html.classList.remove("cfF");
        }
        break;

      case "cfSize":
        if (preferences.cfSize) {
          el.html.classList.add("cfS");
        } else {
          el.html.classList.remove("cfS");
        }
        break;

      case "cfColor":
        if (preferences.cfColor) {
          el.html.classList.add("cfC");
        } else {
          el.html.classList.remove("cfC");
        }
        break;

      case "cfAlign":
        if (preferences.cfAlign) {
          el.html.classList.add("cfA");
        } else {
          el.html.classList.remove("cfA");
        }
        break;

      case "cfOrdered":
        if (preferences.cfOrdered) {
          el.html.classList.add("cfO");
        } else {
          el.html.classList.remove("cfO");
        }
        break;

      case "cfUnordered":
        if (preferences.cfUnordered) {
          el.html.classList.add("cfU");
        } else {
          el.html.classList.remove("cfU");
        }
        break;

      case "cfIndent":
        if (preferences.cfIndent) {
          el.html.classList.add("cfI");
        } else {
          el.html.classList.remove("cfI");
        }
        break;

      case "cfQuote":
        if (preferences.cfQuote) {
          el.html.classList.add("cfQ");
        } else {
          el.html.classList.remove("cfQ");
        }
        break;

      case "cfStrike":
        if (preferences.cfStrike) {
          el.html.classList.add("cfK");
        } else {
          el.html.classList.remove("cfK");
        }
        break;

      case "cfRemove":
        if (preferences.cfRemove) {
          el.html.classList.add("cfR");
        } else {
          el.html.classList.remove("cfR");
        }
        break;
    }
  });

  let savedOrLoaded = Object.keys(prefs).length === 1 ? " saved" : "s loaded";
  report("Simplify preference" + savedOrLoaded, JSON.stringify(prefs));
};

// Initialize Simplify preferences
// TODO: What if the preferences are old and don't have all the new names? OR if I add a preference?
// TODO: Make preferences tri-state (true, false, or undefined/null) and defer to the default when undefined/null
const defaultPreferences = {
  debug: false,

  // Keyboard shortcuts
  kbsMenu: true,
  kbsInfo: true,
  kbsToggle: true,
  kbsEscape: true,
  kbsEnter: true,
  kbsUndo: true,
  kbsRefresh: true,
  kbsBackspace: true,
  kbsSelectAll: true,
  kbsSelectAllAll: true,
  kbsOrder: false,
  kbsAutoSelect: false,

  dateGroup: true,
  inboxZeroBg: "default",
  minimizeChat: true,
  showChat: false,
  hideSignatures: false,
  hideUnreadCount: false,
  hideTitleUnreadCount: false,
  invertMessages: "text-only",
  invertCompose: true,
  invertAddons: true,
  favicon: true,
  addCategories: true,
  hideSelectRefresh: false,
  hideTabIcons: true,
  hideListCount: true,
  hideMsgCount: true,
  matchFontSize: true,
  sendLater: false,
  reverseMsgs: false,
  listWidth: "1100",
  msgWidth: "850",

  // Compose actions
  composeActions: true,
  caCount: 3,
  caImage: true,
  caLink: true,
  caDrive: false,
  caEmoji: false,
  caSig: false,
  caConfid: false,

  // Compose formatting
  composeFormat: false,
  cfUndo: false,
  cfFont: false,
  cfSize: false,
  cfColor: true,
  cfAlign: false,
  cfOrdered: true,
  cfUnordered: true,
  cfIndent: false,
  cfQuote: true,
  cfStrike: false,
  cfRemove: true,
};

chrome.storage.local.get(defaultPreferences, function (results) {
  let updatePrefs = false;

  if (
    results === null ||
    Object.keys(results).length === 0 ||
    results.dateGrouping
  ) {
    preferences = defaultPreferences;
    updatePrefs = true;
  } else {
    // Check if there are new settings that haven't been setup before
    // TODO: is there a better way to do this? maybe with a versioning on the settings?
    Object.keys(defaultPreferences).forEach((key) => {
      if (results[key] === undefined) {
        results[key] = defaultPreferences[key];
        updatePrefs = true;
      }
    });
    preferences = results;
  }
  if (updatePrefs) {
    chrome.storage.local.clear();
    chrome.storage.local.set(preferences);
  }
  applyPreferences(preferences);
});

function handlePrefChange(changes) {
  for (let key in changes) {
    let newPreferences = {};
    newPreferences[key] = changes[key].newValue;
    applyPreferences(newPreferences);
  }
}

// Detect changes in preferences and make appropriate changes
chrome.storage.onChanged.addListener(handlePrefChange);



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// CSS / SASS

/**
 * SASS is in multiple files
 * Shell script merges them into one js variable in one file and removes variable definitions and comments
 * css.compile {
 *   take sass and parse it line by line into CSS
 *   replace SASS variables with selectors loaded from localStorage / simplify[u]
 *   return CSS
 * }
 * css.load {
 *   css = this.compile()
 *   Put CSS into DOM
 * }
 * sass.update {
 *   update variable(s)
 *   this.load()
 * }
 *
 * Things to test still
 *  - empty declaration
 *  - multiple selectors on one line
 *  - multiple line declaration
 *  - trailing comments
 *  - style attribute selectors which put ": " in the selector
 */

const css = {
  updates: [],

  compile() {
    let lines = declarations.split(/\n/);
    let currentSelector = [];
    let addSelectorLater = false;
    let addLineNow = true;
    let openSelectorsCount = 0;
    let lastSelector = -1;
    let styles = [];
    let inComment = false;
    let inSelector = false;
    let inDeclaration = false;

    lines.forEach((sassLine) => {
      let line = sassLine.trim();
      let selectors = "";
      let selectorVars = "";
      let declarationVars = "";
      let hangingSelector = false;

      report("\n-----------------\nSass line: ", line);

      /** -------------------------------------------------------------
       * Reasons to skip this line
       */

      // Ignore empty lines
      if (line === "") return;

      // Ignore // comments
      if (line.match(/^\s*\/\//) !== null) return;

      // Ignore /* comments */
      if (line.match(/\/\*/) !== null) {
        inComment = true;
        return;
      }

      // Has the comment ended?
      if (inComment) {
        if (line.match(/\*\//) !== null) {
          inComment = false;
        }
        return;
      }

      /** -------------------------------------------------------------
       * Resove variables
       */

      // Replace selector variables
      selectorVars = line.match(/#{\$\w+}/g);
      if (selectorVars !== null) {
        selectorVars.forEach((s) => {
          report(
            "SASS selector var: ",
            s,
            s.slice(3, -1),
            simplify[u].sass[s.slice(3, -1)]
          );
          line = line.replace(s, simplify[u].sass[s.slice(3, -1)]);
        });
      }

      // Replace value variables
      declarationVars = line.match(/\$\w+/g);
      if (declarationVars !== null) {
        declarationVars.forEach((v) => {
          report("SASS declaration var: ", v, simplify[u].sass[v.substr(1)]);
          line = line.replace(v, simplify[u].sass[v.substr(1)]);
        });
      }

      /** -------------------------------------------------------------
       * Detect multiple line selectors and declarations
       */

      // Is this line part of a multi-line declaration?
      let unclosedDeclaration = line.match(/.+: .+[^;]$/) !== null;
      let attributeSelector =
        line.match(/\[style[=*$~]{1,2}"[\w-]+: .+"\]/) !== null;

      if (inDeclaration) {
        if (line.substr(-1) === ";") {
          inDeclaration = false;
        }
      } else {
        // Does the line have a ": " in it but not end in a ;
        if (unclosedDeclaration && !attributeSelector) {
          inDeclaration = true;
        }
      }

      // Is this line part of a multi-line selector?
      if (inSelector) {
        if (line.substr(-1) === "{") {
          inSelector = false;
        }
      } else {
        if (
          (!unclosedDeclaration || attributeSelector) &&
          line.substr(-1) === ","
        ) {
          inSelector = true;
        }
      }

      /** -------------------------------------------------------------
       * Parse line
       */

      // If the line is an opening selector, add to building hierarchy
      let openSelector = line.match(/.* {$/);
      if (openSelector !== null || inSelector) {
        // If the line didn't end in a "{" and we're in a selector,
        // then the openSelector will end in a ","
        if (openSelector === null) {
          openSelector = line.match(/.*,$/);
        }

        // Remove bracket from end of selector
        let thisSelector = openSelector[0].replace(" {", "");

        /* Handle multiple selectors in one line */
        let arraySelector = "";
        if (thisSelector.search(/.+\,.+/) >= 0) {
          arraySelector = thisSelector.replace(",", ",//");
          arraySelector = arraySelector.split("//");
        } else {
          arraySelector = [thisSelector];
        }
        report(arraySelector);

        // Check to see if ending of last selector was a comma
        hangingSelector = false;
        lastSelector = currentSelector.length - 1;
        if (lastSelector >= 0) {
          if (currentSelector[lastSelector].slice(-1)[0].substr(-1) === ",") {
            hangingSelector = true;
          }
        }

        // Add selector to the hierarchy
        report("Current selector before:");
        currentSelector.forEach((s) => report(s));

        if (arraySelector.length > 1) {
          if (hangingSelector) {
            arraySelector.forEach((s) => {
              currentSelector[lastSelector].push(s);
            });
          } else {
            currentSelector.push(arraySelector);
          }
        } else {
          if (hangingSelector) {
            currentSelector[lastSelector].push(arraySelector[0]);
          } else {
            currentSelector.push(arraySelector);
          }
        }

        report("Current selector after:");
        currentSelector.forEach((s) => report(s));

        // We're only ready to show the selector if it has been fully opened
        if (!inSelector) {
          addSelectorLater = true;
        }

        // And selectors are only added at the start of a definition
        addLineNow = false;
      }

      // Else if this is a closing statement, see if we should print it
      else if (line === "}") {
        report("Closing selector before");
        currentSelector.forEach((s) => report(s));

        // Remove last selector from from currentSelector
        let removedSelector = currentSelector.pop();
        report("Removed selector: ", removedSelector);

        if (openSelectorsCount >= 1) {
          openSelectorsCount -= 1;
          addLineNow = true;
        }

        report("Closing selector after");
        currentSelector.forEach((s) => report(s));
      }

      // Otherwise, this is a CSS declaration
      else {
        report("CSS declaration: ", line, openSelectorsCount);

        // Indent CSS declaration
        line = "  " + line;

        // Do I need to print the accumulated selector?
        if (addSelectorLater) {
          selectors = this.getSelectors(Array.from(currentSelector));
          report(
            "---\ngetSelectors: ",
            selectors.flat(),
            currentSelector.flat()
          );

          line = selectors.join("\n") + " {\n" + line;

          // Replace & with currentSelector
          // TODO: I think SASS does something special when the & is at the end
          line = line.replace(/ &/gm, "");

          // Remove trailing comments
          line = line.replace(/[;|,|{|}] \/\/.*/, "");

          // Do I need to close the previous selector?
          if (openSelectorsCount >= 1) {
            line = "}\n" + line;
            openSelectorsCount -= 1;
          }

          // After testing, increment the openSelectorsCount
          openSelectorsCount += 1;

          // Reset addSelectorLater
          addSelectorLater = false;
        }

        // Update state variables
        addLineNow = true;
      }

      // Add final line to CSS
      if (addLineNow) styles.push(line);
      report("CSS so far: ", styles);

      // Reset addLineNow
      addLineNow = false;
    });

    // Put all the lines back into one big string
    return styles.join(`\n`);
  },

  getSelectors(selectors, parents = [""]) {
    let selector = selectors.shift();
    let results = [];

    report("---\nParents: ", parents.flat());
    report("Next selector: ", selector);
    report("Remaining selectors: ", selectors.flat());

    parents.forEach((p) => {
      selector.forEach((s) => {
        results.push(`${p} ${s}`.trim());
      });
    });

    if (selectors.length === 0) {
      return results;
    } else {
      return this.getSelectors(selectors, results);
    }
  },

  // Load SASS as CSS into page
  load() {
    // TODO: Use SASS Compiler
    // const styles = this.compile();
    const styles = "";

    const simplifyCss = make(
      "style",
      { type: "text/css", id: "simplifyCss" },
      styles
    );
    (document.head || document.documentElement).appendChild(simplifyCss);
    el.style = get("style#simplifyCss");
    this.sheet = el.style.sheet;
  },

  // Update a SASS variable and then update the CSS in the page
  update(element = "", selector = "") {
    // Process any accumulated updates
    this.updates.forEach((update) => {
      simplify[u].sass[update.e] = update.s;
    });

    // Process any inline updates
    if (element !== "" && selector !== "") {
      simplify[u].sass[element] = selector;
    }

    // Update localStorage
    local.update();

    // Compile CSS with new variables and selectors
    const styles = this.compile();

    // Insert compiled CSS into Gmail
    // TODO: Should I use insertRule?
    el.style.innerText = styles;
  },

  add(css, pos) {
    let position = pos ? pos : this.sheet.cssRules.length;
    this.sheet.insertRule(css, position);
    report("CSS added: " + this.sheet.cssRules[position].cssText);
  },
};

// Load Simplify CSS
css.load();

// Add simplify to <html>
document.documentElement.classList.add("simplify");



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// KEYBOARD SHORTCUTS

// Keypress handler
const keyboard = {
  ignoreNextKey: false,
  obsOverlayOpen: null,
  obsOverlayClose: null,

  onKeydown(e) {
    // Test if only the Alt/Option key was only modifier key used
    let altKeyOnly = e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey;

    // Was person typing somewhere when keypress event happened?
    let composing =
      e.target.isContentEditable ||
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA";

    // If Option+S or Alt+S was pressed, toggle Simplify on/off
    if (altKeyOnly && e.code === "KeyS" && !composing) {
      if (preferences.kbsToggle) {
        toggleSimplify();
        e.preventDefault();
      }
      return;
    }

    // Only handle the rest of the keyboard shortcuts if Simplify is enabled and user is not typing
    if (!is.simplifyOn || composing) return;

    // Test different combinations of modifier keys
    let noModifierKey = !e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey;
    let shiftKeyOk = !e.altKey && !e.metaKey && !e.ctrlKey;
    let cmdKey = is.mac ? e.metaKey : e.ctrlKey;
    let ctrlKey = is.mac ? e.ctrlKey : e.metaKey; // Flip to Win key for Windows so I make sure it isn't pressed
    let cmdKeyOnly = cmdKey && !ctrlKey && !e.altKey && !e.shiftKey;
    // let shiftKeyOnly = e.shiftKey && !e.altKey && !e.metaKey && !e.ctrlKey;

    // Double check for moles if "c" pressed to compose new message
    if (e.key === "c" && noModifierKey) {
      observers.moles.start();
      observers.popouts.start();
    }

    // Don't block chained keyboard shortcuts like g -> i
    let chainedActions = [
      ["g", "*", "h"],
      ["a", "b", "c", "d", "f", "i", "k", "l", "m", "n", "p", "s", "t"],
    ];
    if (chainedActions[0].includes(e.key) && shiftKeyOk) {
      keyboard.ignoreNextKey = true;
      return;
    } else if (
      keyboard.ignoreNextKey &&
      chainedActions[1].includes(e.key) &&
      shiftKeyOk
    ) {
      keyboard.ignoreNextKey = false;
      return;
    } else {
      keyboard.ignoreNextKey = false;
    }

    // Dress up keyboard shortcuts overlay when opened
    if (e.key === "?" && shiftKeyOk) {
      report("Keyboard shortcuts overlay opened");
      keyboard.initOverlay();
      return;
    }

    // Inline actions on list
    if (is.list && shiftKeyOk) {
      // Stregthen item highlight after using J/K or arrow keys
      let upDown = ["ArrowDown", "ArrowUp", "j", "k"];
      if (upDown.includes(e.key)) {
        report("J/K or Up/Down arrow key pressed");
        el.html.classList.add("boldHighlight");
        return;
      }

      // If action key pressed while nothing is selected, select it, do action, unselect
      let actions = ["e", "y", "#", "!", "U", "I", "b", "l", "v"];
      if (preferences.kbsBackspace) {
        actions.push("Backspace", "Delete");
      }
      let readingPane = hasAnyClass(["vPane", "hPane"]);
      if (preferences.kbsAutoSelect && actions.includes(e.key)) {
        report("Inline action pressed", e.key);

        // Get the correct action button
        let btn = getButton(e.key);

        // Click on delete if in reading pane and user pressed backspace or delete
        if (
          readingPane &&
          ["Backspace", "Delete"].includes(e.key) &&
          preferences.kbsBackspace
        ) {
          e.preventDefault();
          clickOn(btn);
          return;
        }

        // Else try to select thread
        let threadSelected = lists.selectThread();

        if (threadSelected && btn) {
          e.preventDefault();
          // Slight delay before clicking on the action button to make sure thread is selected
          setTimeout(() => {
            clickOn(btn);
          }, tryIn);
        } else if (
          btn &&
          ["Backspace", "Delete"].includes(e.key) &&
          preferences.kbsBackspace
        ) {
          clickOn(btn);
        } else if (threadSelected && !btn) {
          // Unselect the thread if I couldn't find the action
          lists.unSelectThread();
        }
        return;
      }
    }

    // Delete message in message view
    if (
      is.msg &&
      (e.key === "Backspace" || e.key === "Delete") &&
      preferences.kbsBackspace &&
      noModifierKey
    ) {
      report("Backspace or Delete pressed in message view. Delete message.");
      clickOn(getButton(e.key));
      return;
    }

    // Go between messages with Space bar
    // TODO: This won't work for reading pane? Or do I just always map space bar to scrolling through messages?
    // TODO: I may be able to scroll to the next message but not sure I can focus it like N/P does :(
    // TODO: Dig more into what N/P does and see if I can replicate it
    // if (e.key === "Space" && is.msg) {
    //   report("Space bar pressed");
    //   // TODO: Write the actual code for this!
    //   // AFTER you press N or P, clicking on the body of the next message focuses
    //   // it + scroll the page (if current email is long) or to top of next message
    //   return;
    // }

    // Smart Select All if you press Cmd+A
    if (
      is.list &&
      preferences.kbsSelectAll &&
      cmdKey &&
      e.key === "a" &&
      !e.altKey &&
      !ctrlKey
    ) {
      report("Command+A pressed, select all the rest");
      let selectAll = get('div[gh="tm"] .T-Pm span[role="checkbox"]');
      if (selectAll) {
        e.preventDefault();
        clickOn(selectAll);
        document.activeElement.blur();
      }

      if (e.shiftKey && preferences.kbsSelectAllAll) {
        let selectAllAll = get('.ya span[role="link"]');
        if (selectAllAll) {
          clickOn(selectAllAll);
          document.activeElement.blur();
        }
      }

      // TODO: More advanced version:
      // If nothing selected, select evertying after current item in current section
      // If something selected before current item, select everything after current item
      // If everything selected after current item (e.g. you just pressed Cmd+A), select everything in current section
      // If everything selected in current selection, select everything on page
      // If everything on page selected, select nothing
    }

    // Refresh list instead of entire page
    // TODO: This isn't working in Safari
    // report(
    //   "Refresh?",
    //   preferences.kbsRefresh && cmdKeyOnly && e.key === "r"
    // );
    if (preferences.kbsRefresh && cmdKeyOnly && e.key === "r") {
      e.stopPropagation();
      e.preventDefault();

      report("Command+R pressed, refresh Gmail list");
      let refreshButton = get('div[gh="tm"] div[act="20"]');
      if (refreshButton) {
        clickOn(refreshButton);
        document.activeElement.blur();
      }
      return;
    }

    // Undo last action if you press Cmd+Z
    if (preferences.kbsUndo && cmdKeyOnly && e.key === "z") {
      report("Command+Z pressed, try to undo last action");
      let undoButton = get("#link_undo");
      if (undoButton) {
        e.preventDefault();
        e.stopPropagation();
        clickOn(undoButton);
      }
    }

    // If Escape was pressed, close conversation or search
    if (e.key === "Escape" && preferences.kbsEscape && noModifierKey) {
      // Prevent ESC from focusing or hiding an open mole instead
      e.preventDefault();
      e.stopPropagation();

      if (get('#simplifyAlert[style*="block"]')) {
        alerts.close();
      } else if (get(".wa:not(.aou)")) {
        // Keyboard shortcuts overlay is open
        clickOn(get(".wa span.wi"));
      } else if (is.msg) {
        report(
          "Pressed esc: In a conversation, return to list view: " + close.msg
        );
        let backButton = get('div[act="19"]');
        url.ignore = true;
        if (backButton) {
          clickOn(backButton);
        } else {
          report("Coundn't find back button. Going to", close.msg);
          location.hash = close.msg;
        }
      } else if (is.search || is.label) {
        report(
          "Pressed esc: In search or label, return to previous list view: " +
            close.search
        );
        // location.hash = close.search;
        search.exit();
      } else if (is.settings) {
        report(
          "Pressed esc: In settings, return to previous list view: " +
            close.settings
        );
        // location.hash = close.settings;
        settings.exit();
      } else if (is.inbox) {
        report("Pressed esc in Inbox, go to Primary tab?");

        // TODO: Use sass variables
        let primaryTab = get(".aAy");
        if (primaryTab) {
          if (primaryTab.getAttribute("aria-selected") === "false") {
            clickOn(primaryTab);
          }
        }
      }
      // Return to Inbox if anywhere else (this might have unintended consequences)
      else {
        location.hash = "#inbox";
        report("Pressed esc: Not in a conversation or search, go to Inbox");
      }
      return;
    }

    // If Enter is pressed, zoom in and eventually reply to the focused message
    if (e.key === "Enter" && preferences.kbsEnter) {
      report("Pressed enter: Look for focused message to reply to");

      // Don't do anything if the Snooze menu is open
      if (count(simplify[u].sass.menuSnooze) > 0) {
        return;
      }

      // If still in the list, open message
      if (is.list && !is.msgOpen) {
        if (document.activeElement.classList.contains("zA")) {
          report("Enter key was pressed in the inbox with message in focus");
          clickOn(get(`${simplify[u].sass.currentList} tr.btb:not(.aps) .a4W`));
        }
      } else {
        let replyToFocusedMsg = get(
          'div[tabindex="0"][role="listitem"] .bAm div[role="button"]:first-child'
        );
        if (replyToFocusedMsg) {
          clickOn(replyToFocusedMsg, e.shiftKey);

          let replyBody = get(
            'table[role="presentation"] div[role="textbox"][contenteditable="true"]'
          );
          if (replyBody) replyBody.focus();
        } else {
          report("Pressed enter: Couldn't find the reply button to click on");
        }
      }
      return;
    }

    // If Option+I or Alt+I was pressed, show Simplify details
    if (
      altKeyOnly &&
      e.code === "KeyD" &&
      preferences.kbsOrder &&
      (is.msg || is.msgOpen)
    ) {
      el.html.classList.toggle("reverseMsgs");
      return;
    }

    // If Option+I or Alt+I was pressed, show Simplify details
    if (altKeyOnly && e.code === "KeyI" && preferences.kbsInfo) {
      // showSimplifyDetails();
      reportIssue();
      return;
    }

    // If Alt+M or Option+M was pressed, toggle nav menu open/closed
    if (altKeyOnly && e.code === "KeyM" && preferences.kbsMenu) {
      clickOn(el.menuButton);
      e.preventDefault();

      // If opening, focus the first element
      if (el.menuButton.getAttribute("aria-expanded") === "true") {
        get(simplify[u].sass.inboxLink).focus();
      } else {
        document.activeElement.blur();
      }
      return;
    }
  },

  initOverlay(tries = 0) {
    if (tries < 10) {
      if (!get(".wh") && !get(".aNP")) {
        setTimeout(() => {
          keyboard.initOverlay(tries++);
        }, retryIn);
        return;
      }
    }

    // Add Simplify keyboard shortcuts (if not there) and fix formatting of overlay
    let simplifyShortcuts = make("table", {
      cellpadding: "0",
      id: "simplifyKbs",
      className: "cf wd",
    });
    let topShortcutsTable = get(".aNP");
    if (topShortcutsTable) {
      topShortcutsTable.insertBefore(simplifyShortcuts, get(".aNO"));
    }
    keyboard.addSimplifyShortcuts();

    // Replace modifier keys
    keyboard.replaceKeys();

    // Listen for overlay closing
    let overlay = get("body > .wa");
    if (this.obsOverlayClose === null) {
      this.obsOverlayClose = new MutationObserver(keyboard.closeOverlay);
    }
    if (overlay) {
      this.obsOverlayClose.observe(
        overlay,
        observers.config.classAttributeOnly
      );
    }

    // Listen for overlay re-opening
    let overlayInner = get("body > .wa > div");
    if (this.obsOverlayOpen === null) {
      this.obsOverlayOpen = new MutationObserver((mutations) => {
        if (mutations.some((m) => m.addedNodes.length > 0)) {
          keyboard.initOverlay();
        }
      });
    }
    if (overlayInner) {
      this.obsOverlayOpen.observe(
        overlayInner,
        observers.config.directChildrenOnly
      );
    }
  },

  addSimplifyShortcuts() {
    report("Adding Simplify keyboard shortcuts");
    let simplifyShortcuts = get("#simplifyKbs");
    if (simplifyShortcuts) {
      simplifyShortcuts.innerHTML =
        '<tbody><tr><td class="Dn"><table cellpadding="0" class="cf"><tbody><tr><th class="Do"></th><th class="Do"><div>Simplify: In list view</div></th></tr>' +
        '<tr><td class="wg Dn"><span class="wh">↓</span><span class="wb slash">/</span><span class="wh">↑</span></td><td class="we Dn">Older/newer conversation</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Cmd</span><span class="wh">r</span></td><td class="we Dn">Refresh list</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Cmd</span><span class="wh">a</span></td><td class="we Dn">Select all / none (on current page)</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Cmd</span><span class="wh">⇧</span><span class="wh">a</span></td><td class="we Dn">Select all (current page and beyond)</td></tr></tbody></table><table cellpadding="0" class="cf"><tbody><tr><th class="Do"></th><th class="Do"><div>Simplify: Between views</div></th></tr>' +
        '<tr><td class="wg Dn"><span class="wh">⏎</span></td><td class="we Dn">Drill in (open message → focus message → reply)</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh escKey">Esc</span></td><td class="we Dn">Drill out (close reply → message → search → inbox)</td></tr></tbody></table></td><td class="Dn"><table cellpadding="0" class="cf"><tbody><tr><th class="Do"></th><th class="Do"><div>Simplify: In message view</div></th></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">d</span></td><td class="we Dn">Reverse a conversation temporarily</td></tr><tr><th class="Do"></th><th class="Do"><div>Simplify: In all views</div></th></tr>' +
        '<tr><td class="wg Dn"><span class="wh">⌫</span></td><td class="we Dn">Delete message</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Cmd</span><span class="wh">z</span></td><td class="we Dn">Undo last action</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">m</span></td><td class="we Dn">Open and focus or close navigation</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">i</span></td><td class="we Dn">Report Simplify Issue</td></tr>' +
        '<tr><td class="wg Dn"><span class="wh">Alt</span><span class="wh">s</span></td><td class="we Dn">Turn Simplify off/on</td></tr></tbody></table></td></tr></tbody>';
    }
  },

  replaceKeys() {
    // Platform specific modifier keys; Cmd maps to Ctrl for Simplify shortcuts
    let ctrlKey = is.mac ? "⌃" : "Ctl";
    let altKey = is.mac ? "⌥" : "Alt";
    let cmdKey = is.mac ? "⌘" : "Ctl";

    // Convert system buttons into symbols
    gets(".wa .wh").forEach((btn) => {
      if (btn.innerText === "<⌘>") {
        btn.innerText = cmdKey;
      } else if (btn.innerText === "<Shift>" || btn.innerText === "Shift") {
        btn.innerText = "⇧";
      } else if (btn.innerText === "<Enter>" || btn.innerText === "Enter") {
        btn.innerText = "⏎";
      } else if (btn.innerText === "<Ctrl>" || btn.innerText === "Ctrl") {
        btn.innerText = ctrlKey;
        if (!is.mac) btn.classList.add("ctlKey");
      } else if (btn.innerText === "Cmd") {
        btn.innerText = cmdKey;
        if (!is.mac) btn.classList.add("ctlKey");
      } else if (btn.innerText === "<Alt>" || btn.innerText === "Alt") {
        btn.innerText = altKey;
        if (!is.mac) btn.classList.add("altKey");
      } else if (btn.innerText === "<⌥>") {
        btn.innerText = "⌥";
      } else if (btn.innerText === "<Esc>" || btn.innerText === "Esc") {
        btn.classList.add("escKey");
        btn.innerText = "Esc";
      }
    });

    // Get rid of the plus signs
    gets(".wa .wb").forEach((symbol) => {
      if (symbol.innerText === "+") {
        symbol.classList.add("plus");
      } else if (symbol.innerText === "then") {
        symbol.innerText = "→";
        symbol.classList.add("then");
      } else if (symbol.innerText === "/") {
        symbol.classList.add("slash");
      }
    });

    // Show keyboard shortcut overlay
    get("body > .wa").setAttribute("data-simplify", "ready");
  },

  closeOverlay() {
    if (get("body > .wa[data-simplify='ready']")) {
      report("Keyboard panel closed. Remove Simplify keys.");

      // Shouldn't be needed but just to be careful in case the below
      // selector stops working. Remove this as it eneds to be set back
      // up each time the overlay is opened
      let simplifyShortcuts = get("#simplifyKbs");
      if (simplifyShortcuts) simplifyShortcuts.remove();

      // Gmail rebuilds this overlay but only after it is opened again.
      // If I don't remove this part, I clean up the old overlay that
      // then immediately gets removed the next time.
      let gmailShortcuts = get("body > .wa .aNP");
      if (gmailShortcuts) gmailShortcuts.remove();

      // Hide keyboard shortcut window until resetup
      get("body > .wa").setAttribute("data-simplify", "closed");
    }
  },
};

// Setup event listener
window.addEventListener("keydown", keyboard.onKeydown, false);



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// OBSERVERS

// Observers used to detect that Gmail has finished loading
const observers = {
  // Observer configs
  config: {
    contentOnly: {
      attributes: false,
      childList: true,
      characterData: true,
      subtree: true,
    },
    attributesOnly: {
      attributes: true,
      childList: false,
      subtree: false,
    },
    styleAttributeOnly: {
      attributes: true,
      attributeFilter: ["style"],
      attributeOldValue: true,
      childList: false,
      subtree: false,
    },
    ariaChecked: {
      attributes: true,
      attributeFilter: ["aria-checked"],
      childList: false,
      subtree: false,
    },
    ariaExpanded: {
      attributes: true,
      attributeFilter: ["aria-expanded"],
      childList: false,
      subtree: false,
    },
    ariaLabel: {
      attributes: true,
      attributeFilter: ["aria-label"],
      childList: false,
      subtree: false,
    },
    classAttributeOnly: {
      attributes: true,
      attributeFilter: ["class"],
      childList: false,
      subtree: false,
    },
    directChildrenOnly: {
      attributes: false,
      childList: true,
      subtree: false,
    },
    allChildren: {
      attributes: false,
      childList: true,
      subtree: true,
    },
    everything: {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    },
  },

  // Once the loading screen is gone, call initAfterLoaded()
  loading: {
    obs: null,
    element: null,
    tries: 0,

    start() {
      // Only try so many times
      if (this.tries > retryAttempts) {
        error("Cound't find loading screen, initializing Simplify in 5 sec");
        setTimeout(initializeSimplify, 5000);
        this.tries = 0;
        this.disconnect();
        return;
      }

      // Don't run Simplify if in Print View or View Original
      if (is.original || is.print) {
        report("Disabling Simplify in this view");
        el.html.classList.remove("simplify");
        return;
      }

      // Don't run full Simplify in pop-out view
      if (is.popout) {
        el.html.classList.add("popout");
        el.html.classList.remove("simplify", "mediumTheme", "vPane", "nPane");
        return;
      }

      this.element = get("#loading");
      if (!this.element) {
        this.tries += 1;
        setTimeout(this.start.bind(this), retryIn);
      } else {
        if (this.obs === null) {
          this.obs = new MutationObserver((mutations) => {
            if (mutations.some((m) => m.target.style.display === "none")) {
              initializeSimplify();
              this.disconnect();
            }
          });
        }

        el.html.classList.add("loading");
        this.observe();
      }
    },

    observe() {
      this.obs.observe(this.element, observers.config.styleAttributeOnly);
    },

    disconnect() {
      this.tries = 0;
      if (this.obs !== null) {
        this.obs.disconnect();
        this.obs = null;
      }
    },
  },

  // Observe style tag for changes to themes
  theme: {
    obs: null,
    element: null,
    tries: 0,

    start() {
      // Only try so many times
      if (this.tries > retryAttempts) {
        error("Cound't find theme css style tag.");
        this.tries = 0;
        this.disconnect();
        return;
      }

      // Find element to observe (style tag with theme css in it)
      [...gets("style:not([id])")]
        .filter((a) => a.textContent.includes(simplify[u].sass.themeBg))
        .forEach((a) => a.classList.add("theme"));

      this.element = get("style.theme");
      if (!this.element) {
        this.tries += 1;
        setTimeout(this.start.bind(this), retryIn);
      } else {
        if (this.obs === null) {
          this.obs = new MutationObserver(theme.detect);
        }
        this.observe();
      }
    },

    observe() {
      this.obs.observe(this.element, observers.config.directChildrenOnly);
    },

    disconnect() {
      if (this.obs !== null) {
        this.obs.disconnect();
        this.obs = null;
        this.tries = 0;
      }
    },

    restart() {
      this.disconnect();
      this.start();
    },
  },

  // Observe when Quick Settings is opened
  quickSettings: {
    obs: null,
    element: null,
    tries: 0,

    start() {
      // Only try so many times
      if (this.tries > retryAttempts) {
        this.tries = 0;
        error("Cound't find right side bar");
        return;
      }

      // TODO: use sass variable
      this.element = get(".bAw");

      if (this.element === null) {
        this.tries += 1;
        setTimeout(this.start.bind(this), retryIn);
      } else {
        if (this.obs === null) {
          this.obs = new MutationObserver(() => {
            report("Checking for quickSettings");

            // When Quick Settings is opened, div.IU is added to the DOM
            if (get(".IU", this.element) === null) {
              el.html.classList.remove("quickSettings");
            } else {
              el.html.classList.add("quickSettings");
              settings.addSimplifySettingsButton();
              appMenu.close();

              // Focus the body on any open compose moles
              gets(".aDi").forEach((composeActionBar) => {
                get(".editable", composeActionBar.closest(".iN")).focus();
              });
            }

            // Resize the reading pane if enabled
            if (simplify[u].readingPaneType === "vPane") {
              readingPane.detectSize();
            }
          });
        }

        this.element = this.element.parentElement;
        this.element.parentElement.classList.add("rightPane");
        this.observe();
      }
    },

    observe() {
      this.obs.observe(this.element, observers.config.directChildrenOnly);
    },

    disconnect() {
      if (this.obs !== null) {
        this.obs.disconnect();
        this.obs = null;
        this.tries = 0;
      }
    },
  },

  // Observe if action bar is toggled and toggle html.msgSelected
  actionBar: {
    obs: null,
    elements: null,
    tries: 0,
    obs: new MutationObserver((mutations) => {
      report("Select state changed");
      // When a message is selected, the select all checkbox state is changed
      if (
        mutations.some((m) => m.target.getAttribute("aria-checked") === "false")
      ) {
        el.html.classList.remove("msgSelected");
      } else {
        el.html.classList.add("msgSelected");
      }

      // Sometimes the action bar isn't in the right place after this change
      if (el.html.classList.contains("hPane")) readingPane.detectSize();
    }),

    start() {
      // Only try so many times
      if (this.tries > retryAttempts) {
        this.tries = 0;
        error("Cound't find action bar in list view");
        return;
      }

      // Get all the action bars (there can be multiple)
      this.elements = gets(simplify[u].sass.bar);

      // Try again if no action bars found
      if (this.elements.length === 0) {
        this.tries += 1;
        report("Didn't find action bar. Trying again...");
        setTimeout(this.start.bind(this), retryIn);
      } else {
        this.tries = 0;
        this.addSearchButton();
        this.observe();
      }
    },

    // Add minimized search button to action bar near pagination buttons
    addSearchButton() {
      if (readingPane.type === "vPane") {
        return;
      }

      if (count(".G-atb[gh='tm'] .searchMinimized") === 0) {
        let searchMinimized = make("div", { className: "searchMinimized" });
        let paginationParent, paginationPrev;

        // List
        if (is.list) {
          paginationParent = get(".G-atb[gh='tm'] .ar5 .Di");
          paginationPrev = get(".G-atb[gh='tm'] .ar5 .Di .amD");
        } else {
          // Message
          paginationParent = get(".G-atb[gh='tm'] .iG .h0");
          paginationPrev = get(".G-atb[gh='tm'] .iG .h0 .adg");
        }

        // TODO: This still doesn't work on a sectioned inbox as there are no pagination buttons
        if (paginationParent && paginationPrev) {
          paginationParent.insertBefore(searchMinimized, paginationPrev);
          gets(".searchMinimized:not(.active)").forEach((button) => {
            button.addEventListener("click", () => {
              let searchBox = get('#gb form input[name="q"]');
              if (searchBox) searchBox.focus();
            });
            button.classList.add("active");
          });
        }
      }
    },

    observe() {
      // Make sure we're observing all select boxes
      gets(".G-Ni span[role='checkbox']:not(.SOFC)").forEach((selectBox) => {
        this.obs.observe(selectBox, observers.config.ariaChecked);
        selectBox.classList.add("SOFC");
        report("Observing select checkbox now");
      });

      // Initialize select state for current view
      let checkbox = get(
        ".BltHke[role='main'] .G-Ni span[role='checkbox'], .G-atb[gh='tm'] .G-Ni span[role='checkbox']"
      );
      let checkboxUnchecked = checkbox
        ? checkbox.getAttribute("aria-checked") === "false"
        : false;

      if (!checkbox || checkboxUnchecked) {
        el.html.classList.remove("msgSelected");
      } else {
        el.html.classList.add("msgSelected");
      }
    },
  },

  // Observe body for certain things being setup (currently, just popout and moles container)
  compose: {
    el: null,
    tries: 0,

    start(all = false) {
      // Look for inline composers (this will exit if not in conversation)
      observers.inlineReply.start();

      // Setup listener on compose button
      observers.compose.listen();

      // Check for any contenteditble elements just to be safe
      compose.check();

      // Moles and popouts will get started when their parent is found by body observer
      if (all) {
        observers.moles.start();
        observers.popouts.start();
      }
    },

    // Add click listener on compose button -> check for new moles & popouts
    listen() {
      if (this.tries > retryAttemptsFew) {
        report("Cound't find compose button", this.el);
        this.tries = 0;
        return;
      }

      this.el = get(simplify[u].sass.composeButton);

      if (!this.el) {
        this.tries += 1;
        report("Didn't find compose button. Try #", this.tries);
        setTimeout(this.observe.bind(this), 500);
      } else {
        this.el.addEventListener("click", () => {
          observers.moles.start();
          observers.popouts.start();
        });
        this.tries = 0;
      }
    },
  },

  // Observe for popouts being opened / closed
  popouts: {
    el: null,
    tries: 0,
    obs: null,

    start() {
      // Only try to find the element to observe so many times
      if (this.tries > retryAttemptsFew) {
        report("Cound't find popout", this.el);
        this.tries = 0;
        return;
      }

      // Get the compose containers
      this.el = get(simplify[u].sass.composePopout);

      // Try again if no compose container found
      if (!this.el) {
        this.tries += 1;
        report("Didn't find popouts. Try #", this.tries);
        setTimeout(this.start.bind(this), 500);
      } else {
        if (this.obs === null) {
          this.obs = new MutationObserver(compose.molePopMutations);
        }

        this.obs.observe(this.el, observers.config.directChildrenOnly);

        // Run now in case mole was just added -- not sure this is needed
        setTimeout(compose.molePopMutations, tryIn);

        // Reset setup
        this.tries = 0;
      }
    },
  },

  // Observe for moles being opened / closed
  moles: {
    el: null,
    tries: 0,
    obs: null,

    start() {
      // Only try to find the element to observe so many times
      if (this.tries > retryAttemptsFew) {
        report("Cound't find moles", this.el);
        this.tries = 0;
        return;
      }

      // Get the compose containers
      this.el = get(simplify[u].sass.composeMoles);

      // Try again if no compose container found
      if (!this.el) {
        this.tries += 1;
        report("Didn't find moles. Try #", this.tries);
        setTimeout(this.start.bind(this), 500);
      } else {
        if (this.obs === null) {
          this.obs = new MutationObserver(compose.molePopMutations);
        }

        this.obs.observe(this.el, observers.config.directChildrenOnly);

        this.el.classList.add("SOFC");

        // Run now in case mole was just added -- not sure this is needed
        setTimeout(compose.molePopMutations, tryIn);

        // Reset setup
        this.tries = 0;
      }
    },
  },

  // Observe inline composer moles opening and for extra css in drafts
  inlineReply: {
    tries: 0,
    obsExpand: null,
    obsReply: null,

    start() {
      // Don't try to setup the inline reply observers if not in a message
      if (!hasAnyClass(["inMsg", "msgOpen"])) return;

      // Only try to find the element to observe so many times
      if (observers.inlineReply.tries > 10) {
        observers.inlineReply.tries = 0;
        report("Cound't find inline replies");
        // Should I instead add check.composers when they haven't been loaded yet?
        return;
      }

      // Get the compose containers
      let messages = gets(`${simplify[u].sass.messages} > div`);

      // Try again if no messages found
      if (messages.length === 0) {
        observers.inlineReply.tries += 1;
        setTimeout(observers.inlineReply.start, 500);
      } else {
        if (observers.inlineReply.obsExpand === null) {
          observers.inlineReply.obsExpand = new MutationObserver(
            observers.inlineReply.observeMessage
          );
        }

        // Observe changes to classname on each message
        messages.forEach((message) => {
          // This catches when a message is expanded or inserted
          observers.inlineReply.obsExpand.observe(
            message,
            observers.config.classAttributeOnly
          );
        });

        report("Observing new inline composers");

        // See if there are any composers already loaded
        observers.inlineReply.observeMessage();

        // See if there are any composers already loaded
        compose.check();

        // Reset tries
        observers.inlineReply.tries = 0;
      }
    },

    // Listen for inline replies to be inserted
    observeMessage() {
      // Are there any messages I'm not observing for new inline replies?
      report("Looking for new inline replies to monitor");

      let replies = gets(`${simplify[u].sass.composeInlineReply}:not([sofc])`);
      if (replies.length > 0) {
        if (observers.inlineReply.obsReply === null) {
          observers.inlineReply.obsReply = new MutationObserver(compose.check);
        }
        report("Found new inline replies to monitor");
        replies.forEach((reply) => {
          // Observe .ip directChildren added -> look for new composers
          observers.inlineReply.obsReply.observe(
            reply,
            observers.config.directChildrenOnly
          );
          reply.setAttribute("sofc", "true");
        });
      }
    },
  },

  // Observe if the Add-ons pane is opened or closed
  addOns: {
    // bq9 buW br3 -- remove br3 when open
    obs: null,
    element: null,
    tries: 0,

    start() {
      // Only try so many times
      if (this.tries > retryAttempts) {
        this.tries = 0;
        error("Cound't find add-ons pane");
        return;
      }

      // TODO: use sass variable $addOnsPane
      this.element = get(".bq9");

      if (this.element === null) {
        this.tries += 1;
        setTimeout(this.start.bind(this), retryIn);
      } else {
        if (this.obs === null) {
          this.obs = new MutationObserver(observers.addOns.detect);
        }

        this.detect();
        this.obs.observe(this.element, observers.config.classAttributeOnly);
      }
    },

    detect() {
      // When Add-ons is opened, .br3 is removed
      // 3rd party extensions leave .br3 and add .companion_app_sidebar_wrapper_visible
      // if (observers.addOns.element.classList.contains("br3")) {
      if (
        observers.addOns.element.classList.contains("br3") &&
        !observers.addOns.element.classList.contains(
          "companion_app_sidebar_wrapper_visible"
        )
      ) {
        el.html.classList.remove("addOnsOpen");
        local.update("addOnsOpen", false);
      } else {
        el.html.classList.add("addOnsOpen");
        local.update("addOnsOpen", true);
        appMenu.close();
      }

      // Sometimes toggling the addOns open/closed causes the action bar to get misplaced
      // TODO: I don't think I'm doing this for Copper and Hubspot and I probably need to (test w/ hPane)
      if (el.html.classList.contains("hPane")) {
        readingPane.detectSize();
      }
    },
  },

  // Observe menus, moles, and popouts being loaded into the DOM
  body: {
    obs: null,
    lastMutation: null,

    start() {
      if (this.obs === null) {
        this.obs = new MutationObserver((mutations) => {
          if (mutations.some((m) => m.addedNodes.length > 0)) {
            observers.body.scan();
          }
        });
      }

      this.obs.observe(document.body, observers.config.directChildrenOnly);

      // Scan on initial startup
      observers.body.scan();
    },

    // Scan for each of the things that are added as a direct child of <body>
    scan() {
      // Any new menus? (not doing anything here yet, so not calling)
      // observers.menus.find();

      // New moles?
      let molesTop = get(`${simplify[u].sass.composeMolesTop}:not(.SOFC)`);
      if (molesTop) {
        report("Found moles top");
        molesTop.classList.add("SOFC");
        observers.moles.start();
      }

      // New popouts?
      let popOutsTop = get(`${simplify[u].sass.composePopoutTop}:not(.SOFC)`);
      if (popOutsTop) {
        report("Found popout top");
        popOutsTop.classList.add("SOFC");
        observers.popouts.start();
      }
    },
  },

  // Find new menus and modify them as needed (set input placeholder text, add options, etc)
  // TODO: This isn't being used right now.
  menus: {
    find() {
      // Menus are usually added as empty divs with .J-M and other classes for the specific menu
      // When the menu is opened, the menu is actually set up
      // A lot of menus are removed from the DOM and added back as needed

      // let newMenus = gets('body > div[role="menu"]');
      // TODO: Use sass variables
      let newMenus = gets("body > div.J-M");

      if (newMenus.length > 0) {
        newMenus.forEach((menu) => {
          report("Menu opened", menu);

          menu.classList.add("SOFC");
          // TODO: I'm not actually observing them though for when they are opened. Most are removed from dom on closing but not all.

          if (menu.classList.contains("brx")) {
            report("Snooze menu opened", menu);
          }

          // TODO: Add placeholder text to label and move to menus
        });
        report("Found new menus", newMenus);
      }
    },
  },

  title: {
    obs: null,
    title: null,
    locked: false,

    check() {
      let currentTitle = this.title.innerText;
      this.title.innerText = currentTitle.replace(/ \(\d+\) - /i, " - ");

      // Unlock observer
      setTimeout(() => {
        observers.title.locked = false;
      }, tryIn);
    },

    start() {
      if (!preferences.hideTitleUnreadCount) return;

      if (this.obs === null) {
        this.obs = new MutationObserver(() => {
          if (!observers.title.locked) {
            // Lock observer so changing the title doesn't create an infinite loop
            observers.title.locked = true;
            observers.title.check();
          }
        });
      }
      if (!this.title) {
        this.title = get("head title");
      }
      this.obs.observe(this.title, observers.config.contentOnly);
    },

    disconnect() {
      if (this.obs !== null) {
        this.obs.disconnect();
        this.obs = null;
      }
    },
  },

  // Observe window events
  window: {
    resize() {
      report("Resize start");
      if (hasAnyClass(["vPane", "hPane"]) && !is.settings) {
        readingPane.detectSize();
      }
      report("Resize end");
    },

    click(e) {
      if (!is.simplifyOn) return;

      // Make sure there aren't any unobserved composers
      compose.check(true);

      // If clicking on a hidden email signature, show it
      if (
        e.target.getAttribute("data-smartmail") === "gmail_signature" ||
        e.target.id.search(/m_.*Signature/) >= 0
      ) {
        e.target.classList.add("show");
      }
    },

    mouseout(e) {
      // Sometimes it is useful to not have things close when the mouse leaves the window
      // if (preferences.debug) return;

      if (
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        report("The mouse has left the building");
        nav.unpeek();
        chat.unpeek();
        appMenu.close();
      }
    },
  },
};

// Start observing the loading screen right away
observers.loading.start();



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// OTHER EXTENSIONS

// Add functionality to profile button in top right
const otherExtensions = {
  passes: 0,
  waitTime: 1000,
  nextSlot: 78,

  // Third party extension app menu bar icons
  extensions: [
    {
      name: "MixMax",
      width: 47,
      ok: true,
    },
    {
      name: "Boomerang",
      width: 48,
      ok: true,
    },
    {
      name: "Streak",
      width: 90,
      ok: true,
      closest: ".inboxsdk__appButton",
    },
    {
      name: "Sortd",
      fullName: "Sortd for Gmail",
      width: 120,
      ok: false,
      closest: ".inboxsdk__appButton",
    },
    {
      name: "Gmass",
      width: 135,
      ok: true,
      parent: true,
    },
    {
      name: "Mailtrack",
      width: 60,
      ok: true,
    },
    {
      name: "PauseGmail",
      width: 45,
      ok: true,
      closest: ".inboxsdk__appButton",
    },
    {
      name: "Copper",
      fullName: "Copper CRM for Gmail",
      width: 48,
      ok: true,
    },
    {
      name: "Hubspot",
      fullName: "HubSpot Sales",
      width: 40,
      ok: true,
    },
    {
      name: "Yesware",
      fullName: "Yesware for Chrome",
      ok: false,
      width: 0,
    },
    {
      name: "Salesforce",
      fullName: "Salesforce",
      ok: false,
      width: 0,
    },
    {
      name: "Drag",
      fullName: "Drag: Organize and Share your Inbox",
      ok: false,
      width: 70,
      closest: ".inboxsdk__appButton",
    },
    {
      name: "InboxWhenReady",
      width: 0,
      ok: true,
    },
  ],

  // Look for and place any 3rd party extensions
  // Called from appMenu.init()
  check() {
    if (this.passes > 13) {
      this.passes = 0;
      return;
    }

    otherExtensions.extensions.forEach((ext, i) => {
      if (ext.found === undefined) {
        let selector = simplify[u].sass[`oe${ext.name}`];
        let element = get(selector);

        if (element !== null) {
          if (!ext.ok) {
            alerts.show(
              `<b>${ext.fullName} conflicts with Simplify 😢</b><br>For an optimal Gmail experience, disable either Simplify or ${ext.fullName}.`,
              "Manage extensions"
            );
          }

          if (ext.width > 0) {
            if (ext.parent) {
              element = element.parentNode;
            }
            if (ext.closest !== undefined) {
              element = element.closest(ext.closest);
            }

            element.setAttribute("data-simplify", "otherExtensions");
            element.setAttribute("data-ext-name", ext.name);

            // Set the right position of the element based on otherExtensions.nextSlot
            css.add(
              `html.simplify *[data-ext-name="${ext.name}"] { position: fixed; right: calc(${otherExtensions.nextSlot}px + var(--width-addOns)) !important; }`
            );

            // If any extensions were detected, we should move over the pagination so it doesn't overlap
            otherExtensions.nextSlot += ext.width;
            let rightMargin = this.nextSlot - 78;
            css.add(
              `html.simplify { --nudgePaginationOver: ${rightMargin}px; }`
            );

            // Gmass breaks Simplify, but I can fix it
            if (ext.name === "Gmass") {
              let searchBox = get("header form");
              if (searchBox) {
                searchBox.parentNode.setAttribute("data-simplify", "Gmass");
              }
            }

            // Copper breaks Simplify, but I can fix it
            else if (ext.name === "Copper") {
              el.html.classList.add("oeCopper");

              // Observe when Copper pane is opened/closed
              let copperRightPane = get(
                ".pw-shadow-host-widget.main-ember-application"
              ).shadowRoot.querySelector("#PWExtension");
              if (copperRightPane) {
                new MutationObserver(otherExtensions.isCopperOpen).observe(
                  copperRightPane,
                  observers.config.classAttributeOnly
                );
                otherExtensions.isCopperOpen();
              }
            }

            // Hubspot breaks Simplify, but I can fix it
            else if (ext.name === "Hubspot") {
              el.html.classList.add("oeHubspot");

              // Observe when Hubspot pane is opened/closed
              let hubspotRightPane = get(".sales-sidebar-container.hubspot");
              if (hubspotRightPane) {
                new MutationObserver(otherExtensions.isHubspotOpen).observe(
                  hubspotRightPane,
                  observers.config.styleAttributeOnly
                );
                otherExtensions.isHubspotOpen();
              }
            }
          }

          ext.found = true;
          report("Found a 3rd party extension", ext.name);
          el.html.classList.add("otherExtensions");
        }
      }
    });

    // Slow down the last few passes in case some extensions take a long time to load
    if (this.passes === 10) {
      this.waitTime = 2500;
    }
    this.passes += 1;
    setTimeout(otherExtensions.check.bind(this), this.waitTime);
  },

  isCopperOpen() {
    let cooperRightPane = get(
      ".pw-shadow-host-widget.main-ember-application"
    ).shadowRoot.querySelector("#PWExtension");
    if (cooperRightPane) {
      if (cooperRightPane.classList.contains("is-expanded")) {
        el.html.classList.add("addOnsOpen", "oeCopper");
      } else {
        el.html.classList.remove("addOnsOpen", "oeCopper");
      }
    }
  },

  isHubspotOpen() {
    let hubspotRightPane = get(".sales-sidebar-container.hubspot");
    if (hubspotRightPane) {
      if (hubspotRightPane.style.display !== "none") {
        el.html.classList.add("addOnsOpen", "oeHubspot");
      } else {
        el.html.classList.remove("addOnsOpen", "oeHubspot");
      }
    }
  },
};



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// APP & ACTION BARS

// Add functionality to profile button in top right
const appMenu = {
  tries: 0,
  builds: 0,
  nextSlot: 192,
  profile: null,
  closeMenu: null,

  // Gmail app menu bar buttons
  buttons: [
    {
      name: "readingPaneToggle",
      width: 54,
    },
    {
      name: "inputTools",
      width: 56,
    },
    {
      name: "offline",
      width: 44,
    },
  ],

  init() {
    // Only try so many times
    if (this.tries > retryAttempts) {
      error("Couldn't find profile button to build App Menu.");
      this.tries = 0;
      return;
    }

    this.profile = get(
      `${simplify[u].sass.accountButton}, ${simplify[u].sass.accountWrapper}`
    );

    if (!this.profile) {
      this.tries += 1;
      setTimeout(this.init.bind(this), retryIn);
      return;
    }

    // Open profile menu on hover
    this.profile.addEventListener("mouseover", () => {
      if (!is.settings) el.html.classList.add("appMenuOpen");
    });

    // Create and add button to close profile menu
    const closeAppMenu = make("div", {
      id: "closeAppMenu",
    });
    document.body.appendChild(closeAppMenu);
    get("#closeAppMenu").addEventListener("mouseover", () => {
      appMenu.close();
    });

    // Delegate accounts don't have the app switcher menu
    if (is.delegate) {
      this.nextSlot = 144;
    }

    // Initialize the position of the Chat Status Menu
    this.placeChatStatus();

    // Build the app menu (find and place all the buttons in the right place)
    this.build();

    // Look for 3rd party extensions
    otherExtensions.check();
  },

  close() {
    el.html.classList.remove("appMenuOpen");
  },

  // Correct the position of Status menu
  placeChatStatus() {
    css.add(
      `html.simplify.appMenuOpen ${simplify[u].sass.chatStatus} { right: calc(${appMenu.nextSlot}px + var(--width-addOns)) !important; }`
    );
  },

  // Build app menu (place various buttons in a row)
  build() {
    if (this.builds > 10) {
      this.builds = 0;
      return;
    }

    // Find and place Gmail icons in the app menu
    appMenu.buttons.forEach((button, i) => {
      if (button.found === undefined || !button.found) {
        let selector = simplify[u].sass[button.name];
        let element = get(selector);

        if (element !== null) {
          // Set the right position of the element based on appMenu.nextSlot
          selector.split(", ").forEach((s) => {
            css.add(
              `html.simplify ${s} { right: calc(${appMenu.nextSlot}px + var(--width-addOns)) !important; }`
            );
          });

          button.found = true;
          appMenu.nextSlot += button.width;

          // Correct position of Status menu
          appMenu.placeChatStatus();
        }
      }
    });

    // Some buttons sometimes show up well after load, keep trying for 15 seconds
    if (this.buttons.some((btn) => !btn.found)) {
      this.builds += 1;
      setTimeout(appMenu.build.bind(this), 1000);
    }
  },
};

// Initialize add ons
if (simplify[u].addOnsOpen) {
  el.html.classList.add("addOnsOpen");
}



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// NAV

const nav = {
  tries: 0,

  init() {
    // Only try so many times
    if (this.tries > retryAttempts) {
      error("Simplify > nav.init() > Cound't find menu button or nav");
      this.tries = 0;
      return;
    }

    el.menuButton = getEl("menuButton");
    el.nav = get(simplify[u].sass.nav);

    if (!el.menuButton || !el.nav) {
      this.tries += 1;
      setTimeout(this.init.bind(this), retryIn);
    } else {
      el.nav = get(simplify[u].sass.nav);

      // Start nav observer
      observers.nav.observe();

      // Init hovering over the menu button to peek the nav
      el.menuButton.addEventListener("mouseover", nav.peek);

      // Init nav state
      this.detect(false);

      // Look for new Gmail Nav
      // TODO: use sass variable and get a better selector for this (all sections but the last)
      let newNavSections = gets(simplify[u].sass.chatNew + ":not(.adZ) .XS");
      if (newNavSections.length > 0) {
        report("Found new Gmail nav, adding event listeners");
        el.html.classList.add("newUI");

        // This was for click-to-focus sections in the new Gmail nav
        // newNavSections.forEach((section) => {
        //   section.addEventListener("click", (e) => {
        //     let alreadyFocused = e.target
        //       .closest(".Xa")
        //       ?.classList.contains("sectionFocused");

        //     // Remove .sectionFocused from whereever it is
        //     get(".sectionFocused")?.classList.remove("sectionFocused");

        //     if (alreadyFocused) {
        //       // Add .sectionFocused to section being hovered
        //       e.target.closest(".Xa")?.classList.remove("sectionFocused");
        //     } else {
        //       // Add .sectionFocused to section being hovered
        //       e.target.closest(".Xa")?.classList.add("sectionFocused");
        //     }
        //   });
        // });

        // // Focus mail by default on load
        // newNavSections[0].closest(".Xa").classList.add("sectionFocused");
      }

      // Create div for closing unpeeking nav
      document.body.appendChild(make("div", { id: "closeNavPeek" }));
      get("#closeNavPeek").addEventListener("mouseover", nav.unpeek);

      // Add missing sections
      this.addCategories();
    }
  },

  toggle(event) {
    if (el.menuButton.getAttribute("aria-expanded") === "false") {
      report("Nav is open, lets close it");
      nav.close();
    } else {
      report("Nav is closed, lets open it");
      nav.open();
    }
  },

  detect(peek = true) {
    if (
      el.menuButton.getAttribute("aria-expanded") === "true" ||
      (el.menuButton.getAttribute("aria-expanded") === null &&
        simplify[u].navOpen)
    ) {
      report("Nav is open");
      nav.open();
    } else {
      report("Nav is closed");
      nav.close(peek);

      if (el.menuButton.getAttribute("aria-expanded") === null) {
        error("Nav state was null");
      }
    }
  },

  open() {
    el.html.classList.add("navOpen");
    local.update("navOpen", true);

    // Update the size of the reading pane if enabled
    // simplify[u].readingPaneType === "vPane"
    if (hasAnyClass(["vPane", "hPane"])) {
      readingPane.detectSize();
    }
  },

  close(peek = true) {
    el.html.classList.remove("navOpen");
    local.update("navOpen", false);

    // Don't peek nav when closing as part of initialization
    if (peek) {
      el.html.classList.add("navPeek");
    }

    // Update the size of the reading pane if enabled
    if (hasAnyClass(["vPane", "hPane"])) {
      readingPane.detectSize();
    }
  },

  peek() {
    if (
      is.simplifyOn &&
      !el.html.classList.contains("navOpen") &&
      !el.html.classList.contains("navPeek")
    ) {
      report("Hover over menu button");
      el.html.classList.add("navPeek");
      el.nav.classList.add("bym");
    }
  },

  unpeek() {
    report("Mouse out menu button or out of window. Unpeek nav.");
    // TODO: Remove? I added this for the window.mouseleave but I don't think I need it
    // if (
    //   el.html.classList.contains("navPeek") &&
    //   !el.html.classList.contains("navOpen")
    // ) {
    el.html.classList.remove("navPeek");
    el.nav.classList.remove("bym");
    if (is.msg && simplify[u].navOpen) {
      el.html.classList.add("navOpen");
      el.nav.classList.remove("bhZ");
    }
    // }
  },

  addCategories() {
    // Don't add categories if setting is disabled
    if (!preferences.addCategories || !is.simplifyOn) return;

    // Don't add the categories if they have already been added
    if (get(".aim[data-category]")) return;

    // let categoryLink = get('.byl a[href*="#category/"]');
    // let categoryItem = categoryLink?.closest(".aim");
    // let categoryGroup = categoryLink
    //   ? categoryLink.closest(".TK")
    //   : get(
    //       '.byl.aJZ.a0L:not(.TA) > .TK > .aim:first-child:last-child div[role="link"]'
    //     )?.closest(".TK");

    let categoryLink = get('.byl a[href*="#category/"]');
    let categoryItem = null;
    let categoryGroup = null;
    if (categoryLink) {
      categoryItem = categoryLink.closest(".aim");
      categoryGroup = categoryLink.closest(".TK");
    } else {
      categoryGroup = get(
        '.byl.aJZ.a0L:not(.TA) > .TK > .aim:first-child:last-child div[role="link"]'
      );
      if (categoryGroup) {
        categoryGroup = categoryGroup.closest(".TK");
      }
    }

    // Setup observer on categories expander
    if (categoryGroup) {
      new MutationObserver(nav.addCategories).observe(
        categoryGroup,
        observers.config.directChildrenOnly
      );
    }

    // If none of the categories are visible, I can't set them up
    if (!categoryLink) {
      // Setup observer on More labels (.HwgYue) being shown/hidden
      let moreNav = get(".wT .HwgYue");
      if (moreNav) {
        new MutationObserver(nav.addCategories).observe(
          moreNav,
          observers.config.styleAttributeOnly
        );
      }
      return;
    }

    // Add three new categories
    Object.keys(categories).forEach((key) => {
      let newCategory = categoryItem.cloneNode(true);
      newCategory.setAttribute("data-category", key);
      newCategory.addEventListener("click", (e) => {
        location.hash = categories[key];

        // Give item a selected background color
        let activeNavItem = e.target.closest(".TO");
        if (activeNavItem) activeNavItem.classList.add("nZ", "aiq");

        // We need to check the category highlights until we're not on an added category again
        check.categories = true;
      });
      categoryGroup.appendChild(newCategory);

      // Update name
      let newLink = get(`.aim[data-category='${key}'] a`);
      newLink.innerText = key;
      newLink.href = categories[key];

      // Update tool tip
      let newLinkWrapper = get(`.aim[data-category='${key}'] .TO`);
      if (newLinkWrapper) newLinkWrapper.setAttribute("data-tooltip", key);
    });

    // Remove special category color
    gets(".aim[data-category] .TO").forEach((item) => {
      item.classList.remove("aS3", "aS4", "aS5", "aS6");
    });

    // Remove bold
    // gets(".aim[data-category] span.nU.n1").forEach((item) => {
    //   item.classList.remove("n1");
    // });
  },
};

observers.nav = {
  obs: new MutationObserver(nav.detect),

  observe() {
    if (el.menuButton) {
      this.obs.observe(el.menuButton, observers.config.ariaExpanded);
    }
  },
};



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// LISTS

const lists = {
  scanTries: 0,
  zeroTries: 0,
  calls: 0,
  scanning: false,

  init() {
    // Initialize the month2 name
    let monthIndex = dates.month < 2 ? dates.month + 10 : dates.month - 2;

    // TODO: Use sass variables
    if (monthNamesAll[lang] !== undefined) {
      css.add(
        `html.simplify.dateGroup .ae4 tr[date="month2"]::before { content: '${monthNames[monthIndex]}' !important; }`
      );
    }
    this.scan();
  },

  // This is called every time the view changes
  scan() {
    if (!is.list || !is.simplifyOn) {
      return;
    }

    // Only try to find the element to observe so many times
    if (lists.scanTries > retryAttemptsFew) {
      lists.scanTries = 0;
      report("Cound't find any new lists");
      return;
    }

    // Find ALL lists that aren't ads
    const allLists = gets(simplify[u].sass.allLists);

    if (allLists.length === 0) {
      report("Didn't find any lists. Will scan again.");
      lists.scanTries += 1;
      setTimeout(lists.scan, 200);
    } else {
      report("Scanning found lists after N tries:", lists.scanTries);

      // Check for ads
      lists.checkForAds();

      // checkInboxZero
      lists.checkInboxZero();

      // Group threads by date
      lists.groupByDate();

      // Observe lists
      lists.observeLists();

      // Bundle threads by label
      // lists.bundle();

      // Re-setup minimized search button
      // TODO: Is there a better place to put this?
      observers.actionBar.addSearchButton();

      // TODO: Rescan for reading pane toggles? (switching inbox types creates a new button)
      readingPane.findToggle(true);

      // Reset counter
      lists.scanTries = 0;
    }
  },

  observeLists() {
    // Find lists not already being observed
    // const unobservedLists = gets(`${simplify[u].sass.allLists}:not(.SOFC)`);

    gets(simplify[u].sass.scanListsUnobserved).forEach((list) => {
      observers.lists.observe(list);
    });
  },

  checkForAds() {
    // Ads are only in the Tabbed Inbox
    if (is.inbox && is.tabbedInbox) {
      // Get the lists we haven't checked yet
      const uncheckedLists = gets(
        `${simplify[u].sass.currentList} tbody:not(:empty)`
      );

      // Check each list
      uncheckedLists.forEach((list) => {
        if (
          count(
            `${simplify[u].sass.msgAdLabel}, ${simplify[u].sass.msgAdAria}`,
            list
          ) >= 1
        ) {
          list.closest(".Cp").classList.add("adverts");
          report("New ads found.");
          return;
        }
      });
    }
  },

  // TODO: If you're using multiple inboxes, this doesn't work as
  // messages can be outside of the inbox
  checkInboxZero() {
    if (!is.inbox) {
      el.html.classList.remove("inboxZero");
      return;
    }

    let threadCount = count(`${simplify[u].sass.currentList} tr.zA`);

    // TODO: Use sass variables
    if (threadCount > 0) {
      el.html.classList.remove("inboxZero");
    } else if (count("div[role='main'] .ae4.iR") > 0) {
      report("Inbox section collapsed, can't test for inbox zero");
      el.html.classList.remove("inboxZero");
    } else if (count(`${simplify[u].sass.currentList} tr.zA`) === 0) {
      report("Inbox zero!");
      el.html.classList.add("inboxZero");
    } else {
      report("NOT Inbox zero");
      el.html.classList.remove("inboxZero");
    }
  },

  groupByDate() {
    // Skip if date grouping is disabled in preferences or language not supported
    if (!preferences.dateGroup || monthNamesAll[lang] === undefined) return;

    // Skip if already grouped and dates are not stale
    let anyThreads = count(simplify[u].sass.scanAllEmails) > 0;
    let allThreadsGrouped = count(simplify[u].sass.scanNotGroupedEmails) === 0;
    if (anyThreads && allThreadsGrouped && !dates.update()) return;

    // Get all the lists in the current view
    const emailLists = gets(simplify[u].sass.currentListToGroup);

    emailLists.forEach((list) => {
      this.calls += 1;
      report("Group this list", this.calls, list);

      // Initialize variables as date and group from last non-snoozed item in list
      let notSnoozed = gets(".byZ:empty ~ .xW > span", list);
      let lastDate =
        notSnoozed.length > 0
          ? dates.parse(Array.from(notSnoozed).slice(-1)[0].title, lang)
          : dates.today;

      let currentGroup = this.getDateGroup(lastDate);

      const threads = gets(".zA", list) || [];

      Array.from(threads)
        .slice()
        .reverse()
        .forEach((thread) => {
          // Skip snoozed emails (the date they have is not the basis on their position in the list)
          if (get(".byZ > div", thread)) {
            thread.setAttribute("date", currentGroup);
            return;
          }

          let dateSpan = get(".xW > span", thread);
          if (!dateSpan) {
            report("Date grouping: thread had no date", thread);
            thread.setAttribute("date", currentGroup);
            return;
          }

          // Extract date from thread
          // let threadDate = new Date(dateSpan.title);
          let threadDate = dates.parse(dateSpan.title, lang);

          // If threadDate is earlier than previous item, use currentGroup (this was a snoozed item)
          if (threadDate < lastDate) {
            thread.setAttribute("date", currentGroup);
            return;
          }

          currentGroup = this.getDateGroup(threadDate);
          lastDate = threadDate;
          thread.setAttribute("date", currentGroup);
        });
    });
  },

  getDateGroup(date) {
    if (date > dates.today) {
      return "today";
    } else if (date >= dates.yesterday) {
      return "yesterday";
    } else if (date >= dates.lastMon) {
      return "week";
    } else if (date >= dates.prevMonth[0]) {
      return "month0";
    } else if (date >= dates.prevMonth[1]) {
      return "month1";
    } else if (date >= dates.prevMonth[2]) {
      return "month2";
    } else if (date < dates.prevMonth[2]) {
      return "earlier";
    } else {
      error("getDateGroup couldn't compare date", date);
      return "today";
    }
  },

  selectThread(thread, override = false) {
    // Do not select thread if other threads are already selected (unless override is true)
    if (
      !override &&
      count(
        `${simplify[u].sass.currentList} tr.zA div[role="checkbox"][aria-checked="true"]`
      ) > 0
    ) {
      report("Something is already selected, not selecting thread");
      return false;
    }

    // if thread not given, initialize to being the active thread
    let toSelect = thread
      ? thread
      : get(
          `${simplify[u].sass.currentList} tr.btb:not(.aps) div[role="checkbox"][aria-checked="false"]`
        );
    if (toSelect) {
      clickOn(toSelect);
      return true;
    } else {
      return false;
    }
  },

  // Unselect first selected thread
  unSelectThread() {
    // if thread not given, initialize to being the active thread
    let selectedThread = get(
      `${simplify[u].sass.currentList} tr.btb div[role="checkbox"][aria-checked="true"]`
    );
    if (selectedThread) {
      clickOn(selectedThread);
      return true;
    } else {
      return false;
    }
  },

  bundle() {
    // Only bundle items in the inbox?
    if (!is.inbox) {
      return;
    }

    const emailLists = gets(simplify[u].sass.currentList);

    emailLists.forEach((list) => {
      report("Bundle this list", list);
      let labels = [];

      // Get labels
      gets(".at", list).forEach((label) => labels.push(label.title));

      // Get unique set of labels
      let uniqueLabels = [...new Set(labels)];

      // For each unique label, bundle if more than one in list
      uniqueLabels.forEach((label) => {
        let count = labels.filter((l) => l === label).length;
        if (count > 1) {
          console.log("Bundle: more than one item with label", label);
          css.add(
            `html.simplify.dateGroup.inInbox:not(.inboxy) .zA[labels*='${label}'] ~ .zA[labels*='${label}'] { display:none; }`
          );
          css.add(
            `html.simplify.dateGroup:not(.inInbox) .zA[labels*='${label}'] ~ .zA[labels*='${label}'] { display:none; }`
          );
        }
      });

      // Add label as className on every thread
      const threads = gets(".zA", list) || [];
      threads.forEach((thread) => {
        // Get labels and add as classes on thread
        let labelList = "";
        gets(".at", thread).forEach((label) => {
          labelList += label.title + ", ";
        });
        thread.setAttribute("labels", labelList);
      });
    });
  },

  // TODO: Gmail appears to have fixed this bug so it is no longer need
  // Only place this is called from (initializeSimplify), call is commented out
  checkSections() {
    // Are all the sections collapsed on load time?
    // This causes a Gmail issue where the actions are shown
    // TODO: Use sass variables
    report("Checking inbox sections now");
    if (
      count("div[gh='tl'] .iR") > 0 &&
      count("div[gh='tl'] .ae4") === count("div[gh='tl'] .iR")
    ) {
      report("Gmail loaded with all sections collapsed");

      // Get first collapsed section
      let section = get('div[gh="tl"] .iR .Wn');

      // Open it
      clickOn(section);

      // Close it again
      clickOn(section);

      // Rescan for the action bar as the select checkbox is only setup after the sections are toggled
      observers.actionBar.start();
    }

    // Don't need to check this again
    check.inboxSections = false;
  },
};

// Observe list for changes to scan for ads, inbox zero, grouping and more
observers.lists = {
  obs: new MutationObserver(lists.scan),

  observe(list) {
    if (list) {
      this.obs.observe(list, observers.config.directChildrenOnly);
      list.classList.add("SOFC");
      report("Now observing", list);
    } else {
      error("No list provided to list observer");
    }
  },
};



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// CONVERSATION

const conversation = {
  tries: 0,

  scan() {
    conversation.hasHtmlEmail();
    conversation.initTrackerBadge();
    // conversation.initReaderMode();
  },

  hasHtmlEmail() {
    // Only check if it is an HTML email if user is using Dark Theme
    if (simplify[u].theme !== "darkTheme") return;

    // If set to not invert any message, flag all emails as htmlEmail
    // (I don't invert emails flagged as htmlEmail)
    if (preferences.invertMessages === "none") {
      el.html.classList.add("htmlEmail");
      return;
    }

    // If set to invert all messages, don't flag any email as htmlEmail
    else if (preferences.invertMessages === "all") {
      el.html.classList.remove("htmlEmail");
      conversation.tagLightBgs();
      return;
    }

    // This seems to work most the time but also catches some messages that don't need to be inverted
    const thisThread =
      'div.nH[role="main"]:not([style*="none"]) .ads:not([style*="none"]) .a3s:not(.undefined)';
    const isHtmlEmail =
      count(
        `${thisThread} iframe, ${thisThread} > u:first-child, ${thisThread} > .adM:first-child, ${thisThread} > .adM + u, ${thisThread} *[style*="background-color"]:not([style*="background-color:rgba(255,255,255,0)"]):not([style*="background-color:rgb(255,255,255)"]):not([style*="background-color: rgb(255,255,255)"]):not([style*="background-color:white"]):not([style*="background-color:#fff"]):not([style*="background-color: #fff"])`
      ) > 0;

    let textOrHtml = "";

    if (isHtmlEmail) {
      el.html.classList.add("htmlEmail");
      textOrHtml = "HTML email with this many <u>'s, .adM's, bg-color:";
    } else {
      el.html.classList.remove("htmlEmail");
      textOrHtml = "Text email with this many <u>'s, .adM's, bg-color:";
    }

    // report(
    //   textOrHtml,
    //   count(`${thisThread} > .adM:first-child`),
    //   count(`${thisThread} > u:first-child`),
    // );
  },

  initReaderMode() {
    // Get .ade > .hk:first-child and insertBefore readerMode
    // html.simplify.readerMode { // Hide everything and zoom .a3s }
  },

  initTrackerDetails() {
    // Insert tracker details
    let trackerDetails = make(
      "div",
      { id: "trackerDetails" },
      make(
        "div",
        {},
        make(
          "b",
          {},
          "Simplify protected your privacy by blocking a tracker in this message."
        ),
        make(
          "p",
          {},
          "Email trackers can track if you opened the email, when you opened it, where you were located, and what device you were using (phone or computer). Some or all of this data could have been reported back to the sender."
        ),
        make(
          "p",
          {},
          "Simplify considers this an invasion of your privacy and blocks email trackers from gathering and reporting this information. You can read, reply, and forward this email without worrying about being tracked."
        )
      )
    );
    document.body.appendChild(trackerDetails);
    get("#trackerDetails").addEventListener("click", () => {
      get("#trackerDetails").classList.remove("show");
    });
  },

  initTrackerBadge() {
    // Insert tracker badge before every star button on each message
    let stars = gets('.bAk .bi4[role="checkbox"]:not(.tbSetup)');
    stars.forEach((star) => {
      star.parentNode.insertBefore(
        make("div", { className: "trackerBadge" }),
        star
      );

      // Mark star so I don't add another tracker badge later
      star.classList.add("tbSetup");
    });
    gets(".trackerBadge").forEach((badge) =>
      badge.addEventListener("click", (event) => {
        get("#trackerDetails").classList.add("show");
        event.preventDefault();
        event.stopPropagation();
      })
    );
  },

  // Find elements with a background lighter than #eee and tag it so I
  // can make it match the darkTheme background (#111) when inverted
  tagLightBgs() {
    // TODO use sass variable for .a3s (message wrapper)
    let sel = ".a3s:not(.undefined) *[style*='background";

    // prettier-ignore
    gets(
      sel + ":rgb(255']," +
      sel + ": rgb(255']," +
      sel + "-color:rgb(255']," +
      sel + "-color: rgb(255']," +
      sel + ":#f']," +
      sel + ": #f']," +
      sel + "-color:#f']," +
      sel + "-color: #f']," + 
      sel + ":white']," +
      sel + ": white']," +
      sel + "-color:white']," +
      sel + "-color: white']," +
      ".a3s:not(.undefined) *[bgcolor*='#fff']"
    ).forEach((elem) => {
      if (elem.style.backgroundColor === "white") {
        elem.classList.add("simplifyEeeBg");
      } else if (elem.bgColor) {
        if (elem.bgColor.toLowerCase() === "#fff" || elem.bgColor.toLowerCase() === "#ffffff") {
          elem.classList.add("simplifyEeeBg");
        }
      } else {
        let [, r, g, b] = elem.style.backgroundColor.match(
          /rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)/
        );
        if (r && g && b) {
          if (r === g && g === b && r > 238) {
            elem.classList.add("simplifyEeeBg");
          }
        }  
      }
    });
  },
};



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// SEARCH

const search = {
  form: null,
  input: null,
  tries: 0,

  init() {
    // Only try so many times
    if (this.tries > retryAttempts) {
      error("Cound't find search form or input.");
      this.tries = 0;
      return;
    }

    this.form = get('#gb form[role="search"]');
    this.input = get('#gb form input[name="q"]');

    if (!this.input || !this.form) {
      this.tries += 1;
      setTimeout(this.init.bind(this), retryIn);
    } else {
      // Return to previous view if you clear the search
      el.closeSearch.addEventListener("mousedown", () => {
        report("Clicked on clear search");
        if (is.search || is.label) {
          // v1?
          event.stopPropagation();
          // document.body.focus();

          // v2
          // location.hash = close.search;

          // v3 TODO: clean this all up
          search.exit();
          return;
        }
      });

      // Handle focusing the search input
      this.input.addEventListener("focus", (e) => {
        // TODO: test if the close button was clicked?
        /* This delays adding focus too much
        if (is.list && e.relatedTarget?.search(/closeSearch/) >= 0) {
          report("Search focused", e.relatedTarget);
          this.blur();
          return;
        }
        */

        el.html.classList.add("searchFocused");
        search.form.classList.add("focused");

        // Select the search if we're in a message
        if (is.msg) {
          search.input.selectionStart = 0;
          search.input.selectionEnd = 10000;
        }
      });

      // Handle bluring focus from the search input
      this.input.addEventListener("blur", (e) => {
        report("Blur focus from search", e, is.search);
        setTimeout(search.close, retryIn);
      });

      // Add starred only toggle if not added
      // let starToggle = make("button", { id: "starToggle" }, make("span", {}));
      // this.form.insertBefore(starToggle, el.closeSearch);
      // get("#starToggle").addEventListener("click", (e) => {
      //   report(e, this);

      //   // get("#starToggle").classList.toggle("on");
      //   e.target.closest("#starToggle").classList.toggle("on");
      // });
    }
  },

  close() {
    if (document.activeElement.name !== "q") {
      el.html.classList.remove("searchFocused");
      search.form.classList.remove("focused");
    }
  },

  exit() {
    const inboxLink = get(simplify[u].sass.inboxLink);
    if (inboxLink) {
      clickOn(inboxLink);
    } else {
      location.hash = close.search;
    }

    // Requires a delay before bluring focus
    setTimeout(() => {
      search.input.blur();
      report("Remove focus from search");
    }, retryIn);
  },
};



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// COMPOSE

const compose = {
  checkTries: 0,
  obsFormatting: null,
  obsMinimize: null,

  formattingCases: {
    fontSizeRem: 'div.SOFC[contenteditable] *[style*="87499"]',
    fontSizePx: 'div.SOFC[contenteditable] *[style*="13.9998"]',
    gDocsWrap: 'div.SOFC[contenteditable] *[dir="ltr"] span[style*="pre-wrap"]',
    darkThemeBg: 'div.SOFC[contenteditable] *[style*="rgb(17, 17, 17);"]',
    lightThemeBg:
      'div.SOFC[contenteditable] *[style*="rgb(34, 34, 34)"][style*="rgb(255, 255, 255);"]',
    safariFont:
      'div.SOFC[contenteditable] *[style*="font-family: -webkit-standard;"]',
    bullets: 'div.SOFC[contenteditable] li:not([style*="0.6001"])',
    tracker: "div.SOFC[contenteditable] .gmail_quote .emailTracker",
  },

  // This is only called when a node is added to an observed content editable div
  checkFormatting() {
    if (!is.simplifyOn) return;

    // Cancel early if none of the cases are found
    if (count(Object.values(compose.formattingCases).toString()) === 0) {
      return;
    }

    // Remove inline styles for Simplify's font size adjustment
    // TODO: Use a regex here maybe in case other browsers round this number differently
    gets(compose.formattingCases.fontSizeRem).forEach((styledEl) => {
      report("Found a styled element", styledEl);
      let newStyle = styledEl
        .getAttribute("style")
        .replace(/font-size:\s?0.87499\s?rem;?\s?/, "");
      styledEl.setAttribute("style", newStyle);
    });
    gets(compose.formattingCases.fontSizePx).forEach((styledEl) => {
      report("Found a styled element", styledEl);
      let newStyle = styledEl
        .getAttribute("style")
        .replace(/font-size:\s?13.9998\s?px;?\s?/, "");
      styledEl.setAttribute("style", newStyle);
    });

    // Remove white-space:no-wrap from Google Docs pasted copy
    gets(compose.formattingCases.gDocsWrap).forEach((styledEl) => {
      report("Found a pre-wrap GDocs element", styledEl);
      let newStyle = styledEl
        .getAttribute("style")
        .replace(/white-space:\s?pre-wrap;?/, "");
      styledEl.setAttribute("style", newStyle);
    });

    // Remove background styling from dark mode (#111 bg + any font color)
    gets(compose.formattingCases.darkThemeBg).forEach((styledEl) => {
      report("Found dark theme styling applied in compose", styledEl);
      let newStyle = styledEl
        .getAttribute("style")
        .replace(/(\s|;|^)color:\s?rgb\((\d{1,3},?\s?){3}\);?/g, ";")
        .replace("background-color: rgb(17, 17, 17);", "");
      styledEl.setAttribute("style", newStyle);
    });

    // Remove background styling from normal theme
    gets(compose.formattingCases.lightThemeBg).forEach((styledEl) => {
      report("Found light theme styling applied in compose", styledEl);
      let newStyle = styledEl
        .getAttribute("style")
        .replace("color: rgb(34, 34, 34);", "")
        .replace("background-color: rgb(255, 255, 255);", "");
      styledEl.setAttribute("style", newStyle);
    });

    // Remove Safari's extra styles added
    if (is.safari) {
      gets(compose.formattingCases.safariFont).forEach((styledEl) => {
        report("Found Safari-added styles", styledEl);
        let newStyle = styledEl
          .getAttribute("style")
          .replace(/font-family:\s?-webkit-standard;?\s?/, "")
          .replace(/font-size:\s?medium;?\s?/, "")
          .replace(/caret-color:\s?rgb\([0, ]*\);?\s?/, "")
          .replace(/color:\s?rgb\([0, ]*\);?\s?/, "");
        styledEl.setAttribute("style", newStyle);
      });
    }

    // Add space between bullets
    gets(compose.formattingCases.bullets).forEach((bullet) => {
      const currentStyle = bullet.getAttribute("style") || "";
      bullet.setAttribute("style", "padding-bottom:0.6001em; " + currentStyle);
    });

    // Remove any trackers from quoted text (when replying or forwarding an email that had a tracker)
    gets(compose.formattingCases.tracker).forEach((tracker) => {
      tracker.parentElement.removeChild(tracker);
    });
  },

  check(singleCheck = false) {
    if (is.settings) return;

    if (compose.checkTries > 4) {
      report("Cound't find any new composers");
      compose.checkTries = 0;
      return;
    }

    let newComposers = gets("div[contenteditable]:not(.SOFC)");
    if (newComposers.length === 0) {
      if (!singleCheck) {
        compose.checkTries += 1;
        setTimeout(compose.check, 500);
      }
    } else {
      report("Found new composers", newComposers);
      compose.checkTries = 0;

      if (compose.obsFormatting === null) {
        // compose.obsFormatting = new MutationObserver(compose.checkFormatting);
        compose.obsFormatting = new MutationObserver((mutations) => {
          if (mutations.some((m) => m.addedNodes.length > 0)) {
            compose.checkFormatting();
          }
        });
      }

      newComposers.forEach((composeBody) => {
        // Add mutation observer to listen for new nodes being added to
        // composer so we can check them for bad formatting
        compose.obsFormatting.observe(
          composeBody,
          observers.config.allChildren
        );
        composeBody.classList.add("SOFC");

        // If promoting formatting buttons enabled, close formatting bar parent as it causes page to scroll while typing
        if (preferences.composeFormat && is.simplifyOn) {
          // Slight delay so it can be created
          setTimeout(compose.closeFormattingBar, tryIn);
        }

        // Add compose expand button if preference enabled
        if (preferences.composeActions) {
          let showComposeActions = make("div", {
            className: "showComposeActions",
          });

          // TODO use sass variables
          let composeActionBar = get(".bAK", composeBody.closest(".iN"));
          if (composeActionBar) {
            composeActionBar = composeActionBar.parentNode;
          }

          report("Adding compose actions expander", composeActionBar);
          if (composeActionBar) {
            composeActionBar.appendChild(showComposeActions);
            gets(".bAK ~ .showComposeActions:not(.active)").forEach(
              (button) => {
                button.addEventListener("click", (event) => {
                  event.target.closest(".iN").classList.toggle("showActions");
                });
                button.classList.add("active");
              }
            );
          }
        }
      });
    }
  },

  closeFormattingBar() {
    // TODO: use sass variables
    let formattingMenuButton = get('.oc.gU div[role="button"]');
    if (formattingMenuButton) {
      if (formattingMenuButton.getAttribute("aria-pressed") === "true") {
        clickOn(formattingMenuButton);
      }
    }
  },

  molePopMutations(mutations) {
    report("Checking for new composers...");

    // Check if moles are open
    compose.anyOpenMoles();

    // If node was added, setup new moles
    if (!mutations || mutations.some((m) => m.addedNodes.length > 0)) {
      // Look for new content editable divs and watch for formatting issues
      compose.check();

      if (compose.obsMinimize === null) {
        compose.obsMinimize = new MutationObserver(compose.anyOpenMoles);
      }

      // Monitor mole minimize state
      let buttons = gets(`${simplify[u].sass.composeMinimize}:not([sofc])`);
      if (buttons.length > 0) {
        buttons.forEach((minimizeButton) => {
          compose.obsMinimize.observe(
            minimizeButton,
            observers.config.ariaLabel
          );
          minimizeButton.setAttribute("sofc", "true");
        });
      }
    }
  },

  anyOpenMoles() {
    report("Checking to see if mole is open");
    if (count(simplify[u].sass.composeMoleOpen) > 0) {
      el.html.classList.add("openMole");
    } else {
      el.html.classList.remove("openMole");
    }
  },
};



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// GMAIL THEMES

// Detect if a dark, light, or medium theme is being used and change styles accordingly
const theme = {
  colorTest: null,
  background: null,
  densityTest: null,
  detectCount: 0,

  detectColor() {
    this.colorTest = get("#gbwa path");
    if (!this.colorTest) {
      error("Coundn't test theme - app switcher not loaded yet.");
      return;
    }

    const isLightTheme = getStyle(this.colorTest, "color").search(/255/) === -1;

    // Check if light theme (we can test in any view)
    if (isLightTheme) {
      el.html.classList.add("lightTheme");
      el.html.classList.remove("mediumTheme", "darkTheme", "defaultTheme");
      local.update("theme", "lightTheme");
      report("Theme: detected light theme");
      check.theme = false;

      // Is this the default white theme?
      this.background = get(simplify[u].sass.themeBg);
      if (this.background) {
        const isWhiteTheme =
          getStyle(this.background, "background-color").search(/255/) >= 0;
        if (isWhiteTheme) {
          local.update("theme", "defaultTheme");
          el.html.classList.add("defaultTheme");
        }
      } else {
        // check.theme = true;
        report("Theme layer not loaded yet or themes disabled?");

        // TODO: I'm going to assume themes are disabled in this case for now
        // to address https://github.com/leggett/simplify/issues/409
        local.update("theme", "defaultTheme");
        el.html.classList.add("defaultTheme");
      }
    } else {
      // TODO: There is an edge case bug where somehow the cached theme is wrong and the
      // initial load is in a tabbed inbox with the first tab being empty so you can't test
      // Would probably fix it to check the theme on switching tabs but it feels over kill
      el.html.classList.remove(
        "defaultTheme",
        "lightTheme",
        "mediumTheme",
        "darkTheme"
      );
      el.html.classList.add(simplify[u].theme);
      report("Theme is dark or medium, will check later when in a list");
      check.theme = true;
    }

    // Detect background color
    // TODO: This is flawed as I initialize the background as the cached
    // color making it impossible to detect any updates
    let themeBgColor = getStyle("themeBg", "background-color");
    if (themeBgColor) local.update("themeBgColor", themeBgColor);

    // Detect background image (can be a css background or an img tag)
    let themeBgImgUrl = getStyle("themeBgImg", "background-image");
    let themeBgImgPos = getStyle("themeBgImg", "background-position");
    if (!themeBgImgUrl || themeBgImgUrl === "none") {
      themeBgImgUrl = get(".a4t img");
      themeBgImgUrl = themeBgImgUrl ? themeBgImgUrl.src : false;
      if (themeBgImgUrl) {
        themeBgImgUrl = `url("${themeBgImgUrl}")`;
        themeBgImgPos = "top";
      } else {
        themeBgImgUrl = "none";
        themeBgImgPos = "";
      }
    }
    local.update("themeBgImgUrl", themeBgImgUrl);
    local.update("themeBgImgPos", themeBgImgPos);

    // TODO When using SASS compiler, this should happen automatically
    // if I update themeBgColor
    // TODO This is working at load time, but not after the theme is changed
    // TODO I'm not monitoring inline changes on the background image and I think I should
    theme.setBg();

    // Detect Text color to decide if darkTheme or mediumTheme
    if (is.list && check.theme) {
      // TODO: Use Sass variable
      const checkbox = get('.xY div[role="checkbox"]');

      // We could be in a list view with no items
      if (checkbox) {
        const isTextInverted =
          getComputedStyle(checkbox)
            .getPropertyValue("background-image")
            .indexOf("white") > -1;
        if (isTextInverted) {
          el.html.classList.add("darkTheme");
          el.html.classList.remove("defaultTheme", "lightTheme", "mediumTheme");
          local.update("theme", "darkTheme");
          report("Theme: detected dark theme");
        } else {
          el.html.classList.add("mediumTheme");
          el.html.classList.remove("defaultTheme", "lightTheme", "darkTheme");
          local.update("theme", "mediumTheme");
          report("Theme: detected medium theme");
        }

        // No need to check for themes further
        check.theme = false;
      }
    }
  },

  detectDensity() {
    this.densityTest = get('div[role="navigation"] .TN');
    if (!this.densityTest) return;

    if (parseInt(getStyle(this.densityTest, "height")) <= 26) {
      report("Theme: detected high density");
      el.html.classList.add("highDensity");
      el.html.classList.remove("lowDensity");
      local.update("density", "highDensity");
    } else {
      report("Theme: detected low density");
      el.html.classList.add("lowDensity");
      el.html.classList.remove("highDensity");
      local.update("density", "lowDensity");
    }
  },

  detectButtons(tries = 0) {
    if (tries > 10) return;

    // TODO use sass variables
    const secondButton = gets('div[gh="tm"] div[role="button"] > div')[2];
    if (secondButton) {
      const textButtonLabel = secondButton.innerText;
      if (textButtonLabel == "") {
        // Using icon buttons
        report("Icon button labels detected", tries);
        local.update("textButtons", false);
        el.html.classList.remove("textButtons");
      } else {
        // Using text buttons
        report("Text button labels detected", tries);
        local.update("textButtons", true);
        el.html.classList.add("textButtons");
      }
    } else {
      theme.detectButtons(tries + 1);
    }
  },

  detectSystemPref() {
    let simplifyAlert = get('html.simplify #simplifyAlert[style*="none"]');
    let systemColorPref;

    if (simplifyAlert) {
      systemColorPref = getStyle(simplifyAlert, "content").replace(/\"/g, "");
      report("system color pref", systemColorPref);

      // TODO: create mutation observer that looks for this value to change? Can it detect that if the style isn't inline?
      // No way to observe this changing, would have to check it every so often... on list.scan?
      // new MutationObserver((mutations) => {
      //   console.log("system color pref changed?", mutations);
      // }).observe(simplifyAlert, observers.config.everything);

      if (systemColorPref === "dark") {
        report("system prefers dark, switch to dark theme");

        // TODO: CHANGE ICON -- Change browser icon to dark version

        // TODO: CHANGE THEME
        // build clickSequence()

        // // Click on settings gear
        // clickOn(get(".FH"));

        // // Click on View all button for themes
        // clickOn(get('div[aria-label="Theme"] + button'));

        // // Click on basicwhite or basicblack theme
        // clickOn(get('div[bgid="basicwhite"]'));
        // clickOn(get('div[bgid="basicblack"]'));

        // // Click on save button
        // clickOn(get('.a8Y > div[role="button"]:first-child'));
      }
    }
  },

  detect() {
    theme.detectCount += 1;
    report("Theme changed? Detect #", theme.detectCount);
    theme.detectDensity();
    theme.detectColor();
    theme.detectButtons();
    // theme.detectSystemPref();
  },

  // I think this was originally just for the loading screen and reading pane
  // TODO: I either need to kill it or make it better; issues when switching away
  // from reading pane
  setBg(color = false, img = false, imgPos = false) {
    if (color) {
      local.update("themeBgColor", color);
    }
    if (img) {
      local.update("themeBgImgUrl", img);
    }
    if (imgPos) {
      local.update("themeBgImgPos", imgPos);
    }

    css.add(
      `:root { --color-themeBg: ${simplify[u].themeBgColor} !important; }`
    );
    css.add(
      `:root { --img-themeBg: ${simplify[u].themeBgImgUrl} !important; }`
    );
    css.add(
      `:root { --img-themeBgPos: ${simplify[u].themeBgImgPos} !important; }`
    );

    // Check for the Soft Gray theme and the High Contrast theme
    el.html.classList.remove("grayTheme", "contrastTheme");
    if (simplify[u].themeBgColor === "rgb(245, 245, 245)") {
      el.html.classList.add("grayTheme");
    } else if (simplify[u].themeBgColor === "rgb(238, 238, 238)") {
      el.html.classList.add("contrastTheme");
    }
  },
};

// Initialize theme & density
el.html.classList.add(simplify[u].theme);
el.html.classList.add(simplify[u].density);



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// GMAIL SETTINGS

const settings = {
  init() {
    // TODO: This should be part of elements and simplify[u].sass
    const closeButton = getEl("closeButton");
    if (closeButton) {
      report("Adding event listener to close button");
      closeButton.addEventListener("click", settings.exit);
    }

    // Make sure the App menu is closed
    appMenu.close();

    // Note: this appears to be the main app's container div when themes are disabled for a domain
    let settingsWrapper = get('.nH[style*="width"] + .bq9');
    settingsWrapper = settingsWrapper ? settingsWrapper.previousSibling : false;
    if (settingsWrapper) {
      settingsWrapper.classList.add("settingsWrapper");
    }

    // Add Simplify options link to settings nav
    this.addSimplifySettingsLink();
  },

  exit() {
    const inboxLink = get(simplify[u].sass.inboxLink);
    if (inboxLink) {
      clickOn(inboxLink);
    } else {
      // This is better in that it goes to where we were previously (good) BUT
      // it breaks if there were unsaved changes and the user tried to cancel leaving
      // TODO: is there a way to always go here?
      location.hash = close.settings;
    }

    // Need to re-setup reading-pane upon leaving Settings
    check.readingPane = true;
  },

  // Add Simplify Options link to Gmail settings nav
  addSimplifySettingsLink() {
    const settingsNav = get(".fY");
    const alreadyCreated = get("#simplifyOptions");

    if (settingsNav && !alreadyCreated) {
      // <div class="f1"><a href="" class="f0" role="tab" hidefocus="false">Simplify Gmail</a></div>
      const openSimplifySettings = make(
        "div",
        { className: "f1", id: "simplifyOptions" },
        make(
          "a",
          {
            href: chrome.runtime.getURL("prefs/edit.html"),
            className: "f0",
            role: "tab",
          },
          "Simplify Gmail"
        )
      );

      settingsNav.appendChild(openSimplifySettings);
      get("#simplifyOptions").addEventListener("click", () => {
        window.open(chrome.runtime.getURL("prefs/edit.html"));
      });
    }
  },

  // Add Simplify Options button to quick settings
  addSimplifySettingsButton() {
    const quickSettingsBottom = get(".IU fieldset");

    if (quickSettingsBottom) {
      const openSimplifySettings = make(
        "div",
        { className: "Q3" },
        make("div", { className: "OG" }, "SIMPLIFY GMAIL"),
        make(
          "button",
          {
            id: "openSimplifySettings",
            className: "Tj",
            ariaLabel: "Simplify options",
          },
          "Simplify options"
        )
      );

      quickSettingsBottom.appendChild(openSimplifySettings);
      get("#openSimplifySettings").addEventListener("click", () => {
        window.open(chrome.runtime.getURL("prefs/edit.html"));

        // Close quick settings when user clicks on Simplify Settings
        // TODO: Use Sass variable
        clickOn(get(".rightPane .OB"));
      });
    }
  },
};



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// CHAT

const chat = {
  triesSide: 0,
  triesPeek: 0,
  triesMeet: 0,
  side: undefined,
  meet: null,
  roster: null,
  newChat: null,

  init() {
    // Only try so many times
    if (this.triesPeek > retryAttempts) {
      report("Simplify > chat.init() > No roster, assume chat is disabled");
      this.triesPeek = 0;

      // If chat is disabled, you get the new icons
      el.html.classList.add("newUI");

      return;
    }

    this.roster = get(simplify[u].sass.chatAndMeet);
    this.newChat = get(simplify[u].sass.chatNew);

    // Abort if we find the new chat roster
    if (this.newChat !== null) {
      report("New Gmail nav. Aborting looking for old chat roster");

      // Check if new roster is on the right size
      if (!get(`.aeN ${simplify[u].sass.chatNew}:not(.adZ) .XS`)) {
        report("New chat roster is on the right size");
        el.html.classList.add("rhsChat");
      }
      return;
    }

    // Loop if we haven't found the roster
    if (this.roster === null) {
      this.triesPeek += 1;
      setTimeout(this.init.bind(this), retryIn);
    } else {
      report("Chat: Set up peeking", this.roster);
      this.roster.addEventListener("click", chat.peek);
      this.roster.addEventListener("mouseover", chat.peek);

      // Add invisible div for hiding the chat roster when you mouse away
      document.body.appendChild(make("div", { id: "closeChatPeek" }));
      get("#closeChatPeek").addEventListener("mouseover", chat.unpeek);

      // Find out what side the chat roster is on
      this.detectChat();
      this.detectMeet();
    }
  },

  detectChat() {
    // Only try so many times
    if (this.triesSide > 10) {
      report(
        "Simplify > chat.detectChat() > No roster, assume chat is disabled"
      );
      local.update("chat", "off");
      this.triesSide = 0;
      return;
    }

    report(`Finding chat roster attempt #${this.triesSide}`);
    let roster = get("#talk_roster");
    if (roster) {
      this.side = roster.getAttribute("guidedhelpid");
    }

    if (this.side === undefined) {
      this.triesSide += 1;
      el.html.classList.add("chatOff");
      setTimeout(this.detectChat.bind(this), 250);
    } else {
      this.triesSide = 0;
      local.update("chat", this.side);
      el.html.classList.remove("chatOff");
      report(`Found chat: ${simplify[u].chat}`);

      if (this.side === "right_roster") {
        el.html.classList.add("rhsChat");
      } else {
        el.html.classList.remove("rhsChat");
      }
    }
  },

  detectMeet() {
    // Only try so many times
    if (this.triesMeet > 10) {
      report(
        "Simplify > chat.detectChat() > No roster, assume chat is disabled"
      );
      local.update("meet", false);
      this.triesMeet = 0;
      return;
    }

    report(`Finding meet widget attempt #${this.triesMeet}`);

    // TODO: use sass variables
    this.meet = get('.YM, *[aria-label="Meet"]');

    if (!this.meet) {
      this.triesMeet += 1;
      el.html.classList.add("meetOff");
      setTimeout(this.detectMeet.bind(this), 250);
    } else {
      this.triesMeet = 0;
      local.update("meet", true);
      el.html.classList.remove("meetOff");
    }
  },

  peek(event) {
    if (is.simplifyOn) {
      el.html.classList.add("chatOpen");
      event.stopPropagation();
    }
  },

  unpeek() {
    el.html.classList.remove("chatOpen");
  },
};



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// READING PANE

// Detect if reading pane is enabled
const readingPane = {
  element: null,
  tries: 0,
  size: "500px",
  type: "",
  calls: 0,

  init() {
    // Only try to detect reading pane if in a list
    if (!is.list) {
      check.readingPane = true;
      return;
    }

    // Only try so many times
    if (this.tries > retryAttempts) {
      // TODO: Add Sass variable
      error("Simplify > readingPane.init() > Cound't find div[gh='tl']");
      this.tries = 0;
      return;
    }

    this.element = get("div[gh='tl']");
    if (!this.element) {
      this.tries += 1;
      setTimeout(this.init.bind(this), retryIn);
    } else {
      report("Detecting reading pane took this many loops:", this.tries);
      this.tries = 0;
      // TODO: Use Sass variable, strip out "."
      if (this.element.classList.contains("vy")) {
        is.readingPane = true;
        readingPane.detect();

        // MOVED 2/22: under readingPane.detect so it gets restarted when readingPane type changes
        // observers.readingPane.start();

        // REMOVED 2/22: Does this need to be called more than once?
        // readingPane.findToggle();
      } else {
        is.readingPane = false;
        this.type = "unknown";
        el.html.classList.remove("nPane", "hPane", "vPane");
        // Reset background if I'm still overriding it
        // theme.setBg("initial");
      }
      check.readingPane = false;
      local.update("readingPane", is.readingPane);
      local.update("readingPaneType", this.type);
    }
  },

  detect() {
    report("readingPane.detect called", this.calls);
    this.calls += 1;

    this.findToggle();
    this.detectType();
    this.detectSize();
  },

  // Add class to toggle so we can move it around
  // TODO: Use Sass variables for selector or el.
  findToggle(listScan = false) {
    let foundNewToggles = false;
    gets('.apF, div[data-tooltip="Toggle split pane mode"]').forEach(
      (element) => {
        if (!element.parentElement.classList.contains("readingPaneToggle")) {
          element.parentElement.classList.add("readingPaneToggle");
          foundNewToggles = true;
        }
      }
    );

    if (foundNewToggles && listScan) {
      // observers.readingPane.restart();
      // report("Found a new toggle on a list.scan, reinitializing readingPane");
      // readingPane.init();
    }
  },

  detectType() {
    // If in conversation view, most likely nPane but could be an email opened via search suggestion
    if (is.msg) {
      this.type = "nPane";
      check.readingPane = true;
      return;
    }

    // TODO: This needs to be refreshed when the view changes, probably not here
    this.element = get("div[gh='tl'], div.UI");

    // TODO: Use Sass variable
    // Detect type of reading pane
    report("Detect type of reading pane");
    if (this.element) {
      if (this.element.classList.contains("Nm")) {
        this.type = "vPane";
      } else {
        // Make sure we revert to single-line rows in list view
        gets(".Zs").forEach((list) => {
          list.classList.remove("Zs");
        });

        if (this.element.classList.contains("S2")) {
          this.type = "nPane";
          check.readingPane = false;
        } else if (this.element.classList.contains("Nf")) {
          this.type = "hPane";
        } else {
          this.type = "unknown";
          is.readingPane = false;
          report("Looks like reading pane is disabled");
        }
      }
    }

    // Restart action bar observer
    observers.actionBar.start();

    // Restart readingPane observer
    observers.readingPane.restart();

    // Cache reading pane type and update class on <html>
    local.update("readingPaneType", this.type);
    el.html.classList.remove("nPane", "hPane", "vPane");
    if (this.type !== "unknown") {
      el.html.classList.add(simplify[u].readingPaneType);
    }
  },

  // Detect if the size of the reading pane has changed
  // TODO: Use Sass variables
  detectSize() {
    // If Gmail was loaded in vhPane and then switched to nPane,
    // this still gets called sometimes but isn't needed
    if (this.type === "nPane") return;

    report("detectSize called", this.type);
    let newSize = 0;

    if (this.type === "vPane") {
      newSize = getStyle(".UI.vy[gh='tl'] > div:first-child", "width");
    } else if (this.type === "hPane") {
      newSize = getStyle(".UI.vy[gh='tl'] > div:last-child", "height");
    }

    if (this.size !== newSize) {
      // Save & apply reading pane size when it changes
      this.size = newSize;
      local.update("readingPaneSize", this.size);

      if (this.type === "vPane") {
        css.add(`:root { --width-readingPane: ${this.size} !important; }`);

        // If width is below 510 pixels, add Zs to wrap the threads
        if (parseInt(this.size) < 510) {
          gets(".UI .Nu > div[jsaction]").forEach((list) => {
            list.classList.add("Zs");
          });
        } else {
          gets(".Zs").forEach((list) => {
            list.classList.remove("Zs");
          });
        }
      } else if (this.type === "hPane") {
        css.add(`:root { --height-readingPane: ${this.size} !important; }`);
      }
    }
  },
};

// Observer for reading pane size change or toggle
observers.readingPane = {
  toggles: null,
  listPanes: [],
  mode: null,
  size: null,
  tries: 0,
  messagePane: null,
  currentListPane: null,
  pauseScrollObs: false,

  paneObserver: new MutationObserver(() => {
    report("paneObserver fired");
    readingPane.detectSize();
  }),

  toggleObserver: new MutationObserver(() => {
    report("toggleObserver fired");

    // Delay the check just a little so the DOM has a chance to update
    setTimeout(readingPane.detect.bind(readingPane), retryIn);
  }),

  msgObserver: new MutationObserver((mutations) => {
    // TODO: Use sass variables
    if (mutations.some((m) => m.target.classList.contains("UG"))) {
      el.html.classList.add("msgOpen");
      is.msgOpen = true;

      report("Scan conversation for trackers & htmlEmail if darkTheme");
      conversation.scan();
      observers.inlineReply.start();
    } else if (count(".Bs .apb") > 0) {
      el.html.classList.remove("msgOpen");
      is.msgOpen = false;
    }

    // Remove .reverseMsgs if setting not enabled
    if (!preferences.reverseMsgs) {
      el.html.classList.remove("reverseMsgs");
    }
  }),

  start() {
    // Only try so many times
    if (this.tries > retryAttempts) {
      error("Cound't find list view for reading pane");
      this.tries = 0;
      return;
    }

    let vhPane = readingPane.type === "vPane" || readingPane.type === "hPane";

    // Find the reading pane toggle
    // TODO: Use Sass variables
    this.toggles = gets(
      '.apH, .apI, .apJ, .apK, div[data-tooltip*="Toggle split pane"] .asa > div'
    );

    if (vhPane) {
      // Find the message pane
      // TODO: Use Sass variables
      this.messagePane = get(".BltHke[role='main'] .UI:not(.S2) .Bs"); // nH ao9 id UG

      // Find list panes
      // TODO: Use Sass variables
      this.listPanes = gets(".UI:not(.S2) > .Nu:first-child");
    }

    if (this.toggles.length === 0 || (vhPane && this.listPanes.length === 0)) {
      this.tries += 1;
      setTimeout(this.start.bind(this), retryIn);
    } else {
      this.tries = 0;
      this.observe();

      // REMOVED 2/22 as I think this is overkill
      // readingPane.detect();
    }
  },

  observe() {
    report("Observe reading panes and/or toggles", readingPane.type);

    this.toggles.forEach((toggle) => {
      this.toggleObserver.observe(toggle, observers.config.classAttributeOnly);
    });

    this.listPanes.forEach((listPane) => {
      this.paneObserver.observe(listPane, observers.config.styleAttributeOnly);
    });

    if (this.messagePane) {
      this.msgObserver.observe(
        this.messagePane,
        observers.config.classAttributeOnly
      );
      this.messagePane.classList.add("SOFC");
    }

    this.observeScrolling();
  },

  disconnect() {
    if (this.paneObserver !== null) {
      this.paneObserver.disconnect();
    }

    if (this.msgObserver !== null) {
      this.msgObserver.disconnect();
    }
  },

  restart() {
    this.disconnect();
    this.start();
  },

  // For detecting when search results are scrolled to the top
  scrollObserver() {
    report("Scrolling");

    if (!observers.readingPane.pauseScrollObs) {
      observers.readingPane.isListScrolled(this);
      observers.readingPane.pauseScrollObs = true;
      setTimeout(() => {
        observers.readingPane.pauseScrollObs = false;
        observers.readingPane.isListScrolled(this);
      }, 200);
    }
  },

  isListScrolled(list) {
    if (list.scrollTop < 30) {
      el.html.classList.remove("listScrolled");
    } else {
      el.html.classList.add("listScrolled");
    }
  },

  observeScrolling() {
    if (!is.search || !is.readingPane || readingPane.type === "nPane") {
      return;
    }

    this.currentListPane = get(".BltHke[role='main'] .UI > .Nu:first-child");

    if (this.currentListPane) {
      if (this.currentListPane.onscroll === null) {
        this.currentListPane.onscroll = this.scrollObserver;
        report("Observe scrolling search list");
      }
    }
  },
};

// Init reading pane based on cached state
if (simplify[u].readingPaneType !== "unknown") {
  el.html.classList.add(simplify[u].readingPaneType);
  report("Loading with reading pane enabled", simplify[u].readingPaneType);
}



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// ALERTS

// Support for showing Simplify notifications
const alerts = {
  autoClose: null,

  action: () => {},

  init() {
    // prettier-ignore
    el.alert = make("div", { id: "simplifyAlert", style: "display:none" }, 
      make("p", { className: "alertMsg"}, "This is a test"),
      make("button", { className: "action" }, "Open Simplify settings"),
      make("button", { className: "close" }, "Close")
    );
    document.body.appendChild(el.alert);
    el.alert = get("#simplifyAlert");
    el.alertMsg = get("#simplifyAlert .alertMsg");
    el.alertAction = get("#simplifyAlert .action");
    el.alertAction.addEventListener("click", alerts.primaryAction, false);
    get("#simplifyAlert .close").addEventListener("click", alerts.close, false);
  },

  show(msg, action, hideAfter = 0) {
    // Initialize the alert box if it hasn't already been
    if (!get("#simplifyAlert")) {
      alerts.init();
    }

    // Add content to notification div
    // el.alertMsg.textContent = msg;
    el.alertMsg.innerHTML = msg;
    el.alertAction.textContent = action;
    el.alertAction.style.display = "block";

    let details = "";

    // Add primary action to notification div
    switch (action) {
      case "Manage extensions":
        alerts.action = () => {
          console.log("Open chrome extensions");
          chrome.runtime.sendMessage({ action: "manage_extensions" });
        };
        break;
      case "Copy to clipboard":
        alerts.action = (m = msg) => {
          console.log(m);
          navigator.clipboard.writeText(m);
        };
        break;
      case "Report issue":
        details = getSimplifyDetails();
        alerts.action = (m = details) => {
          window.open("https://simpl.fyi/support?system=" + details);
        };
        break;
      case "Report issue instant":
        details = getSimplifyDetails();
        alerts.action = (m = details) => {
          window.open("https://simpl.fyi/support?system=" + details);
        };
        clickOn(get("#simplifyAlert .action"));
        clickOn(get("#simplifyAlert .close"));
        break;
      case "None":
        el.alertAction.style.display = "none";
        break;
    }

    // Should probably do this at the end
    el.alert.style.display = "block";

    // Auto hide this notification in 30 seconds
    if (hideAfter > 0) {
      alerts.autoClose = setTimeout(alerts.close, hideAfter * 1000);
    }
  },

  primaryAction() {
    alerts.action();
    el.alert.style.display = "none";
    clearTimeout(alerts.autoClose);
  },

  close() {
    el.alert.style.display = "none";
    clearTimeout(alerts.autoClose);

    // TODO: Add "Don't remind me"
    // preferences.kbsNotified = true;
  },
};



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// URL, HISTORY, & TRACKING CURRENT VIEW

// Update view state variables based on URL
// TODO: Detecting message view won't work in Reading Pane, anything to do about that? Does it matter?
const url = {
  hash: null,

  check() {
    // Check for special Gmail views
    is.popout = location.href.indexOf("view=btop") !== -1;
    is.original = location.href.indexOf("view=om") !== -1;
    is.print = location.href.indexOf("view=pt") !== -1;

    if (location.hash === "") {
      return;
    }

    // Remove pagination from url hash
    this.hash = location.hash.replace(/\/p\d{1,3}$/, "");

    is.msg = this.hash.search(regex.msg) !== -1;
    is.list = this.hash.search(regex.msg) === -1;
    is.inbox = this.hash.search(/#inbox/) === 0;
    is.search = this.hash.search(regex.search) === 0;
    is.label = this.hash.search(regex.label) === 0;
    is.settings = this.hash.search(/#settings/) === 0;

    if (is.settings) {
      el.html.classList.add("inSettings");

      // Since is.list is based on it not being a message,
      // it could be wrong if in Settings
      is.list = false;
    } else {
      el.html.classList.remove("inSettings");
      close.settings = this.hash;
    }

    if (is.msg) {
      el.html.classList.add("inMsg");
      conversation.scan();

      // If in a message, set the list views to false
      is.inbox = false;
      is.search = false;
      is.label = false;
      is.list = false;
    } else {
      el.html.classList.remove("inMsg");
    }

    if (is.search) {
      el.html.classList.add("inSearch");

      // TODO: I think I can do this with html.simplify.inSearch now that I separated out inLabel
      // css.add("html.simplify { --padding-top: 82px; }");
    } else {
      el.html.classList.remove("inSearch");
      if (is.list) close.search = this.hash;
      // css.add("html.simplify { --padding-top: 40px; }");
    }

    if (is.label) {
      el.html.classList.add("inLabel");
    } else {
      el.html.classList.remove("inLabel");
      if (is.list) close.search = this.hash;
    }

    if (is.inbox) {
      el.html.classList.add("inInbox");

      // Find out if the inbox is a tabbed inbox
      if (!is.loading && is.tabbedInbox === null) {
        is.tabbedInbox = count(simplify[u].sass.tabs) > 0;
      }
    } else {
      el.html.classList.remove("inInbox");
    }

    if (is.list) {
      el.html.classList.add("inList");
      close.msg = this.hash;
    } else {
      el.html.classList.remove("inList");
    }

    if (is.delegate) {
      el.html.classList.add("delegate");
    } else {
      el.html.classList.remove("delegate");
    }
  },
};

window.onhashchange = () => {
  url.check();

  // Close profile menu if it is open
  document.documentElement.classList.remove("appMenuOpen");

  // Look for new inline replies when changing conversations
  if (is.msg) {
    observers.inlineReply.start();
    observers.actionBar.addSearchButton();
  }

  if (is.list) {
    // Happens if Gmail originally loaded in a message
    // and we couldn't fully detect the theme
    if (check.theme) {
      theme.detect();
    }
    if (check.readingPane) {
      readingPane.init();
    }

    // Remove bold highlight on focused thread
    el.html.classList.remove("boldHighlight");

    // Scan list for ads and date grouping
    lists.scan();

    // Resetup actionBar observers
    observers.actionBar.start();

    if (is.readingPane) {
      // The toggle gets recreated across views and needs to be retagged
      readingPane.findToggle();

      // If the URL changed and we're using vPane or hPane, restart observers
      if (["vPane", "hPane"].includes(readingPane.type)) {
        observers.readingPane.restart();
      }
    }
  }

  if (is.settings) {
    settings.init();
  }

  // Remove .reverseMsgs if setting not enabled
  if (!preferences.reverseMsgs) {
    el.html.classList.remove("reverseMsgs");
  }

  if (check.categories) {
    if (Object.values(categories).indexOf(location.hash) > -1) {
      Object.keys(categories).forEach((key) => {
        report(
          "Checking location hash for category",
          location.hash,
          key,
          categories[key],
          location.hash === categories[key]
        );
        // Remove highlight if not on this category
        if (location.hash !== categories[key]) {
          let wasActive = get(`.aim[data-category="${key}"] .TO.nZ.aiq`);
          if (wasActive) wasActive.classList.remove("nZ", "aiq");
        }
      });
    } else {
      // If not on any category, no need to check next time
      check.categories = false;

      // Remove highlight from nav item if not on that category
      gets(".aim[data-category] .TO.nZ.aiq").forEach((item) => {
        item.classList.remove("nZ", "aiq");
      });
    }
  }
};

// Check locaton on load (I also run this again after loading is complete)
url.check();



/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// INITIALIZE

// Print Simplify version to console
console.log("Simplify v" + chrome.runtime.getManifest().version + " loaded");

// Call all initialization functions
const initializeSimplify = () => {
  report("Gmail is loaded, initializing Simplify");

  // Done loading
  el.html.classList.remove("loading");
  is.loading = false;

  // Show OOBE
  // if (simplify[u].firstTimeWelcome) {
  //   let oobe = get("#welcomeToSimplify");
  //   if (oobe) oobe.classList.add("wtsShow");
  // }

  // Show warning for Chrome Canary users
  // if (is.chromeCanary) {
  //   alerts.show(
  //     "<b>Warning</b><br>Bugs in Chrome Dev/Canary (v90) has a bug that breaks Simplify. Google is working on a fix. You can follow the issue <a href='https://github.com/leggett/simplify/issues/494'>on Github</a>.",
  //     "None"
  //   );
  // }

  // Initialize all the elements
  Object.keys(trickyElements).forEach((el) => {
    getEl(el);
  });

  url.check();
  nav.init();
  appMenu.init();
  readingPane.init();
  search.init();
  chat.init();
  lists.init();
  alerts.init();

  if (is.list) {
    observers.actionBar.start();
  }

  if (is.settings) {
    settings.init();
  }

  theme.detect();
  observers.theme.start();
  observers.quickSettings.start();
  observers.addOns.start();
  observers.body.start();
  observers.compose.start();
  observers.title.start();
  conversation.initTrackerDetails();

  // Get the correct width of the readingPane after it is fully loaded
  if (
    simplify[u].readingPaneType === "vPane" ||
    simplify[u].readingPaneType === "hPane"
  ) {
    setTimeout(readingPane.detectSize, 100);
  }

  // See if I need to check the inbox sections on initial load
  // TODO: Gmail appears to have fixed this bug so it is no longer need
  // if (is.inbox && check.inboxSections) {
  //   lists.checkSections();
  // }

  // Setup window event listeners
  window.addEventListener("resize", observers.window.resize);
  window.addEventListener("click", observers.window.click);
  window.addEventListener("mouseout", observers.window.mouseout);

  // Check for Simplify v1 being still enabled
  if (el.html.classList.contains("simpl")) {
    alerts.show(
      "To test Simplify v2, disable Simplify v1 under chrome://extensions and refresh Gmail.",
      "Manage extensions"
    );
  }
};
