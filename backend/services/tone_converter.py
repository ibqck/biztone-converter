import os
from dotenv import load_dotenv
from langchain_upstage import ChatUpstage
from langchain_core.prompts import ChatPromptTemplate
from backend.prompts.templates import PROMPTS

# .env 파일 로드
load_dotenv()

class ToneConverter:
    def __init__(self):
        api_key = os.getenv("UPSTAGE_API_KEY")
        if not api_key:
            raise ValueError("UPSTAGE_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.")
        
        # ChatUpstage 초기화 (모델명: solar-pro2)
        self.llm = ChatUpstage(
            api_key=api_key,
            model="solar-pro2"
        )

    async def convert(self, text: str, target_audience: str) -> str:
        """
        입력된 텍스트를 수신 대상에 맞는 말투로 변환합니다.
        """
        system_prompt = PROMPTS.get(target_audience, PROMPTS["team"])
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", "{text}")
        ])
        
        chain = prompt | self.llm
        
        try:
            response = await chain.ainvoke({"text": text})
            return response.content
        except Exception as e:
            print(f"Error calling Upstage API: {e}")
            raise RuntimeError("LLM API 호출 중 오류가 발생했습니다.")

# 싱글톤 인스턴스 생성
converter_service = ToneConverter()
