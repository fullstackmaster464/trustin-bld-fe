import { BrowserRouter as Router } from 'react-router-dom';
import UserRoutes from './router';

const App = () => {

  return (
    <div className="App">
      {
          <Router>
            <UserRoutes  />
          </Router>
      }
    </div>
  );
};

export default App;
