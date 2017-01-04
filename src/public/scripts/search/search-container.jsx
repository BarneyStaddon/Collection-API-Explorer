import React from 'react';
import SearchForm from './search-form.jsx';
import SearchActions from '../actions/search-actions.jsx';


export default class SearchContainer extends React.Component {

    handleTermSubmit(searchObject) {
        SearchActions.storeSearchTerm(searchObject.term);
        SearchActions.getSearchResults(searchObject, this.props.router.push);
    };


    render() {
        return (  
            <div className="searchContainer">  
                <SearchForm onTermSubmit={this.handleTermSubmit.bind(this)}/>
            </div>
        );
    };
};