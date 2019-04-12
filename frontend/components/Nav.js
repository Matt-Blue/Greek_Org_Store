import Link from 'next/link';
import { Mutation } from 'react-apollo';
import Cart, { TOGGLE_CART_MUTATION } from './Cart';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';
import CartCount from './CartCount';
const Nav = () => (
    <User>
        {({data: {me} }) => (
            <NavStyles>
                <Link href="/organization">
                    <a>org name here</a>
                </Link>
                <Link href= "/items">
                    <a>Items</a>
                </Link>
                {me && (
                    <>
                        
                        <Link href= "/orders">
                            <a>Orders</a>
                        </Link>
                        <Link href= "/account">
                            <a>Account</a>
                        </Link> 
                        <Signout></Signout>
                        <Mutation mutation = { TOGGLE_CART_MUTATION}>
                            {(toggleCart) => (
                                <button onClick={toggleCart}>
                                    My Cart
                                    <CartCount count = {me.cart.reduce((tally, cartItem)=>tally+cartItem.quantity,0)}></CartCount>
                                </button>
                            )}
                        </Mutation>
                    </>
                )}
                {!me && (
                    <Link href= "/signup">
                        <a>Sign In</a>
                    </Link>
                )}
                {me && (me.email === process.env.ADMIN_EMAIL) && (
                    <Link href= "/sell">
                        <a>Sell</a>
                    </Link>
                ) }
            </NavStyles>
        )}
    </User>
        
        
)
export default Nav; 