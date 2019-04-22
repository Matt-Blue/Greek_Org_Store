import React, {Component} from 'react'
import firebase from '../../Firebase'
import Pagination from '../Util/Pagination'
import Receipt from './Receipt'

class Account extends Component{
    constructor(props){
        super(props)
        this.state={
            permissions: 'guest',
            uid: '',
            receipts: [],
            receiptsLength: 0,
            page: 1,
            numPages: 0,
        }
        this.pageUp = this.pageUp.bind(this)
        this.pageDown = this.pageDown.bind(this)
    }
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                if(user.email === 'dev@dev.com'){
                    this.setState({
                        permissions: 'admin',
                        uid: user.uid,
                    })
                }else{
                    this.setState({
                        permissions: 'user',
                        uid: user.uid,
                    })
                }
            }
        })
        const receiptsRef = firebase.database().ref(`receipts/` + this.state.uid).orderByChild('timestamp')
        receiptsRef.on('value', snapshot => {
            let receipts = snapshot.val()
            let receiptsList = []
            for(let receipt in receipts){
                for(let r in receipts[receipt]) {
                    receiptsList.push({
                        id: receipt,
                        delivered: receipts[receipt][r].delivered,
                        emailUsed: receipts[receipt][r].emailUsed,
                        stripeId: receipts[receipt][r].stripeId,
                        cart: receipts[receipt][r].cart,
                        timestamp: receipts[receipt][r].timestamp,
                        userEmail: receipts[receipt][r].userEmail,
                        userId: receipts[receipt][r].userId,
                        amount: receipts[receipt][r].amount,
                    })
                }                
            }
            receiptsList.sort(this.sortNewestFirst)
            this.setState({
                receipts: receiptsList,
                receiptsLength: receiptsList.length,
                numPages: Math.ceil(receiptsList.length / 4),
            })
        })
    }
    pageUp(e){
        if(this.state.page < this.state.numPages){
            this.setState({
                page: this.state.page + 1
            })
        }
    }
    pageDown(e){
        if(this.state.page > 1){
            this.setState({
                page: this.state.page - 1
            })
        }
    }
    sortNewestFirst(a,b){
        if (a.timestamp < b.timestamp)
            return 1;
        if (a.timestamp > b.timestamp)
            return -1;
        return 0;
    }
    render(){
        var user = firebase.auth().currentUser
        if (user) {
            return(
                <div>
                    <div className="title">Account Page</div>
                    <Pagination 
                        page={this.state.page}
                        numPages={this.state.numPages}
                        pageUp={this.pageUp}
                        pageDown={this.pageDown}
                    />
                    <div className="row">
                        {
                            this.state.receipts.map((receipt, index) => {
                                if(4 * (this.state.page - 1) <= index && index < 4 * this.state.page){
                                    if(receipt.id === user.uid || user.email === 'dev@dev.com'){
                                        var date = new Date(receipt.timestamp)
                                        var formattedTime = date.toDateString()
                                        return(           
                                            <Receipt
                                                key={index}
                                                id={receipt.id}
                                                stripeId={receipt.stripeId}
                                                delivered={receipt.delivered}
                                                timestamp={formattedTime}
                                                emailUsed={receipt.emailUsed}
                                                userEmail={receipt.userEmail}
                                                userId={receipt.userId}
                                                amount={receipt.amount}
                                                cart={receipt.cart}
                                                admin={user.email === 'dev@dev.com'}
                                            />
                                        )
                                    }
                                }else{
                                    return null
                                }                                
                            })
                        }
                    </div>
                    <Pagination 
                        page={this.state.page}
                        numPages={this.state.numPages}
                        pageUp={this.pageUp}
                        pageDown={this.pageDown}
                    />          
                </div>
            )
        } else {
            return <div>You are not logged in!</div>
        }
        
    }
}

export default Account