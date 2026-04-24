import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_config.dart';

class ApiService {
  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('${AppConfig.baseUrl}$endpoint'),
        headers: headers,
      ).timeout(const Duration(milliseconds: AppConfig.connectTimeout));
      
      return _processResponse(response);
    } catch (e) {
      throw ApiException('Gagal terhubung ke server: ${e.toString()}');
    }
  }

  Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> body) async {
    try {
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('${AppConfig.baseUrl}$endpoint'),
        headers: headers,
        body: jsonEncode(body),
      ).timeout(const Duration(milliseconds: AppConfig.connectTimeout));
      
      return _processResponse(response);
    } catch (e) {
      throw ApiException('Gagal terhubung ke server: ${e.toString()}');
    }
  }

  Future<Map<String, dynamic>> put(String endpoint, [Map<String, dynamic>? body]) async {
    try {
      final headers = await _getHeaders();
      final response = await http.put(
        Uri.parse('${AppConfig.baseUrl}$endpoint'),
        headers: headers,
        body: body != null ? jsonEncode(body) : null,
      ).timeout(const Duration(milliseconds: AppConfig.connectTimeout));
      
      return _processResponse(response);
    } catch (e) {
      throw ApiException('Gagal terhubung ke server: ${e.toString()}');
    }
  }

  Future<Map<String, dynamic>> delete(String endpoint) async {
    try {
      final headers = await _getHeaders();
      final response = await http.delete(
        Uri.parse('${AppConfig.baseUrl}$endpoint'),
        headers: headers,
      ).timeout(const Duration(milliseconds: AppConfig.connectTimeout));
      
      return _processResponse(response);
    } catch (e) {
      throw ApiException('Gagal terhubung ke server: ${e.toString()}');
    }
  }

  Map<String, dynamic> _processResponse(http.Response response) {
    final Map<String, dynamic> responseBody = jsonDecode(response.body);
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return responseBody;
    } else {
      throw ApiException(
        responseBody['message'] ?? 'Terjadi kesalahan pada server',
        statusCode: response.statusCode,
        code: responseBody['error'],
      );
    }
  }
}

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final String? code;

  ApiException(this.message, {this.statusCode, this.code});

  @override
  String toString() => message;
}
