import React from 'react';
import {Link} from 'react-router-dom';
function Notauth() {
  return (
    <div>
        <p>You are not authenticated!</p>
        
        <Link to='/Login'>Go to login page</Link>
    </div>
  )
}

export default Notauth