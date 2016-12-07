import AppDispatcher from '../dispatcher/app-dispatcher.jsx';
import { EventEmitter } from 'events';
import objectAssign from 'object-assign';

console.log('termstore loaded');

// Define initial data points
var terms = [];

// Add term to store
var termStore = assign({}, EventEmitter.prototype, {

	emitChange: function() {
    	this.emit('change');
  	},

  	addChangeListener: function(callback) {
    	this.on('change', callback);
  	},

  	removeChangeListener: function(callback) {
    	this.removeListener('change', callback);
  	},

  	getAll: function() {
    	return comments;
  	}
});

