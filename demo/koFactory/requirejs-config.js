// Setup requirejs configuration
var requirejsConfig = {
  baseUrl: "../../",
  paths: {
    "app": "demo/koFactory",
    "lib": "lib",
    "mortar": "src",
    "jquery": "lib/js/jquery-1.10.1",
<<<<<<< HEAD
    "jquery.ui": "lib/jquery-ui-1.10.3/ui/jquery-ui",
=======
    "jquery.widget": "lib/js/jquery.ui.widget",
>>>>>>> gh-pages
    "bootstrap": "lib/bootstrap/js/bootstrap",
    "infuser": "lib/js/infuser-amd",
    "trafficCop": "lib/js/TrafficCop",
    "ko": "lib/js/knockout-2.2.1",
    "koext": "lib/js/koExternalTemplateEngine-amd"
  },
  "shim": {
<<<<<<< HEAD
    "jquery.ui": ["jquery"],
=======
    "jquery.widget": ["jquery"],
>>>>>>> gh-pages
    "infuser": ["jquery"]
  },
  waitSeconds: 15
};


if ( require ) {
  require.config(requirejsConfig);
}
else {
  var require = requirejsConfig;
}

