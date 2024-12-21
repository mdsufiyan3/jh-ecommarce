import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDvsL_zxBOdG0X7qyuybnL5Dlohnw_1-7s",
    authDomain: "hasuta-ecommerce.firebaseapp.com",
    databaseURL: "https://hasuta-ecommerce-default-rtdb.firebaseio.com",
    projectId: "hasuta-ecommerce",
    storageBucket: "hasuta-ecommerce.firebasestorage.app",
    messagingSenderId: "989424962158",
    appId: "1:989424962158:web:3b39e9eb4b7c76d0f4747f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 