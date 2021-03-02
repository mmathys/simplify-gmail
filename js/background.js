/* Copyright (C) 2021 Michael Leggett, Made Simple LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential */

// ==========================================================================
// BACKGROUND - Handle background funtions like toggling Simplify on/off

const toggledOnIcon = {
  48: "img/app/icon48.png",
  128: "img/app/icon128.png",
};

const toggledOffIcon = {
  48: "img/app/icon48_off.png",
  128: "img/app/icon128_off.png",
};

function updatePageAction(tabId, toggled) {
  chrome.pageAction.setIcon({
    tabId: tabId,
    path: toggled ? toggledOnIcon : toggledOffIcon,
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "activate_page_action") {
    chrome.pageAction.show(sender.tab.id);
  } else if (message.action === "toggle_simplify") {
    updatePageAction(sender.tab.id, message.isOn);
  } else if (message.action === "manage_extensions") {
    chrome.tabs.create({ url: "chrome://extensions/" });
    // Firefox: about:addons
    // Safari: ?
  }
});

// ==========================================================================
// Reload Gmail tab on Simplify installation or update

chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.query({ url: "*://mail.google.com/*" }, function (tabs) {
    tabs.forEach(function (tab) {
      chrome.tabs.reload(tab.id);
    });
  });
});
