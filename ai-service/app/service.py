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

        # Calculate AI score based on multiple factors
        text_similarity = float(similarity_scores[i]) * 100
        sustainability_bonus = getattr(destination, "sustainability_score", 0) * 0.15
        transport_bonus = getattr(destination, "public_transport_score", 0) * 0.10

        ai_score = min(99, max(10, text_similarity + (sustainability_bonus + transport_bonus) / 100 * 20))

        # Generate intelligent reason based on destination characteristics
        reason = generate_recommendation_reason(destination, request.user_input)

        results.append({
            "id": destination.id,
            "name": destination.name,
            "description": getattr(destination, "description", ""),
            "score": round(ai_score, 1),
            "ai_reason": reason,
            "country": getattr(destination, "country", ""),
            "sustainability_score": getattr(destination, "sustainability_score", 0),
            "cost_index": getattr(destination, "cost_index", 0),
            "crowd_index": getattr(destination, "crowd_index", 0),
            "tags": getattr(destination, "tags", ""),
            "co2_per_trip": getattr(destination, "co2_per_trip", 0),
            "public_transport_score": getattr(destination, "public_transport_score", 0)
        })

    results = sorted(
        results,
        key=lambda x: x["score"],
        reverse=True
    )

    return results


def generate_recommendation_reason(destination, user_input):
    """Generate intelligent recommendations based on destination attributes"""

    reasons = []
    user_input_lower = user_input.lower()

    # Sustainability check
    if getattr(destination, "sustainability_score", 0) >= 90:
        reasons.append(f"Excellent sustainability score ({getattr(destination, 'sustainability_score', 0)})")

    # Public transport check
    if getattr(destination, "public_transport_score", 0) >= 90:
        reasons.append("Outstanding public transportation network")

    # CO2 check
    co2 = getattr(destination, "co2_per_trip", 0)
    if co2 < 100:
        reasons.append("Low carbon footprint travel")

    # Crowd check
    if getattr(destination, "crowd_index", 0) < 60:
        reasons.append("Quiet destination with fewer crowds")

    # Cost check
    cost = getattr(destination, "cost_index", 0)
    if cost < 65:
        reasons.append("Affordable destination with good value")

    # Tag matching
    tags = getattr(destination, "tags", "").lower()
    if any(keyword in user_input_lower for keyword in ["eco", "green", "sustainable", "environment"]):
        if "eco" in tags or "green" in tags or "solar" in tags:
            reasons.append("Strong eco-friendly profile matches your interests")

    if any(keyword in user_input_lower for keyword in ["culture", "history", "heritage"]):
        if "culture" in tags or "historic" in tags or "heritage" in tags or "architecture" in tags:
            reasons.append("Rich cultural and historic heritage")

    if any(keyword in user_input_lower for keyword in ["cycling", "bike", "walk"]):
        if "cycling" in tags or "walkable" in tags:
            reasons.append("Excellent for cycling and walking")

    if any(keyword in user_input_lower for keyword in ["quiet", "calm", "relax", "peaceful"]):
        if "quiet" in tags or "calm" in tags or "peaceful" in tags:
            reasons.append("Perfect for a peaceful getaway")

    if any(keyword in user_input_lower for keyword in ["coast", "beach", "sea", "water"]):
        if "coast" in tags or "water" in tags or "harbor" in tags:
            reasons.append("Beautiful coastal destination")

    # If no specific reasons found, generate generic one
    if not reasons:
        if cost < 70:
            reasons.append(f"Great for travelers seeking value and sustainability")
        else:
            reasons.append("Perfect match based on AI analysis of your preferences")

    return "; ".join(reasons[:2]) if reasons else "AI-recommended destination for you"
