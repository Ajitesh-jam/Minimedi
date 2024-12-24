const express = require('express');

const cors = require('cors'); // Import the CORS package
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, setDoc, getDoc, query, where, getDocs, updateDoc, deleteDoc } = require("firebase/firestore");

const app = express();
const port = 8000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To handle JSON requests
const bcrypt = require('bcrypt'); // Import bcrypt for password encryption
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpOT2KxA0FqWUnZnNZeILITRXXeBIeipE",
  authDomain: "medblock-9305e.firebaseapp.com",
  projectId: "medblock-9305e",
  storageBucket: "medblock-9305e.appspot.com",
  messagingSenderId: "266663758075",
  appId: "1:266663758075:web:184fb1b14f56e7eb76085e",
  measurementId: "G-VKM81ZZVQ4"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

// API to create a new record using Aadhar as the document ID
app.post('/createRecord/:publicAddress', async (req, res) => {
  const { 
  
        name,
        phone,
        email,
        DOB, 
        aadhar,
        gender, 
        password,
        confirmPassword,
        image
    } = req.body;
    const publicAddress = req.params.publicAddress;
    //console.log("Arguments: " + JSON.stringify(req.body));
   try {
    // Use setDoc with the Aadhar number as the document ID
    await setDoc(doc(firestore, "patient", aadhar), {
      publicAddress: publicAddress,
      name:  name,
      phone: phone,
      email: email,
      DOB: DOB,
      aadhar: aadhar,
      gender: gender,
      password: password,
      image: image,
    });
    res.status(200).send({ message: "Medical Report written with Aadhar ID: " + aadhar });
  } catch (error) {
    res.status(500).send({ error: "Error adding Record: " + error });
  }
});

// API to get a document by Aadhar (which is now the document ID)
app.get('/getRecord/:aadhar/:password', async (req, res) => {
  const { aadhar } = req.params;
  const { password } = req.params; // Password provided in the request

  console.log("Getting ",aadhar, " records from ",password);

  try {
    const docRef = doc(firestore, "patient", aadhar);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();

      if (data.password) {
        const isPasswordMatch = await bcrypt.compare(password, data.password);

        if (isPasswordMatch) {
          res.status(200).send(data);
        } else {
          res.status(401).send({ error: "Password is incorrect" });
        }
      } else {
        res.status(400).send({ error: "No password set for this record" });
      }
    } else {
      res.status(404).send({ error: "Record not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error fetching Record: " + error });
  }
});

app.get('/getRecord/Test/:aadhar', async (req, res) => {
  const { aadhar } = req.params;
  try {
    const docRef = doc(firestore, "patient", aadhar);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      res.status(200).send(snap.data());
    } else {
      res.status(404).send({ error: "Record not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error fetching Record: " + error });
  }
});

// API to set or update password by public address
app.get('/getRecord/NewPass/:publicAddress', async (req, res) => {
  const { publicAddress } = req.params;
  const { password } = req.body; // New password provided in the request

  try {
    if (!password) {
      return res.status(400).send({ error: "Password is required" });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the patient by public address
    const collectionRef = collection(firestore, "patient");
    const q = query(collectionRef, where("publicAddress", "==", publicAddress));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).send({ error: "No patient found with the provided public address" });
    }

    // Update the password for the found patient
    querySnapshot.forEach(async (doc) => {
      const docRef = doc.ref;
      await updateDoc(docRef, { password: hashedPassword });
    });

    res.status(200).send({ message: "Password set/updated successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error updating password: " + error });
  }
});

app.put('/updateRecord/:aadhar', async (req, res) => {
    const { aadhar } = req.params;
    const updates = req.body; // Extract only the fields provided in the request body
  
    try {
      const docRef = doc(firestore, "patient", aadhar);
  
      // Dynamically update only the provided fields
      if (Object.keys(updates).length > 0) {
        await updateDoc(docRef, updates);
        res.status(200).send({ message: "Record updated successfully" });
      } else {
        res.status(400).send({ error: "No fields provided for update" });
      }
    } catch (error) {
      res.status(500).send({ error: "Error updating Record: " + error });
    }
  });

// API to delete a document by Aadhar (document ID)
app.delete('/deleteRecord/:aadhar', async (req, res) => {
  const { aadhar } = req.params;
  try {
    const docRef = doc(firestore, "patient", aadhar);
    await deleteDoc(docRef);
    res.status(200).send({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error deleting document: " + error });
  }
});

// API to dynamically query records by any field
app.get('/api/queryRecords', async (req, res) => {
  try {
    const collectionRef = collection(firestore, "patient");

    // Dynamically build the query based on the request parameters
    const queryParams = req.query;

    if (Object.keys(queryParams).length !== 1) {
      return res.status(400).send({ error: "Please provide exactly one query parameter." });
    }

    // Extract the field and value from the query
    const field = Object.keys(queryParams)[0];
    const value = queryParams[field];
    // Construct the Firestore query dynamically
    const q = query(collectionRef, where(field, '==', value));
    const querySnapshot = await getDocs(q);

    // Collect all matching documents
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: "Error querying documents: " + error });
  }
});

