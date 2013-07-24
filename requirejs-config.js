// Setup requirejs configuration
var requirejsConfig = {
  baseUrl: "./",
  paths: {
    "app": "docs",
    "lib": "lib",
    "mortar": "src",
    "views": "docs/views",
    "jquery": "lib/js/jquery-1.10.1",
    "jquery.ui": "lib/jquery-ui-1.10.3/ui/jquery-ui",
    "bootstrap": "lib/bootstrap/js/bootstrap",
    "infuser": "lib/js/infuser-amd",
    "trafficCop": "lib/js/TrafficCop",
    "ko": "lib/js/knockout-2.2.1",
    "koext": "lib/js/koExternalTemplateEngine-amd"
  },
  "shim": {
    "jquery.ui": ["jquery"],
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
