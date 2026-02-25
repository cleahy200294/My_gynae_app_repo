import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../../generated/l10n.dart';

class PrivacyPage extends StatefulWidget {
  const PrivacyPage({Key? key}) : super(key: key);

  @override
  State<PrivacyPage> createState() => _PrivacyPageState();
}

class _PrivacyPageState extends State<PrivacyPage> {
  late WebViewController _controller;

  String _getPrivacyPolicyUrl(Locale locale) {
    switch (locale.languageCode) {
      case 'zh':
        return 'https://cs1.ucc.ie/~ym5/phplace_privacy/index_zh.html';
      case 'he':
        return 'https://cs1.ucc.ie/~ym5/phplace_privacy/index_he.html';
      default:
        return 'https://cs1.ucc.ie/~ym5/phplace_privacy/';
    }
  }

  @override
  Widget build(BuildContext context) {
    Locale myLocale = Localizations.localeOf(context);
    String url = _getPrivacyPolicyUrl(myLocale);

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x00000000))
      ..loadRequest(Uri.parse(url));

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xff0147a6),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios),
          color: Colors.white,
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          S.of(context).privacy,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      body: WebViewWidget(controller: _controller),
    );
  }
}
