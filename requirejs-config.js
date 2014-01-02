// Setup requirejs configuration
var requirejsConfig = {
  baseUrl: "./",
  paths: {
    "mortar": "src",
    "underscore": "lib/js/underscore",
    "jquery": "lib/js/jquery-1.10.1",
    "jquery.widget": "lib/js/jquery.ui.widget",
    "bootstrap": "lib/bootstrap/js/bootstrap",
    "rivets": "lib/js/rivets",
    "ko": "lib/js/knockout-3.0.0",
    //"koext": "lib/js/koExternalTemplateEngine-amd",
    //"infuser": "lib/js/infuser-amd",
    //"trafficCop": "lib/js/TrafficCop",
    "codemirror": "lib/CodeMirror",
    "text": "lib/js/require.text",
    "css": "lib/js/require.css"
  },
  "shim": {
    "app": ["jquery", "underscore", "bootstrap"],
    "tests": ["jquery", "underscore"],
    "jquery.widget": ["jquery"],
    //"infuser": ["jquery"],
    "bootstrap": ["jquery"],
    "codemirror/mode/javascript/javascript": ["codemirror/lib/codemirror"],
    "codemirror/addon/runmode/runmode": ["codemirror/lib/codemirror"],
    "codemirror/addon/runmode/colorize": ["codemirror/lib/codemirror"],
    "underscore": {
      "exports": "_"
    }
  },
  packages: ["app", "components", "examples", "home", "tests"],
  waitSeconds: 15
};


if ( require ) {
  require.config(requirejsConfig);
}
else {
  var require = requirejsConfig;
}
