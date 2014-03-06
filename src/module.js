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
    var injectModule = "var d = this.define;\n var r = this.require;\n var exports = module.exports;\n this.require = function() {\n return Module.require.apply(module, arguments); }\n this.define = function() {\n Module.adapters.apply(module, arguments); \n};\n try {\n eval(content); \n}finally{\n this.require = r;\n this.define = d;\n}";
    function _injectModule( moduleMeta, moduleContent ) { return (new Function("Module", "module", "content", injectModule))(Module, moduleMeta, moduleContent); }
    function _result(input, args, context) { if (typeof(input) === "function") {return input.apply(context, args||[]);} return input; }
    function _noop() {}

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
      if (name in deferred) {
        return deferred[name];
      }

      var moduleMeta;
      options = options || Module.settings;
      options.baseUrl = options.baseUrl || Module.settings.baseUrl;

      if (name in pending) {
        moduleMeta = pending[name];
        delete pending[name];
        deferred[name] = Module.resolve(moduleMeta);
      }
      else {
        // moduleMeta is an object used for collecting information about a module file being
        // loaded.  This is where we are storing information such as anonymously defined modules,
        // and named modules.  If no modules are loaded, we assumed that the file being loaded
        // is the module itself which is treated as a CJS module.
        var file = File.factory(name, options.baseUrl);
        moduleMeta = {name:name, file:file, settings:options, anonymous:[], modules:{}, dependencies:[], exports:{}};
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
            moduleMeta.dependencies.push(dep);
          });

        // Currently, the only way to get these dependencies at the moduleMeta level is when
        // they are required inline in CJS format. E.g. var x = require("x");
        // If we find any of these, then we will pre load them so that they are available if
        // and when they are required.
        //
        if ( moduleMeta.dependencies.length ) {
          return Module.require(moduleMeta.dependencies).then(function() {
            return Module.finalize(moduleMeta, _injectModule(moduleMeta, moduleContent));
          });
        }
        else {
          return Module.finalize(moduleMeta, _injectModule(moduleMeta, moduleContent));
        }
      });
    };

    /**
    */
    Module.finalize = function(moduleMeta) {
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
      // and use the exports
      return Module.resolve(mainModule || moduleMeta);
    };

    /**
    * Resolve a module dependencies
    */
    Module.resolve = function(module) {
      var i, length;
      var dependencies = module.dependencies || [], deps = [];

      for ( i = 0, length = dependencies.length; i < length; i++ ) {
        deps.push( Module.import(dependencies[i]) );
      }

      return Promise.when.apply(module, deps).then(function() {
        var i, length;
        for ( i = 0, length = deps.length; i < length; i++ ) {
          deps[i] = arguments[i];
        }

        module.resolved = deps;
        return (resolved[module.name] = _result(module.factory, deps, Module.settings.global) || module.exports);
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
