import { Route, Routes } from "react-router-dom";
import Welcome from './Welcome';
import Login from './Login';
import Register from './Register';
import RegisterBand from './RegisterBand';
import RegisterBandCreate from './RegisterBandCreate';
import Home from './Home';
import Records from './Records';
import Studio from './Studio';
import Settings from './Settings';
import NotFound from './NotFound';
import '../assets/scss/style.scss';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/band" element={<RegisterBand />} />
      <Route path="/register/band/create" element={<RegisterBandCreate />} />
      <Route path="/home" element={<Home />} />
      <Route path="/records/:id" element={<Records />} />
      <Route path="/studio/:id" element={<Studio />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App;
