import AppDispatcher from '../dispatcher/app-dispatcher.jsx';

// Define actions object
var ServerActions = {

    receiveResults: function(response) {
        AppDispatcher.handleAction({
            actionType: 'RECEIVE_RESULTS_RESPONSE',
            data: response
        });
    }
};

module.exports = ServerActions;