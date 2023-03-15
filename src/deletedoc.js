import firebase from 'firebase/compat/app'; 
import 'firebase/compact/app'

const db = new Firestore({
    projectId: "projectId",
    keyFilename: "./key.json"
  });
  db.collection("messages")
    .get()
    .then(res => {
      res.forEach(element => {
        element.ref.delete();
      });
    });