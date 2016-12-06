import AppDispatcher from '../dispatcher/app-dispatcher.jsx';

// Define actions object
var SearchActions = {

  	// GET SEARCH TERM
  	getSearchTerm: function(data) {

    	AppDispatcher.handleAction({
      		actionType: 'GET_SEARCH_TERM',
      		data: data
    	})
  	}
}

module.exports = SearchActions;