import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/home/main_screen.dart';
import 'config/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/skill_provider.dart';
import 'providers/swap_provider.dart';

void main() {
  runApp(const SkillSwapApp());
}

class SkillSwapApp extends StatelessWidget {
  const SkillSwapApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => SkillProvider()),
        ChangeNotifierProvider(create: (_) => SwapProvider()),
      ],
      child: MaterialApp(
        title: 'SkillSwap',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: Consumer<AuthProvider>(
          builder: (context, auth, _) {
            // Tampilkan loading screen jika sedang mengecek token
            if (auth.isLoading) {
              return const Scaffold(
                body: Center(child: CircularProgressIndicator()),
              );
            }
            // Arahkan ke MainScreen jika sudah login, atau LoginScreen jika belum
            return auth.isAuthenticated ? const MainScreen() : const LoginScreen();
          },
        ),
      ),
    );
  }
}
