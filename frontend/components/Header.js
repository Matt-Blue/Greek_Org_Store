import Nav from './Nav';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import NProgress from 'nprogress';
import Cart from './Cart';
import Search from './Search';
Router.onRouteChangeStart = () => {
    NProgress.start();
    console.log('Start triggered');
};
Router.onRouteChangeComplete = () => {
    NProgress.done();
    console.log('Complete  triggered');
}; 
Router.onRouteChangeError = () => {
    NProgress.done();   
    console.log('Error triggered');
};


const Logo = styled.h1`
    font-size: 4rem; 
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    margin-left: 2rem; 
    position: relative;
    z-index: 2;
    a { 
        padding: 0.5rem 1rem; 
        background: darkblue;
        background: lightcyan; 
        color: black; 
        text-transform: uppercase; 
        text-decoration: none; 
    }
    @media (max-width: 1300px){
        margin: 0;
        text-align: center; 
    }
`;

const StyledHeader = styled.header`
    .bar {
        /* border-bottom: 10px solid ${props => props.theme.black}; */
        border-bottom: 10px solid lightblue;
        display: grid;
        grid-template-columns: auto 1fr; 
        justify-content: space-between;
        align-items: stretch;
        @media (max-width: 1300px) {
            grid-template-columns: 1fr; 
            justify-content: center;
        }
    }

    .sub-bar{
        display: grid; 
        grid-template-columns: 1fr auto; 
        /* border-bottom: 10px solid ${props => props.theme.lightgrey}; */
        border-bottom: 10px solid darkblue;
    }
`;

const Header = () => (
     <StyledHeader>
        <div className="bar">
            <Logo>
                <Link href = "/">
                    <a>Your org here</a>
                </Link>
            </Logo>
            <Nav />
        </div>
        <div className="sub-bar">
        <Search></Search>
        </div>
        <Cart />
     </StyledHeader>
 );
 
 export default Header;