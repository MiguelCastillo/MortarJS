(function(root) {

  define([
    "src/fetch",
    "src/spromise"
  ], function(Fetch, Promise) {
    "use strict";

    var cache = {};
    var injectModule = "var d = this.define || function() {};\n var result;\n this.define = function() {\n adapters.apply(module, arguments); \n};\n try {\n result = eval(content); \n}finally{\n this.define = d; }\n return result;";
    function _injectModule( moduleMeta, moduleContent ) { return (new Function("adapters", "module", "content", injectModule))(Module.adapters, moduleMeta, moduleContent); }
    function _result(input, args, context) { if (typeof(input) === "function") {return input.apply(context||this, args);} return input; }

    function Module() {
      return Module.define.apply(this, arguments);
    }

    /**
    * AMD compliant define interface
    */
    Module.define = function(name, dependencies, factory) {
      throw new TypeError("Define not implemented");
    };

    /**
    * AMD/CJS compliant require interface
    */
    Module.require = function(name, options) {
      if (name in cache) {
        return cache[name];
      }

      options = options || Module.settings;
      options.baseUrl = options.baseUrl || Module.settings.baseUrl;
      var file = File.factory(name, options.baseUrl);
      var moduleMeta = {name: name, file: file, settings: options, anonymous: [], modules: {}};
      return (cache[name] = Module.load(moduleMeta));
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
        return Module.finalize(moduleMeta, _injectModule(moduleMeta, moduleContent));
      });
    };

    /**
    */
    Module.finalize = function(moduleMeta) {
      var mainModule = moduleMeta.modules[moduleMeta.name], pending = [];
      var currentModule, i, length;

      if ( mainModule ) {
        delete moduleMeta.modules[moduleMeta.name];
      }
      else {
        mainModule = moduleMeta.anonymous.shift();
      }

      // In order to allow modules to not depend in the order in which they are loaded, the
      // modules need to be added as pending so that a later step to actually load them can
      // allow for modules to depend on other modules that are pending.

      // First make sure we add all modules as pending so that they can be inner dependent
      for (var iModule in moduleMeta.modules) {
        currentModule = moduleMeta.modules[iModule];
        if ( !cache[currentModule.name] ) {
          cache[currentModule.name] = Promise.defer();
          pending.push(currentModule);
        }
      }

      // Now that the modules are pending, load them
      for (i = 0, length = pending.length; i < length; i++) {
        Module.resolve(pending[i]).done(cache[pending[i].name].resolve);
      }

      return Module.resolve(mainModule, true);
    };

    /**
    * Resolve a module dependencies
    */
    Module.resolve = function(module) {
      var i, length;
      var dependencies = module.dependencies || [], deps = [];

      for ( i = 0, length = dependencies.length; i < length; i++ ) {
        deps.push( Module.require(dependencies[i]) );
      }

      return Promise.when.apply(module, deps).then(function() {
        var i, length;
        for ( i = 0, length = deps.length; i < length; i++ ) {
          deps[i] = arguments[i];
        }

        module.resolved = deps;
        return _result(module.factory, deps, Module.settings.global);
      });
    };

    /**
    * Adapter interfaces to define modules
    */
    Module.adapters = function(name, dependencies, factory) {
      var _signature = ["", typeof name, typeof dependencies, typeof factory].join("/");
      var _adapter   = Module.adapters[_signature];
      if ( _adapter ) {
        return _adapter.apply(this, arguments);
      }
    };

    Module.adapters["/string/function/undefined"] = function(name, factory) {
      var context = this;
      context.modules[name] = {
        name: name,
        factory: factory
      };
    };

    Module.adapters["/string/object/undefined"] = function(name, data) {
      var context = this;
      context.modules[name] = {
        name: name,
        factory: data
      };
    };

    Module.adapters["/string/object/function"] = function(name, dependencies, factory) {
      var context = this;
      context.modules[name] = {
        name: name,
        dependencies: dependencies,
        factory: factory
      };
    };

    Module.adapters["/object/function/undefined"] = function(dependencies, factory) {
      var context = this;
      context.anonymous.push({
        name: context.name,
        dependencies: dependencies,
        factory: factory
      });
    };

    Module.adapters["/object/undefined/undefined"] = function(data) {
      var context = this;
      context.anonymous.push({
        name: context.name,
        factory: data
      });
    };

    Module.adapters["/function/undefined/undefined"] = function(factory) {
      var context = this;
      context.anonymous.push({
        name: context.name,
        factory: factory
      });
    };

    Module.settings = {
      global: this,
      baseUrl: "",
      cache: true,
      dependencies: []
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

    File.prototype.toUrl = function() {
      var file = this;
      var protocol = file.protocol ? file.protocol + "//" : "";
      return protocol + file.path + "/" + file.name + ".js";
    };

    /**
    *
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

    //root.require = Module.require;
    //root.define  = Module.define;
    Module.define.amd = {};
    return Module;
  });

})(this);
