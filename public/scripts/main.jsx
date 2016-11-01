

var SearchForm = React.createClass({

    //getInitialState() executes exactly once during the lifecycle of the component and sets up the initial state of the component
    //see for usage - http://stackoverflow.com/questions/30668326/what-is-the-difference-between-using-constructor-vs-getinitialstate-in-react-r
    getInitialState () {
        return {term: ''};
    },

    //N.B this is 'shorthand' syntax for:
    //handleSubmit: function(e) {}
    handleSubmit (e) {

        e.preventDefault();
        var term = this.state.term.trim();
        
        if (!term) return;
                
        console.log('term');

        //this.props.onCommentSubmit({author: author, text: text});
        //this.setState({term: '');

    },

    handleTermChange (e) {

        //this effectively sets the value in the field
        this.setState({term: e.target.value});

    },

    render () {

        return (

            <form className="searchForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Enter a search term"  value={this.state.term} onChange={this.handleTermChange} />
                <input type="submit" value="Post" />
            </form>

        );

    }

});


class SearchContainer extends React.Component {

    render() {
      return (  
        <div className="searchContainer">  
            <h1>{this.props.title}</h1>
            <SearchForm/>
        </div>
      );
    }
};





//instantiates the root component, starts the framework, and injects the markup into a raw DOM element, provided as the second argument.
ReactDOM.render(
    <SearchContainer title="API Explorer"/>,
    document.getElementById('content')
  );