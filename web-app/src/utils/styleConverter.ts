
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

export interface StyleConfig {
    global: {
        fontFamily: string;
        headerLineHeight: string;  // 헤더용 줄간격
        contentLineHeight: string; // 본문용 줄간격
    };
    headers: {
        h1: { color: string; fontSize: string; fontWeight: string; underlined?: boolean; backgroundColor?: string; underlineColor?: string };
        h2: { color: string; fontSize: string; fontWeight: string; underlined?: boolean; backgroundColor?: string; underlineColor?: string };
        h3: { color: string; fontSize: string; fontWeight: string; underlined?: boolean; backgroundColor?: string; underlineColor?: string };
        h4: { color: string; fontSize: string; fontWeight: string; underlined?: boolean; backgroundColor?: string; underlineColor?: string };
        h5: { color: string; fontSize: string; fontWeight: string; underlined?: boolean; backgroundColor?: string; underlineColor?: string };
    };
    content: {
        blockquote: { bg: string; border: string; color: string };
        inlineCode: { bg: string; color: string };
        table: { headerBg: string; borderColor: string; headerAlign: 'left' | 'center' | 'right'; bodyAlign: 'left' | 'center' | 'right' };
        link: { color: string };
        highlight: { bg: string; color: string };
        paragraph: { color: string; fontSize: string };
        bold: { color: string };
        italic: { color: string };
        footnotes: { separatorColor: string; fontSize: string; color: string };
    };
}

export const defaultStyleConfig: StyleConfig = {
    global: {
        fontFamily: '"NanumSquare", "NanumGothic", sans-serif',
        headerLineHeight: '1.4',   // 헤더 기본값
        contentLineHeight: '1.8'   // 본문 기본값
    },
    headers: {
        h1: { color: '#000000', fontSize: '34px', fontWeight: 'bold', underlined: false, backgroundColor: '#ffffff', underlineColor: '#000000' },
        h2: { color: '#000000', fontSize: '28px', fontWeight: 'bold', underlined: false, backgroundColor: '#ffffff', underlineColor: '#000000' },
        h3: { color: '#000000', fontSize: '24px', fontWeight: 'bold', underlined: false, backgroundColor: '#ffffff', underlineColor: '#000000' },
        h4: { color: '#000000', fontSize: '19px', fontWeight: 'bold', underlined: false, backgroundColor: '#ffffff', underlineColor: '#000000' },
        h5: { color: '#000000', fontSize: '16px', fontWeight: 'bold', underlined: false, backgroundColor: '#ffffff', underlineColor: '#000000' },
    },
    content: {
        blockquote: { bg: '#f6f8fa', border: '#0366d6', color: '#24292e' },
        inlineCode: { bg: '#f4f4f4', color: '#000000' },
        table: { headerBg: '#f6f8fa', borderColor: '#ddd', headerAlign: 'left', bodyAlign: 'left' },
        link: { color: '#0366d6' },
        highlight: { bg: '#fff8b2', color: '' },
        paragraph: { color: '#000000', fontSize: '15px' },
        bold: { color: '' },
        italic: { color: '' },
        footnotes: { separatorColor: '#dbdbdb', fontSize: '13px', color: '#333333' }
    }
};

