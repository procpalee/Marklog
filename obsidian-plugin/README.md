# Marklog for Obsidian

**Marklog**는 옵시디언(Obsidian)에서 작성한 마크다운 문서를 **네이버 블로그** 스타일에 맞춰 HTML로 변환해주는 플러그인입니다.
복잡한 수작업 없이, 클릭 한 번으로 네이버 스마트에디터에 붙여넣을 수 있는 호환 코드를 생성하세요.

![Marklog Obsidian Banner](https://marklog.procpa.co.kr/marklog_banner.png)

## 주요 기능 (Features)

* **네이버 블로그 호환 HTML 변환**: 마크다운 문법을 네이버 블로그 인라인 스타일(Inline Style)이 적용된 HTML로 변환합니다.
* **완벽한 커스터마이징 (Settings)**:
    * **전역 스타일**: 폰트, 헤더/본문 줄간격(Line Height), 본문 색상 및 크기
    * **헤더(H1~H5)**: 레벨별 색상 및 크기 개별 설정
    * **콘텐츠**: 하이라이트, 볼드, 이탈릭, 인용구, 인라인 코드, 테이블 등의 색상 및 스타일 상세 설정
* **간편한 사용**: 리본 아이콘 클릭 또는 명령어(`Ctrl/Cmd + P`)로 즉시 변환 및 클립보드 복사
* **선택 영역 복사 (Selection Copy)**: 문서 전체가 아닌 드래그 선택한 부분만 부분적으로 변환하여 복사 가능 (v1.2.0 추가)
* **콜아웃(Callout) 지원**: Obsidian의 `> [!Type]` 문법을 네이버 블로그용 예쁜 박스 스타일(Table)로 완벽 변환
* **코드 하이라이팅**: 개발 블로그를 위한 코드 블록 스타일링(Highlight.js) 지원

## 설치 방법 (Installation)

현재 이 플러그인은 옵시디언 커뮤니티 플러그인 목록에 등록되지 않았으므로, 수동으로 설치해야 합니다. (또는 `BRAT` 플러그인 사용)

1. 이 저장소의 [Releases](https://github.com/PROCPA/Markdown2Naver/releases) 페이지에서 최신 버전의 `main.js`, `manifest.json`, `styles.css` 파일을 다운로드합니다.
2. 내 옵시디언 볼트(Vault) 폴더를 엽니다.
3. `.obsidian/plugins/marklog-obsidian` 폴더를 생성합니다.
4. 다운로드한 3개의 파일을 해당 폴더에 넣습니다.
5. 옵시디언 **설정 > 커뮤니티 플러그인**에서 '새로고침' 후 **Marklog**를 활성화합니다.

## 사용 방법 (Usage)

1. **변환할 노트 열기**: 옵시디언에서 포스팅할 마크다운 문서를 엽니다.
2. **명령어 실행**:
    * 왼쪽 사이드바의 **문서 모양 아이콘(Ribbon Icon)**을 클릭합니다.
    * 또는 `Ctrl/Cmd + P`를 누르고 `Marklog: Copy as Naver Blog HTML`을 실행합니다.
3. **복사 완료**: "Naver Blog HTML copied to clipboard!" 알림이 뜨면 클립보드에 HTML이 복사된 상태입니다.
4. **붙여넣기**: 네이버 블로그 글쓰기 화면에서 **붙여넣기(Ctrl+V)**를 합니다.

## 설정 가이드 (Settings)

**설정 > Marklog Settings**에서 다음 항목들을 조정할 수 있습니다.

### 전역 스타일 (Global Styles)
* **기본 폰트**: 나눔스퀘어, 나눔고딕, 마루부리 등 네이버 블로그 호환 폰트 선택
* **행간 (Line Height)**: 헤더와 본문의 줄간격을 분리하여 가독성 조절
* **본문 (Paragraph)**: 기본 텍스트의 색상 및 크기(px 단위) 설정

### 헤더 스타일 (Header Styles)
* H1부터 H5까지 각 제목 수준별로 **색상**과 **크기**를 지정할 수 있습니다.

### 본문 스타일 (Content Styles)
* **하이라이트**: `==강조==` 문법에 적용될 배경색 및 텍스트 색상
* **볼드/이탈릭**: 굵게(`**`) 또는 기울임(`*`) 텍스트의 색상 지정
* **인용구 (Blockquote)**: 배경색, 테두리 색상, 텍스트 색상 커스텀
* **인라인 코드**: 문장 내 `코드`의 배경/텍스트 색상
* **테이블 (Table)**: 헤더 배경, 테두리 색상, 텍스트 정렬(좌/우/중앙)

## 개발 및 빌드 (Development)

이 프로젝트를 수정하거나 직접 빌드하려면 다음 단계를 따르세요.

```bash
# 의존성 설치
npm install

# 개발 모드 (파일 변경 감지)
npm run dev

# 프로덕션 빌드 (main.js 생성)
npm run build
```

## 라이선스

MIT License
