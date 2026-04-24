import 'package:flutter/material.dart';

class SwapScreen extends StatelessWidget {
  const SwapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Swap Requests'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Masuk'),
              Tab(text: 'Terkirim'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildIncomingRequests(),
            _buildOutgoingRequests(),
          ],
        ),
      ),
    );
  }

  Widget _buildIncomingRequests() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 2,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Rina Sari', style: TextStyle(fontWeight: FontWeight.bold)),
                          Text('Ingin belajar: UI/UX Design', style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text('Menawarkan: Basic Python', style: TextStyle(color: Theme.of(context).primaryColor, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {},
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.red,
                          side: const BorderSide(color: Colors.red),
                        ),
                        child: const Text('Tolak'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {},
                        child: const Text('Terima'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildOutgoingRequests() {
    return const Center(child: Text('Belum ada request yang dikirim', style: TextStyle(color: Colors.grey)));
  }
}
