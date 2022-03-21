/* global define */
/*
  We use a specific wrapper to support different inclussion contexts
  for this script.
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (require.js). Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory();
    } else if (typeof window.RClientWindowMessenger === 'undefined') {
        // Browser globals
        window.RClientWindowMessenger = factory();
    }
}(function() {
    'use strict';

    /*
    {
      // maps message type to MessageListeners
      'message type': [
        function() {},
        ...
      ]
    }
    */
    const messageTypes = new Map();
    // window.opener is set if this Window was opened using window.open. Otherwise, we use
    // the top most Window in the stack of iframes
    const targetWindow = window.opener || window.top;
    const POST_MESSAGE_TYPE = 'RClientWindowMessenger';

    const WindowMessenger = {
        /**
         * @typedef MessageListener
         * @type Object
         * @property {String} messageType Type associated with a message
         * @property {Function|Function[]} handlers Message handler(s)
         */

        /**
         * @typedef Message
         * @type Object
         * @property {String} messageType Type associated with a message
         * @property {*} data Application data
         */

        /**
         * Adds multiple message listeners.
         *
         * @param {MessageListener[]} listeners Message listeners to add
         * @returns {void}
         */
        addMessageListeners: function(listeners) {
            listeners.forEach(function(listener) {
                var messageListeners = messageTypes.get(listener.messageType);
                if (!messageListeners) {
                    messageListeners = new Set();
                    messageTypes.set(listener.messageType, messageListeners);
                }

                messageListeners.add(listener);
            });
        },

        /**
         * Adds a message listener.
         *
         * @param {MessageListener} listener Message listener to add
         * @returns {void}
         */
        addMessageListener: function(listener) {
            WindowMessenger.addMessageListeners([listener]);
        },

        /**
         * Removes a message listener.
         * If `listener.handlers` is not provided, all listeners are removed
         * from `listener.messageType`.
         *
         * @param {MessageListener} listener Message listener to remove
         * @returns {void}
         */
        removeMessageListener: function(listener) {
            if (!listener.handlers) {
                // remove all data tied to this message type
                messageTypes.delete(listener.messageType);
            } else {
                // remove specific listener for this message type
                var listeners = messageTypes.get(listener.messageType);
                listeners && listeners.delete(listener);
            }
        },

        /**
         * Sends a message to LCU Window
         *
         * @param {Message} message Message to send
         * @returns {void}
         */
        sendMessage: function(message) {
            // clone message to avoid moddifying the source object
            message = WindowMessenger.clone(message);
            message.type = POST_MESSAGE_TYPE;
            targetWindow.postMessage(message, '*');
        },

        /**
         * Dispatch message to message listeners
         *
         * @private
         * @param {Event} e Post message event
         * @param {*} e.data Data sent with post message
         * @param {Window} e.source Window that sent the post message
         * @returns {void}
         */
        dispatchMessage: function(e) {
            var data = e.data;
            var origin = e.origin;
            var domainAllowed = origin.includes('://localhost') || origin.includes('://127.0.0.1');

            if (data.type !== POST_MESSAGE_TYPE || !domainAllowed) {
                // ignore post messages with different type
                return;
            }

            var listeners = messageTypes.get(data.messageType);
            if (!listeners) {
                // no listeners defined for message type
                return;
            }

            listeners.forEach(function(listener) {
                WindowMessenger.toArray(listener.handlers).forEach(function(handler) {
                    handler(data.messageType, WindowMessenger.clone(data.data), e.source, e.origin);
                });
            });
        },

        /**
         * Clone object. If `value` is not an object, it's returned as is.
         *
         * @private
         * @param {*} value Value to clone
         * @returns {*} Cloned object, or `value`
         */
        clone: function(value) {
            if (typeof value !== 'object') {
                return value;
            }

            // deep copy data
            return JSON.parse(JSON.stringify(value));
        },

        /**
         * Put `value` in an array. If `value` is an array, it's returned as is.
         *
         * @private
         * @param {*} value Value to put in array
         * @returns {Array} Value in an array, or `value`
         */
        toArray: function(value) {
            return [].concat(value);
        }
    };

    window.addEventListener('message', WindowMessenger.dispatchMessage);

    return WindowMessenger;
}));
/*  |xGv00|cfdb6ae6c29c91bd4d4f557c982ee6f1 */