import React, {Component} from 'react'
import firebase from '../../Firebase'
import Item from './Item'
import Pagination from '../Util/Pagination'
const uuidv4 = require('uuid/v4')

class Items extends Component{
    constructor(props){
        super(props)
        this.state={
            permissions: 'guest',
            title: '',
            description: '',
            price: 0,
            image: null,
            items: [],
            itemsLength: 0,
            page: 1,
            numPages: 0,
        }
        this.handleChange = this.handleChange.bind(this)
        this.fileSelect = this.fileSelect.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.addItem = this.addItem.bind(this)
        this.pageUp = this.pageUp.bind(this)
        this.pageDown = this.pageDown.bind(this)
        this.addToCart = this.addToCart.bind(this)
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
        // get all items and send them to items page
        const itemsRef = firebase.database().ref('items/').orderByChild('timestamp')
        itemsRef.on('value', snapshot => {
            let items = snapshot.val()
            let itemsList = []
            for(let item in items){
                itemsList.push({
                    id: item,
                    title: items[item].title,
                    description: items[item].description,
                    price: items[item].price,
                    timestamp: items[item].timestamp,
                    image: items[item].image,
                })
            }
            itemsList.sort(this.sortNewestFirst)
            this.setState({
                items: itemsList,
                itemsLength: itemsList.length,
                numPages: Math.ceil(itemsList.length / 4),
            })
        })
    }
    handleChange(e){
        const tempName = e.target.name
        const tempValue = e.target.value
        this.setState({[tempName]: tempValue})
    }
    fileSelect(e){
        if(e.target.files[0]){
            const image = e.target.files[0]
            this.setState({
                image: image
            })
        }
    }
    handleSubmit(e){
        e.preventDefault()
        // image upload
        const image = this.state.image
        var imageBlob = new Blob([image], { type: "image/jpeg" })
        const uuid = uuidv4()
        var uploadTask = firebase.storage().ref().child(`/items/${uuid}`)
        uploadTask.put(imageBlob).then((snapshot) => {
            // pass item to parent & clear state
            var item = {
                title: this.state.title,
                description: this.state.description,
                price: this.state.price,
                timestamp: Date.now(),
                image: uuid,
            }
            this.addItem(item)
            this.setState({
                title: '',
                description: '',
                price: 0,
                image: null,
            })
        })
    }
    addItem(item){
        firebase.database().ref(`items`).push(item)
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
    addToCart(id){
        this.props.addToCart(id)
    }
    sortNewestFirst(a,b){
        if (a.timestamp < b.timestamp)
            return 1;
        if (a.timestamp > b.timestamp)
            return -1;
        return 0;
    }
    render(){
        if(this.state.permissions === 'admin'){
            return(
                <div>
                    <div className="title">Items Page [admin]</div>
                    <div className="row">
                        <div className="col-sm section">
                            Add Item<br/>
                            <form className="formgroup" onSubmit={this.handleSubmit}>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    placeholder="Title"
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    name="description"
                                    placeholder="Description"
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                    required
                                />
                                <input
                                    type="number"
                                    min="0.00"
                                    step="0.01"
                                    max="2500"
                                    className="form-control"
                                    name="price"
                                    placeholder="price"
                                    value={this.state.price}
                                    onChange={this.handleChange}
                                    required
                                />
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    name="image"
                                    onChange={this.fileSelect}
                                    required
                                /><br/>
                                <button 
                                    type="submit"
                                    className="btn btn-success col-sm"
                                    id="addItem"
                                    onSubmit={this.handleSubmit}
                                >Add Item</button>
                            </form>
                        </div>
                    </div>
                    <div className="title">Items</div>
                    <Pagination 
                        page={this.state.page}
                        numPages={this.state.numPages}
                        pageUp={this.pageUp}
                        pageDown={this.pageDown}
                    />
                    <div className="row">
                        {
                            this.state.items.map((item, index) => {
                                if(4 * (this.state.page - 1) <= index && index < 4 * this.state.page){
                                    return(
                                        <Item
                                            key={item.id}
                                            id={item.id}
                                            title={item.title}
                                            description={item.description}
                                            price={item.price}
                                            timestamp={item.timestamp}
                                            image={item.image}
                                            permissions={this.state.permissions}
                                            cart={this.props.cart}
                                        />
                                    )
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
        }else{
            return(
                <div>
                    <div className="title">Items</div>
                    <Pagination 
                        page={this.state.page}
                        numPages={this.state.numPages}
                        pageUp={this.pageUp}
                        pageDown={this.pageDown}
                    />
                    <div className="row">
                        {
                            this.state.items.map((item, index) => {
                                if(4 * (this.state.page - 1) <= index && index < 4 * this.state.page){
                                    return(
                                        <Item
                                            key={index}
                                            id={item.id}
                                            title={item.title}
                                            description={item.description}
                                            price={item.price}
                                            timestamp={item.timestamp}
                                            image={item.image}
                                            permissions={this.state.permissions}
                                            addToCart={this.addToCart}
                                            cart={this.props.cart}
                                        />
                                    )
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
        }
    }
}

export default Items