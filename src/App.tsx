import { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import 'highlight.js/styles/github.css';

import { convertToNaverHtml, defaultStyleConfig, StyleConfig } from './utils/styleConverter';
import StyleEditor from './components/StyleEditor';

const DEFAULT_MARKDOWN = `
# MD to Naver Converter

이 도구는 **마크다운(Markdown)** 으로 작성한 글을 **네이버 블로그** 스타일의 HTML로 변환해줍니다.
왼쪽 패널에서 마크다운을 작성하면, 오른쪽에서 실시간으로 미리보기(Preview)를 확인할 수 있습니다.

## 🛠 지원하는 문법 예시

### 1. 텍스트 스타일
글자를 **진하게(Bold)** 강조하거나, *기울임(Italic)* 으로 표현할 수 있습니다.
물론 ~~취소선(Strikethrough)~~ 이나 ==하이라이트(Highlight)== 도 지원합니다.

### 2. 헤딩 (Headers)
# H1 제목입니다 (가장 큼)
## H2 제목입니다 (주요 섹션)
### H3 제목입니다 (소제목)
#### H4 제목입니다 (세부 제목)
##### H5 제목입니다 (세부 제목)

### 3. 목록 (Lists)
**순서 없는 목록:**
- 사과
- 바나나
- 포도

**순서 있는 목록:**
1. 첫 번째 할 일
2. 두 번째 할 일
3. 세 번째 할 일

### 4. 인용구 (Blockquote)
> "중요한 내용은 인용구로 감싸서 강조해보세요.
> 독자의 시선을 사로잡을 수 있습니다."

### 5. 코드 (Code)
문장 중간에 \`console.log('Hello')\` 처럼 **인라인 코드**를 넣을 수 있습니다.

여러 줄의 코드는 **코드 블록**을 사용하세요. (하이라이팅 지원 ✨)

\`\`\`javascript
// JavaScript 예시
function sayHello() {
    console.log(\`안녕하세요!\`);
    return true;
}
\`\`\`

\`\`\`python
# Python 예시
def calculate_sum(a, b):
    return a + b
\`\`\`

### 6. 링크 및 이미지
[생산적 회계사 바로가기](https://www.procpa.co.kr) 처럼 링크를 걸 수 있습니다.

이미지도 간편하게 넣으세요:
![생산적 회계사](https://procpa.co.kr/wp-content/uploads/2025/12/cropped-프로필사진_증명사진-변환-1.png)

### 7. 표 (Table)
| 제품명 | 가격 | 재고 |
|:---:|:---:|:---:|
| 기계식 키보드 | 150,000원 | 10개 |
| 게이밍 마우스 | 89,000원 | 5개 |
| 모니터 | 300,000원 | 2개 |
`;

function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);

  const [styleConfig, setStyleConfig] = useState<StyleConfig>(defaultStyleConfig);
  const [naverHtml, setNaverHtml] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  useEffect(() => {
    marked.setOptions({ breaks: true, gfm: true });

    // 연속된 빈 줄을 각각 별도 단락으로 처리 (네이버 블로그 호환성)
    let processedMarkdown = markdown;
    processedMarkdown = processedMarkdown.replace(/\n\n+/g, (match) => {
      const newlineCount = match.length;
      const emptyLineCount = newlineCount - 1; // 실제 빈 줄 개수
      // 각 빈 줄마다 &nbsp; 단락 추가
      return '\n\n' + '&nbsp;\n\n'.repeat(emptyLineCount);
    });

    // ==하이라이트== 문법 지원
    processedMarkdown = processedMarkdown.replace(/==(.+?)==/g, '<mark>$1</mark>');

    const rawHtml = marked.parse(processedMarkdown, { async: false }) as string;
    const sanitized = DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['class', 'style', 'target'],
    });
    const finalHtml = convertToNaverHtml(sanitized, styleConfig);
    setNaverHtml(finalHtml);
    setPreviewHtml(finalHtml);
  }, [markdown, styleConfig]);

  const handleCopy = async () => {
    try {
      if (typeof ClipboardItem !== 'undefined') {
        const htmlBlob = new Blob([naverHtml], { type: 'text/html' });
        const textBlob = new Blob([naverHtml], { type: 'text/plain' });
        const data = [new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob
        })];
        await navigator.clipboard.write(data);
      } else {
        // Fallback for older browsers (might copy as raw text)
        await navigator.clipboard.writeText(naverHtml);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      try {
        // 2nd Fallback attempt
        await navigator.clipboard.writeText(naverHtml);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e2) {
        alert('복사에 실패했습니다. 보안 컨텍스트(HTTPS/localhost)에서 실행 중인지 확인해주세요.');
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('작성 중인 내용이 사라지고 초기 상태로 되돌아갑니다. 계속하시겠습니까?')) {
      setMarkdown(DEFAULT_MARKDOWN);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-white overflow-hidden font-pretendard relative">
      {/* Top Header Bar (Fixed) */}
      <div className="w-full bg-[#16213e] border-b border-[#2a3b55] flex justify-between items-center px-6 py-3 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] bg-clip-text text-transparent">
            MD to NaverBlog Transformer
          </h1>
          <p className="text-[11px] text-gray-500 pt-1 hidden sm:block">Designed for Naver SmartEditor 2.0</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all border ${isSettingsOpen
              ? 'bg-[#3b82f6]/10 border-[#3b82f6] text-[#60a5fa]'
              : 'bg-[#1e293b] border-[#2a3b55] text-gray-400 hover:text-white hover:border-gray-500'
              }`}
          >
            {isSettingsOpen ? '설정 닫기' : '설정 열기'}
          </button>

          <button
            onClick={() => setIsHelpOpen(true)}
            className="px-3 py-1.5 text-xs bg-[#2a3b55] hover:bg-[#344b6b] text-gray-200 rounded-md transition-colors whitespace-nowrap"
          >
            사용법
          </button>
        </div>
      </div>

      {/* Main Content Area with Relative Positioning for Floating Sidebar */}
      <div className="flex-1 flex relative min-h-0 z-10 bg-slate-50 overflow-hidden">

        {/* Floating Settings Sidebar */}
        <div
          className={`absolute top-0 left-0 h-full w-[340px] bg-[#16213e] border-r border-[#2a3b55] shadow-2xl z-40 transition-transform duration-300 ease-in-out transform ${isSettingsOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="h-full overflow-y-auto custom-scrollbar">
            <StyleEditor config={styleConfig} onChange={setStyleConfig} />
          </div>
        </div>

        {/* Main Editor Environment */}
        <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300">
          <div className="flex-1 flex overflow-hidden p-6 gap-6 min-h-0">
            {/* Markdown Input Container */}
            <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-14 border-b border-slate-200 bg-slate-100 flex justify-between items-center px-5 shrink-0">
                <span className="text-base font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Markdown Input
                </span>
                <button
                  onClick={handleReset}
                  className="text-xs px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-md transition-colors font-medium"
                  title="초기 상태로 되돌리기"
                >
                  초기화
                </button>
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 w-full bg-white text-gray-800 resize-none focus:outline-none text-[16px] leading-relaxed custom-scrollbar selection:bg-blue-500/30"
                placeholder="여기에 마크다운을 입력하거나 붙여넣으세요..."
                spellCheck={false}
                style={{
                  paddingTop: '40px',
                  paddingBottom: '40px',
                  paddingLeft: 'max(40px, calc((100% - 800px) / 2 + 40px))',
                  paddingRight: 'max(40px, calc((100% - 800px) / 2 + 40px))'
                }}
              />
            </div>

            {/* PREVIEW Container */}
            <div className="flex-1 flex flex-col min-w-[400px] bg-white text-black rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-14 border-b border-slate-200 bg-slate-100 flex justify-between items-center px-5 shrink-0">
                <span className="text-base font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Naver Blog Preview
                </span>
                <button
                  onClick={handleCopy}
                  className={`text-xs px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 font-bold shadow-sm ${copied ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      복사 완료
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.375a3.375 3.375 0 00-3.375-3.375h-3.375A3.375 3.375 0 004.25 10.625v3.375h-1A1.5 1.5 0 011.75 12.5V3.5A1.5 1.5 0 013.25 2h1.375A1.5 1.5 0 016.125 3.5V3.5z" />
                        <path d="M3.25 15.5a.25.25 0 01.25-.25h.625a1.875 1.875 0 011.875-1.875h3.375a1.875 1.875 0 011.875 1.875h.625a.25.25 0 01.25.25v.625a1.875 1.875 0 01-1.875 1.875H4.125A1.875 1.875 0 012.25 16.125V15.5H3.25z" />
                      </svg>
                      HTML 복사
                    </>
                  )}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
                <div className="max-w-[800px] mx-auto p-[40px] min-h-full">
                  <div
                    className="naver-post-content"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Modal */}
        {isHelpOpen && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm p-4" onClick={() => setIsHelpOpen(false)}>
            <div className="bg-[#1e293b] w-full max-w-lg rounded-xl border border-white/10 shadow-2xl flex flex-col animate-fadeIn overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-[#2a3b55] flex justify-between items-center bg-[#16213e]">
                <h3 className="font-bold text-lg bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] bg-clip-text text-transparent">사용 방법</h3>
                <button className="text-gray-400 hover:text-white text-2xl leading-none" onClick={() => setIsHelpOpen(false)}>&times;</button>
              </div>
              <div className="p-6 text-gray-300 text-sm leading-relaxed overflow-y-auto max-h-[70vh] custom-scrollbar">
                <div className="flex gap-4 mb-6">
                  <span className="w-6 h-6 rounded-full bg-[#3b82f6] text-[#1e293b] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="text-white block mb-1">마크다운 작성 (Markdown)</strong>
                    <p className="text-gray-400">왼쪽 입력창에 마크다운 문법을 사용하여 글을 작성하세요.</p>
                  </div>
                </div>
                <div className="flex gap-4 mb-6">
                  <span className="w-6 h-6 rounded-full bg-[#3b82f6] text-[#1e293b] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="text-white block mb-1">스타일 커스텀 (Customizing)</strong>
                    <p className="text-gray-400">왼쪽 사이드바에서 폰트, 색상, 줄간격 등을 내 취향대로 조절하세요. 실시간으로 반영됩니다.</p>
                  </div>
                </div>
                <div className="flex gap-4 mb-6">
                  <span className="w-6 h-6 rounded-full bg-[#3b82f6] text-[#1e293b] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="text-white block mb-1">복사 및 붙여넣기 (Copy & Paste)</strong>
                    <p className="text-gray-400">설정이 끝나면 하단의 'HTML 복사하기' 버튼을 누르고, 네이버 블로그 글쓰기 에디터에 그대로 붙여넣기(Ctrl+V) 하세요.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
