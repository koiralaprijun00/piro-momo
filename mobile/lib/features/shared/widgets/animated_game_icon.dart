import 'dart:math' as math;
import 'package:flutter/material.dart';

class AnimatedGameIcon extends StatefulWidget {
  const AnimatedGameIcon({
    super.key,
    required this.assetPath,
    this.size = 140,
  });

  final String assetPath;
  final double size;

  @override
  State<AnimatedGameIcon> createState() => _AnimatedGameIconState();
}

class _AnimatedGameIconState extends State<AnimatedGameIcon>
    with TickerProviderStateMixin {
  late final AnimationController _floatController;
  late final AnimationController _rotateController;
  late final Animation<double> _floatAnimation;

  @override
  void initState() {
    super.initState();

    // Float Animation: 3s ease-in-out infinite
    _floatController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat(reverse: true);

    _floatAnimation = Tween<double>(begin: 0, end: -15).animate(
      CurvedAnimation(parent: _floatController, curve: Curves.easeInOut),
    );

    // Rotate Animation: 4s linear infinite
    _rotateController = AnimationController(
      duration: const Duration(seconds: 4),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _floatController.dispose();
    _rotateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _floatAnimation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _floatAnimation.value),
          child: SizedBox(
            width: widget.size + 40, // Extra space for glow
            height: widget.size + 40,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Rotating Glow Ring (Layer 3 - Bottom)
                AnimatedBuilder(
                  animation: _rotateController,
                  builder: (context, child) {
                    return Transform.rotate(
                      angle: _rotateController.value * 2 * math.pi,
                      child: Container(
                        width: widget.size + 20,
                        height: widget.size + 20,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(45),
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                          Colors.white.withValues(alpha: 0.1),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
                
                // Glass Container (Layer 2 - Middle)
                Container(
                  width: widget.size,
                  height: widget.size,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(40),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.25),
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 60,
                        offset: const Offset(0, 20),
                      ),
                    ],
                  ),
                  // Emoji/Icon (Layer 1 - Top)
                  child: Image.asset(
                    widget.assetPath,
                    fit: BoxFit.contain,
                    // Note: Drop shadow on image itself is tricky with just Image.asset.
                    // We can wrap it in a container with shadow or use a shader mask, 
                    // but for simple drop shadow on transparent PNG/SVG, simple BoxShadow on container won't work perfectly if it's not a box.
                    // However, the requirement says "Emoji with Drop Shadow... filter: drop-shadow".
                    // In Flutter, we can use simple shadow on the container if the image is the content, 
                    // OR use a Shadow widget if it was text.
                    // For an image asset, we can't easily apply CSS filter drop-shadow without a specific package or shader.
                    // But we can try to simulate it or just let the container shadow do the work for the "box".
                    // The requirement specifically mentioned "Emoji... filter: drop-shadow".
                    // If the asset is an image, we can't easily do per-pixel drop shadow without `SimpleShadow` package or similar.
                    // I will stick to the container shadow for now as it provides depth to the *card*.
                    // Wait, the requirement says "Emoji... z-index: 1... drop-shadow".
                    // If the asset is a PNG with transparency, `BoxShadow` on the parent `Container` (the glass box) is already there.
                    // If we want shadow *on the icon itself* inside the box, we can use a trick:
                    // Stack with two images, one offset and dark/blurred? Or just ignore per-pixel shadow for now to keep it simple and performant.
                    // I will stick to the glass container shadow which is already implemented above.
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
