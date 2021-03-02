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

const isOn = (setting) => {
  let settingEl = get("#" + setting);
  if (settingEl) {
    return settingEl.classList.contains("on");
  } else {
    return false;
  }
};

const isChecked = (checkbox) => {
  let checkboxEl = get("#" + checkbox);
  if (checkboxEl) {
    return checkboxEl.checked;
  } else {
    return false;
  }
};

const turnOn = (setting) => {
  let el = get("#" + setting);
  if (el) {
    if (el.type === "checkbox") {
      el.checked = true;
    } else if (el.type === "submit") {
      el.classList.add("on");
      el.closest("tr").classList.add("on");
    }
  }
};

const UA = navigator.userAgent;
const isSafari = /Safari/.test(UA) && !/Chrome/.test(UA);

// ==============================================================
// PREFERENCES

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

// Function to save preferences to Chrome Storage
const savePreferences = (event) => {
  if (!event) return;
  if (
    ["BUTTON", "LABEL", "SPAN", "INPUT", "SELECT"].includes(
      event.target.nodeName
    )
  ) {
    chrome.storage.local.set({
      debug: isOn("debug"),
      kbsMenu: isOn("kbsMenu"),
      kbsInfo: isOn("kbsInfo"),
      kbsEscape: isOn("kbsEscape"),
      kbsEnter: isOn("kbsEnter"),
      kbsToggle: isOn("kbsToggle"),
      kbsUndo: isOn("kbsUndo"),
      kbsRefresh: isOn("kbsRefresh"),
      kbsBackspace: isOn("kbsBackspace"),
      kbsSelectAll: isOn("kbsSelectAll"),
      kbsSelectAllAll: isOn("kbsSelectAllAll"),
      kbsOrder: isOn("kbsOrder"),
      kbsAutoSelect: isOn("kbsAutoSelect"),

      minimizeChat: isOn("minimizeChat"),
      showChat: isOn("showChat"),
      hideUnreadCount: isOn("hideUnreadCount"),
      hideTitleUnreadCount: isOn("hideTitleUnreadCount"),
      hideSignatures: isOn("hideSignatures"),
      dateGroup: isOn("dateGroup"),
      inboxZeroBg: get("#inboxZeroBg").value,
      invertMessages: get("#invertMessages").value,
      invertCompose: isOn("invertCompose"),
      invertAddons: isOn("invertAddons"),
      favicon: isOn("favicon"),
      addCategories: isOn("addCategories"),
      hideSelectRefresh: isOn("hideSelectRefresh"),
      hideTabIcons: isOn("hideTabIcons"),
      hideListCount: isOn("hideListCount"),
      hideMsgCount: isOn("hideMsgCount"),
      matchFontSize: isOn("matchFontSize"),
      sendLater: isOn("sendLater"),
      reverseMsgs: isOn("reverseMsgs"),
      listWidth: get("#listWidth").value,
      msgWidth: get("#msgWidth").value,

      // Compose actions
      composeActions: isOn("composeActions"),
      caCount: count('.options.actions input[type="checkbox"]:checked') + 1,
      caImage: isChecked("caImage"),
      caLink: isChecked("caLink"),
      caDrive: isChecked("caDrive"),
      caEmoji: isChecked("caEmoji"),
      caSig: isChecked("caSig"),
      caConfid: isChecked("caConfid"),

      // Compose formatting
      composeFormat: isOn("composeFormat"),
      cfUndo: isChecked("cfUndo"),
      cfFont: isChecked("cfFont"),
      cfSize: isChecked("cfSize"),
      cfColor: isChecked("cfColor"),
      cfAlign: isChecked("cfAlign"),
      cfOrdered: isChecked("cfOrdered"),
      cfUnordered: isChecked("cfUnordered"),
      cfIndent: isChecked("cfIndent"),
      cfQuote: isChecked("cfQuote"),
      cfStrike: isChecked("cfStrike"),
      cfRemove: isChecked("cfRemove"),
    });

    // Show all prefs in console
    console.log("Preferences updated");
    // chrome.storage.local.get(null, (items) => console.log(items));

    if (isSafari) {
      showAlert("You must refresh Gmail for the changes to apply in Safari");
    }
  }
};

let alertBox;
let alertTimeout = false;
const showAlert = (msg) => {
  alertBox.innerText = msg;
  alertBox.classList.add("shown");

  if (alertTimeout) {
    clearTimeout(alertTimeout);
  }

  alertTimeout = setTimeout(() => {
    alertBox.classList.remove("shown");
  }, 7000);
};

// Restores select box and checkbox state using the preferences
const restorePreferences = () => {
  // Save preferences when user interacts with page
  document.addEventListener("click", savePreferences);

  // Use default values to initialize preferences
  chrome.storage.local.get(defaultPreferences, (items) => {
    Object.keys(items).forEach((key) => {
      if (typeof items[key] === "string") {
        let el = get("#" + key);
        if (el) {
          el.value = items[key];
        }
      } else if (items[key]) {
        turnOn(key);
      }
    });
  });
};
document.addEventListener("DOMContentLoaded", restorePreferences);

const setup = () => {
  // Setup confirmation banner
  alertBox = get("#alertMsg");
  alertBox.addEventListener("click", () => {
    alertBox.classList.remove("shown");
  });

  // Change Ctrl button to Cmd for Mac
  if (window.navigator.platform.indexOf("Mac") >= 0) {
    document.querySelectorAll(".altKey").forEach((key) => {
      key.innerText = "";
      key.appendChild(document.createTextNode("\u2325"));
    });
    document.querySelectorAll(".cmdKey").forEach((key) => {
      key.innerText = "";
      key.appendChild(document.createTextNode("\u2318"));
    });
  }

  // Add onClick event for each toggle
  document.querySelectorAll("button.toggle").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("on");
      if (button.classList.contains("on")) {
        button.closest("tr").classList.add("on");
      } else {
        button.closest("tr").classList.remove("on");
      }
    });
  });

  // Setup event listeners for 'Show Options' links
  document.querySelectorAll(".hasOptions a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.target.parentElement.classList.toggle("show");
    });
  });

  // Add onChange event for each checkbox
  document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      savePreferences(e);
    });
  });

  // Add onChange event for each select
  document.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", (e) => {
      console.log("Select changed", e.target);
      savePreferences(e);
    });
  });
};
window.addEventListener("load", setup);
