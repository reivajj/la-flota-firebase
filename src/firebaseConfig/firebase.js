import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/functions';
import firebaseConfig from 'firebaseConfig/firebaseConfig';

firebase.initializeApp(firebaseConfig);

export default firebase;