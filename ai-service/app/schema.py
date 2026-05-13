from pydantic import BaseModel
from typing import List

class Destination(BaseModel):
    id: int
    name: str
    description: str

class RecommendationRequest(BaseModel):
    user_input: str
    destinations: List[Destination]