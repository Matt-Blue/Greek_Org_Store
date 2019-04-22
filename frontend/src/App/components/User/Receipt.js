import React, {Component} from 'react'

class Receipt extends Component{
    constructor(props){
        super(props)
        this.state={
            delivered: this.props.delivered
        }
        this.markDelivered = this.markDelivered.bind(this)
    }
    markDelivered(){
        // var deliveryRef = firebase.database().ref(`receipts/${this.props.userId}`).child(`${this.props.id}`)
        // deliveryRef.update({delivered: true})
        this.setState({ delivered: true })
    }
    render(){
        return(
            <div className="col-sm-3">
                <div>user id: {this.props.userId}</div>
                <div>user email: {this.props.userEmail}</div>
                <div>stripe email: {this.props.emailUsed}</div>
                <div>amount: {this.props.amount}</div>
                <div>stripe id: {this.props.stripeId}</div>
                <div>timestamp: {this.props.timestamp}</div>
                <div>delivered: {this.state.delivered ? 'yes' : 'no'}</div>
                {
                    this.props.admin ? (<button onClick={this.markDelivered}>Deliver</button>) : (<div/>)
                }                
            </div>
        )
    }
}

export default Receipt