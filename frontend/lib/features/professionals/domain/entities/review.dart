class Review {
  const Review({
    required this.id,
    required this.authorName,
    required this.authorAvatarUrl,
    required this.rating,
    required this.comment,
    required this.createdAt,
  });

  final String id;
  final String authorName;
  final String authorAvatarUrl;
  final double rating;
  final String comment;
  final DateTime createdAt;
}
