# Obsidian Callout Test Sheet

이 문서는 지원되는 모든 콜아웃(Callout) 유형과 엣지 케이스를 테스트하기 위해 작성되었습니다.

## 1. Blue / Info 계열 (파랑)
> [!Note] Note (노트)
> 기본 노트 스타일입니다.

> [!Info] Info (정보)
> 정보 제공용 스타일입니다.

> [!Todo] Todo (할 일)
> 체크리스트 느낌의 스타일입니다.

> [!Abstract] Abstract (요약)
> 요약문 스타일입니다.

> [!Summary] Summary
> Abstract와 동일합니다.

> [!TLDR] TLDR
> 긴 글 요약용입니다.

## 2. Green / Success 계열 (초록)
> [!Tip] Tip (팁)
> 팁 제공용입니다.

> [!Hint] Hint (힌트)
> 팁과 동일합니다.

> [!Important] Important (중요)
> 중요 사항 강조용입니다.

> [!Success] Success (성공)
> 성공 메시지용입니다.

> [!Check] Check (체크)
> 확인용입니다.

> [!Done] Done (완료)
> 완료용입니다.

## 3. Orange / Warning 계열 (주황)
> [!Question] Question (질문)
> 질문 사항용입니다.

> [!Help] Help (도움)
> 도움 요청용입니다.

> [!FAQ] FAQ
> 자주 묻는 질문용입니다.

> [!Warning] Warning (경고)
> 경고 메시지용입니다.

> [!Caution] Caution (주의)
> 주의 사항용입니다.

> [!Attention] Attention (주목)
> 주목할 사항용입니다.

## 4. Red / Danger 계열 (빨강)
> [!Failure] Failure (실패)
> 실패 메시지용입니다.

> [!Fail] Fail
> Failure와 동일합니다.

> [!Missing] Missing (누락)
> 누락된 항목용입니다.

> [!Danger] Danger (위험)
> 위험 경고용입니다.

> [!Error] Error (에러)
> 에러 메시지용입니다.

> [!Bug] Bug (버그)
> 버그 리포트용입니다.

## 5. Other Colors (기타)
> [!Example] Example (예시) - 보라색
> 예시 코드나 사례용입니다.

> [!Quote] Quote (인용) - 회색/인용구 스타일
> 인용문 스타일입니다.

## 6. Edge Cases (기능 테스트)

### 제목 커스텀 (Custom Title)
> [!Tip] 나만의 꿀팁 🍯
> 제목이 '🔥 나만의 꿀팁 🍯'으로 표시되어야 합니다.

### 제목 생략 (Empty Title)
> [!Info]
> 제목을 입력하지 않으면 기본값인 'ℹ️ Info'가 표시되어야 합니다.

### 본문 줄바꿈 (Multiline Content)
> [!Warning] 주의 사항
> 첫 번째 줄입니다.
>
> 빈 줄이 있고 두 번째 줄이 이어집니다.
> 내용이 잘리는지 확인하세요.

### 마크다운 포함 제목 (Markdown in Title)
> [!Danger] **매우 위험한** 작업
> 제목에 굵은 글씨(**)가 있어도 텍스트만 깔끔하게 나오는지 확인합니다.

### 코드 블록 포함 (Code Block)
> [!Example] 코드 예제
> ```javascript
> console.log('Hello');
> ```
> 콜아웃 안에 코드 블록이 있을 때 스타일이 깨지지 않는지 확인합니다.
