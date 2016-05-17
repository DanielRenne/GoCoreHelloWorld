'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var promise_1 = require('angular2/src/facade/promise');
var collection_1 = require('angular2/src/facade/collection');
var url_parser_1 = require('../url_parser');
var instruction_1 = require('../instruction');
// RouteMatch objects hold information about a match between a rule and a URL
var RouteMatch = (function () {
    function RouteMatch() {
    }
    return RouteMatch;
})();
exports.RouteMatch = RouteMatch;
var PathMatch = (function (_super) {
    __extends(PathMatch, _super);
    function PathMatch(instruction, remaining, remainingAux) {
        _super.call(this);
        this.instruction = instruction;
        this.remaining = remaining;
        this.remainingAux = remainingAux;
    }
    return PathMatch;
})(RouteMatch);
exports.PathMatch = PathMatch;
var RedirectMatch = (function (_super) {
    __extends(RedirectMatch, _super);
    function RedirectMatch(redirectTo, specificity) {
        _super.call(this);
        this.redirectTo = redirectTo;
        this.specificity = specificity;
    }
    return RedirectMatch;
})(RouteMatch);
exports.RedirectMatch = RedirectMatch;
var RedirectRule = (function () {
    function RedirectRule(_pathRecognizer, redirectTo) {
        this._pathRecognizer = _pathRecognizer;
        this.redirectTo = redirectTo;
        this.hash = this._pathRecognizer.hash;
    }
    Object.defineProperty(RedirectRule.prototype, "path", {
        get: function () { return this._pathRecognizer.toString(); },
        set: function (val) { throw new exceptions_1.BaseException('you cannot set the path of a RedirectRule directly'); },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns `null` or a `ParsedUrl` representing the new path to match
     */
    RedirectRule.prototype.recognize = function (beginningSegment) {
        var match = null;
        if (lang_1.isPresent(this._pathRecognizer.matchUrl(beginningSegment))) {
            match = new RedirectMatch(this.redirectTo, this._pathRecognizer.specificity);
        }
        return promise_1.PromiseWrapper.resolve(match);
    };
    RedirectRule.prototype.generate = function (params) {
        throw new exceptions_1.BaseException("Tried to generate a redirect.");
    };
    return RedirectRule;
})();
exports.RedirectRule = RedirectRule;
// represents something like '/foo/:bar'
var RouteRule = (function () {
    // TODO: cache component instruction instances by params and by ParsedUrl instance
    function RouteRule(_routePath, handler) {
        this._routePath = _routePath;
        this.handler = handler;
        this._cache = new collection_1.Map();
        this.specificity = this._routePath.specificity;
        this.hash = this._routePath.hash;
        this.terminal = this._routePath.terminal;
    }
    Object.defineProperty(RouteRule.prototype, "path", {
        get: function () { return this._routePath.toString(); },
        set: function (val) { throw new exceptions_1.BaseException('you cannot set the path of a RouteRule directly'); },
        enumerable: true,
        configurable: true
    });
    RouteRule.prototype.recognize = function (beginningSegment) {
        var _this = this;
        var res = this._routePath.matchUrl(beginningSegment);
        if (lang_1.isBlank(res)) {
            return null;
        }
        return this.handler.resolveComponentType().then(function (_) {
            var componentInstruction = _this._getInstruction(res.urlPath, res.urlParams, res.allParams);
            return new PathMatch(componentInstruction, res.rest, res.auxiliary);
        });
    };
    RouteRule.prototype.generate = function (params) {
        var generated = this._routePath.generateUrl(params);
        var urlPath = generated.urlPath;
        var urlParams = generated.urlParams;
        return this._getInstruction(urlPath, url_parser_1.convertUrlParamsToArray(urlParams), params);
    };
    RouteRule.prototype.generateComponentPathValues = function (params) {
        return this._routePath.generateUrl(params);
    };
    RouteRule.prototype._getInstruction = function (urlPath, urlParams, params) {
        if (lang_1.isBlank(this.handler.componentType)) {
            throw new exceptions_1.BaseException("Tried to get instruction before the type was loaded.");
        }
        var hashKey = urlPath + '?' + urlParams.join('&');
        if (this._cache.has(hashKey)) {
            return this._cache.get(hashKey);
        }
        var instruction = new instruction_1.ComponentInstruction(urlPath, urlParams, this.handler.data, this.handler.componentType, this.terminal, this.specificity, params);
        this._cache.set(hashKey, instruction);
        return instruction;
    };
    return RouteRule;
})();
exports.RouteRule = RouteRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9zcmMvcm91dGVyL3J1bGVzL3J1bGVzLnRzIl0sIm5hbWVzIjpbIlJvdXRlTWF0Y2giLCJSb3V0ZU1hdGNoLmNvbnN0cnVjdG9yIiwiUGF0aE1hdGNoIiwiUGF0aE1hdGNoLmNvbnN0cnVjdG9yIiwiUmVkaXJlY3RNYXRjaCIsIlJlZGlyZWN0TWF0Y2guY29uc3RydWN0b3IiLCJSZWRpcmVjdFJ1bGUiLCJSZWRpcmVjdFJ1bGUuY29uc3RydWN0b3IiLCJSZWRpcmVjdFJ1bGUucGF0aCIsIlJlZGlyZWN0UnVsZS5yZWNvZ25pemUiLCJSZWRpcmVjdFJ1bGUuZ2VuZXJhdGUiLCJSb3V0ZVJ1bGUiLCJSb3V0ZVJ1bGUuY29uc3RydWN0b3IiLCJSb3V0ZVJ1bGUucGF0aCIsIlJvdXRlUnVsZS5yZWNvZ25pemUiLCJSb3V0ZVJ1bGUuZ2VuZXJhdGUiLCJSb3V0ZVJ1bGUuZ2VuZXJhdGVDb21wb25lbnRQYXRoVmFsdWVzIiwiUm91dGVSdWxlLl9nZXRJbnN0cnVjdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxQkFBaUMsMEJBQTBCLENBQUMsQ0FBQTtBQUM1RCwyQkFBNEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUM3RCx3QkFBNkIsNkJBQTZCLENBQUMsQ0FBQTtBQUMzRCwyQkFBa0IsZ0NBQWdDLENBQUMsQ0FBQTtBQUduRCwyQkFBMkMsZUFBZSxDQUFDLENBQUE7QUFDM0QsNEJBQW1DLGdCQUFnQixDQUFDLENBQUE7QUFLcEQsNkVBQTZFO0FBQzdFO0lBQUFBO0lBQWtDQyxDQUFDQTtJQUFERCxpQkFBQ0E7QUFBREEsQ0FBQ0EsQUFBbkMsSUFBbUM7QUFBYixrQkFBVSxhQUFHLENBQUE7QUFFbkM7SUFBK0JFLDZCQUFVQTtJQUN2Q0EsbUJBQW1CQSxXQUFpQ0EsRUFBU0EsU0FBY0EsRUFDeERBLFlBQW1CQTtRQUNwQ0MsaUJBQU9BLENBQUNBO1FBRlNBLGdCQUFXQSxHQUFYQSxXQUFX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LElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLEVBQUVBLFdBQVdBLENBQUNBLENBQUNBO1FBRXRDQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQTtJQUNyQkEsQ0FBQ0E7SUFDSE4sZ0JBQUNBO0FBQURBLENBQUNBLEFBekRELElBeURDO0FBekRZLGlCQUFTLFlBeURyQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge1Byb21pc2VXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL3Byb21pc2UnO1xuaW1wb3J0IHtNYXB9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5cbmltcG9ydCB7Um91dGVIYW5kbGVyfSBmcm9tICcuL3JvdXRlX2hhbmRsZXJzL3JvdXRlX2hhbmRsZXInO1xuaW1wb3J0IHtVcmwsIGNvbnZlcnRVcmxQYXJhbXNUb0FycmF5fSBmcm9tICcuLi91cmxfcGFyc2VyJztcbmltcG9ydCB7Q29tcG9uZW50SW5zdHJ1Y3Rpb259IGZyb20gJy4uL2luc3RydWN0aW9uJztcbmltcG9ydCB7Um91dGVQYXRofSBmcm9tICcuL3JvdXRlX3BhdGhzL3JvdXRlX3BhdGgnO1xuaW1wb3J0IHtHZW5lcmF0ZWRVcmx9IGZyb20gJy4vcm91dGVfcGF0aHMvcm91dGVfcGF0aCc7XG5cblxuLy8gUm91dGVNYXRjaCBvYmplY3RzIGhvbGQgaW5mb3JtYXRpb24gYWJvdXQgYSBtYXRjaCBiZXR3ZWVuIGEgcnVsZSBhbmQgYSBVUkxcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSb3V0ZU1hdGNoIHt9XG5cbmV4cG9ydCBjbGFzcyBQYXRoTWF0Y2ggZXh0ZW5kcyBSb3V0ZU1hdGNoIHtcbiAgY29uc3RydWN0b3IocHVibGljIGluc3RydWN0aW9uOiBDb21wb25lbnRJbnN0cnVjdGlvbiwgcHVibGljIHJlbWFpbmluZzogVXJsLFxuICAgICAgICAgICAgICBwdWJsaWMgcmVtYWluaW5nQXV4OiBVcmxbXSkge1xuICAgIHN1cGVyKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlZGlyZWN0TWF0Y2ggZXh0ZW5kcyBSb3V0ZU1hdGNoIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlZGlyZWN0VG86IGFueVtdLCBwdWJsaWMgc3BlY2lmaWNpdHkpIHsgc3VwZXIoKTsgfVxufVxuXG4vLyBSdWxlcyBhcmUgcmVzcG9uc2libGUgZm9yIHJlY29nbml6aW5nIFVSTCBzZWdtZW50cyBhbmQgZ2VuZXJhdGluZyBpbnN0cnVjdGlvbnNcbmV4cG9ydCBpbnRlcmZhY2UgQWJzdHJhY3RSdWxlIHtcbiAgaGFzaDogc3RyaW5nO1xuICBwYXRoOiBzdHJpbmc7XG4gIHJlY29nbml6ZShiZWdpbm5pbmdTZWdtZW50OiBVcmwpOiBQcm9taXNlPFJvdXRlTWF0Y2g+O1xuICBnZW5lcmF0ZShwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogQ29tcG9uZW50SW5zdHJ1Y3Rpb247XG59XG5cbmV4cG9ydCBjbGFzcyBSZWRpcmVjdFJ1bGUgaW1wbGVtZW50cyBBYnN0cmFjdFJ1bGUge1xuICBwdWJsaWMgaGFzaDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BhdGhSZWNvZ25pemVyOiBSb3V0ZVBhdGgsIHB1YmxpYyByZWRpcmVjdFRvOiBhbnlbXSkge1xuICAgIHRoaXMuaGFzaCA9IHRoaXMuX3BhdGhSZWNvZ25pemVyLmhhc2g7XG4gIH1cblxuICBnZXQgcGF0aCgpIHsgcmV0dXJuIHRoaXMuX3BhdGhSZWNvZ25pemVyLnRvU3RyaW5nKCk7IH1cbiAgc2V0IHBhdGgodmFsKSB7IHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCd5b3UgY2Fubm90IHNldCB0aGUgcGF0aCBvZiBhIFJlZGlyZWN0UnVsZSBkaXJlY3RseScpOyB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYG51bGxgIG9yIGEgYFBhcnNlZFVybGAgcmVwcmVzZW50aW5nIHRoZSBuZXcgcGF0aCB0byBtYXRjaFxuICAgKi9cbiAgcmVjb2duaXplKGJlZ2lubmluZ1NlZ21lbnQ6IFVybCk6IFByb21pc2U8Um91dGVNYXRjaD4ge1xuICAgIHZhciBtYXRjaCA9IG51bGw7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9wYXRoUmVjb2duaXplci5tYXRjaFVybChiZWdpbm5pbmdTZWdtZW50KSkpIHtcbiAgICAgIG1hdGNoID0gbmV3IFJlZGlyZWN0TWF0Y2godGhpcy5yZWRpcmVjdFRvLCB0aGlzLl9wYXRoUmVjb2duaXplci5zcGVjaWZpY2l0eSk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlV3JhcHBlci5yZXNvbHZlKG1hdGNoKTtcbiAgfVxuXG4gIGdlbmVyYXRlKHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0pOiBDb21wb25lbnRJbnN0cnVjdGlvbiB7XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYFRyaWVkIHRvIGdlbmVyYXRlIGEgcmVkaXJlY3QuYCk7XG4gIH1cbn1cblxuXG4vLyByZXByZXNlbnRzIHNvbWV0aGluZyBsaWtlICcvZm9vLzpiYXInXG5leHBvcnQgY2xhc3MgUm91dGVSdWxlIGltcGxlbWVudHMgQWJzdHJhY3RSdWxlIHtcbiAgc3BlY2lmaWNpdHk6IHN0cmluZztcbiAgdGVybWluYWw6IGJvb2xlYW47XG4gIGhhc2g6IHN0cmluZztcblxuICBwcml2YXRlIF9jYWNoZTogTWFwPHN0cmluZywgQ29tcG9uZW50SW5zdHJ1Y3Rpb24+ID0gbmV3IE1hcDxzdHJpbmcsIENvbXBvbmVudEluc3RydWN0aW9uPigpO1xuXG4gIC8vIFRPRE86IGNhY2hlIGNvbXBvbmVudCBpbnN0cnVjdGlvbiBpbnN0YW5jZXMgYnkgcGFyYW1zIGFuZCBieSBQYXJzZWRVcmwgaW5zdGFuY2VcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZVBhdGg6IFJvdXRlUGF0aCwgcHVibGljIGhhbmRsZXI6IFJvdXRlSGFuZGxlcikge1xuICAgIHRoaXMuc3BlY2lmaWNpdHkgPSB0aGlzLl9yb3V0ZVBhdGguc3BlY2lmaWNpdHk7XG4gICAgdGhpcy5oYXNoID0gdGhpcy5fcm91dGVQYXRoLmhhc2g7XG4gICAgdGhpcy50ZXJtaW5hbCA9IHRoaXMuX3JvdXRlUGF0aC50ZXJtaW5hbDtcbiAgfVxuXG4gIGdldCBwYXRoKCkgeyByZXR1cm4gdGhpcy5fcm91dGVQYXRoLnRvU3RyaW5nKCk7IH1cbiAgc2V0IHBhdGgodmFsKSB7IHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCd5b3UgY2Fubm90IHNldCB0aGUgcGF0aCBvZiBhIFJvdXRlUnVsZSBkaXJlY3RseScpOyB9XG5cbiAgcmVjb2duaXplKGJlZ2lubmluZ1NlZ21lbnQ6IFVybCk6IFByb21pc2U8Um91dGVNYXRjaD4ge1xuICAgIHZhciByZXMgPSB0aGlzLl9yb3V0ZVBhdGgubWF0Y2hVcmwoYmVnaW5uaW5nU2VnbWVudCk7XG4gICAgaWYgKGlzQmxhbmsocmVzKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlci5yZXNvbHZlQ29tcG9uZW50VHlwZSgpLnRoZW4oKF8pID0+IHtcbiAgICAgIHZhciBjb21wb25lbnRJbnN0cnVjdGlvbiA9IHRoaXMuX2dldEluc3RydWN0aW9uKHJlcy51cmxQYXRoLCByZXMudXJsUGFyYW1zLCByZXMuYWxsUGFyYW1zKTtcbiAgICAgIHJldHVybiBuZXcgUGF0aE1hdGNoKGNvbXBvbmVudEluc3RydWN0aW9uLCByZXMucmVzdCwgcmVzLmF1eGlsaWFyeSk7XG4gICAgfSk7XG4gIH1cblxuICBnZW5lcmF0ZShwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogQ29tcG9uZW50SW5zdHJ1Y3Rpb24ge1xuICAgIHZhciBnZW5lcmF0ZWQgPSB0aGlzLl9yb3V0ZVBhdGguZ2VuZXJhdGVVcmwocGFyYW1zKTtcbiAgICB2YXIgdXJsUGF0aCA9IGdlbmVyYXRlZC51cmxQYXRoO1xuICAgIHZhciB1cmxQYXJhbXMgPSBnZW5lcmF0ZWQudXJsUGFyYW1zO1xuICAgIHJldHVybiB0aGlzLl9nZXRJbnN0cnVjdGlvbih1cmxQYXRoLCBjb252ZXJ0VXJsUGFyYW1zVG9BcnJheSh1cmxQYXJhbXMpLCBwYXJhbXMpO1xuICB9XG5cbiAgZ2VuZXJhdGVDb21wb25lbnRQYXRoVmFsdWVzKHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0pOiBHZW5lcmF0ZWRVcmwge1xuICAgIHJldHVybiB0aGlzLl9yb3V0ZVBhdGguZ2VuZXJhdGVVcmwocGFyYW1zKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEluc3RydWN0aW9uKHVybFBhdGg6IHN0cmluZywgdXJsUGFyYW1zOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSk6IENvbXBvbmVudEluc3RydWN0aW9uIHtcbiAgICBpZiAoaXNCbGFuayh0aGlzLmhhbmRsZXIuY29tcG9uZW50VHlwZSkpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBUcmllZCB0byBnZXQgaW5zdHJ1Y3Rpb24gYmVmb3JlIHRoZSB0eXBlIHdhcyBsb2FkZWQuYCk7XG4gICAgfVxuICAgIHZhciBoYXNoS2V5ID0gdXJsUGF0aCArICc/JyArIHVybFBhcmFtcy5qb2luKCcmJyk7XG4gICAgaWYgKHRoaXMuX2NhY2hlLmhhcyhoYXNoS2V5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlLmdldChoYXNoS2V5KTtcbiAgICB9XG4gICAgdmFyIGluc3RydWN0aW9uID1cbiAgICAgICAgbmV3IENvbXBvbmVudEluc3RydWN0aW9uKHVybFBhdGgsIHVybFBhcmFtcywgdGhpcy5oYW5kbGVyLmRhdGEsIHRoaXMuaGFuZGxlci5jb21wb25lbnRUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXJtaW5hbCwgdGhpcy5zcGVjaWZpY2l0eSwgcGFyYW1zKTtcbiAgICB0aGlzLl9jYWNoZS5zZXQoaGFzaEtleSwgaW5zdHJ1Y3Rpb24pO1xuXG4gICAgcmV0dXJuIGluc3RydWN0aW9uO1xuICB9XG59XG4iXX0=