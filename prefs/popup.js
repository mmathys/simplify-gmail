/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==============================================================
// UTILITIES

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

// Getting active tab's ID
let tabId = null;
const getTabId = () => {
  chrome.tabs.query(
    {
      active: true,
      windowType: "normal",
      currentWindow: true,
    },
    (tabs) => {
      if (tabs[0]) tabId = tabs[0].id;
    }
  );
  console.log("Updated tab ID", tabId);
};
getTabId();

// Update tab id when active tab is changed
chrome.tabs.onActivated.addListener(getTabId);

// ==============================================================
// PREFERENCES

const goto = (where) => {
  switch (where) {
    case "options":
      let optionsUrl = chrome.runtime.getURL("prefs/edit.html");
      chrome.tabs.create({ active: true, url: optionsUrl });
      break;
    case "newsletter":
      chrome.tabs.create({
        active: true,
        url: "https://on.simpl.fyi/?no_cover=true",
      });
      break;
    case "details":
      chrome.tabs.sendMessage(tabId, { action: "show_details" });
      window.close();
      break;
    case "about":
      chrome.tabs.create({ active: true, url: "https://simpl.fyi/#about" });
      break;
    case "privacy":
      chrome.tabs.create({ active: true, url: "https://simpl.fyi/#privacy" });
      break;
    case "issue":
      chrome.tabs.sendMessage(tabId, { action: "report_issue" });
      window.close();
      break;
    case "support":
      chrome.tabs.create({ active: true, url: "https://simpl.fyi/#faq" });
      break;
    case "disable":
      chrome.tabs.sendMessage(tabId, { action: "disable_simplify" });
      window.close();
      break;
    case "changes":
      chrome.tabs.create({ active: true, url: "https://simpl.fyi/#faq" });
      break;
    case "tweet":
      chrome.tabs.create({ active: true, url: "https://twitter.com/leggett" });
      break;
    case "pricing":
      chrome.tabs.create({
        active: true,
        url: "https://on.simpl.fyi/p/pricing-v2",
      });
      break;
  }
};

const setup = () => {
  gets("#menu *[id]").forEach((item) => {
    item.addEventListener("click", () => {
      goto(item.id);
    });
  });
};
window.addEventListener("load", setup);
