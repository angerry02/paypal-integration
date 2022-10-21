import * as functions from "firebase-functions";
import * as constant from "../../payPalConfig";
import { OrderService } from "../../services/order-service";

const paypal = require("paypal-rest-sdk");

paypal.configure({
    'mode': 'sandbox',
    'client_id': constant.CLIENT_ID,
    'client_secret': constant.CLIENT_SECRET
});

export const paypalHandleOrder = 
  functions
    .region("europe-west3")
    .https.onRequest(async (req, res) => {
    
      const amount = req.query.amount;
      const currency = req.query.currency?.toString().toUpperCase();
      
      var execute_payment_json = {
        "payer_id": req.query.PayerID,
        "transactions": [{
            "amount": {
                "currency": currency,
                "total": amount
            }
        }]
      };
      
      const paymentId = req.query.paymentId as string;
      const orderId = req.query.orderId as string;
      
      paypal.payment.execute(paymentId, execute_payment_json, async function (error: any, payment: any) {
        if (error) {
            console.log(error);
            throw error;
        } else {
          console.log(JSON.stringify(payment));
          //Proceed with the updating of order payment
          await OrderService.updateOrderPayPalPayment(orderId, payment);
          res.redirect(`http://return_url/?status=success&id=${payment.id}&state=${payment.state}`);
        }
    });
});