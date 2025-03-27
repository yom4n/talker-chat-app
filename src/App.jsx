import { useState } from 'react'

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth';      

import { useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import { useRef } from 'react';

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
        <h1>talker</h1>
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
    <button className='sign-in' onClick={signInWithGoogle}>Sign in with Google</button>
  )
}


function SignOut() {
  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef()

  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(1000)
  
  const [messages] = useCollectionData(query, {idField : 'id'})

  const [formValue, setFormValue] = useState('')



  const checkKey = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      return null
    }else if (e.key === "Enter") {
      sendMessage(e)
    }
  }
  

  const sendMessage = async(e) => {
    console.log(e)
    e.preventDefault()

    if (!formValue.replace(/\s/g, '').length ){
      return null
    }else {
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
  }
  return(
    <>
    {/* <div></div> */}
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.createdAt} message={msg} />)}
    </div>

    <form onSubmit={sendMessage}>
      <textarea maxLength="400" value={formValue} onChange={(e) => setFormValue(e.target.value)} onKeyDown={e => checkKey(e)} />
      <button className='send-button'  type="submit">SEND</button>
    </form>

    <div ref={dummy}></div>
    </>
  )
}

function ChatMessage(props, key) {
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  // return <p>{text} {messageClass}</p>
  return (
    <div className={`message ${messageClass}`} key={key}>
        <img className='pfp' src={photoURL} alt="" /> 
      <p>{text}</p>
    </div>
  )
}

export default App
