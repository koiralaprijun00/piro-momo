import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';

/// Web pages the app links to. Google Play asks for the privacy policy to be
/// reachable from inside the app, and for a web page where people can delete
/// their account without the app.
class ExternalLinks {
  const ExternalLinks._();

  static const String privacyPolicy = 'https://piromomo.com/en/privacy';
  static const String deleteAccount = 'https://piromomo.com/en/delete-account';

  /// Opens [url] in the browser. Returns false if no app could open it.
  static Future<bool> open(String url) async {
    try {
      return await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    } catch (error) {
      debugPrint('Could not open $url: $error');
      return false;
    }
  }
}
