import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router'

class SearchForm extends React.Component {
    
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


class FacetResultList extends React.Component {

    render() {

        function facetResultItem(facetResultObject){

            //N.B facet.field will be unique
            return <FacetResultItem item={facetResultObject} key={facetResultObject.responseHeader.params['facet.field']} />
        };

        return (
            <ul className="facetResultList list-unstyled">
                {this.props.data.map(facetResultItem)}
            </ul>
        );
    };
}; 


class FacetResultItem extends React.Component {

    render() {

        let facetField = this.props.item.responseHeader.params['facet.field'];
        let breakdownList = [];
        let fieldObject = this.props.item.facet_counts.facet_fields[facetField];
        
        Object.keys(fieldObject).forEach(function (key) {
            let breakdownItem = [];
            breakdownItem.push(key);
            breakdownItem.push(fieldObject[key]);
            breakdownList.push(breakdownItem);
        });

        //console.log(this.props.breakdown);
        function breakdownItem(breakdownItemObject){

            return <FacetResultItemList item={breakdownItemObject} key={breakdownItemObject[0]} facetField={facetField} />
        };

        return (
            <li className="facetResultItem">
                <h4>{facetField}</h4>
                <ul>
                    {breakdownList.map(breakdownItem)}
                </ul> 
            </li>
        );
    };
};


class FacetResultItemList extends React.Component {

    handleClick(e) {

        e.preventDefault();
        
        let itemOb = {  'field' : this.props.facetField,
                    'name'  : this.props.item[0] }

        console.log(itemOb);
        // we need to get the facet search type here, i.e section or whatever
     
        /*

        var term = this.state.term.trim();
    
        if (!term) return;
        this.props.onTermSubmit({term: term});

        */
    };

    render() {

        return (
            //to do - think about using the shorthand for components - see https://camjackson.net/post/9-things-every-reactjs-beginner-should-know
            <li><a href="#" onClick={this.handleClick.bind(this)}>{this.props.item[0]}<span> ({this.props.item[1]})</span></a></li>
        );
    };
};


class SearchContainer extends React.Component {

    constructor(props){

        super(props);
        this.state = {data:[]}; //http://stackoverflow.com/questions/37427508/react-changing-an-uncontrolled-input
    };

    handleTermSubmit(searchObject){

        console.log('Term submitted:' + searchObject.term);

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: searchObject,
            
            success: function(data) {

                console.log('this is our data');
                console.log(data);

                //jsut use the facet results at the moment...
                this.setState({data: data[1]});
                
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
                <h1>{this.props.title}</h1>
                <SearchForm onTermSubmit={this.handleTermSubmit.bind(this)}/>
                <FacetResultList data={this.state.data} />
            </div>
        );
    };
};



class App extends React.Component {


    render() {

        return (
            <SearchContainer title="API Explorer" url="/api/search" />
        );
    };
};


//instantiates the root component, starts the framework, and injects the markup into a raw DOM element, provided as the second argument.
//history error see - https://github.com/chentsulin/electron-react-boilerplate/issues/542
ReactDom.render(
    
    <Router history={hashHistory}>
        <Route path="/" component={App}>
        </Route>
    </Router>,
    
    document.getElementById('content')
  );