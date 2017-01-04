import ServerActions from '../actions/server-actions.jsx';

// Define actions object
var CollectionsAPI = {

    // GET SEARCH TERM
  	searchForTerm: function(searchObject, resultRoute) {

    	/*
      AppDispatcher.handleAction({
      		actionType: 'STORE_SEARCH_TERM',
      		data: data
    	});
      */

      $.ajax({
            url: "/api/search",//this.props.url,
            dataType: 'json',
            type: 'POST',
            data: searchObject,
            
            success: function(data) {

                console.log('All data: ');
                console.log(data);

                ServerActions.receiveResults(data);
                resultRoute('/results');

                //this.props.resultsDataHandler(data);  
                //this.props.router.push('/results');
                
                }.bind(this),
            
            error: function(xhr, status, err) {
                    //this.setState({data: comments});
                    //console.error(this.props.url, status, err.toString());
                }.bind(this)
        });

  	}

}

module.exports = CollectionsAPI;