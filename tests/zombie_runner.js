var Browser = require("zombie");
var assert = require("assert");

// Load the page from localhost
browser = new Browser();
//browser.visit("file://" + __dirname + "/tests.html", { silent: false });
browser.visit("http://mcastillo_macbook/MortarJs/tests.html", { silent: false });

