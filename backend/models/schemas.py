from pydantic import BaseModel, Field
from typing import Literal

class ConvertRequest(BaseModel):
    text: str = Field(..., min_length=1, description="변환할 원문")
    target_audience: Literal["boss", "colleague", "client", "team"] = Field(
        ..., description="수신 대상 (boss, colleague, client, team)"
    )

class ConvertResponse(BaseModel):
    converted_text: str
    target_audience: str
    original_text: str
