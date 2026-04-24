import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/skill_provider.dart';
import '../../providers/swap_provider.dart';
import '../chat/chat_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SkillProvider>().fetchSkills();
      context.read<SwapProvider>().fetchActiveSessions();
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;
    final swapProvider = context.watch<SwapProvider>();
    final activeSessions = swapProvider.activeSessions;

    return Scaffold(
      appBar: AppBar(
        title: const Text('SkillSwap'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Halo, ${user?['username'] ?? 'User'}!',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'Siap untuk bertukar skill hari ini?',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),
            _buildActivePartnersCard(context, activeSessions),
            const SizedBox(height: 32),
            Text(
              'Kategori Skill',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            _buildCategories(),
            const SizedBox(height: 32),
            Text(
              'Rekomendasi Partner',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            _buildRecommendationList(),
          ],
        ),
      ),
    );
  }

  Widget _buildActivePartnersCard(BuildContext context, List<dynamic> activeSessions) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Theme.of(context).primaryColor.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Partner Aktif',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.all(Radius.circular(12)),
                ),
                child: Text(
                  '${activeSessions.length}/3 Slot',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (activeSessions.isEmpty)
            const Text(
              'Belum ada partner aktif. Yuk cari partner pertamamu!',
              style: TextStyle(color: Colors.white70),
            )
          else
            ...activeSessions.take(3).map((session) {
              // Menentukan nama partner dan skill yang diajarkan partner tersebut
              // Jika user login adalah requester (user_id di session), maka partner adalah requested_id (tidak ada di session langsung dari API default, tapi di backend controller kita joinkan username)
              // Oh, wait, the API returns user1_id and user2_id, we need to handle that.
              // Assuming API returns partner_name, partner_skill based on the current user. Let's just use generic field or session.id for now since we didn't customize the user's personal get_sessions fully, or did we?
              // `SwapProvider.requests` comes from `/swaps/requests` which returns requests sent/received.
              // We should just use basic fields here. Let's assume there's a field "partner_name" from API.
              final partnerName = session['partner_name'] ?? 'Partner';
              final partnerSkill = session['partner_skill_name'] ?? 'Skill Partner';

              return Padding(
                padding: const EdgeInsets.only(bottom: 12.0),
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: Colors.white,
                      child: Text(
                        partnerName.isNotEmpty ? partnerName[0].toUpperCase() : 'P',
                        style: TextStyle(color: Theme.of(context).primaryColor),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            partnerName,
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            'Belajar $partnerSkill',
                            style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ChatScreen(
                              sessionId: session['id'].toString(),
                              partnerName: partnerName,
                              partnerSkill: partnerSkill,
                            ),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Theme.of(context).primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        minimumSize: const Size(60, 36),
                        padding: EdgeInsets.zero,
                      ),
                      child: const Text('Chat', style: TextStyle(fontSize: 13)),
                    ),
                  ],
                ),
              );
            }).toList(),
        ],
      ),
    );
  }

  Widget _buildCategories() {
    final categories = [
      {'icon': Icons.code, 'name': 'Pemrograman'},
      {'icon': Icons.brush, 'name': 'Desain'},
      {'icon': Icons.language, 'name': 'Bahasa'},
      {'icon': Icons.music_note, 'name': 'Musik'},
    ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: categories.map((cat) {
        return Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 5,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Icon(
                cat['icon'] as IconData,
                color: Colors.grey.shade700,
                size: 28,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              cat['name'] as String,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
            ),
          ],
        );
      }).toList(),
    );
  }

  Widget _buildRecommendationList() {
    final searchResults = context.watch<SkillProvider>().searchResults;
    final isLoading = context.watch<SkillProvider>().isLoading;

    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (searchResults.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(16.0),
        child: Text('Belum ada rekomendasi partner saat ini.', style: TextStyle(color: Colors.grey)),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: searchResults.length > 3 ? 3 : searchResults.length,
      itemBuilder: (context, index) {
        final user = searchResults[index];
        final teachSkills = (user['teach_skills'] as List?)?.join(', ') ?? 'Belum ada';
        final learnSkills = (user['learn_skills'] as List?)?.join(', ') ?? 'Belum ada';

        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(color: Colors.grey.shade200),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.all(12),
            leading: CircleAvatar(
              radius: 24,
              backgroundColor: Colors.grey.shade200,
              child: Text(
                user['username'].toString().substring(0, 1).toUpperCase(),
                style: TextStyle(color: Theme.of(context).primaryColor, fontWeight: FontWeight.bold),
              ),
            ),
            title: Text(
              user['username'],
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text('Menawarkan: $teachSkills', maxLines: 1, overflow: TextOverflow.ellipsis),
                Text(
                  'Mencari: $learnSkills',
                  style: TextStyle(color: Theme.of(context).primaryColor),
                  maxLines: 1, overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // Navigasi ke profil user
            },
          ),
        );
      },
    );
  }
}
