import Reset from '../components/Reset';
// import PleaseSignIn from '../components/PleaseSignIn';

const sell = props => (
  <div>
    {/* <PleaseSignIn> */}
      <p>Reset your password {props.query.resetToken}</p>
    {/* </PleaseSignIn> */}
    <Reset resetToken={props.query.resetToken}/>
  </div>
);

export default sell;