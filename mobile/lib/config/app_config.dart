class AppConfig {
  // Use 10.0.2.2 for Android emulator testing locally, or localhost for web/iOS simulator
  static const String baseUrl = 'http://localhost:5000/api'; // For Web/iOS Simulator
  // static const String baseUrl = 'http://10.0.2.2:5000/api'; // For Android Emulator
  // static const String baseUrl = 'https://your-api-url.railway.app/api'; // For Production

  // Timeout settings
  static const int connectTimeout = 10000;
  static const int receiveTimeout = 10000;
}