export const convertToNaverHtml = (html: string, styleConfig: StyleConfig = defaultStyleConfig): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 스타일 적용 헬퍼
    const applyStyles = (element: Element) => {
        const tagName = element.tagName.toLowerCase();

        switch (tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
                {
                    const level = tagName as 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
                    const hConfig = styleConfig.headers[level];

                    if (hConfig.underlined) {
                        // Table 구조로 변환 (배경색 + 하단 보더 2px)
                        const table = document.createElement('table');
                        const bgColor = hConfig.backgroundColor || '#ffffff';
                        const borderColor = hConfig.underlineColor || hConfig.color;

                        // border-collapse: collapse 필수, width 100%
                        table.setAttribute('style', `width: 100%; border-bottom: 2px solid ${borderColor}; background-color: ${bgColor}; border-collapse: collapse; margin-block-start: 0.83em; margin-block-end: 0.83em;`);

                        const tr = document.createElement('tr');
                        const td = document.createElement('td');

                        // TD 내부에 텍스트 스타일 적용
                        // padding을 주어 보더와 간격 확보
                        td.setAttribute('style', `padding: 5px 0 10px 0; color: ${hConfig.color}; font-size: ${hConfig.fontSize}; font-weight: ${hConfig.fontWeight}; font-family: ${styleConfig.global.fontFamily}; line-height: ${styleConfig.global.headerLineHeight}; border: none;`);

                        td.innerHTML = element.innerHTML;
                        tr.appendChild(td);
                        table.appendChild(tr);

                        element.parentNode?.replaceChild(table, element);
                    } else {
                        // 기존 방식
                        element.setAttribute('style', `font-size: ${hConfig.fontSize}; font-weight: ${hConfig.fontWeight}; color: ${hConfig.color}; margin: 0; line-height: ${styleConfig.global.headerLineHeight}; font-family: ${styleConfig.global.fontFamily}; `);
                    }
                }
                break;
            case 'sup':
                // 각주 링크 스타일 (링크 제거됨)
                element.setAttribute('style', `font-size: 0.8em; vertical-align: super; line-height: 0; font-family: ${styleConfig.global.fontFamily}; `);
                break;
            case 'p':
                // 인용구 내부의 P 태그는 인용구의 색상(blockquote.color)을 상속받아야 함.
                // 따라서 인용구 내부가 아닐 때만 본문 색상(paragraph.color)을 적용.
                const isInsideBlockquote = element.closest('blockquote');
                const pColor = isInsideBlockquote ? 'inherit' : styleConfig.content.paragraph.color;

                element.setAttribute('style', `line-height: ${styleConfig.global.contentLineHeight}; margin: 0; font-family: ${styleConfig.global.fontFamily}; color: ${pColor}; font-size: ${styleConfig.content.paragraph.fontSize}; `);
                break;
            case 'strong':
            case 'b':
                {
                    const boldColor = styleConfig.content.bold.color ? `color: ${styleConfig.content.bold.color}; ` : '';
                    element.setAttribute('style', `font-weight: bold; line-height: ${styleConfig.global.contentLineHeight}; font-family: ${styleConfig.global.fontFamily}; ${boldColor}`);
                }
                break;
            case 'em':
            case 'i':
                {
                    const italicColor = styleConfig.content.italic.color ? `color: ${styleConfig.content.italic.color}; ` : '';
                    element.setAttribute('style', `font-style: italic; line-height: ${styleConfig.global.contentLineHeight}; font-family: ${styleConfig.global.fontFamily}; ${italicColor}`);
                }
                break;
            case 'code':
                if (element.parentElement?.tagName !== 'PRE') {
                    element.setAttribute('style', `background-color: ${styleConfig.content.inlineCode.bg}; color: ${styleConfig.content.inlineCode.color}; padding: 2px 6px; border-radius: 3px; font-family: "NanumGothic", sans-serif; font-size: 13px; `);
                }
                break;
            case 'mark':
                // 네이버 블로그 하이라이트 구조
                // <span class="se-ff-nanumsquare se-fs15 se-highlight __se-node" style="color: rgb(0, 0, 0); background-color: ..."><mark>...</mark></span>
                // 이미 mark 태그이므로 감싸지 않고, mark 태그를 span으로 바꾸고 내부에 mark를 다시 넣거나
                // 또는 mark 태그 자체를 span으로 변환하고 내부에 텍스트를 mark로 감싸는 방식 사용.
                // 여기서는 element가 mark 태그임.

                // 1. 스타일 설정
                const highlightBg = styleConfig.content.highlight.bg;
                // 사용자가 color를 비워두면 상속('inherit')하게 할지, 검정으로 할지 결정. 
                // 요청사항: "기본값 없음 -> 상속". 따라서 빈 문자열이면 style 속성에서 color를 제외하거나 inherit으로 설정.
                // 네이버 블로그 호환성을 위해 span에는 color가 웬만하면 있는게 좋지만, 상속을 원하므로 처리:

                // 2. 새로운 SPAN 래퍼 생성
                const wrapperSpan = document.createElement('span');
                wrapperSpan.className = 'se-ff-nanumsquare se-fs15 se-highlight __se-node';
                wrapperSpan.style.backgroundColor = highlightBg;

                if (styleConfig.content.highlight.color) {
                    wrapperSpan.style.color = styleConfig.content.highlight.color;
                } else {
                    wrapperSpan.style.color = 'inherit';
                }

                // 3. 내용 이동 (mark 태그 내부 내용을 span 아래 mark로 이동)
                const innerMark = document.createElement('mark');
                innerMark.innerHTML = element.innerHTML;
                // 브라우저 기본 mark 스타일(노란색) 제거하여 부모 span 색상이 보이게 함
                innerMark.style.backgroundColor = 'transparent';
                innerMark.style.color = 'inherit';
                wrapperSpan.appendChild(innerMark);

                // 4. 교체
                element.parentNode?.replaceChild(wrapperSpan, element);
                break;
            case 'blockquote':
                // border-left, padding, bg, color, line-height
                element.setAttribute('style', `border-left: 4px solid ${styleConfig.content.blockquote.border}; padding: 1em 1.5em; background-color: ${styleConfig.content.blockquote.bg}; color: ${styleConfig.content.blockquote.color}; border-radius: 4px; margin: 0; line-height: ${styleConfig.global.contentLineHeight}; font-family: ${styleConfig.global.fontFamily}; `);
                break;
            case 'div':
                if (element.classList.contains('footnotes')) {
                    // 각주 영역 전체 스타일
                    element.setAttribute('style', `margin-top: 40px; border-top: 1px solid ${styleConfig.content.footnotes.separatorColor}; padding-top: 20px; font-size: ${styleConfig.content.footnotes.fontSize}; color: ${styleConfig.content.footnotes.color}; font-family: ${styleConfig.global.fontFamily}; `);

                    // 각주 내부 리스트 스타일링 -> 일반 DIV 스타일링으로 변경
                    const footnoteItems = element.querySelectorAll('div.footnote-item');
                    footnoteItems.forEach(item => {
                        item.setAttribute('style', `margin-bottom: 8px; line-height: 1.6; font-size: 13px; color: ${styleConfig.content.footnotes.color}; `);
                    });
                }
                break;
            case 'ul':
                element.setAttribute('style', `padding-left: 2em; list-style-type : disc; margin: 0; line-height: ${styleConfig.global.contentLineHeight}; font-family: ${styleConfig.global.fontFamily}; `);
                break;
            case 'ol':
                element.setAttribute('style', `padding-left: 2em; list-style-type : decimal; margin: 0; line-height: ${styleConfig.global.contentLineHeight}; font-family: ${styleConfig.global.fontFamily}; `);
                break;
            case 'li':
                element.setAttribute('style', `margin: 0; line-height: ${styleConfig.global.contentLineHeight}; `);
                break;
            case 'a':
                element.setAttribute('style', `color: ${styleConfig.content.link.color}; text-decoration: underline; font-weight: bold; line-height: ${styleConfig.global.contentLineHeight}; font-family: ${styleConfig.global.fontFamily}; `);
                break;
            case 'hr':
                element.setAttribute('style', 'border: 0; border-top: 1px solid #ddd; margin: 2em 0;');
                break;
            case 'table':
                element.setAttribute('style', `border-collapse: collapse; width: 100%; border: 1px solid ${styleConfig.content.table.borderColor}; margin: 1.5em 0; font-family: ${styleConfig.global.fontFamily}; line-height: 1.6; `);
                break;
            case 'thead':
                element.setAttribute('style', `background-color: ${styleConfig.content.table.headerBg}; `);
                break;
            case 'th':
                element.setAttribute('style', `border: 1px solid ${styleConfig.content.table.borderColor}; padding: 10px 12px; font-weight: bold; text-align: ${styleConfig.content.table.headerAlign}; background-color: ${styleConfig.content.table.headerBg}; `);
                break;
            case 'td':
                element.setAttribute('style', `border: 1px solid ${styleConfig.content.table.borderColor}; padding: 10px 12px; text-align: ${styleConfig.content.table.bodyAlign}; `);
                break;
            case 'img':
                element.setAttribute('style', 'max-width: 100%; height: auto; display: block; margin: 1.5em auto;');
                break;
            case 'span':
                if (element.classList.contains('figure-caption')) {
                    element.setAttribute('style', 'font-size: 0.9em; background-color: #fee; padding: 4px 8px; display: inline-block; margin-top: 8px; font-style: italic; color: #666; text-align: center;');
                }
                break;
        }

        // 재귀적으로 자식 요소에도 적용
        Array.from(element.children).forEach((child) => applyStyles(child));
    };

    // 1. 기본 스타일 적용
    Array.from(doc.body.children).forEach((child) => applyStyles(child));

    // 2. 리스트를 네이버 스마트에디터 구조로 변환
    const lists = doc.body.querySelectorAll('ul, ol');
    lists.forEach((list) => {
        const isOrdered = list.tagName === 'OL';

        // 1. 리스트 컨테이너 클래스 적용
        if (isOrdered) {
            list.setAttribute('class', 'se-text-list se-text-list-type-decimal');
        } else {
            list.setAttribute('class', 'se-text-list se-text-list-type-bullet-disc');
        }

        // 스타일 유지 (styleConverter 설정값 + 기본 리셋)
        // 기존 applyStyles에서 적용된 style 속성에 추가적으로 margin/padding 제어
        const currentStyle = list.getAttribute('style') || '';
        list.setAttribute('style', `${currentStyle} margin: 0; padding-left: 40px; `); // padding-left는 기본 들여쓰기 유지

        // 2. 리스트 아이템 처리
        const items = list.querySelectorAll('li');
        items.forEach((item) => {
            item.setAttribute('class', 'se-text-list-item');

            // li 스타일 정리
            const itemStyle = item.getAttribute('style') || '';
            item.setAttribute('style', `${itemStyle} margin: 0; `);

            // 3. 내부 콘텐츠 래핑 (p > span)
            // 기존 내용을 span으로 감싸고, 그 span을 p로 감싸야 함
            // 단, 이미 p태그가 있는 경우(복잡한 구조) 등을 고려하여 내부 콘텐츠를 이동

            const p = doc.createElement('p');
            p.setAttribute('class', 'se-text-paragraph se-text-paragraph-align-left');
            p.setAttribute('style', `line-height: ${styleConfig.global.contentLineHeight}; `);

            const span = doc.createElement('span');
            span.setAttribute('class', 'se-ff-system se-fs15 se-highlight __se-node');
            span.setAttribute('style', `color: ${styleConfig.content.paragraph.color}; font-size: ${styleConfig.content.paragraph.fontSize}; background-color: rgb(255, 255, 255); `); // 요청된 스타일에 본문 설정 반영

            // 기존 자식 노드들을 span으로 이동
            while (item.firstChild) {
                span.appendChild(item.firstChild);
            }

            p.appendChild(span);
            item.appendChild(p);
        });
    });

    // 3. Blockquote를 div로 변환
    const blockquotes = doc.body.querySelectorAll('blockquote');
    blockquotes.forEach((blockquote) => {
        // 마지막 p 태그의 빈 줄(&nbsp;) 제거 처리 등...
        // 여기서는 간단하게 div로 치환하고 스타일 유지
        const div = doc.createElement('div');
        div.setAttribute('style', blockquote.getAttribute('style') || '');
        div.innerHTML = blockquote.innerHTML;

        // 내부 p 태그 스타일 재적용 (line-height 포함)
        const ps = div.querySelectorAll('p');
        ps.forEach(p => {
            p.style.margin = '0 0 0.5em 0';
            p.style.lineHeight = styleConfig.global.contentLineHeight;
        });

        blockquote.parentNode?.replaceChild(div, blockquote);
    });

    // 4. PRE/CODE 블록 처리 (Highlight.js 적용 - 단순화 및 안정화)
    const codeBlocks = doc.body.querySelectorAll('pre code');
    codeBlocks.forEach((codeElement) => {
        const preElement = codeElement.parentElement;
        if (!preElement) return;

        // 언어 감지
        const className = codeElement.className || '';
        const langMatch = className.match(/language-([a-zA-Z0-9_-]+)/);
        const lang = langMatch ? langMatch[1] : 'plaintext';

        // highlight.js 실행
        let highlightedHtml = '';
        try {
            if (lang && hljs.getLanguage(lang)) {
                highlightedHtml = hljs.highlight(codeElement.textContent || '', { language: lang }).value;
            } else {
                highlightedHtml = hljs.highlightAuto(codeElement.textContent || '').value;
            }
        } catch (e) {
            highlightedHtml = codeElement.textContent || ''; // 실패 시 원본 텍스트
        }

        // Highlight.js Github Theme Colors (Inline Styles)
        const colorMap: Record<string, string> = {
            'hljs-comment': '#6a737d',
            'hljs-quote': '#6a737d',
            'hljs-keyword': '#d73a49',
            'hljs-selector-tag': '#d73a49',
            'hljs-literal': '#005cc5',
            'hljs-section': '#005cc5',
            'hljs-link': '#005cc5',
            'hljs-name': '#22863a',
            'hljs-attr': '#005cc5',
            'hljs-string': '#032f62',
            'hljs-title': '#6f42c1',
            'hljs-type': '#005cc5',
            'hljs-built_in': '#005cc5',
            'hljs-symbol': '#e36209',
            'hljs-bullet': '#735c0f',
            'hljs-meta': '#005cc5',
            'hljs-number': '#005cc5',
            'hljs-regexp': '#032f62',
            'hljs-variable': '#e36209',
            'hljs-template-variable': '#e36209',
            'hljs-subst': '#24292e',
            'hljs-function': '#24292e',
            'hljs-doctag': '#d73a49',
            'hljs-operator': '#d73a49',
            'hljs-punctuation': '#24292e',
            'hljs-tag': '#22863a',
        };

        // 임시 컨테이너에 넣어서 스타일 적용
        const tempDiv = parser.parseFromString(`<pre><code>${highlightedHtml}</code></pre>`, 'text/html').body.firstChild as HTMLElement;
        const codeContent = tempDiv.querySelector('code');

        if (codeContent) {
            const spans = codeContent.querySelectorAll('span');
            spans.forEach(span => {
                const classes = span.className.split(' ');
                let style = '';

                // 매칭되는 클래스 찾아서 스타일 적용
                classes.forEach(cls => {
                    if (colorMap[cls]) {
                        style += `color: ${colorMap[cls]}; `;
                    }
                });

                // bold, italic 등 추가 스타일 처리
                if (classes.includes('hljs-section') || classes.includes('hljs-title')) {
                    style += 'font-weight: bold; ';
                }

                if (style) {
                    span.setAttribute('style', style);
                    // 클래스 제거 (네이버 블로그 호환성)
                    span.removeAttribute('class');
                }
            });

            // 2. 공백 보존 처리 (텍스트 노드 내 공백 -> &nbsp;)
            const preserveSpaces = (node: Node) => {
                if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
                    // 일반 공백을 Non-breaking space로 치환
                    node.nodeValue = node.nodeValue.replace(/ /g, '\u00A0');
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    node.childNodes.forEach(child => preserveSpaces(child));
                }
            };
            preserveSpaces(codeContent);

            highlightedHtml = codeContent.innerHTML;
        }

        // 결과물 생성 (네이버 블로그 스타일의 테이블 구조로 변경 - 언어 표시 헤더 추가)
        const table = doc.createElement('table');
        table.setAttribute('style',
            `border-collapse: separate; border-spacing: 0; width: 100%; margin: 1.5em 0; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; background-color: #f6f8fa; font-family: "NanumGothic", sans-serif; `
        );

        // 1. 언어 헤더 행
        const headerRow = doc.createElement('tr');
        const headerCell = doc.createElement('td');
        // 언어 이름 표시 (예: JAVASCRIPT)
        const langDisplay = lang === 'plaintext' ? 'CODE' : lang.toUpperCase();

        headerCell.textContent = langDisplay;
        headerCell.setAttribute('style',
            `background-color: #f1f3f5; padding: 6px 12px; font-weight: bold; font-family: "NanumGothic", sans-serif; font-size: 0.85em; color: #666; border-bottom: 1px solid #ddd; text-align: left; `
        );
        headerRow.appendChild(headerCell);
        table.appendChild(headerRow);

        // 2. 코드 내용 행
        const codeRow = doc.createElement('tr');
        const codeCell = doc.createElement('td');
        codeCell.setAttribute('style', `padding: 0; background-color: #f6f8fa; `);

        // 스크롤 가능한 래퍼
        const scrollWrapper = doc.createElement('div');
        scrollWrapper.setAttribute('style',
            `padding: 16px; overflow-x: auto; white-space: nowrap; font-size: 13px; line-height: 1.5; color: #24292e;`
        );

        // \n을 <br>로 치환하여 복사 시 줄바꿈 유지
        scrollWrapper.innerHTML = highlightedHtml.replace(/\n/g, '<br>');

        codeCell.appendChild(scrollWrapper);
        codeRow.appendChild(codeCell);
        table.appendChild(codeRow);

        preElement.parentNode?.replaceChild(table, preElement);
    });

    return doc.body.innerHTML;
};
