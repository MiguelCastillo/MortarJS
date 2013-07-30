// Setup requirejs configuration
var requirejsConfig = {
  baseUrl: "./",
  paths: {
    "mortar": "src",
    "jquery": "lib/js/jquery-1.10.1",
    "jquery.widget": "lib/js/jquery.ui.widget",
    "bootstrap": "lib/bootstrap/js/bootstrap",
    "infuser": "lib/js/infuser-amd",
    "trafficCop": "lib/js/TrafficCop",
    "ko": "lib/js/knockout-2.2.1",
    "koext": "lib/js/koExternalTemplateEngine-amd"
  },
  "shim": {
    "jquery.widget": ["jquery"],
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
