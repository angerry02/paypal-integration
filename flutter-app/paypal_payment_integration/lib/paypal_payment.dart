import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:webview_flutter/webview_flutter.dart';

class PaypalPayment extends StatelessWidget {
  final double amount;
  final String currency;
  final String orderId;

  const PaypalPayment({Key? key, required this.amount, required this.currency, required this.orderId})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: GestureDetector(
          onTap: () {
            Navigator.pop(context);
          },
          child: const Icon(Icons.arrow_back_ios),
        ),
      ),
      body: WebView(
        initialUrl: 'https://europe-west3-bayanihan-test.cloudfunctions.net/paypalCreateOrder?amount=$amount&currency=$currency&orderId=$orderId',
        javascriptMode: JavascriptMode.unrestricted,
        gestureRecognizers: Set()
          ..add(Factory<DragGestureRecognizer>(
              () => VerticalDragGestureRecognizer())),
        onPageFinished: (value) {
          // print(value);
        },
        navigationDelegate: (NavigationRequest request) async {
          if (request.url.contains('http://return_url/?status=success')) {
            Navigator.pop(context);
          }
          return NavigationDecision.navigate;
        },
        onWebResourceError: (WebResourceError webviewerrr) {
          Navigator.pop(context);
        },
      ),
    );
  }
}