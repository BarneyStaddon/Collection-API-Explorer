import AppDispatcher from '../dispatcher/app-dispatcher.jsx';
import { EventEmitter } from 'events';
import objectAssign from 'object-assign';

// Define initial data points
var term = null;

function loadTermData(data) {
 	term = data;
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

    	case "STORE_SEARCH_TERM":
      		loadTermData(action.data);
      	break;

    	case "SOME_OTHER_ACTIONTYPE":
      		//do whatever
      	break;

    	default:
      		return true;
  	}

  	TermStore.emitChange();
  	return true;

});

module.exports = TermStore;

