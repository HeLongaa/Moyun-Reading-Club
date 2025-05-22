from fastapi import FastAPI
from app.api.v1 import *
app = FastAPI()

@app.get("/")
def read_root():
    return {"massage": "This is a Dev Server"}

app.include_router(test_router, prefix="/api/v1")
