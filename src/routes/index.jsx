import ZakLayout from 'layouts/Zak.jsx';
import LoginPage from 'layouts/LoginPage.jsx';

var BASEDIR = process.env.REACT_APP_BASEDIR;

var indexRoutes = [
    { path: BASEDIR+"/login", name: "Login", component: LoginPage },
    { path: BASEDIR+"/register", name: "Register", component: LoginPage },
    { path: BASEDIR+"/resetpassword", name: "Reset Password", component: LoginPage },
    { path: BASEDIR+"/forgotpassword", name: "Forgot Password", component: LoginPage },
    { path: BASEDIR+"/logout", name: "Logout", component: LoginPage },
    { path: BASEDIR+"/lockscreen", name: "Lockscreen", component: LoginPage },

    { path: BASEDIR+"/zak", name: "Zak Dashboard", component: ZakLayout },
    
    { path: BASEDIR+"/app/", name: "Home", component: ZakLayout },
    { path: BASEDIR+"/app", name: "Home", component: ZakLayout },
    { path: BASEDIR+"/", name: "Home", component: ZakLayout },
    { path: "/", name: "Home", component: ZakLayout },


];

export default indexRoutes;
