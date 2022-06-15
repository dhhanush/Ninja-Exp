// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  where,
  updateDoc,
} from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6DAlx-39l2MsAmeinsYFvYZc3h7gM7e4",
  authDomain: "fir-9-dojos.firebaseapp.com",
  projectId: "fir-9-dojos",
  storageBucket: "fir-9-dojos.appspot.com",
  messagingSenderId: "222476959751",
  appId: "1:222476959751:web:08e6a3218cb02bdc7eeaa2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

const colRef = collection(db, "books");

function formatDoc(snapshot) {
  return snapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });
}

// Real time db
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = formatDoc(snapshot);
//     console.log(books);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//we can pass q instead fo colRef to onSnapshot or getDocs
const q = query(
  colRef,
  where("author", "==", "Bibek Debroy"),
  orderBy("title", "desc")
);

onSnapshot(colRef, (snapshot) => {
  let books = formatDoc(snapshot);
  console.log(books);
});

const addForm = document.querySelector(".add");
const deleteForm = document.querySelector(".remove");

//adding docs
addForm.addEventListener("submit", function (e) {
  e.preventDefault();

  console.log(addForm.title.value);
  addDoc(colRef, {
    title: this.title.value,
    author: this.author.value,
    createdAt: serverTimestamp(),
  })
    .then((res) => {
      this.reset();
    })
    .catch((err) => {
      console.log(err);
    });
});

//deleting docs
deleteForm.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(this.id.value);

  const docRef = doc(db, "books", this.id.value);
  deleteDoc(docRef)
    .then(() => {
      this.reset();
    })
    .catch(console.log);
});

//get a single document
const docRef = doc(db, "books", "xmuDC6uqjWmg6hat9p1H");
getDoc(docRef).then((res) => {
  console.log({
    ...res.data(),
    id: res.id,
  });
});

//signup
const signupForm = document.querySelector(".signup");
const loginForm = document.querySelector(".login");
const signoutButton = document.querySelector(".signout");
signupForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let email = this.email.value;
  let password = this.password.value;
  console.log(email);
  createUserWithEmailAndPassword(auth, this.email.value, password)
    .then((cred) => {
      console.log("user logged in", cred.user);
      this.reset();
      return cred.user.sendEmailVerification();
    })
    .then(() => {
      console.log("check your mail for verification mail before loggin in");
    })
    .catch(console.log);
});

signoutButton.addEventListener("click", function (e) {
  signOut(auth)
    .then(() => {
      console.log("user signed out");
    })
    .catch(console.log);
});

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  signInWithEmailAndPassword(auth, this.email.value, this.password.value)
    .then((cred) => {
      console.log("user signed in", cred.user);
      this.reset();
    })
    .catch((err) => console.log(err.message));
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user);
});

const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("unsubscribing");
  unsubAuth();
});
