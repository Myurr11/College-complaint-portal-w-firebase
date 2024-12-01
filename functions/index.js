const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setAdminRole = functions.https.onCall(async (data, context) => {
  const {uid} = data;

  // Check if the requester is authenticated and an admin
  if (!context.auth || context.auth.token.admin !== true) {
    throw new functions.https.HttpsError("permission-denied", "Only admins can assign roles");
  }

  try {
    // Set the custom claim 'admin' to true for the given user ID
    await admin.auth().setCustomUserClaims(uid, {admin: true});
    return {message: `User ${uid} is now an admin.`};
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Unable to assign admin role", error);
  }
});
