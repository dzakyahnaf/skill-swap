import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SkillProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  bool _isLoading = false;
  List<dynamic> _mySkills = [];
  String _error = '';

  bool get isLoading => _isLoading;
  List<dynamic> get mySkills => _mySkills;
  String get error => _error;

  Future<void> fetchMySkills(int userId) async {
    _isLoading = true;
    _error = '';
    notifyListeners();

    try {
      final response = await _apiService.get('/skills?user_id=$userId');
      _mySkills = response['data'] ?? [];
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addSkill(String name, String category, String description, String skillType) async {
    _isLoading = true;
    _error = '';
    notifyListeners();

    try {
      await _apiService.post('/skills', {
        'name': name,
        'category': category,
        'description': description,
        'skill_type': skillType,
      });
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> deleteSkill(int skillId) async {
    try {
      await _apiService.delete('/skills/$skillId');
      // Remove from local list
      _mySkills.removeWhere((skill) => skill['id'] == skillId);
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  List<dynamic> _searchResults = [];
  List<dynamic> get searchResults => _searchResults;

  Future<void> fetchSkills() async {
    // This is a placeholder for fetching all available skills or recommendations
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _apiService.get('/users/search?skill=');
      _searchResults = response['data'] ?? [];
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> searchUsers(String query) async {
    _isLoading = true;
    _error = '';
    notifyListeners();
    try {
      final response = await _apiService.get('/users/search?skill=$query');
      _searchResults = response['data'] ?? [];
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
