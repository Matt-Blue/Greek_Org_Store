import React, {Component} from 'react'
import firebase from '../../Firebase'

class CartItem extends Component{
    constructor(props){
        super(props)
        // get all items and send them to items page
        const itemsRef = firebase.database().ref('items/').child(this.props.id)
        itemsRef.on('value', snapshot => {
            let item = snapshot.val()
            this.state={
                cartItem: item,
                permissions: 'guest',
            }
        })
        
        this.removeFromCart = this.removeFromCart.bind(this)
    }
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                if(user.email === 'dev@dev.com'){
                    this.setState({permissions: 'admin'})
                }else{
                    this.setState({permissions: 'user'})
                }
            }
        })
        this.props.addToTotal(this.state.cartItem.price)
        const imageRef = firebase.storage().ref(`/items/`)
        imageRef.child(`${this.props.image}`).getDownloadURL().then((url) => {
            this.setState({
                imageUrl: url,
            })
        }).catch(() => {
            console.log("error getting image")
        })
    }
    addToTotal(value){
        this.props.addToTotal(value)
    }
    subtractFromTotal(value){
        this.props.subtractFromTotal(value)
    }
    removeFromCart(e, id){
        this.props.removeFromCart(id)
        this.subtractFromTotal(this.state.cartItem.price)
    }
    render(){
        var date = new Date(this.state.cartItem.timestamp)
        var formattedTime = date.toDateString()
        return(
            <div className="col-sm-3">
                <div className="pricetag">
                    <div className="price">
                        ${this.state.cartItem.price}
                    </div>
                </div>
                <div className="item">
                    <img 
                        className="item-image"
                        src={this.state.imageUrl}
                        width="100%"
                        height="auto"
                        alt={this.state.cartItem.description}
                    /><br/>
                    <div className="item-title">{this.state.cartItem.title}</div>
                    <div className="item-description">{this.state.cartItem.description}</div>
                    <div className="item-timestamp"><i>Created {formattedTime}</i></div>
                    <button className="btn btn-danger" onClick={e => this.removeFromCart(e, this.props.id)}>Remove</button>
                </div>
            </div>
        )
    }
}

export default CartItem