import React from 'react';
import User from './User';
import PropTypes from 'prop-types';
import {adopt} from 'react-adopt';

const Composed = adopt ({
    user: ({render}) => <User>{render}</User>,
    // toggleCart: ({render}) => <Mutation mutation = {TOGGLE_CART_MUTATION}>{render}</Mutation>,
    // localState: ({render}) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});

const Account = () => (
    <Composed>
    {({user ,toggleCart,localState})=>{
        const me = user.data.me;
        if (!me) return "You must be logged in to see account details"; 
        return (                    
            <div>
                <p>Hello {me.name}</p>
                <p>Your email is {me.email}</p>
                <p>To date you've made: __ orders </p>
                <p>Your org: {me.organization}</p>
                <p>Are you in an org?{me.inOrg}</p>
            </div>
            
        )
    }}</Composed>
);

export default Account;