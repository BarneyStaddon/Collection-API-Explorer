import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, withRouter, browserHistory } from 'react-router';

import AppDispatcher from './dispatcher/app-dispatcher.jsx';
import ResultsContainer from './results/results-container.jsx';
import SearchContainer from './search/search-container.jsx';


//see = https://scotch.io/tutorials/creating-a-simple-shopping-cart-with-react-js-and-flux


//N.B we use an HoC to get the router as a prop of our SearchContainer component
var WrappedSearchContainer = withRouter(SearchContainer);
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