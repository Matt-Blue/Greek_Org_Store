import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY} from './User';
import  Signin  from './Signin';
import Items from './Items';
import gql from 'graphql-tag';

// const ISADMIN_QUERY = gql`
//     query ISADMIN_QUERY { 
//         IsAdmin() {
//             hasPermissions
//         }
//     }
// `;
const IsAdmin = (props) => (
    <Query query = {CURRENT_USER_QUERY}>
        {({data, loading} ) => {
            if (loading ) return <p>Loading</p>
            if(data.me && data.me.permissions[0] ==='ADMIN'){
                return props.children;
            }
            else {
                if (!data.me) {                
                    return <div>
                        <p>You need to be signed in as admin to sell items.</p>
                        <Signin />
                    </div>
                }
                return <div>
                    <p>You do not have permission to sell items.</p>
                    <Items />
                </div>
            }
        }}
    </Query>
)

export default IsAdmin;