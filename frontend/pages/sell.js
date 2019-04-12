import CreateItem from '../components/CreateItem';
import PleaseSignIn from '../components/PleaseSignIn';
import IsAdmin from '../components/IsAdmin';

const sell = props => (
  <div>
    <IsAdmin>
      <CreateItem />
    </IsAdmin>
  </div>
);

export default sell;