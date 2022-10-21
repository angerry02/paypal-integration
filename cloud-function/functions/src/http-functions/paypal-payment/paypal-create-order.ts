import * as functions from "firebase-functions";
import * as constant from "../../payPalConfig";

const paypal = require("paypal-rest-sdk");

paypal.configure({
    'mode': 'sandbox',
    'client_id': constant.CLIENT_ID,
    'client_secret': constant.CLIENT_SECRET
});

export const paypalCreateOrder =
  functions
    .region("europe-west3")
    .https.onRequest(async (req, res) => {
  
      const amount = req.query.amount;
      const currency = req.query.currency?.toString().toUpperCase();
      const orderId = req.query.orderId;
      
      //This will be executed once the intent is created.
      //Note: other payment details returned by paypal will be append to this url.
      const RETURN_URL = `https://europe-west3-bayanihan-test.cloudfunctions.net/paypalHandleOrder?amount=${amount}&currency=${currency}&orderId=${orderId}`;
      
      var create_payment_json = {
          "intent": "sale",
          "payer": {
              "payment_method": "paypal"
          },
          "redirect_urls": {
              "return_url": RETURN_URL,
              "cancel_url": "http://cancel.url"
          },
          "transactions": [{
              "item_list": {
                  "items": [{
                      "name": `Order id: ${orderId}`,
                      "sku": "item",
                      "price": amount,
                      "currency": currency,
                      "quantity": 1
                  }]
              },
              "amount": {
                  "currency": currency,
                  "total": amount
              },
              "description": `Payment for order ${orderId}`
          }]
      };

      paypal.payment.create(create_payment_json, function (error: any, payment: any) {
          if (error) {
              console.log(error);
              throw error;
          } else {
              console.log('create payment response');
              console.log(payment);
              for (var index = 0; index < payment.links.length; index++) {
                  if (payment.links[index].rel === 'approval_url') {
                      res.redirect(payment.links[index].href);
                  }
              }
          }
      });
      
});