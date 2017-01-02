import AppDispatcher from '../dispatcher/app-dispatcher.jsx';
import { EventEmitter } from 'events';
import objectAssign from 'object-assign';

console.log('termstore loaded');

// Define initial data points
var term = null;

function loadTermData(data) {
	console.log('loading some term data');
 	term = data[0];
}

// Add term to store
var TermStore = objectAssign({}, EventEmitter.prototype, {

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	getTerm: function() {
		return term;
	}
});



// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
  	
  	var action = payload.action;

  	switch(action.actionType) {

    	// Respond to STORE_SEARCH_TERM action
    	case "STORE_SEARCH_TERM":
      		loadTermData(action.data);
      	break;

    	// Respond to SOMETHING_ELSE_TO_BE_USED action
    	case "SOMETHING_ELSE_TO_BE_USED":
      		loadTermData(action.data);
      	break;

    	default:
      		return true;
  	}

  	// If action was responded to, emit change event
  	TermStore.emitChange();
  	return true;

});

module.exports = TermStore;

