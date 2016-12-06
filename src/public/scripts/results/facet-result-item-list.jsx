import React from 'react';

export default class FacetResultItemList extends React.Component {

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