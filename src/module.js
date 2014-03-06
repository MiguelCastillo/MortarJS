(function(root) {

  define([
    "src/fetch",
    "src/spromise"
  ], function(Fetch, Promise) {
    "use strict";

    ///
    /// From requirejs https://github.com/jrburke/requirejs. Thanks dude!
    ///
    var commentRegExp    = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;

    var deferred = {}, resolved = {}, pending = {};
    function _result(input, args, context) { if (typeof(input) === "function") {return input.apply(context, args||[]);} return input; }
    function _noop() {}

    /**
    * Module contructor
    */
    function Module() {
      return Module.define.apply(this, arguments);
    }

    /**
    * AMD compliant define interface
    */
    Module.define = function(name, deps, factory) {
      throw new TypeError("Define not implemented");
    };

    /**
    * AMD/CJS compliant require interface.
    *
    * name can be a string or an array or string module name
    * ready is the callback when the module(s) is loaded.
    * If multiple module are to loaded, a promise object is also returned. If a single module
    * is required in CJS format, then the resolved module is returned.
    *
    * return promise object
    */
    Module.require = function(name, ready, options) {
      var pending = [];
      var i, length;

      if ( name instanceof Array ) {
        for (i = 0, length = name.length; i < length; i++) {
          pending.push(Module.import(name[i], options));
        }
        return Promise.when.apply((void 0), pending).done(ready || _noop);
      }

      return resolved[name];
    };

    /**
    * Import interface to load a module
    */
    Module.import = function(name, options) {
      var moduleMeta;

      if (name in pending === true) {
        moduleMeta = pending[name];
        delete pending[name];
        deferred[name] = Module.resolve(moduleMeta);
      }
      else if (name in deferred === false) {
        moduleMeta = Module.configure(name, options);
        deferred[name] = Module.load(moduleMeta);
      }

      return deferred[name];
    };

    /**
    * Load a module
    */
    Module.load = function(moduleMeta) {
      return Fetch.load({
        url: moduleMeta.file.toUrl(),
        ajax: {
          dataType: "text"
        }
      })
      .then(function(moduleContent) {
        // Prep script to handle inline module imports in CJS format. E.g. var x = require("x");
        moduleContent
          .replace(commentRegExp, '')
          .replace(cjsRequireRegExp, function (match, dep) {
            moduleMeta.deps.push(dep);
          });

        // Currently, the only way to get these dependencies at the moduleMeta level is when
        // they are inline require calls in CJS format. E.g. var x = require("x");
        // If we find any of these, then we will preload them so that they are available if
        // and when they are required.
        //
        if ( moduleMeta.deps.length ) {
          return Module.require(moduleMeta.deps).then(function() {
            return Module.finalize(moduleMeta, Module.injection(moduleMeta, moduleContent));
          });
        }
        else {
          return Module.finalize(moduleMeta, Module.injection(moduleMeta, moduleContent));
        }
      });
    };

    /**
    * Interface to take a module, ensure its dependencies are loaded, then make sure that the
    * proper value is reolved for the module.
    */
    Module.finalize = function(moduleMeta, moduleResult) {
      var mainModule = moduleMeta.modules[moduleMeta.name];
      var currentModule;

      if ( mainModule ) {
        delete moduleMeta.modules[moduleMeta.name];
      }
      else {
        mainModule = moduleMeta.anonymous.shift();
      }

      // Add modules to the pending bucket.  This is so that we can lazy load these pending
      // modules as dependencies to other modules.  Only load them when they are imported.
      for (var iModule in moduleMeta.modules) {
        currentModule = moduleMeta.modules[iModule];
        if ( !deferred[currentModule.name] && !pending[currentModule.name] ) {
          pending[currentModule.name] = currentModule;
        }
      }

      // If there is no mainModule, that means that define was not called with a corresponding
      // module id or even anonymously.  This means we are going to try to use the moduleMeta
      // and use the exports or whatever was returned when loading the module.
      return Module.resolve(mainModule || moduleMeta, moduleResult);
    };

    /**
    * Resolve a module dependencies and figure out what the module actually is.
    */
    Module.resolve = function(module, moduleResult) {
      var i, length;
      var deps = [];

      for ( i = 0, length = module.deps.length; i < length; i++ ) {
        deps.push( Module.import(module.deps[i]) );
      }

      return Promise.when.apply(module, deps).then(function() {
        var i, length;
        module.resolved = [];

        for ( i = 0, length = deps.length; i < length; i++ ) {
          module.resolved.push(arguments[i]);
        }

        //
        // Order of priority.
        // 1. Factory, which can be a function we need to invoke to get a value from or a value
        // 2. moduleResult, which is basically anything that was returned by the module when it was loaded
        // 3. exports, which is a place holder in a module for modules to inject what they was to exposed to the world
        //
        return (resolved[module.name] = _result(module.factory, module.resolved, Module.settings.global) || moduleResult || module.exports);
      });
    };


    Module.injection = function( moduleMeta, moduleContent ) {
      return (new Function("Module", "module", "content", Module.injection.__module))(Module, moduleMeta, moduleContent);
    };


    Module.injection.__module = "var d = this.define;\n var r = this.require;\n var exports = module.exports;\n var result;\n" +
      "this.require = function() {\n return Module.require.apply(module, arguments); \n}\n" +
      "this.define = function() {\n Module.adapters.apply(module, arguments); \n};\n" +
      "try {\n result = eval(content); \n}finally{\n this.require = r;\n this.define = d; \n}\n" +
      "return result;";


    /**
    * Takes in a module name and options to create a proper moduleMeta object needed to load the module
    *
    // moduleMeta is an object used for collecting information about a module file being loaded. This
    // is where we are storing information such as anonymously modules, names modules, exports and so on.
    // This information is used to figure out if we have and AMD, CJS, or just a plain ole module pattern.
    */
    Module.configure = function(name, options) {
      options = options || Module.settings;
      options.baseUrl = options.baseUrl || Module.settings.baseUrl;

      return {
        name: name,
        file: File.factory(name, options.baseUrl),
        settings: options,
        anonymous: [],
        modules: {},
        deps :[],
        exports: {}
      };
    };


    /**
    * Adapter interfaces to define modules
    */
    Module.adapters = function(name, deps, factory) {
      var _signature = ["", typeof name, typeof deps, typeof factory].join("/");
      var _adapter   = Module.adapters[_signature];
      if ( _adapter ) {
        return _adapter.apply(this, arguments);
      }
    };

    Module.adapters["/string/function/undefined"] = function(name, factory) {
      var context = this;
      context.modules[name] = {
        name: name,
        deps: [],
        factory: factory
      };
    };

    Module.adapters["/string/object/undefined"] = function(name, data) {
      var context = this;
      context.modules[name] = {
        name: name,
        deps: [],
        factory: data
      };
    };

    Module.adapters["/string/object/function"] = function(name, deps, factory) {
      var context = this;
      context.modules[name] = {
        name: name,
        deps: deps,
        factory: factory
      };
    };

    Module.adapters["/object/function/undefined"] = function(deps, factory) {
      var context = this;
      context.anonymous.push({
        name: context.name,
        deps: deps,
        factory: factory
      });
    };

    Module.adapters["/object/undefined/undefined"] = function(data) {
      var context = this;
      context.anonymous.push({
        name: context.name,
        deps: [],
        factory: data
      });
    };

    Module.adapters["/function/undefined/undefined"] = function(factory) {
      var context = this;
      context.anonymous.push({
        name: context.name,
        deps: [],
        factory: factory
      });
    };

    Module.settings = {
      global: this,
      baseUrl: "",
      cache: true,
      deps: []
    };


    /**
    * File parsers
    */
    function File(settings, base) {
      this.base     = base;
      this.name     = settings.name;
      this.path     = settings.path;
      this.protocol = settings.protocol;
    }

    /**
    */
    File.prototype.toUrl = function() {
      var file = this;
      var protocol = file.protocol ? file.protocol + "//" : "";
      return protocol + file.path + "/" + file.name + ".js";
    };

    /**
    */
    File.factory = function( file, base ) {
      file = File.parsePath(file);
      if ( file.protocol ) {
        return new File(File.parseFile(file), base);
      }

      var baseUrl = File.parsePath(base);
      var basePath = baseUrl.path.split("/"),
          name = file.path.split("/"),
          length = name.length, skip = 0;

      while ( length-- !== 0 ) {
        if ( name[0] === ".." ) {
          name.shift();
          skip++;
        }
        else if ( name[0] === "." ) {
          name.shift();
        }
        else {
          break;
        }
      }

      skip = basePath.length > skip ? skip : basePath.length;
      basePath.splice((basePath.length-1) - skip, skip);
      basePath = basePath.join("/");
      return new File(File.parseFile({protocol: baseUrl.protocol, path: basePath + name.join("/") }), base);
    };

    /**
    * Extract path and protocol
    */
    File.parsePath = function(file) {
      var offset   = file.indexOf("://") + 3,
          path     = offset !== 2 ? file.substr( offset ) : file,
          protocol = offset !== 2 ? file.substr(0, offset - 2) : "";

      return {
        path: File.normalizeSlashes(path),
        protocol: protocol
      };
    };

    /**
    * Build and file object with the important pieces
    */
    File.parseFile = function( file ) {
      var fileParts = file.path.split("/");
      return {
        name: fileParts.pop(),
        path: fileParts.join("/"),
        protocol: file.protocol
      };
    };

    /**
    * Make sure we only have forward slashes and we dont have any duplicate slashes
    */
    File.normalizeSlashes = function( path ) {
      return path.replace(/\/+|\\+/g, "/");
    };

    /**
    * Lets get rid of the trailing slash
    */
    File.stripTrailingSlashes = function(path) {
      return path.replace(/\/$/, "");
    };

    Module.define.amd = {};
    //root.require = Module.require;
    //root.define  = Module.define;
    return Module;
  });

})(this);
