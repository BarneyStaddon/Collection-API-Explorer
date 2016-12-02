import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, withRouter } from 'react-router';


/* to kill a process on windows 
cmd.exe as admin > neststat -a -n -o 
note processid (pid)
> taskkill /f /pid <yourpid>
*/


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
            <section>
                {this.props.data.length > 0 && <p>Narrow by</p>}
                <ul className="facetResultList list-unstyled">
                    {this.props.data.map(facetResultItem)}
                </ul>
            </section>
        );
    };
}; 


class FacetResultItem extends React.Component {

    render() {

        let facetField = this.props.item.responseHeader.params['facet.field'];
        let facetFieldCount = this.props.item.response.numFound;
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
                <details>
                    <summary>{facetField}</summary>
                    <ul className="list-unstyled">
                        {breakdownList.map(breakdownItem)}
                    </ul>
                </details>
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
        this.state = {facetsData:[]}; //http://stackoverflow.com/questions/37427508/react-changing-an-uncontrolled-input
    };

    handleTermSubmit(searchObject){

        console.log('Term submitted:' + searchObject.term );

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: searchObject,
            
            success: function(data) {

                console.log('this is all of our data now');
                console.log(data);

                //jsut use the facet results at the moment...
                this.setState({facetsData: data[1]});


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
                <FacetResultList data={this.state.facetsData} />
            </div>
        );
    };
};


/*

http://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
https://www.sitepoint.com/react-higher-order-components/
https://github.com/ReactTraining/react-router/blob/master/docs/API.md#withroutercomponent-options

N.B we use an HoC to get the router as a prop of our SearchContainer component

*/

var WrappedSearchContainer = withRouter(SearchContainer);

/* 

https://facebook.github.io/react/docs/typechecking-with-proptypes.html
prop called 'router' must be set to an object that must contain a function called 'push'   

*/
SearchContainer.propTypes = {
    router: React.PropTypes.shape({
        push: React.PropTypes.func.isRequired
    }).isRequired
};


class Header extends React.Component {

    render() {

        return (
            <div className="header">
                <header>
                    <h1>Collections API Explorer</h1>
                </header>
            </div>
        );
    };

}


class Home extends React.Component {

    render() {

        return (
            <WrappedSearchContainer url="/api/search" />
        );
    };
};




class App extends React.Component {


    render() {

        return (
            <div className="app">
                <Header />
                <div className="content">
                    {this.props.children}
                </div>
                <footer>&copy;2016</footer>
            </div>
        );
    };
};


//instantiates the root component, starts the framework, and injects the markup into a raw DOM element, provided as the second argument.
//history error see - https://github.com/chentsulin/electron-react-boilerplate/issues/542
ReactDom.render(
    
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
        </Route>
    </Router>,
    
    document.getElementById('container')
  );