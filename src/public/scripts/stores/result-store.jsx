import AppDispatcher from '../dispatcher/app-dispatcher.jsx';
import { EventEmitter } from 'events';
import objectAssign from 'object-assign';

// Define initial data points
var result = null;

function loadResultData(data) {
 	result = data;
}

// Add term to store
var ResultStore = objectAssign({}, EventEmitter.prototype, {

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	getResult: function() {
		return result;
	}
});



// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
  	
  	var action = payload.action;

  	switch(action.actionType) {

    	case "RECEIVE_RESULTS_RESPONSE":
      		loadResultData(action.data);
      	break;

    	case "SOME_OTHER_ACTIONTYPE":
      		loadResultData(action.data);
      	break;

    	default:
      		return true;
  	}

  	ResultStore.emitChange();
  	return true;

});

module.exports = ResultStore;

