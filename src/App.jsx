import { useState } from 'react'
import './App.css'

// import {initializeApp} from 'firebase/app'
// import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth'
// import {getFirestore, collection } from 'firebase/firestore'

// import 'firebase/firestore'
// import 'firebase/auth'

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth';      

import { useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import { useRef } from 'react';
import { useEffect } from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyCvQGXdDE5_gckxgccIKkEI_WHyphYS1hM",
  authDomain: "talker-48fd5.firebaseapp.com",
  projectId: "talker-48fd5",
  storageBucket: "talker-48fd5.appspot.com",
  messagingSenderId: "700032807961",
  appId: "1:700032807961:web:1d25c935ac559a81716688",
  measurementId: "G-SLPT4Y5SVN"
})

const auth = firebase.auth()
const firestore = firebase.firestore()



function App() {
  const [user] = useAuthState(auth)
  
  return (
    <div className="App">
      <header>
        <img src={'../chat.png'}  />
        { user ? <SignOut /> : null}
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef()

  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)
  // const query = messagesRef.orderby('createdAt').limit(25)
  
  const [messages] = useCollectionData(query, {idField: 'id'})

  const [formValue, setFormValue] = useState('')


  useEffect(() => {
    const form = document.getElementsByTagName("form")[0]
    const btn = document.getElementsByTagName("textarea")[0]
    // const btn = document.getElementsByClassName("send")
    
    form.addEventListener("keyup", (e) => {
      const keyCode = e.key

      if (keyCode === "Enter" && !e.shiftKey ) {
        console.log(form)
        e.preventDefault()
        console.log()
        
        setTimeout(btn.click(), 1000)
        
        // form.addEventListener("submit", sendMessage)
          // form.onsubmit = function() {sendMessage(e)}
          // // console.log(1)
          // sendMessage(e)
      }
    })
  })
  

  const sendMessage = async(e) => {
    console.log(e)
    e.preventDefault()

    const {uid, photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    
    setFormValue('')

    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  return(
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </div>

    <form onSubmit={sendMessage}>
      <textarea maxLength="400" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
      <button className='send' type="submit">SEND</button>
    </form>

    <div ref={dummy}></div>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  // return <p>{text} {messageClass}</p>
  return (
    <div className={`message ${messageClass}`}>
        <img className='pfp' src={photoURL} alt="" />
      <p>{text}</p>
    </div>
  )
}

export default App
