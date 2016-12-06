import React from 'react';
import { Link } from 'react-router';
import FacetResultItem from './facet-result-item.jsx';

export default class FacetResultList extends React.Component {

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