app.get('/getAllPatients',async (req,res)=>{
  try{
    const collectionRef = collection(firestore, "patient");
    const querySnapshot = await getDocs(collectionRef);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).send(results);   
  }catch(error){
    res.status(500).send({error:"Error fetching all patients: "+error});
  }
})



//DOCTOR ----------------------------------------------------------------

// API to create a new record using Aadhar as the document ID
app.post('/doctor/createRecord/:publicAddress', async (req, res) => {
  const { 
  
        name,
        phone,
        email,
        DOB, 
        aadhar,
        gender, 
        password,
        confirmPassword,
        image,
        doctorId,
    } = req.body;
    const publicAddress = req.params.publicAddress;
    //console.log("Arguments: " + JSON.stringify(req.body));
   try {
    // Use setDoc with the Aadhar number as the document ID
    await setDoc(doc(firestore, "Doctor", aadhar), {
      publicAddress: publicAddress,
      name:  name,
      phone: phone,
      email: email,
      DOB: DOB,
      aadhar: aadhar,
      gender: gender,
      password: password,
      image: image,
      doctorId: doctorId,
    });
    res.status(200).send({ message: "Medical Report written with Aadhar ID: " + aadhar });
  } catch (error) {
    res.status(500).send({ error: "Error adding Record: " + error });
  }
});

// API to get a document by Aadhar (which is now the document ID)
app.get('/doctor/getRecord/:aadhar/:password', async (req, res) => {
  const { aadhar } = req.params;
  const { password } = req.params; // Password provided in the request

  console.log("Getting ",aadhar, " records from ",password);

  try {
    const docRef = doc(firestore, "Doctor", aadhar);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();

      if (data.password) {
        const isPasswordMatch = await bcrypt.compare(password, data.password);

        if (isPasswordMatch) {
          res.status(200).send(data);
        } else {
          res.status(401).send({ error: "Password is incorrect" });
        }
      } else {
        res.status(400).send({ error: "No password set for this record" });
      }
    } else {
      res.status(404).send({ error: "Record not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error fetching Record: " + error });
  }
});

app.get('/doctor/getRecord/Test/:aadhar', async (req, res) => {
  const { aadhar } = req.params;
  try {
    const docRef = doc(firestore, "Doctor", aadhar);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      res.status(200).send(snap.data());
    } else {
      res.status(404).send({ error: "Record not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error fetching Record: " + error });
  }
});

// API to set or update password by public address
app.get('/doctor/getRecord/NewPass/:publicAddress', async (req, res) => {
  const { publicAddress } = req.params;
  const { password } = req.body; // New password provided in the request

  try {
    if (!password) {
      return res.status(400).send({ error: "Password is required" });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the Doctor by public address
    const collectionRef = collection(firestore, "Doctor");
    const q = query(collectionRef, where("publicAddress", "==", publicAddress));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).send({ error: "No Doctor found with the provided public address" });
    }

    // Update the password for the found Doctor
    querySnapshot.forEach(async (doc) => {
      const docRef = doc.ref;
      await updateDoc(docRef, { password: hashedPassword });
    });

    res.status(200).send({ message: "Password set/updated successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error updating password: " + error });
  }
});

app.put('/doctor/updateRecord/:aadhar', async (req, res) => {
    const { aadhar } = req.params;
    const updates = req.body; // Extract only the fields provided in the request body
  
    try {
      const docRef = doc(firestore, "Doctor", aadhar);
  
      // Dynamically update only the provided fields
      if (Object.keys(updates).length > 0) {
        await updateDoc(docRef, updates);
        res.status(200).send({ message: "Record updated successfully" });
      } else {
        res.status(400).send({ error: "No fields provided for update" });
      }
    } catch (error) {
      res.status(500).send({ error: "Error updating Record: " + error });
    }
  });

// API to delete a document by Aadhar (document ID)
app.delete('/doctor/deleteRecord/:aadhar', async (req, res) => {
  const { aadhar } = req.params;
  try {
    const docRef = doc(firestore, "Doctor", aadhar);
    await deleteDoc(docRef);
    res.status(200).send({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error deleting document: " + error });
  }
});

// API to dynamically query records by any field
app.get('/doctor/api/queryRecords', async (req, res) => {
  try {
    const collectionRef = collection(firestore, "Doctor");

    // Dynamically build the query based on the request parameters
    const queryParams = req.query;

    if (Object.keys(queryParams).length !== 1) {
      return res.status(400).send({ error: "Please provide exactly one query parameter." });
    }

    // Extract the field and value from the query
    const field = Object.keys(queryParams)[0];
    const value = queryParams[field];
    // Construct the Firestore query dynamically
    const q = query(collectionRef, where(field, '==', value));
    const querySnapshot = await getDocs(q);

    // Collect all matching documents
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: "Error querying documents: " + error });
  }
});

