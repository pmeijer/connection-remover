/*globals define, _, DEBUG, $*/
/*jshint browser: true*/

/**
 * @author rkereskenyi / https://github.com/rkereskenyi
 */


define([
    'js/Constants',
    'js/NodePropertyNames',
    'js/Widgets/PartBrowser/PartBrowserWidget.DecoratorBase',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.Constants',
    'text!../DiagramDesigner/ConnRemoverDecorator.DiagramDesignerWidget.html',
    'css!../DiagramDesigner/ConnRemoverDecorator.DiagramDesignerWidget.css',
    'css!./ConnRemoverDecorator.PartBrowserWidget.css'
], function (CONSTANTS,
             nodePropertyNames,
             PartBrowserWidgetDecoratorBase,
             DiagramDesignerWidgetConstants,
             ConnRemoverDecoratorDiagramDesignerWidgetTemplate) {

    'use strict';

    var ConnRemoverDecoratorPartBrowserWidget,
        __parent__ = PartBrowserWidgetDecoratorBase,
        DECORATOR_ID = 'ConnRemoverDecoratorPartBrowserWidget';

    ConnRemoverDecoratorPartBrowserWidget = function (options) {
        var opts = _.extend({}, options);

        __parent__.apply(this, [opts]);

        this.logger.debug('ConnRemoverDecoratorPartBrowserWidget ctor');
    };

    _.extend(ConnRemoverDecoratorPartBrowserWidget.prototype, __parent__.prototype);
    ConnRemoverDecoratorPartBrowserWidget.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    ConnRemoverDecoratorPartBrowserWidget.prototype.$DOMBase = (function () {
        var el = $(ConnRemoverDecoratorDiagramDesignerWidgetTemplate);
        //use the same HTML template as the ConnRemoverDecorator.DiagramDesignerWidget
        //but remove the connector DOM elements since they are not needed in the PartBrowser
        el.find('.' + DiagramDesignerWidgetConstants.CONNECTOR_CLASS).remove();
        return el;
    })();

    ConnRemoverDecoratorPartBrowserWidget.prototype.beforeAppend = function () {
        this.$el = this.$DOMBase.clone();

        //find name placeholder
        this.skinParts.$name = this.$el.find('.name');

        this._renderContent();
    };

    ConnRemoverDecoratorPartBrowserWidget.prototype.afterAppend = function () {
    };

    ConnRemoverDecoratorPartBrowserWidget.prototype._renderContent = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);

        //render GME-ID in the DOM, for debugging
        if (DEBUG) {
            this.$el.attr({'data-id': this._metaInfo[CONSTANTS.GME_ID]});
        }

        if (nodeObj) {
            this.skinParts.$name.text(nodeObj.getAttribute(nodePropertyNames.Attributes.name) || '');
        }
    };

    ConnRemoverDecoratorPartBrowserWidget.prototype.update = function () {
        this._renderContent();
    };

    return ConnRemoverDecoratorPartBrowserWidget;
});