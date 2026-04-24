import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/skill_provider.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SkillProvider>().searchUsers('');
    });
  }

  void _onSearch(String query) {
    context.read<SkillProvider>().searchUsers(query);
  }

  @override
  Widget build(BuildContext context) {
    final skillProvider = context.watch<SkillProvider>();
    final results = skillProvider.searchResults;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Cari Partner'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: TextField(
              controller: _searchController,
              onChanged: _onSearch,
              decoration: InputDecoration(
                hintText: 'Cari skill yang ingin dipelajari...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    _onSearch('');
                  },
                ),
                filled: true,
                fillColor: Colors.grey.shade100,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
              ),
            ),
          ),
        ),
      ),
      body: skillProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : results.isEmpty
              ? const Center(child: Text('Tidak ada partner ditemukan.'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: results.length,
                  itemBuilder: (context, index) {
                    final user = results[index];
                    final teachSkills = (user['teach_skills'] as List?)?.cast<String>() ?? [];
                    final learnSkills = (user['learn_skills'] as List?)?.cast<String>() ?? [];

                    return Card(
                      margin: const EdgeInsets.only(bottom: 16),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(color: Colors.grey.shade200),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                CircleAvatar(
                                  radius: 24,
                                  backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                                  child: Text(
                                    user['username'].toString().substring(0, 1).toUpperCase(),
                                    style: TextStyle(
                                      color: Theme.of(context).primaryColor,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        user['username'],
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                      ),
                                    ],
                                  ),
                                ),
                                ElevatedButton(
                                  onPressed: () {
                                    // Navigasi ke profil partner
                                  },
                                  style: ElevatedButton.styleFrom(
                                    minimumSize: const Size(80, 36),
                                    padding: const EdgeInsets.symmetric(horizontal: 12),
                                  ),
                                  child: const Text('Profil'),
                                ),
                              ],
                            ),
                            const Divider(height: 24),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text('Bisa Mengajarkan:', style: TextStyle(fontSize: 12, color: Colors.grey)),
                                      const SizedBox(height: 4),
                                      Wrap(
                                        spacing: 8,
                                        children: teachSkills.map((skill) => Chip(
                                          label: Text(skill, style: const TextStyle(fontSize: 12)),
                                          padding: EdgeInsets.zero,
                                          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                          backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                                          side: BorderSide.none,
                                        )).toList(),
                                      ),
                                      if (teachSkills.isEmpty)
                                        const Text('-', style: TextStyle(fontSize: 12, color: Colors.grey)),
                                    ],
                                  ),
                                ),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text('Ingin Belajar:', style: TextStyle(fontSize: 12, color: Colors.grey)),
                                      const SizedBox(height: 4),
                                      Wrap(
                                        spacing: 8,
                                        children: learnSkills.map((skill) => Chip(
                                          label: Text(skill, style: const TextStyle(fontSize: 12)),
                                          padding: EdgeInsets.zero,
                                          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                          backgroundColor: Colors.orange.withOpacity(0.1),
                                          side: BorderSide.none,
                                        )).toList(),
                                      ),
                                      if (learnSkills.isEmpty)
                                        const Text('-', style: TextStyle(fontSize: 12, color: Colors.grey)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
