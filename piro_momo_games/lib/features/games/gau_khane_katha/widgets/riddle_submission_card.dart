import 'package:flutter/material.dart';

import '../../../../data/models/game_locale.dart';
import '../application/riddle_game_state.dart';

class RiddleSubmissionCard extends StatefulWidget {
  const RiddleSubmissionCard({
    super.key,
    required this.status,
    required this.locale,
    required this.onSubmitSuggestion,
  });

  final SubmissionStatus status;
  final GameLocale locale;
  final void Function({required String name, required String riddle})
  onSubmitSuggestion;

  @override
  State<RiddleSubmissionCard> createState() => _RiddleSubmissionCardState();
}

class _RiddleSubmissionCardState extends State<RiddleSubmissionCard> {
  late final TextEditingController _nameController;
  late final TextEditingController _riddleController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _riddleController = TextEditingController();
  }

  @override
  void didUpdateWidget(covariant RiddleSubmissionCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.status != SubmissionStatus.success &&
        widget.status == SubmissionStatus.success) {
      _nameController.clear();
      _riddleController.clear();
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _riddleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final bool isSubmitting = widget.status == SubmissionStatus.submitting;
    final bool isSuccess = widget.status == SubmissionStatus.success;
    final bool canSubmit =
        !isSubmitting &&
        _nameController.text.trim().isNotEmpty &&
        _riddleController.text.trim().isNotEmpty;

    final String title = widget.locale.languageCode == 'np'
        ? 'तपाईंको कथा पठाउनुहोस्'
        : 'Share your favorite riddle';

    final String subtitle = widget.locale.languageCode == 'np'
        ? 'नयाँ गाई खाने कथा थाहा छ? हामीलाई पठाउनुहोस्, हामी जाँचेर खेलमा थप्छौं।'
        : 'Know a clever Gau Khane Katha? Send it in and we might add it to the deck.';

    return Card(
      elevation: 5,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              title,
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              subtitle,
              style: theme.textTheme.bodyLarge?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _nameController,
              textInputAction: TextInputAction.next,
              onChanged: (_) => setState(() {}),
              decoration: const InputDecoration(
                labelText: 'Your name',
                hintText: 'e.g., Aama ko nani',
              ),
            ),
            const SizedBox(height: 14),
            TextField(
              controller: _riddleController,
              minLines: 2,
              maxLines: 4,
              onChanged: (_) => setState(() {}),
              decoration: const InputDecoration(
                labelText: 'Riddle or punchline',
                hintText: 'Write your best Gau Khane Katha...',
              ),
            ),
            const SizedBox(height: 18),
            Row(
              children: <Widget>[
                FilledButton.icon(
                  onPressed: canSubmit
                      ? () => widget.onSubmitSuggestion(
                          name: _nameController.text,
                          riddle: _riddleController.text,
                        )
                      : null,
                  icon: isSubmitting
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.send_rounded),
                  label: Text(isSubmitting ? 'Sending…' : 'Submit idea'),
                ),
                const SizedBox(width: 12),
                if (isSuccess)
                  Chip(
                    avatar: const Icon(
                      Icons.check_rounded,
                      color: Colors.green,
                    ),
                    label: const Text('धन्यवाद!'),
                    backgroundColor: Colors.green.withOpacity(0.1),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
