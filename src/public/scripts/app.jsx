import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, withRouter, browserHistory, Link} from 'react-router';


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

        let numResults = this.props.resultsData[0][0]['response']['numFound'];
        let resultsPerPage = this.props.resultsData[0][0]['response']['docs'].length;
        let start = this.props.resultsData[0][0]['response']['start'];

        function facetResultItem(facetResultObject){

            //N.B facet.field will be unique
            return <FacetResultItem item={facetResultObject} key={facetResultObject.responseHeader.params['facet.field']} />
        };
        
        if(numResults > 0){

            return (
                <section>
                    <h4>Showing {start} to {resultsPerPage} of {numResults} results for '{this.props.searchTerm}'</h4>
                    <Link to="/">Search again</Link>
                    <p>Refine</p>
                    <ul className="facetResultList list-unstyled">
                        {this.props.resultsData[1].map(facetResultItem)}
                    </ul>
                </section>
            );
        }

        return (
            <section>
                <h4>There were no results for '{this.props.searchTerm}'</h4>
                <Link to="/">Please try again</Link>
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

        function breakdownItem(breakdownItemObject){

            return <FacetResultItemList item={breakdownItemObject} key={breakdownItemObject[0]} facetField={facetField} />
        };

        if(breakdownList.length > 0){

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
        }

        return null;
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




class ResultsContainer extends React.Component {

    render() {

        console.log('render our results');

        return (
            <div className="resultsContainer">
               <FacetResultList resultsData={this.props.resultsData} searchTerm={this.props.searchTerm} />
            </div>
        );
    };

}



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
            <WrappedSearchContainer termHandler={this.props.termHandler} resultsDataHandler={this.props.resultsDataHandler} url="/api/search" />
        );
    };
};



class Results extends React.Component {

    render() {

        return (
            <ResultsContainer resultsData={this.props.resultsData} searchTerm={this.props.searchTerm} />
        );
    };
};



class App extends React.Component {

    constructor(props){

        super(props);
        this.state = { resultsData:[],
                       searchTerm:''}; //http://stackoverflow.com/questions/37427508/react-changing-an-uncontrolled-input
        self = this;
    };


    setResultsData(data) {

        console.log('Adding data to root app state...');
        self.setState({resultsData: data});
    };

    setSearchTerm(term) {

        console.log('Setting search term to root app state...');
        self.setState({searchTerm: term});
    };

    getResultsData() {


        //self.setState({facetsData: data[1]});
    };


    render() {

        //to add props to children - http://stackoverflow.com/questions/35835670/react-router-and-this-props-children-how-to-pass-state-to-this-props-children
        var children = React.Children.map(this.props.children, function(child){
            return React.cloneElement(child, {
                termHandler: self.setSearchTerm,
                resultsDataHandler: self.setResultsData,
                searchTerm: self.state.searchTerm,
                resultsData: self.state.resultsData
            })

        });

        return (
            <div className="app">
                <Header />
                <div className="content">
                    {children}
                </div>
                <footer>&copy;2016</footer>
            </div>
        );
    };
};


//instantiates the root component, starts the framework, and injects the markup into a raw DOM element, provided as the second argument.
//history error see - https://github.com/chentsulin/electron-react-boilerplate/issues/542
//use browserHistory - https://github.com/reactjs/react-router-redux/issues/197
ReactDom.render(
    
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="results" component={Results} />
        </Route>
    </Router>,
    
    document.getElementById('container')
  );