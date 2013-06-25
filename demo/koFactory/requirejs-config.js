// Setup requirejs configuration
var requirejsConfig = {
  baseUrl: "../../",
  paths: {
    "app": "demo/koFactory",
    "lib": "lib",
    "mortar": "src",
    "jquery": "lib/jquery-1.9.1",
    "jquery.ui": "lib/jquery.ui.widget",
    "infuser": "lib/infuser-amd",
    "trafficCop": "lib/TrafficCop",
    "ko": "lib/knockout-2.2.1",
    "koext": "lib/koExternalTemplateEngine-amd"
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

