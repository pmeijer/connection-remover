/*globals define, _*/
/*jshint browser: true, camelcase: false*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */

define([
    'js/Decorators/DecoratorBase',
    './DiagramDesigner/ConnRemoverDecorator.DiagramDesignerWidget',
    './PartBrowser/ConnRemoverDecorator.PartBrowserWidget'
], function (DecoratorBase, ConnRemoverDecoratorDiagramDesignerWidget, ConnRemoverDecoratorPartBrowserWidget) {

    'use strict';

    var ConnRemoverDecorator,
        __parent__ = DecoratorBase,
        __parent_proto__ = DecoratorBase.prototype,
        DECORATOR_ID = 'ConnRemoverDecorator';

    ConnRemoverDecorator = function (params) {
        var opts = _.extend({loggerName: this.DECORATORID}, params);

        __parent__.apply(this, [opts]);

        this.logger.debug('ConnRemoverDecorator ctor');
    };

    _.extend(ConnRemoverDecorator.prototype, __parent_proto__);
    ConnRemoverDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DecoratorBase MEMBERS **************************/

    ConnRemoverDecorator.prototype.initializeSupportedWidgetMap = function () {
        this.supportedWidgetMap = {
            DiagramDesigner: ConnRemoverDecoratorDiagramDesignerWidget,
            PartBrowser: ConnRemoverDecoratorPartBrowserWidget
        };
    };

    return ConnRemoverDecorator;
});