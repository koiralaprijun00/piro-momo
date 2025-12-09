import 'package:flutter/material.dart';

class HeaderStatChip extends StatelessWidget {
  const HeaderStatChip({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: const BoxConstraints(minWidth: 70),
      child: child,
    );
  }
}
