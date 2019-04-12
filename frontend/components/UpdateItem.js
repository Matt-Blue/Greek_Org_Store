import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item (where: {id: $id}) {
            id
            title
            description
            Price
        }
    }
`;

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $Price: Int
    ) {
        updateItem(
            id: $id
            title: $title 
            description: $description 
            Price: $Price
        ) {
            id
            title
            description
            Price
        }
    } 
`;

class UpdateItem extends Component {
    state = {    };
    handleChange = (e) => {
        // console.log(e.target.value);
        const { name, type, value } = e.target; 
        // console.log({name, type, value});
        const val = type === 'number' ? parseFloat(value) : value; 
        this.setState( { [name]: val });
    };
    updateItem = async (e, updateItemMutation) => {
        e.preventDefault();
        console.log('updating item!');
        console.log(this.state);
        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state,
            }
        });
        console.log('updated');
    }
    
    render() {
        return ( //watch for the error 
            <Query 
                query ={SINGLE_ITEM_QUERY} 
                variables ={{
                    id: this.props.id
                }}
            >
                {({data, loading}) => {
                    if (loading) return <p> Loading . . . </p>;
                    if (!data.item) return <p> No item found for id {this.props.id} </p>
                    return (
                        <Mutation mutation = {UPDATE_ITEM_MUTATION} variables={this.state}>
                            {(updateItem, {loading, error}) => (
                                <Form onSubmit = {(e) => this.updateItem(e, updateItem)}>
                                    <Error error={error}/>
                                    <fieldset disabled={loading} aria-busy={loading}>
                                        <label htmlFor ="title">
                                            Title
                                            <input 
                                                type = "text" 
                                                id="title" 
                                                name ="title" 
                                                placeholder = "Title" 
                                                required 
                                                defaultValue = {data.item.title}
                                                onChange = {this.handleChange}
                                                />
                                        </label> 

                                        <label htmlFor ="Price">
                                            Price
                                            <input 
                                                type = "number" 
                                                id="Price" 
                                                name ="Price" 
                                                placeholder = "Price" 
                                                required 
                                                defaultValue = {data.item.Price}
                                                onChange = {this.handleChange}
                                                />
                                        </label> 

                                        <label htmlFor ="description">
                                            Description
                                            <textarea 
                                                id="description" 
                                                name ="description" 
                                                placeholder = "Description" 
                                                required 
                                                defaultValue = {data.item.description}
                                                onChange = {this.handleChange}
                                                />
                                        </label> 
                                        <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
                                    </fieldset>
                                </Form> 
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

export default UpdateItem;
export {UPDATE_ITEM_MUTATION};