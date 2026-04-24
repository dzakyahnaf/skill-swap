import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SwapProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  bool _isLoading = false;
  List<dynamic> _incomingRequests = [];
  List<dynamic> _activeSessions = [];
  String _error = '';

  bool get isLoading => _isLoading;
  List<dynamic> get incomingRequests => _incomingRequests;
  List<dynamic> get activeSessions => _activeSessions;
  String get error => _error;

  int get activePartnersCount => _activeSessions.length;

  Future<void> fetchIncomingRequests() async {
    _isLoading = true;
    _error = '';
    notifyListeners();

    try {
      final response = await _apiService.get('/swaps/incoming');
      _incomingRequests = response['data'] ?? [];
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchActiveSessions() async {
    _isLoading = true;
    _error = '';
    notifyListeners();

    try {
      final response = await _apiService.get('/sessions/active');
      _activeSessions = response['data'] ?? [];
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> sendSwapRequest(int receiverId, int senderSkillId, int receiverSkillId, String message) async {
    _isLoading = true;
    _error = '';
    notifyListeners();

    try {
      await _apiService.post('/swaps', {
        'receiver_id': receiverId,
        'sender_skill_id': senderSkillId,
        'receiver_skill_id': receiverSkillId,
        'message': message,
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

  Future<bool> acceptRequest(int requestId) async {
    _isLoading = true;
    _error = '';
    notifyListeners();

    try {
      await _apiService.put('/swaps/$requestId/accept');
      // Refresh data
      await fetchIncomingRequests();
      await fetchActiveSessions();
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> rejectRequest(int requestId) async {
    try {
      await _apiService.put('/swaps/$requestId/reject');
      // Remove from local list
      _incomingRequests.removeWhere((req) => req['id'] == requestId);
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> confirmSessionCompletion(int sessionId) async {
    _isLoading = true;
    _error = '';
    notifyListeners();

    try {
      await _apiService.put('/sessions/$sessionId/confirm');
      // Refresh to get updated status
      await fetchActiveSessions();
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
