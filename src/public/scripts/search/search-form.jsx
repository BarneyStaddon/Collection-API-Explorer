import React from 'react';

export default class SearchForm extends React.Component {
    
    constructor(props){

        super(props);
        //N.B we need state here an input is an 'uncontrolled' component
        this.state = {term:''}; 
    };

    //N.B this is 'shorthand' syntax for:
    //handleSubmit: function(e) {}
    handleSubmit(e) {

        e.preventDefault();
        var term = this.state.term.trim();
        
        if (!term) return;
        this.props.onTermSubmit({term: term});

    };

    handleTermChange(e) {

        //sets the value in the field
        this.setState({term: e.target.value});
    };

    render() {

        return (

            <form className="searchForm form-inline" onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-group">
                    <label className="sr-only" htmlFor="searchTerm">Search term:</label>
                    <input className="form-control" id="searchTerm" type="text" placeholder="Enter search term here"  value={this.state.term} onChange={this.handleTermChange.bind(this)} />
                </div>
                <button type="submit" className="btn btn-default">Search</button>

            </form>

        );

    };

};