import React from 'react'
import StripeCheckout from 'react-stripe-checkout';

export default class Checkout extends React.Component {
    onToken = (token, addresses) => {
        console.log(token)
        this.props.checkout(
            token.id,
            token.email,
            token.created,
        )
    }
    render() {
        return (
            <StripeCheckout
                description="Greek Checkout"
                name="Greek Clothing Inc."
                amount={this.props.total*100}
                stripeKey="pk_test_KqarsaXwAaC77z25DeO3tPEz"
                token={this.onToken}
                locale="auto"
            />
        )
    }
}