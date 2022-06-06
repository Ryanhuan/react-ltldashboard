import {  BrowserRouter as Router,  Route,  Routes } from "react-router-dom";
import {ErrorBoundary} from 'react-error-boundary';
import "./App.css";
import Topbar from './components/topbar/Topbar'
import Sidebar from './components/sidebar/Sidebar'
import Home from './pages/home/Home'
import UserList from './pages/userList/UserList'
import User from './pages/user/User'
import NewUser from './pages/newUser/NewUser'
import ProductList from './pages/productList/ProductList'
import Login from './pages/login/Login'

import AdminUser from './pages/adminUser/AdminUser'
import {AdminMatManage} from './pages/adminMatManage/AdminMatManage'


function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}


function App() {
  let token=localStorage.getItem('token');
  
  if(!token) {
    return  (
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} /> 
            <Route path='*'  element={<Login />}/> 
          </Routes> 
        </Router>
    )
  }
  return (
    <>
     <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Router>
          <div className="appContainer">
            <Sidebar />
            <div className="appBody">
              <Topbar />
              <Routes>
                <Route path='/' element={<Home />} /> 
                <Route path='/users' element={<UserList />} /> 
                <Route path='/user/:userId' element={<User />} /> 
                <Route path='/newUser' element={<NewUser />} /> 
                <Route path='/products' element={<ProductList />} /> 
                <Route path='/product/:productId' element={<User />} /> 
                <Route path='/newProduct' element={<NewUser />} /> 

                <Route path='/Admin' element={<Home />} /> 
                <Route path='/AdminUser' element={<AdminUser />} /> 
                <Route path='/AdminMatManage' element={<AdminMatManage />} />
                
                <Route path='*'  element={<Home />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ErrorBoundary>
    </>
  );
}

export default App;
