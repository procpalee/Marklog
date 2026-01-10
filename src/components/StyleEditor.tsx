import React from 'react';
import { StyleConfig } from '../utils/styleConverter';

interface StyleEditorProps {
    config: StyleConfig;
    onChange: (newConfig: StyleConfig) => void;
}

// --- Helper Components ---

const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-sm font-bold text-[#60a5fa] uppercase tracking-wider mb-3 pb-1 border-b border-[#2a3b55]/50 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]"></span>
        {title}
    </h3>
);

// Unified Label Component
const InputLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[0.85rem] text-[#8d99ae] font-medium mb-1.5 block tracking-wide truncate">
        {children}
    </label>
);

const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full bg-black/30 border border-[#2a3b55] rounded-lg px-3 py-2.5 text-white text-[0.9rem] focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] outline-none transition-all placeholder-gray-600 ${props.className}`}
    />
);

const StyledSelect = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div className="relative w-full">
        <select
            {...props}
            className={`w-full bg-black/30 border border-[#2a3b55] rounded-lg px-3 py-2.5 text-white text-[0.9rem] focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] outline-none transition-all appearance-none cursor-pointer ${props.className}`}
        >
            {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        </div>
    </div>
);

const ColorInput = ({ label, value, onChange }: { label?: string, value: string, onChange: (val: string) => void }) => (
    <div className="flex flex-col min-w-0">
        {label && <InputLabel>{label}</InputLabel>}
        <div className="flex items-center gap-2 group min-w-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#2a3b55] group-hover:border-[#60a5fa] transition-colors shrink-0">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 cursor-pointer border-none"
                    style={{ padding: 0 }}
                />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 min-w-0 bg-black/30 border border-[#2a3b55] rounded-lg px-3 py-2.5 text-white text-[0.9rem] font-mono uppercase focus:border-[#60a5fa] outline-none"
            />
        </div>
    </div>
);

// --- Main Component ---

const StyleEditor: React.FC<StyleEditorProps> = ({ config, onChange }) => {
    const handleChange = (section: keyof StyleConfig, key: string, value: any) => {
        onChange({
            ...config,
            [section]: {
                ...config[section],
                [key]: value,
            },
        });
    };

    const handleDeepChange = (section: keyof StyleConfig, subSection: string, key: string, value: string) => {
        onChange({
            ...config,
            [section]: {
                ...config[section],
                [subSection]: {
                    ...(config[section] as any)[subSection],
                    [key]: value
                }
            }
        });
    };

    return (
        <div className="flex flex-col p-5 gap-6">
            {/* 1. Global & Headings Section */}
            <div>
                <SectionHeader title="기본 설정 & 타이포그래피" />
                <div className="flex flex-col gap-4">

                    {/* Global Settings */}
                    <div className="bg-[#0f172a]/40 p-4 rounded-xl border border-[#2a3b55]/50 flex flex-col gap-3">
                        <span className="text-[#dbeafe] font-bold text-xs uppercase mb-1">전역 설정 (Global)</span>
                        <div>
                            <InputLabel>기본 폰트</InputLabel>
                            <StyledSelect
                                value={config.global.fontFamily.split(',')[0].replace(/"/g, '')}
                                onChange={(e) => {
                                    const font = e.target.value;
                                    handleChange('global', 'fontFamily', `"${font}", sans-serif`);
                                }}
                            >
                                <option value="NanumSquare">나눔스퀘어</option>
                                <option value="NanumGothic">나눔고딕</option>
                                <option value="NanumMyeongjo">나눔명조</option>
                                <option value="NanumBarunGothic">나눔바른고딕</option>
                                <option value="MaruBuri">마루부리</option>
                            </StyledSelect>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="min-w-0">
                                <InputLabel>헤더 행간</InputLabel>
                                <StyledInput
                                    type="number" step="0.1" value={config.global.headerLineHeight}
                                    onChange={(e) => handleChange('global', 'headerLineHeight', e.target.value)}
                                />
                            </div>
                            <div className="min-w-0">
                                <InputLabel>본문 행간</InputLabel>
                                <StyledInput
                                    type="number" step="0.1" value={config.global.contentLineHeight}
                                    onChange={(e) => handleChange('global', 'contentLineHeight', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Body Text Style */}
                    <div className="bg-[#0f172a]/40 p-4 rounded-xl border border-[#2a3b55]/50 flex flex-col gap-3">
                        <span className="text-[#dbeafe] font-bold text-xs uppercase mb-1">본문 (Body Text)</span>
                        <div className="grid grid-cols-1 gap-3">
                            <ColorInput
                                label="색상"
                                value={config.content.paragraph.color}
                                onChange={(val) => handleDeepChange('content', 'paragraph', 'color', val)}
                            />
                            <div className="min-w-0">
                                <InputLabel>크기</InputLabel>
                                <StyledSelect
                                    value={config.content.paragraph.fontSize.replace('px', '')}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        handleDeepChange('content', 'paragraph', 'fontSize', val ? `${val}px` : '');
                                    }}
                                >
                                    <option value="11">11px</option>
                                    <option value="13">13px</option>
                                    <option value="15">15px</option>
                                    <option value="16">16px</option>
                                    <option value="19">19px</option>
                                    <option value="24">24px</option>
                                    <option value="28">28px</option>
                                    <option value="30">30px</option>
                                    <option value="34">34px</option>
                                    <option value="38">38px</option>
                                </StyledSelect>
                            </div>
                        </div>
                    </div>

                    {/* Headers h1-h3 */}
                    {['h1', 'h2', 'h3'].map((tag) => {
                        const level = tag as 'h1' | 'h2' | 'h3';
                        return (
                            <div key={level} className="bg-[#0f172a]/40 p-4 rounded-xl border border-[#2a3b55]/50 flex flex-col gap-3">
                                <span className="text-[#dbeafe] font-bold text-xs uppercase mb-1">{tag} 스타일</span>
                                <div className="grid grid-cols-1 gap-3">
                                    <ColorInput
                                        label="색상"
                                        value={config.headers[level].color}
                                        onChange={(val) => handleDeepChange('headers', level, 'color', val)}
                                    />
                                    <div className="min-w-0">
                                        <InputLabel>크기</InputLabel>
                                        <StyledSelect
                                            value={config.headers[level].fontSize.replace('px', '')}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                handleDeepChange('headers', level, 'fontSize', val ? `${val}px` : '');
                                            }}
                                        >
                                            <option value="11">11px</option>
                                            <option value="13">13px</option>
                                            <option value="15">15px</option>
                                            <option value="16">16px</option>
                                            <option value="19">19px</option>
                                            <option value="24">24px</option>
                                            <option value="28">28px</option>
                                            <option value="30">30px</option>
                                            <option value="34">34px</option>
                                            <option value="38">38px</option>
                                        </StyledSelect>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Extra Syntax Section */}
            <div>
                <SectionHeader title="기타 문법 스타일" />
                <div className="flex flex-col gap-4">

                    {/* Headers h4-h5 */}
                    {['h4', 'h5'].map((tag) => {
                        const level = tag as 'h4' | 'h5';
                        return (
                            <div key={level} className="bg-[#0f172a]/40 p-4 rounded-xl border border-[#2a3b55]/50 flex flex-col gap-3">
                                <span className="text-[#dbeafe] font-bold text-xs uppercase mb-1">{tag} 스타일</span>
                                <div className="grid grid-cols-1 gap-3">
                                    <ColorInput
                                        label="색상"
                                        value={config.headers[level].color}
                                        onChange={(val) => handleDeepChange('headers', level, 'color', val)}
                                    />
                                    <div className="min-w-0">
                                        <InputLabel>크기</InputLabel>
                                        <StyledSelect
                                            value={config.headers[level].fontSize.replace('px', '')}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                handleDeepChange('headers', level, 'fontSize', val ? `${val}px` : '');
                                            }}
                                        >
                                            <option value="11">11px</option>
                                            <option value="13">13px</option>
                                            <option value="15">15px</option>
                                            <option value="16">16px</option>
                                            <option value="19">19px</option>
                                            <option value="24">24px</option>
                                            <option value="28">28px</option>
                                            <option value="30">30px</option>
                                            <option value="34">34px</option>
                                            <option value="38">38px</option>
                                        </StyledSelect>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Emphasis */}
                    <div className="bg-[#0f172a]/40 p-4 rounded-xl border border-[#2a3b55]/50 flex flex-col gap-3">
                        <span className="text-[#dbeafe] font-bold text-xs uppercase mb-1">강조 (Emphasis)</span>
                        <div className="grid grid-cols-1 gap-3">
                            <ColorInput
                                label="Bold 색상"
                                value={config.content.bold.color || config.content.paragraph.color}
                                onChange={(val) => handleDeepChange('content', 'bold', 'color', val)}
                            />
                            <ColorInput
                                label="Italic 색상"
                                value={config.content.italic.color || config.content.paragraph.color}
                                onChange={(val) => handleDeepChange('content', 'italic', 'color', val)}
                            />
                        </div>
                    </div>

                    {/* Highlight */}
                    <div className="bg-[#0f172a]/40 p-4 rounded-xl border border-[#2a3b55]/50 flex flex-col gap-3">
                        <span className="text-[#dbeafe] font-bold text-xs uppercase mb-1">하이라이트 (Highlight)</span>
                        <div className="grid grid-cols-1 gap-3">
                            <ColorInput
                                label="배경색"
                                value={config.content.highlight.bg}
                                onChange={(val) => handleDeepChange('content', 'highlight', 'bg', val)}
                            />
                            <ColorInput
                                label="글자색"
                                value={config.content.highlight.color || config.content.paragraph.color}
                                onChange={(val) => handleDeepChange('content', 'highlight', 'color', val)}
                            />
                        </div>
                    </div>

                    {/* Blockquote */}
                    <div className="bg-[#0f172a]/40 p-4 rounded-xl border border-[#2a3b55]/50 flex flex-col gap-3">
                        <span className="text-[#dbeafe] font-bold text-xs uppercase mb-1">인용구 (Blockquote)</span>
                        <div className="grid grid-cols-1 gap-3">
                            <ColorInput
                                label="배경색"
                                value={config.content.blockquote.bg}
                                onChange={(val) => handleDeepChange('content', 'blockquote', 'bg', val)}
                            />
                            <ColorInput
                                label="테두리"
                                value={config.content.blockquote.border}
                                onChange={(val) => handleDeepChange('content', 'blockquote', 'border', val)}
                            />
                            <ColorInput
                                label="글자색"
                                value={config.content.blockquote.color}
                                onChange={(val) => handleDeepChange('content', 'blockquote', 'color', val)}
                            />
                        </div>
                    </div>

                    {/* Inline Code */}
                    <div className="bg-[#0f172a]/40 p-4 rounded-xl border border-[#2a3b55]/50 flex flex-col gap-3">
                        <span className="text-[#dbeafe] font-bold text-xs uppercase mb-1">인라인 코드 (Inline Code)</span>
                        <div className="grid grid-cols-1 gap-3">
                            <ColorInput
                                label="배경색"
                                value={config.content.inlineCode.bg}
                                onChange={(val) => handleDeepChange('content', 'inlineCode', 'bg', val)}
                            />
                            <ColorInput
                                label="글자색"
                                value={config.content.inlineCode.color}
                                onChange={(val) => handleDeepChange('content', 'inlineCode', 'color', val)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-[#0f172a]/40 p-4 rounded-xl border border-[#2a3b55]/50 flex flex-col gap-3">
                        <span className="text-[#dbeafe] font-bold text-xs uppercase mb-1">표 (Table)</span>
                        <div className="grid grid-cols-1 gap-3">
                            <ColorInput
                                label="헤더 배경"
                                value={config.content.table.headerBg}
                                onChange={(val) => handleDeepChange('content', 'table', 'headerBg', val)}
                            />
                            <ColorInput
                                label="테두리"
                                value={config.content.table.borderColor}
                                onChange={(val) => handleDeepChange('content', 'table', 'borderColor', val)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default StyleEditor;
