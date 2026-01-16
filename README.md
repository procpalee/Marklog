# Marklog (Markdown for Naverblog)

**네이버 블로그를 위한 마크다운 커스터마이징 & 변환 솔루션**

![Marklog Banner](web-app/public/marklog_banner.png)

**Marklog**는 마크다운(Markdown)으로 작성된 문서를 네이버 블로그 스마트에디터에 완벽하게 호환되는 HTML 스타일로 변환해주는 도구입니다.

마크다운의 편리함과 네이버 블로그의 디자인을 동시에 잡으세요.

---

## 📂 프로젝트 구성 (Project Components)

이 저장소는 두 가지 버전의 Marklog를 포함하고 있습니다.

### 1. [Marklog Web (웹 애플리케이션)](./web-app)

설치 없이 브라우저에서 즉시 사용 가능한 웹 에디터입니다.
* **특징**: 실시간 미리보기, 스타일 프리셋 저장, 직관적인 UI
* **서비스 주소**: [https://marklog.procpa.co.kr](https://marklog.procpa.co.kr)
* **소스 코드**: [`web-app/`](./web-app)

### 2. [Marklog for Obsidian (옵시디언 플러그인)](./obsidian-plugin)

노트 앱 **Obsidian** 사용자를 위한 플러그인입니다.
* **특징**: 옵시디언 내에서 명령어(`Ctrl+P`) 한 번으로 변환 및 복사, 전용 설정 탭 지원
* **소스 코드**: [`obsidian-plugin/`](./obsidian-plugin)

---

## 🚀 주요 기능

* Inline Style 변환: 외부 CSS를 허용하지 않는 네이버 블로그를 위해 모든 스타일을 인라인으로 자동 주입
* 완벽한 커스터마이징: 폰트(나눔고딕, 마루부리 등), 색상, 크기, 줄간격 상세 설정
* 문법 지원: GFM(GitHub Flavored Markdown) 완벽 지원 (표, 인용구, 코드블럭 등)
* 코드 하이라이팅: `highlight.js` 기반의 깔끔한 코드 블록 스타일링

## 🆕 v1.1 업데이트 (2026-01-16)

* **각주 스타일(Footnotes)**:
    * 글자색 커스터마이징 지원
    * UI 간소화 및 구분선 스타일 자동 최적화
* **헤더 스타일(Headers)**:
    * **'구분선(Divider line)'** 옵션 추가: 헤더를 깔끔한 구분선 디자인(Table)으로 자동 변환
    * 구분선 모드 시 **배경색(Background Color)** 설정 지원

## 🤝 기여 (Contribution)

버그 제보나 기능 제안은 [Contact](https://procpa.co.kr/contact)를 통해 연락주세요.
Pull Request는 언제나 환영합니다.

## 📄 라이선스 (License)

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

Copyright (c) 2026 **PROCPA**.
