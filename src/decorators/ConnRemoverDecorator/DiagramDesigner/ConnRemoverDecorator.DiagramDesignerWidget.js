/*globals define, _, $*/
/*jshint browser: true, camelcase: false*/

/**
 * @author pmeijer / https://github.com/pmeijer
 */

define([
    'js/Constants',
    'js/NodePropertyNames',
    'js/Widgets/DiagramDesigner/DiagramDesignerWidget.DecoratorBase',
    'text!./ConnRemoverDecorator.DiagramDesignerWidget.html',
    'css!./ConnRemoverDecorator.DiagramDesignerWidget.css'
], function (CONSTANTS, nodePropertyNames, DiagramDesignerWidgetDecoratorBase, ConnRemoverDecoratorTemplate) {

    'use strict';

    var ConnRemoverDecorator,
        __parent__ = DiagramDesignerWidgetDecoratorBase,
        __parent_proto__ = DiagramDesignerWidgetDecoratorBase.prototype,
        DECORATOR_ID = 'ConnRemoverDecorator';

    ConnRemoverDecorator = function (options) {
        var opts = _.extend({}, options);

        __parent__.apply(this, [opts]);

        this.name = '';

        this.logger.debug('ConnRemoverDecorator ctor');
    };

    _.extend(ConnRemoverDecorator.prototype, __parent_proto__);
    ConnRemoverDecorator.prototype.DECORATORID = DECORATOR_ID;

    /*********************** OVERRIDE DiagramDesignerWidgetDecoratorBase MEMBERS **************************/

    ConnRemoverDecorator.prototype.$DOMBase = $(ConnRemoverDecoratorTemplate);

    ConnRemoverDecorator.prototype.on_addTo = function () {
        var self = this,
            client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            nodeId,
            parent,
            base;

        if (nodeObj &&
            nodeObj.getMetaTypeId() !== nodeObj.getId() &&
            nodeObj.isReadOnly() === false &&
            (typeof nodeObj.getPointerId('src') !== 'string' || typeof nodeObj.getPointerId('dst') !== 'string')) {

            parent = nodeObj.getParentId();
            base = nodeObj.getBaseId();

            if (typeof base === 'string' && typeof parent === 'string') {
                // Makes sure we don't delete the FCO or ROOT.
                base = client.getNode(base);
                parent = client.getNode(parent);

                if (base && parent && base.getParentId() !== parent.getBaseId()) {
                    // Not an inherited child.
                    nodeId = nodeObj.getId();
                    client.startTransaction();

                    setTimeout(function () {
                        client.deleteNode(nodeId, 'Connection node [ ' + nodeObj.getId() +
                            ' ] without src or dst removed by ConnRemoverDecorator.');
                        client.completeTransaction();
                    });
                }
            }
        }

        this._renderName();

        //let the parent decorator class do its job first
        __parent_proto__.on_addTo.apply(this, arguments);
    };

    ConnRemoverDecorator.prototype._renderName = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]);

        //render GME-ID in the DOM, for debugging
        this.$el.attr({'data-id': this._metaInfo[CONSTANTS.GME_ID]});

        if (nodeObj) {
            this.name = nodeObj.getAttribute(nodePropertyNames.Attributes.name) || '';
        }

        //find name placeholder
        this.skinParts.$name = this.$el.find('.name');
        this.skinParts.$name.text(this.name);
    };

    ConnRemoverDecorator.prototype.update = function () {
        var client = this._control._client,
            nodeObj = client.getNode(this._metaInfo[CONSTANTS.GME_ID]),
            newName = '';

        if (nodeObj) {
            newName = nodeObj.getAttribute(nodePropertyNames.Attributes.name) || '';

            if (this.name !== newName) {
                this.name = newName;
                this.skinParts.$name.text(this.name);
            }
        }
    };

    ConnRemoverDecorator.prototype.getConnectionAreas = function (id /*, isEnd, connectionMetaInfo*/) {
        var result = [],
            edge = 10,
            LEN = 20;

        //by default return the bounding box edge's midpoints

        if (id === undefined || id === this.hostDesignerItem.id) {
            //NORTH
            result.push({
                id: '0',
                x1: edge,
                y1: 0,
                x2: this.hostDesignerItem.getWidth() - edge,
                y2: 0,
                angle1: 270,
                angle2: 270,
                len: LEN
            });

            //EAST
            result.push({
                id: '1',
                x1: this.hostDesignerItem.getWidth(),
                y1: edge,
                x2: this.hostDesignerItem.getWidth(),
                y2: this.hostDesignerItem.getHeight() - edge,
                angle1: 0,
                angle2: 0,
                len: LEN
            });

            //SOUTH
            result.push({
                id: '2',
                x1: edge,
                y1: this.hostDesignerItem.getHeight(),
                x2: this.hostDesignerItem.getWidth() - edge,
                y2: this.hostDesignerItem.getHeight(),
                angle1: 90,
                angle2: 90,
                len: LEN
            });

            //WEST
            result.push({
                id: '3',
                x1: 0,
                y1: edge,
                x2: 0,
                y2: this.hostDesignerItem.getHeight() - edge,
                angle1: 180,
                angle2: 180,
                len: LEN
            });
        }

        return result;
    };

    ConnRemoverDecorator.prototype.doSearch = function (searchDesc) {
        var searchText = searchDesc.toString();
        if (this.name && this.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
            return true;
        }

        return false;
    };

    return ConnRemoverDecorator;
});