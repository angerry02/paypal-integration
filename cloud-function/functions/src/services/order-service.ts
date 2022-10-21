import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
//import * as initFirebase from "firebase";

const config = functions.config().env;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.project_id,
    clientEmail: config.client_email,
    privateKey: config.private_key.replace(/\\n/g, "\n"),
  }),
});

//initFirebase.initializeApp(functions.config().firebase);
const db = admin.firestore();

export class OrderService {
    static async updateOrderPayPalPayment(orderId: string, paymentDetails: Array<any>): Promise<boolean> {
        try {
            const payment = {
                payment: {
                    paypal: paymentDetails
                }
            };
            await db.collection('orders').doc(orderId).update(payment);
        } catch (error) {
            console.log(error);
            return false;
        }
        return true;
    }
}