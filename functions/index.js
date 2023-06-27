// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require('firebase-functions/v2');

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");


setGlobalOptions({ maxInstances: 1 });
initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
  const original = req.query.text;

  const writeResult = await getFirestore()
    .collection("messages")
    .add({ original });

  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
  // Grab the current value of what was written to Firestore.
  const original = event.data.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log("Uppercasing", event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event.data.ref.set({ original: uppercase }, { merge: true });
});

// exports.addAndFetchData = onRequest(async (req, res) => {
//   const invs = [
//     {
//       name: 'Naval',
//       portfolio: 'Slack',
//     },
//     {
//       name: 'John',
//       portfolio: 'Google',
//     }
//   ];
//   // Push the new message into Firestore using the Firebase Admin SDK.
//   for (const inv of invs) {
//     const writeResult = await getFirestore()
//       .collection("test-investors")
//       .add({ inv });
//   };

//   const snapshot = await getFirestore()
//     .collection("test-investors")
//     .get();

//   console.log(`loaded docs: `)
//   snapshot.docs.forEach(doc => {
//     console.log(doc.data());
//   });

//   // Send back a message that we've successfully written the message
//   res.json({ result: `Done` });
// });