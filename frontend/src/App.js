import {  BrowserRouter as Router,  Route,  Routes } from "react-router-dom";
import {ErrorBoundary} from 'react-error-boundary';
import "./App.css";
import Topbar from './components/admin/topbar/Topbar'
import Sidebar from './components/admin/sidebar/Sidebar'
import ScrollArrow from './components/scrollArrow/ScrollArrow'
import Home from './pages/home/Home'
import Login from './pages/login/Login'

import NewUser from './pages/client/newUser/NewUser'
import ProductList from './pages/client/productList/ProductList'
import UserList from './pages/client/userList/UserList'
import User from './pages/client/user/User'

import AdminUser from './pages/admin/adminUser/AdminUser'
import {AdminMatManage} from './pages/admin/adminMatManage/AdminMatManage'
import {AdminMatCode} from './pages/admin/adminMatCode/AdminMatCode'


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
            <ScrollArrow/>
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
                <Route path='/AdminMatCode' element={<AdminMatCode />} />
                
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
