from fastapi import FastAPI
from schema import RecommendationRequest
from service import recommend

app = FastAPI()

@app.get('/health')
def health():
    return {'status': 'UP'}

@app.post('/recommend')
def get_recommendations(request: RecommendationRequest):
    return recommend(request)