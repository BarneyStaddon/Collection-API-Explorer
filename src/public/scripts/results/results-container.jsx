import React from 'react';
import FacetResultList from './facet-result-list.jsx';

export default class ResultsContainer extends React.Component {

    render() {

        return (
            <div className="resultsContainer">
               <FacetResultList resultsData={this.props.resultsData} searchTerm={this.props.searchTerm} />
            </div>
        );
    };

}
