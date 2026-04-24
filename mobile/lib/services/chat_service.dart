import 'package:cloud_firestore/cloud_firestore.dart';

class ChatService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Mendapatkan stream pesan untuk suatu sesi swap
  Stream<QuerySnapshot> getMessages(String sessionId) {
    return _firestore
        .collection('chats')
        .doc(sessionId)
        .collection('messages')
        .orderBy('timestamp', descending: true)
        .snapshots();
  }

  // Mengirim pesan baru
  Future<void> sendMessage(String sessionId, int senderId, String text) async {
    await _firestore
        .collection('chats')
        .doc(sessionId)
        .collection('messages')
        .add({
      'senderId': senderId,
      'text': text,
      'timestamp': FieldValue.serverTimestamp(),
    });

    // Update last message in the chat document for session list
    await _firestore.collection('chats').doc(sessionId).set({
      'lastMessage': text,
      'lastMessageTime': FieldValue.serverTimestamp(),
      'lastSenderId': senderId,
    }, SetOptions(merge: true));
  }
}