app.get('/doctor/getAllDoctors',async (req,res)=>{
  try{
    const collectionRef = collection(firestore, "Doctor");
    const querySnapshot = await getDocs(collectionRef);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).send(results);   
  }catch(error){
    res.status(500).send({error:"Error fetching all Doctors: "+error});
  }
})



//HOSPITAL ----------------------------------------------------------------
//LifeCoin


// API to create a new record using Aadhar as the document ID
app.post('/staff/createRecord/:publicAddress', async (req, res) => {
  const { 
    name,
    phone,
    email,
    DOB, 
    aadhar,
    gender, 
    password,
    staffId,
    post,
    image
    } = req.body;
    const publicAddress = req.params.publicAddress;
    //console.log("Arguments: " + JSON.stringify(req.body));
   try {
    // Use setDoc with the Aadhar number as the document ID
    await setDoc(doc(firestore, "staff", publicAddress), {
      publicAddress: publicAddress,
      name:  name,
      phone: phone,
      email: email,
      DOB: DOB,
      aadhar: aadhar,
      gender: gender,
      password: password,
      image: image,
      staffId: staffId,
      post: post,
    
    });
    res.status(200).send({ message: "Medical Report written with Aadhar ID: " + aadhar });
  } catch (error) {
    res.status(500).send({ error: "Error adding Record: " + error });
  }
});

// API to get a document by Aadhar (which is now the document ID)
app.get('/staff/getRecord/:publicAddress/:password', async (req, res) => {
  const { publicAddress } = req.params;
  const { password } = req.params; // Password provided in the request

  //console.log("Getting ",aadhar, " records from ",password);

  try {
    const docRef = doc(firestore, "staff", publicAddress);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();

      if (data.password) {
        const isPasswordMatch = await bcrypt.compare(password, data.password);

        if (isPasswordMatch) {
          res.status(200).send(data);
        } else {
          res.status(401).send({ error: "Password is incorrect" });
        }
      } else {
        res.status(400).send({ error: "No password set for this record" });
      }
    } else {
      res.status(404).send({ error: "Record not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error fetching Record: " + error });
  }
});


// app.get('/staff/:publicAddress',async (req, res) => {

//   const { publicAddress } = req.params;
//   console.log("Getting ",publicAddress);
//   try {
//       const docRef = doc(firestore, "staff", publicAddress);
//       const snap = await getDoc(docRef);
//       if (snap.exists()) {
//         const data = snap.data();
//         res.status(200).send(data);
//         } 
//       else {
//         res.status(404).send({ error: "Record not found" });
//         }
//     } 
//     catch (error) {
//        res.status(500).send({ error: "Error fetching Record: " + error });
//     }
//  });
 
 //make a api function that on giving 3 public address as input ,will return an array from the firebase staff database
 // their public address, img url , email
 app.get('/staff/:publicAddress1/:publicAddress2/:publicAddress3', async (req, res) => {
     const { publicAddress1, publicAddress2, publicAddress3 } = req.params;
 
     try {
         // Create an array of public addresses to fetch data for
         const publicAddresses = [publicAddress1, publicAddress2, publicAddress3];
         
         
         // Fetch details for each public address from Firestore
         const fetchDetails = async (address) => {
             const docRef = doc(firestore, "staff", address);
             const snap = await getDoc(docRef);

             
             if (snap.exists()) {
                 return { publicAddress: address, ...snap.data() };
             } else {
                 return { publicAddress: address, error: "Record not found" };
             }
         };
 
         // Execute fetch for all addresses concurrently
         const results = await Promise.all(publicAddresses.map(fetchDetails));
 
         // Send the response
         res.status(200).send({ data: results });
     } catch (error) {
         res.status(500).send({ error: "Error fetching records: " + error.message });
     }
 });
 

  



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// const axios = require('axios');
 
// async function setNewPassword(publicAddress, newPassword) {
//     try {
//         const response = await axios.get(`http://localhost:8000/getRecord/NewPass/${publicAddress}`, {
//             data: { password: newPassword },
//         });

//         if (response.status === 200) {
//             console.log(`Password updated successfully for address: ${publicAddress}`);
//         } else {
//             console.error(`Failed to update password for address: ${publicAddress}`);
//         }
//     } catch (error) {
//         console.error(`Error updating password for ${publicAddress}:`, error.response?.data || error.message);
//     }
// }

// // Example usage
// const publicAddresses = [
//     '0x3a94bD23Eb39cd8083A31C0e802F7f724e95b6c2',
//     '0x1625E307538AF371F7e0B176318678De7f9C0F27',
//     '0xB6659c4B889fD48A9fa134bAB01Ce3fc25c2A3b8',
// ];

// const newPassword = 'SecureNewPassword123'; // Replace with your desired password

// publicAddresses.forEach((address) => setNewPassword(address, newPassword));
