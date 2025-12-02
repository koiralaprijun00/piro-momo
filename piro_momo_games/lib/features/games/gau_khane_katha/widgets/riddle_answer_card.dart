import 'package:flutter/material.dart';

import '../../../../data/models/riddle_entry.dart';
import '../application/riddle_game_state.dart';

class RiddleAnswerCard extends StatelessWidget {
  const RiddleAnswerCard({
    super.key,
    required this.riddle,
    required this.state,
    required this.answerController,
    required this.onAnswerChanged,
    required this.onSubmitAnswer,
    required this.onRevealAnswer,
    required this.onNextRiddle,
  });

  final RiddleEntry riddle;
  final RiddleGameState state;
  final TextEditingController answerController;
  final ValueChanged<String> onAnswerChanged;
  final VoidCallback onSubmitAnswer;
  final VoidCallback onRevealAnswer;
  final VoidCallback onNextRiddle;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    final int attemptsLeft = (state.maxAttempts - state.attempts).clamp(
      0,
      state.maxAttempts,
    );
    final bool showAnswer = state.showAnswer;
    final bool isCorrect = state.isCorrect ?? false;

    final bool hasMore = !state.completed;
    final IconData actionIcon =
        hasMore ? Icons.arrow_forward_rounded : Icons.refresh_rounded;
    final String actionLabel =
        hasMore ? 'Next riddle' : 'Shuffle & continue';

    return Card(
      elevation: 8,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              'Riddle of the round',
              style: theme.textTheme.labelLarge?.copyWith(
                color: colorScheme.primary,
                letterSpacing: 0.6,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              riddle.question,
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w700,
                color: colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: <Widget>[
                Icon(
                  Icons.help_outline_rounded,
                  color: colorScheme.onSurfaceVariant,
                ),
                const SizedBox(width: 8),
                Text(
                  attemptsLeft > 0
                      ? '$attemptsLeft attempt${attemptsLeft == 1 ? '' : 's'} left'
                      : 'No attempts left',
                  style: theme.textTheme.titleSmall?.copyWith(
                    color: attemptsLeft > 0
                        ? colorScheme.onSurfaceVariant
                        : colorScheme.error,
                  ),
                ),
                const Spacer(),
                Text(
                  'Round ${state.completedCount + 1}',
                  style: theme.textTheme.titleSmall?.copyWith(
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            TextField(
              controller: answerController,
              enabled: !showAnswer,
              textInputAction: TextInputAction.done,
              onChanged: onAnswerChanged,
              onSubmitted: (_) => onSubmitAnswer(),
              decoration: InputDecoration(
                labelText: 'Your guess',
                hintText: 'Type your answer…',
              ),
            ),
            const SizedBox(height: 18),
            Row(
              children: <Widget>[
                FilledButton.icon(
                  onPressed: showAnswer ? null : onSubmitAnswer,
                  icon: const Icon(Icons.check_rounded),
                  label: const Text('Submit answer'),
                ),
                const SizedBox(width: 12),
                OutlinedButton(
                  onPressed: showAnswer ? null : onRevealAnswer,
                  child: const Text('Reveal answer'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 260),
              switchInCurve: Curves.easeOutCubic,
              switchOutCurve: Curves.easeInCubic,
              child: showAnswer
                  ? Column(
                      key: ValueKey<String>('reveal-${riddle.id}'),
                      children: <Widget>[
                        Align(
                          alignment: Alignment.centerRight,
                          child: FilledButton.tonalIcon(
                            onPressed: onNextRiddle,
                            icon: Icon(actionIcon),
                            label: Text(actionLabel),
                            style: FilledButton.styleFrom(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 12,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        _AnswerReveal(
                          riddle: riddle,
                          isCorrect: isCorrect,
                        ),
                      ],
                    )
                  : const SizedBox.shrink(),
            ),
          ],
        ),
      ),
    );
  }
}

class _AnswerReveal extends StatelessWidget {
  const _AnswerReveal({
    required this.riddle,
    required this.isCorrect,
  });

  final RiddleEntry riddle;
  final bool isCorrect;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;
    final Color accent = isCorrect ? colorScheme.primary : colorScheme.error;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 22),
      decoration: BoxDecoration(
        color: accent.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: accent.withValues(alpha: 0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              Icon(
                isCorrect
                    ? Icons.emoji_events_rounded
                    : Icons.lightbulb_outline_rounded,
                color: accent,
              ),
              const SizedBox(width: 8),
              Text(
                isCorrect ? 'बधाई छ! Correct.' : 'Here\'s the answer.',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: accent,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            riddle.answer,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w700,
              color: colorScheme.onSurface,
            ),
          ),
          if (riddle.translation != null) ...<Widget>[
            const SizedBox(height: 12),
            Text(
              'Translation:',
              style: theme.textTheme.labelMedium?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              riddle.translation!,
              style: theme.textTheme.bodyLarge?.copyWith(
                color: colorScheme.onSurface,
                height: 1.6,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
