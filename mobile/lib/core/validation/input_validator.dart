/// Utility class for validating user input.
/// 
/// Provides validation methods for common input types like email and password
/// with user-friendly error messages.
class InputValidator {
  InputValidator._();

  /// Validates an email address.
  /// 
  /// Returns `null` if the email is valid, otherwise returns an error message.
  /// 
  /// Example:
  /// ```dart
  /// final error = InputValidator.validateEmail('user@example.com');
  /// if (error != null) {
  ///   // Show error to user
  /// }
  /// ```
  static String? validateEmail(String? email) {
    if (email == null || email.isEmpty) {
      return 'Email is required';
    }

    final trimmedEmail = email.trim();
    if (trimmedEmail.isEmpty) {
      return 'Email cannot be empty';
    }

    // Basic email format validation
    // Matches: user@domain.com, user.name@domain.co.uk, etc.
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );

    if (!emailRegex.hasMatch(trimmedEmail)) {
      return 'Please enter a valid email address';
    }

    // Check for reasonable length (most email systems have limits)
    if (trimmedEmail.length > 254) {
      return 'Email address is too long';
    }

    return null; // Valid
  }

  /// Validates a password.
  /// 
  /// Returns `null` if the password is valid, otherwise returns an error message.
  /// 
  /// Requirements:
  /// - At least 8 characters
  /// - At least one uppercase letter
  /// - At least one lowercase letter
  /// - At least one number
  /// 
  /// Example:
  /// ```dart
  /// final error = InputValidator.validatePassword('MyPass123');
  /// if (error != null) {
  ///   // Show error to user
  /// }
  /// ```
  static String? validatePassword(String? password) {
    if (password == null || password.isEmpty) {
      return 'Password is required';
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }

    if (password.length > 128) {
      return 'Password is too long';
    }

    if (!password.contains(RegExp(r'[A-Z]'))) {
      return 'Password must contain at least one uppercase letter';
    }

    if (!password.contains(RegExp(r'[a-z]'))) {
      return 'Password must contain at least one lowercase letter';
    }

    if (!password.contains(RegExp(r'[0-9]'))) {
      return 'Password must contain at least one number';
    }

    return null; // Valid
  }

  /// Validates that two passwords match.
  /// 
  /// Returns `null` if passwords match, otherwise returns an error message.
  /// 
  /// Example:
  /// ```dart
  /// final error = InputValidator.validatePasswordMatch('pass123', 'pass123');
  /// if (error != null) {
  ///   // Show error to user
  /// }
  /// ```
  static String? validatePasswordMatch(String? password, String? confirmPassword) {
    if (password == null || password.isEmpty) {
      return 'Password is required';
    }

    if (confirmPassword == null || confirmPassword.isEmpty) {
      return 'Please confirm your password';
    }

    if (password != confirmPassword) {
      return 'Passwords do not match';
    }

    return null; // Valid
  }

  /// Validates email and password together.
  /// 
  /// Returns a map with 'email' and 'password' keys containing error messages,
  /// or `null` values if valid.
  /// 
  /// Example:
  /// ```dart
  /// final errors = InputValidator.validateEmailAndPassword(
  ///   email: 'user@example.com',
  ///   password: 'MyPass123',
  /// );
  /// if (errors['email'] != null || errors['password'] != null) {
  ///   // Show errors to user
  /// }
  /// ```
  static Map<String, String?> validateEmailAndPassword({
    required String? email,
    required String? password,
  }) {
    return {
      'email': validateEmail(email),
      'password': validatePassword(password),
    };
  }
}
