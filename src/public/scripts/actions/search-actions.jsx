import AppDispatcher from '../dispatcher/app-dispatcher.jsx';

// Define actions object
var SearchActions = {

  	// GET SEARCH TERM
  	storeSearchTerm: function(data) {

    	AppDispatcher.handleAction({
      		actionType: 'STORE_SEARCH_TERM',
      		data: data
    	})
  	}
}

module.exports = SearchActions;