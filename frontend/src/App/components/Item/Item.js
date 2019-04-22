import React, {Component} from 'react'
import firebase from '../../Firebase'

class Account extends Component{
    constructor(props){
        super(props)
        this.state={
            imageUrl: '',
            inCart: false,
        }
        
    }
    componentDidMount(){
        const imageRef = firebase.storage().ref(`/items/`)
        imageRef.child(`${this.props.image}`).getDownloadURL().then((url) => {
            this.setState({
                imageUrl: url,
            })
        }).catch(() => {
            console.log("error getting image")
        })
        if(this.props.cart.includes(this.props.id)){
            this.setState({
                inCart: true,
            })
        }
    }
    addToCart(e, id){
        this.props.addToCart(id)
        this.setState({
            inCart: true,
        })
    }
    deleteItem(e, id){
        firebase.database().ref(`items`).child(id).remove()
    }
    render(){
        var date = new Date(this.props.timestamp)
        var formattedTime = date.toDateString()
        return(
            <div className="col-sm-3">
                <div className="pricetag">
                    <div className="price">
                        ${this.props.price}
                    </div>
                </div>
                <div className="item">
                    <img 
                        className="item-image"
                        src={this.state.imageUrl}
                        width="100%"
                        height="auto"
                        alt={this.props.description}
                    /><br/>
                    <div className="item-title">{this.props.title}</div>
                    <div className="item-description">{this.props.description}</div>
                    <div className="item-timestamp"><i>Created {formattedTime}</i></div>
                    {
                        this.props.permissions === 'admin' ? (
                            <p>
                                <button className="btn btn-success" disabled>Edit</button>
                                <button className="btn btn-danger" onClick={e => this.deleteItem(e, this.props.id)}>Delete</button>
                            </p>
                        ) : (
                            this.state.inCart ? (<div>Added to cart</div>) : (<button className="btn btn-success" onClick={e => this.addToCart(e, this.props.id)}>Add to cart</button>)
                            
                        )
                    }
                </div>
            </div>            
        )    
    }
}

export default Account