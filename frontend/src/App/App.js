import React, { Component } from 'react'
import { Router, Link, navigate } from '@reach/router'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import firebase from './Firebase'
import Index from './components/Info/Index'
import About from './components/Info/About'
import Items from './components/Item/Items'
import Register from './components/User/Register'
import Login from './components/User/Login'
import Account from './components/User/Account'
import Cart from './components/Cart/Cart'
import Footer from './components/Util/Footer'

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      userId: null,
      userName: null,
      userEmail: null,
      permissions: null,
      cart: [],
    }
    this.addToCart = this.addToCart.bind(this)
    this.removeFromCart = this.removeFromCart.bind(this)
    this.resetCart = this.resetCart.bind(this)
  }
  registerUser = userName => {
    firebase.auth().onAuthStateChanged(user => {
      user.updateProfile({
        displayName: userName
      }).then(() => {
        this.setState({
          userId: user.uid,
          userName: user.displayName,
          userEmail: user.email,
        })
        navigate('/items')
      })
    })
  }
  logoutUser = e => {
    e.preventDefault()
    this.setState({
      userId: null,
      userName: null,
      userEmail: null,
    })
    firebase.auth().signOut().then(() => {
      navigate('/')
    })
  }
  addToCart(id){
    var tempCart = this.state.cart
    if(!tempCart.includes(id)){
      tempCart.push(id)
      this.setState({
        cart: tempCart,
      })
    }else{
      alert('This item is already in your cart!')
    }
  }
  removeFromCart(id){
    var tempCart = this.state.cart
    const index = tempCart.indexOf(id)
    if (index > -1) {
      tempCart.splice(index, 1);
    }
    this.setState({
      cart: tempCart,
    })
  }
  resetCart(){
    this.setState({
      cart: [],
    })
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.setState({
          userId: user.uid,
          userName: user.displayName,
          userEmail: user.email,
        })
      }else{
        this.setState({
          userId: null,
          userName: null,
          userEmail: null,
        })
      }
    })
  }
  render() {
    return (
      <div className="app">
        <nav className="navbar navbar-expand-sm sticky-top navbar-dark bg-dark">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">Greek Clothing Inc.</Link>
          </div>
          <ul className="navbar-nav">
            <li className="nav-item"><Link to="/about/" className="nav-link">About</Link></li>
            <li className="nav-item"><Link to="/items/" className="nav-link">Items</Link></li>
          </ul>
          {
            this.state.userId !== null ? (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item"><Link to="/account/" className="nav-link">My Account</Link></li>
                <li className="nav-item"><Link onClick={e => this.logoutUser(e)} to="/logout/" className="nav-link">Logout</Link></li>
                <li className="nav-item"><Link to="/cart/" className="nav-link">Cart <span className="badge badge-light">{this.state.cart.length}</span></Link></li>
              </ul>
            ) : (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item"><Link to="/register/" className="nav-link">Register</Link></li>
                <li className="nav-item"><Link to="/login/" className="nav-link">Login</Link></li>
                <li className="nav-item"><Link to="/cart/" className="nav-link">Cart <span className="badge badge-light">{this.state.cart.length}</span></Link></li>
              </ul>
            )
          }
        </nav>
        <div className="container">
          <Router>
            <Index path="/"/>
            <About path="/about"/>
            <Items
              path="/items"
              userEmail={this.state.userEmail}
              addItem={this.addItem}
              permissions={this.state.permissions}
              cart={this.state.cart}
              addToCart={this.addToCart}
            />
            <Register path="/register" registerUser={this.registerUser}/>
            <Login path="/login" loginUser={this.loginUser}/>
            <Account path="/account" 
              userId={this.state.userId}
              userName={this.state.userName}
              userEmail={this.state.userEmail}
            />
            <Cart path="/cart" 
              userId={this.state.userId}
              userName={this.state.userName}
              userEmail={this.state.userEmail}
              cart={this.state.cart}
              removeFromCart={this.removeFromCart}
              resetCart={this.resetCart}
            />
          </Router>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default App;
