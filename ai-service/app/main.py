from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schema import (
    RecommendationRequest,
    RecommendationCreate,
    RecommendationBulkRequest
)

from service import recommend

app = FastAPI(
    title="EcoRoute AI Service",
    description="AI-powered sustainable tourism recommendation engine",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fake in-memory DB
recommendations_db = []

# Health Endpoint
@app.get("/health")
def health():

    return {
        "status": "UP",
        "service": "EcoRoute AI"
    }

# Root Endpoint
@app.get("/")
def root():

    return {
        "message": "EcoRoute AI Service Running"
    }

# AI Recommendation Endpoint
@app.post("/recommend")
def recommend_destinations(
        request: RecommendationRequest
):

    return recommend(request)


# Create Recommendation
@app.post("/recommendations")
def create_recommendation(
        recommendation: RecommendationCreate
):

    recommendations_db.append(
        recommendation.dict()
    )

    return {
        "message": "Recommendation created successfully",
        "data": recommendation
    }

# Bulk Insert Recommendations
@app.post("/recommendations/bulk")
def bulk_insert_recommendations(
        request: RecommendationBulkRequest
):

    for recommendation in request.recommendations:

        recommendations_db.append(
            recommendation.dict()
        )

    return {
        "message": "Bulk insert successful",
        "count": len(request.recommendations)
    }


# Get All Recommendations
@app.get("/recommendations")
def get_recommendations():

    return {
        "count": len(recommendations_db),
        "data": recommendations_db
    }