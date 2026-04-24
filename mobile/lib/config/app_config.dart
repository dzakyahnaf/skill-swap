class AppConfig {
  // Use 10.0.2.2 for Android emulator testing locally, or localhost for web/iOS simulator
  static const String baseUrl = 'http://localhost:5000/api';
  
  // Timeout settings
  static const int connectTimeout = 10000;
  static const int receiveTimeout = 10000;
}
