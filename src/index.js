import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getFirestore, onSnapshot, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp,query } from 'firebase/firestore';

console.log('Started with webpack');

  const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
  };
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const facturesCollection = collection(db, 'factures');
let factures = [];
let modif = 0;

onSnapshot(collection(db, 'factures'), (snapshot) => {
  let factures = [];
  snapshot.docs.map((doc) => {
    factures.push({...doc.data(), id: doc.id});
  });
  showFactures(factures);
});

const getFactures = async () => {
    const facturesSnapshot = await getDocs(facturesCollection);
    let factures = [];
    facturesSnapshot.docs.map((doc) => {
      factures.push({...doc.data(), id: doc.id});
    });

    return factures;
}

document.querySelector("#addFacture").addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log("Submit add facture");

  let number = document.querySelector('#number').value;
  let status = document.querySelector('#status').value;

  if (number !== "" && status !== "") {
    await addDoc(collection(db, "factures"), {
      'number': number,
      'status': status,
      'date': serverTimestamp()
    });

    factures = await getFactures();
    showFactures(factures);

    document.querySelector('#number').value = "";
    document.querySelector('#status').value = "";
  } else {
    alert('Merci de renseiger les champs !');
  }
});

const showFactures = (factures) => {
  document.querySelector('#listFactures').innerHTML = '';
  factures.map((facture, key) => {
    document.querySelector('#listFactures').innerHTML += '<tr class="'+(facture.status == 'A payer' ? 'red' : 'green')+'">'+'<td>'+facture.number+'</td>'+'<td>'+facture.status+'</td>'+'<td><button class="modifyFacture" data-id="'+facture.id+'" data-number="'+facture.number+'" data-status="'+facture.status+'">modifier</button>    <button class="deleteFacture" data-id="'+facture.id+'">supprimer</button></td></tr>';
  });

  //a modifier
  document.querySelectorAll('.modifyFacture').forEach(element => {
    element.addEventListener('click', async (e) => {
    
    //réecris dans le form les informations
    document.querySelector('#number').value = e.target.getAttribute('data-number');
    document.querySelector('#status').value = e.target.getAttribute('data-status');
    
    /*
    document.querySelector("#addFacture").addEventListener('submit', async (e) => {
      await updateDoc(doc(db, "factures", e.target.getAttribute('data-id')), {
        number: e.target.getAttribute('data-number'),
        status: e.target.getAttribute('data-status')
      });
      });*/
    });
  });

  document.querySelectorAll('.deleteFacture').forEach(element => {
    element.addEventListener('click', async (e) => {
      await deleteDoc(doc(db, "factures", e.target.getAttribute('data-id')));
    });
  });
}

factures=await getFactures();
showFactures(factures);