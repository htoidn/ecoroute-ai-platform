from typing import List, Optional
from pydantic import BaseModel, Field

# Destination Schema
class Destination(BaseModel):
    id: int
    name: str
    description: Optional[str] = ""
    country: Optional[str] = ""
    sustainability_score: Optional[float] = 0
    cost_index: Optional[float] = 0
    crowd_index: Optional[float] = 0
    tags: Optional[str] = ""
    co2_per_trip: Optional[float] = 0
    public_transport_score: Optional[float] = 0
    avg_temp: Optional[float] = 0
    best_season: Optional[str] = ""

# Recommendation Request
class RecommendationRequest(BaseModel):
    userInput: str = Field(alias="user_input")
    destinations: List[Destination]

    class Config:
        populate_by_name = True


# Recommendation Insert
class RecommendationCreate(BaseModel):
    userId: int = Field(alias="user_id")
    destinationId: int = Field(alias="destination_id")
    aiScore: float = Field(alias="ai_score")
    reason: str

    class Config:
        populate_by_name = True


# Bulk Recommendation Insert
class RecommendationBulkRequest(BaseModel):
    recommendations: List[RecommendationCreate]
