from fastapi import APIRouter, HTTPException
from backend.models.schemas import ConvertRequest, ConvertResponse
from backend.services.tone_converter import converter_service

router = APIRouter()

@router.post("/convert", response_model=ConvertResponse)
async def convert_text(request: ConvertRequest):
    """
    텍스트 말투 변환 엔드포인트
    """
    try:
        converted = await converter_service.convert(
            text=request.text, 
            target_audience=request.target_audience
        )
        
        return ConvertResponse(
            converted_text=converted,
            target_audience=request.target_audience,
            original_text=request.text
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
