import React from 'react';
import FacetResultItemList from './facet-result-item-list.jsx';

export default class FacetResultItem extends React.Component {

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