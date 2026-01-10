# M2N (Markdown to Naver Blog Converter)

**마크다운을 네이버 블로그 포맷(HTML)으로 변환해주는 웹 애플리케이션입니다.**

네이버 블로그는 외부 마크다운을 직접 붙여넣으면 스타일이 깨지거나 코드가 제대로 표시되지 않는 문제가 있습니다. M2N은 이러한 문제를 해결하기 위해 **네이버 스마트에디터 2.0/ONE에 최적화된 인라인 스타일 HTML**을 생성해줍니다.

---

## ✨ 주요 기능 (Key Features)

### 1️⃣ 강력한 마크다운 파싱 & 변환
- **Github Flavored Markdown (GFM)** 지원
- **Hugo Frontmatter** 자동 파싱 (제목, 태그 추출)
- **Hugo Shortcodes** (`{{< figure >}}`) 이미지 변환 지원
- **Syntax Highlighting**: Highlight.js를 이용한 코드 블록 스타일링 (GitHub 테마)

### 2️⃣ 실시간 스타일 커스터마이징 (M2N Customizer)
좌측 사이드바의 **Style Editor**를 통해 블로그 스타일을 실시간으로 조정할 수 있습니다.
- **Global Settings**: 폰트 종류(Pretendard, 나눔고딕 등), 헤더/본문 줄간격 개별 설정
- **Typography**: H1 ~ H5 헤더별 글자 색상, 크기(Font Size) 조절
- **Content Elements**: 인용구(Blockquote), 인라인 코드, 표(Table) 스타일(배경색, 테두리 등) 커스텀

### 3️⃣ 사용자 편의성 (UX)
- **Dual View**: 마크다운 입력과 네이버 블로그 미리보기를 한 화면에서 대조
- **One-Click Copy**: 변환된 HTML을 버튼 하나로 복사
- **반응형 사이드바**: 직관적인 설정 컨트롤, 항상 노출되어 접근성 강화
- **도움말 가이드**: 초보자를 위한 상세 사용법 모달 제공

---

## 🚀 사용 방법 (How to Use)

1. **마크다운 작성**: 왼쪽 'Markdown Input' 창에 글을 작성합니다. (Hugo 포맷 지원)
2. **스타일 설정**: 왼쪽 사이드바에서 폰트, 색상, 크기 등을 취향대로 조절합니다.
3. **미리보기 확인**: 오른쪽 'Naver Blog Preview' 창에서 실제 네이버 블로그에 올라길 모습을 미리 확인합니다.
4. **HTML 복사**: 사이드바 하단의 **[HTML 복사하기]** 버튼을 클릭합니다.
5. **블로그 붙여넣기**: 네이버 블로그 글쓰기 페이지로 이동하여 **붙여넣기(Ctrl+V)** 합니다.
   - *팁: 이미지가 포함된 경우, 붙여넣기 후 이미지를 클릭하여 업로드하거나 크기를 조정하세요.*

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v3 (Custom UI Design)
- **Markdown Processing**: marked (Parser), DOMPurify (Sanitizer)
- **Syntax Highlighting**: highlight.js
- **Icons**: Heroicons

## 🏗️ 프로젝트 구조

```
src/
├── components/
│   └── StyleEditor.tsx      # 스타일 설정 사이드바 컴포넌트
├── utils/
│   └── styleConverter.ts    # 마크다운 HTML -> 네이버 스타일 변환 로직
├── App.tsx                  # 메인 레이아웃 및 로직
└── main.tsx                 # 엔트리 포인트
```

## 🔧 네이버 블로그 호환성 해결 전략

| 문제점 | M2N의 해결책 |
|-------|-------------|
| **CSS 클래스 무시** | 모든 스타일을 HTML 태그 내 **인라인 `style` 속성**으로 강제 주입 |
| **코드 블록 깨짐** | `white-space` 속성과 `background-color`를 직접 지정하여 박스 형태 보존 |
| **리스트 스타일** | `<ul>`, `<ol>`의 기본 스타일 대신 패딩과 마진을 계산하여 적용 |
| **줄간격 부조화** | 헤더와 본문의 `line-height`를 분리하여 가독성 최적화 |

---

## 📝 라이선스

MIT License

## 👨‍💻 개발자

Developed by **PROCPA**