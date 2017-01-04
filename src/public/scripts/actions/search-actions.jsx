import AppDispatcher from '../dispatcher/app-dispatcher.jsx';
import CollectionsAPI from '../search/collections-api.jsx';

// Define actions object
var SearchActions = {

  	// GET SEARCH TERM
  	storeSearchTerm: function(data) {

    	AppDispatcher.handleAction({
      		actionType: 'STORE_SEARCH_TERM',
      		data: data
    	});
  	},

  	// GET SEARCH TERM RESULTS
  	getSearchResults: function(searchObject) {
  		
  		AppDispatcher.handleAction({
      		actionType: 'GET_RESULTS'
    	});

    	CollectionsAPI.searchForTerm(searchObject);
  	} 
}

module.exports = SearchActions;