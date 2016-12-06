import React from 'react';
import SearchForm from './search-form.jsx';
import SearchActions from '../actions/search-actions.jsx';


export default class SearchContainer extends React.Component {


    handleTermSubmit(searchObject) {

        console.log('Term submitted:' + searchObject.term );


        /*


        TO DO:

        Use this somewhere in the results layout/path


        */ 


        this.props.termHandler(searchObject.term); 

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: searchObject,
            
            success: function(data) {

                console.log('All data: ');
                console.log(data);



                SearchActions.getSearchTerm(data);


                this.props.resultsDataHandler(data);  
                this.props.router.push('/results');
                
                }.bind(this),
            
            error: function(xhr, status, err) {
                    //this.setState({data: comments});
                    //console.error(this.props.url, status, err.toString());
                }.bind(this)
        });
    
    };

    render() {
        return (  
            <div className="searchContainer">  
                <SearchForm onTermSubmit={this.handleTermSubmit.bind(this)}/>
            </div>
        );
    };
};