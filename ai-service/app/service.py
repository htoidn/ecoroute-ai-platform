from sklearn.metrics.pairwise import cosine_similarity
from model import vectorizer


def recommend(request):

    descriptions = []

    for destination in request.destinations:

        description = destination.description

        if description is None:
            description = ""

        descriptions.append(description)

    descriptions.append(request.user_input)

    tfidf_matrix = vectorizer.fit_transform(descriptions)

    similarity_scores = cosine_similarity(
        tfidf_matrix[-1],
        tfidf_matrix[:-1]
    )[0]

    results = []

    for i, destination in enumerate(request.destinations):

        results.append({
            "id": destination.id,
            "name": destination.name,
            "description": description,
            "score": round(float(similarity_scores[i]), 4),
            "country": getattr(destination, "country", ""),
            "sustainability_score": getattr(destination, "sustainability_score", 0),
            "cost_index": getattr(destination, "cost_index", 0),
            "crowd_index": getattr(destination, "crowd_index", 0),
            "tags": getattr(destination, "tags", "")
        })

    results = sorted(
        results,
        key=lambda x: x["score"],
        reverse=True
    )

    return results