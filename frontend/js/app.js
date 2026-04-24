const API_BASE = "http://localhost:8000";

// 수신 대상 버튼 클릭 이벤트 설정
const targetButtons = document.querySelectorAll('.target-btn');
targetButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 기존 active 제거
        targetButtons.forEach(btn => btn.classList.remove('active'));
        // 클릭된 버튼에 active 추가
        button.classList.add('active');
    });
});

/**
 * 말투 변환 API 호출
 */
async function convertTone() {
    const inputText = document.getElementById('inputText').value.trim();
    const activeBtn = document.querySelector('.target-btn.active');
    const outputText = document.getElementById('outputText');

    if (!inputText) {
        alert('변환할 내용을 입력해주세요.');
        return;
    }

    if (!activeBtn) {
        alert('수신 대상을 선택해주세요.');
        return;
    }

    const targetAudience = activeBtn.dataset.target;

    // 로딩 시작
    setLoading(true);

    try {
        const response = await fetch(`${API_BASE}/api/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: inputText,
                target_audience: targetAudience
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '변환 중 오류가 발생했습니다.');
        }

        const data = await response.json();
        outputText.value = data.converted_text;

    } catch (error) {
        console.error('Error:', error);
        alert(`오류: ${error.message}`);
    } finally {
        // 로딩 종료
        setLoading(false);
    }
}

/**
 * 로딩 상태 업데이트
 */
function setLoading(isLoading) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const convertBtn = document.getElementById('convertBtn');

    if (isLoading) {
        loadingOverlay.classList.remove('hidden');
        convertBtn.disabled = true;
        convertBtn.classList.add('opacity-50');
    } else {
        loadingOverlay.classList.add('hidden');
        convertBtn.disabled = false;
        convertBtn.classList.remove('opacity-50');
    }
}

/**
 * 클립보드 복사 기능
 */
function copyToClipboard() {
    const outputText = document.getElementById('outputText');
    
    if (!outputText.value) {
        alert('복사할 내용이 없습니다.');
        return;
    }

    // 최신 API 사용
    if (navigator.clipboard) {
        navigator.clipboard.writeText(outputText.value).then(() => {
            alert('클립보드에 복사되었습니다.');
        }).catch(err => {
            console.error('Copy failed:', err);
            // 대체 방법
            outputText.select();
            document.execCommand('copy');
            alert('클립보드에 복사되었습니다.');
        });
    } else {
        outputText.select();
        document.execCommand('copy');
        alert('클립보드에 복사되었습니다.');
    }
}
