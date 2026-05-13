from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

vectorizer = TfidfVectorizer()


def recommend(request):
    descriptions = [d.description for d in request.destinations]
    descriptions.append(request.user_input)

    tfidf = vectorizer.fit_transform(descriptions)

    scores = cosine_similarity(tfidf[-1], tfidf[:-1])[0]

    results = []

    for i, destination in enumerate(request.destinations):
        results.append({
            'id': destination.id,
            'name': destination.name,
            'description': destination.description,
            'score': float(scores[i])
        })

    return sorted(results, key=lambda x: x['score'], reverse=True)