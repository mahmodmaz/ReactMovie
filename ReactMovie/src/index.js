import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider, connect } from 'react-redux';
import { store, persister } from './store';
import { PersistGate } from 'redux-persist/es/integration/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './config/firebase'
import LoginPage from './Components/LoginPage';
import SignUpPage from './Components/SignUpPage';
import actions from './store/actions';


export const AllRoutes = (props) => {
  const user = store?.getState()?.user
  return (
    <PersistGate loading={null} persistor={persister}>
      <Provider {...{ store }}>
        {/* <App /> */}
        <BrowserRouter>
          <Routes>
            {user === null ?
              <>

                <Route  path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<App />} />
              </>
              :
              <>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/" element={<App />} />
                <Route path="/home" element={<App />} />
              </>
            }

          </Routes>
        </BrowserRouter>
      </Provider>
    </PersistGate>
  )
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    logged: state.logged,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _login: data => dispatch(actions.loginUser(data)),
  }
}
connect(mapStateToProps, mapDispatchToProps)(AllRoutes)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AllRoutes />
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
