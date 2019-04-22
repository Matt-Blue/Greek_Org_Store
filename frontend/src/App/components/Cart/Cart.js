import React, {Component} from 'react'
import CartItem from './CartItem'
import CheckoutForm from './CheckoutForm'
import firebase from '../../Firebase'
import { navigate } from '@reach/router'

class Cart extends Component{
    constructor(props){
        super(props)
        this.state={
            total: 0,
            imageUrl: '',
        }
        this.removeFromCart = this.removeFromCart.bind(this)
        this.addToTotal = this.addToTotal.bind(this)
        this.subtractFromTotal = this.subtractFromTotal.bind(this)
        this.checkout = this.checkout.bind(this)
    }
    addToTotal(value){
        this.setState({ total: parseFloat(this.state.total) + parseFloat(value) })
    }
    subtractFromTotal(value){
        this.setState({ total: parseFloat(this.state.total) - parseFloat(value) })
    }
    removeFromCart(id){
        this.props.removeFromCart(id)
    }
    checkout(id, email, created){
        var item = {
            id: '',
            stripeId: id,
            userId: this.props.userId,
            userEmail: this.props.userEmail,
            emailUsed: email,
            timestamp: created,
            delivered: false,
            cart: this.props.cart,
            amount: this.state.total,
        }
        firebase.database().ref(`receipts/${this.props.userId}`).push(item)
        this.props.resetCart()
        navigate('/account')
    }
    render(){
        if(this.props.cart.length === 0){
            return(<div className="title">Your cart is empty!</div>)
        }
        return(
            <div>
                <div className="title">Cart</div>
                <div className="row">
                    {
                        this.props.cart.map((id, index) => {
                            return(
                                <CartItem
                                    key={index}
                                    id={id}
                                    url={this.state.imageUrl}
                                    removeFromCart={this.removeFromCart}
                                    cart={this.props.cart}
                                    addToTotal={this.addToTotal}
                                    subtractFromTotal={this.subtractFromTotal}
                                />
                            )                            
                        })
                    }
                </div>
                <div className="row">
                    <div className="col-sm">Your total is ${this.state.total}</div>
                    {
                        this.props.userId !== null && this.props.userId !== '' ? (
                            <CheckoutForm
                                total={this.state.total}
                                userId={this.props.userId}
                                checkout={this.checkout}
                            />
                        ) : (
                            <div className="col-sm">You must login to make a purchase</div>
                        )
                    }                    
                </div>
            </div>
        )
    }
}

export default Cart