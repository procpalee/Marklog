import React, { useEffect, useState } from 'react';
import { StyleConfig, defaultStyleConfig } from '../utils/styleConverter';
import { getAllPresets, saveUserPreset, deleteUserPreset, Preset } from '../utils/stylePresets';

interface StyleEditorProps {
    config: StyleConfig;
    onChange: (newConfig: StyleConfig) => void;
}

// --- Helper Components ---

const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2a3b55]/50">
        <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]"></span>
        <h3 className="text-[15px] font-bold text-[#60a5fa] uppercase tracking-wider">
            {title}
        </h3>
    </div>
);

const SubSectionHeader = ({ title }: { title: string }) => (
    <div className="text-[13px] font-semibold text-[#dbeafe] mb-2 flex items-center gap-1.5">
        <span className="w-1 h-3 bg-[#3b82f6]/50 rounded-sm"></span>
        {title}
    </div>
);

const InputLabel = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <label className={`text-[12px] text-gray-400 font-medium whitespace-nowrap ${className}`}>
        {children}
    </label>
);

const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full bg-black/20 border border-[#2a3b55] rounded-md px-2.5 py-1.5 text-white text-[13px] focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] outline-none transition-all placeholder-gray-600 ${props.className}`}
    />
);

const StyledSelect = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div className={`relative w-full ${props.className}`}>
        <select
            {...props}
            className="w-full bg-black/20 border border-[#2a3b55] rounded-md pl-2.5 pr-8 py-1.5 text-white text-[13px] focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] outline-none transition-all appearance-none cursor-pointer"
        >
            {children}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        </div>
    </div>
);

interface ColorInputProps {
    value: string;
    onChange: (val: string) => void;
    defaultValue?: string;
    placeholder?: string;
    label?: string; // Add optional label logic inside if needed, or handle outside
}

const ColorInput = ({ value, onChange, defaultValue, placeholder }: ColorInputProps) => {
    return (
        <div className="flex items-center gap-1.5 min-w-[120px] relative group h-[34px]">
            {/* Color Preview & Picker */}
            <div className="relative w-[34px] h-[34px] rounded-md overflow-hidden border border-[#2a3b55] group-hover:border-[#60a5fa] transition-colors shrink-0">
                <input
                    type="color"
                    value={value || '#000000'}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 cursor-pointer border-none"
                    style={{ padding: 0 }}
                />
            </div>

            {/* Text Input */}
            <input
                type="text"
                value={value}
                placeholder={placeholder || "#000000"}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 w-full min-w-[70px] bg-black/20 border border-[#2a3b55] rounded-md px-2 py-1.5 text-white text-[12px] font-mono uppercase focus:border-[#60a5fa] outline-none h-full"
            />

            {/* Reset Button */}
            {defaultValue !== undefined && value !== defaultValue && (
                <button
                    onClick={() => onChange(defaultValue)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    title="기본값으로 복원"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0v2.433l-.31-.31a7 7 0 00-11.712 3.138.75.75 0 001.449.39 5.5 5.5 0 019.201-2.466l.312.312h-2.433a.75.75 0 000 1.5h4.242z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </div>
    );
};

// --- Container Components ---

const SectionCard = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-[#0f172a]/40 p-3.5 rounded-xl border border-[#2a3b55]/50 flex flex-col gap-3 h-full">
        {children}
    </div>
);

const Row = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        {children}
    </div>
);

// --- Main Component ---

const StyleEditor: React.FC<StyleEditorProps> = ({ config, onChange }) => {
    const [presets, setPresets] = useState<Preset[]>([]);
    const [selectedPresetName, setSelectedPresetName] = useState<string>('기본 (Default)');

    useEffect(() => {
        setPresets(getAllPresets());
    }, []);

    const handleChange = (section: keyof StyleConfig, key: string, value: any) => {
        onChange({
            ...config,
            [section]: {
                ...config[section],
                [key]: value,
            },
        });
        setSelectedPresetName(''); // Custom change -> no preset selected
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
        setSelectedPresetName(''); // Custom change -> no preset selected
    };

    const handlePresetChange = (name: string) => {
        const preset = presets.find(p => p.name === name);
        if (preset) {
            onChange(preset.config);
            setSelectedPresetName(name);
        }
    };

    const handleSavePreset = () => {
        const name = prompt('프리셋 이름을 입력하세요:');
        if (name) {
            saveUserPreset(name, config);
            setPresets(getAllPresets());
            setSelectedPresetName(name);
        }
    };

    const handleDeletePreset = () => {
        if (confirm(`'${selectedPresetName}' 프리셋을 삭제하시겠습니까?`)) {
            deleteUserPreset(selectedPresetName);
            const all = getAllPresets();
            setPresets(all);
            // Default select first one or reset
            if (all.length > 0) {
                handlePresetChange(all[0].name);
            }
        }
    };

    const currentPreset = presets.find(p => p.name === selectedPresetName);

    return (
        <div className="flex flex-col p-5 gap-8">
            {/* 0. 프리셋 관리 */}
            <div>
                <SectionHeader title="스타일 프리셋" />
                <div className="flex gap-2">
                    <StyledSelect
                        value={selectedPresetName}
                        onChange={(e) => handlePresetChange(e.target.value)}
                        className="flex-1"
                    >
                        <option value="" disabled>사용자 설정 (Custom)</option>
                        {presets.map(p => (
                            <option key={p.name} value={p.name}>
                                {p.name} {p.isBuiltIn ? '' : '(사용자)'}
                            </option>
                        ))}
                    </StyledSelect>

                    <button
                        onClick={handleSavePreset}
                        className="px-3 py-1.5 bg-[#3b82f6]/20 text-[#60a5fa] text-[13px] font-bold rounded-md border border-[#3b82f6]/50 hover:bg-[#3b82f6]/30 transition-colors whitespace-nowrap"
                    >
                        저장
                    </button>

                    {currentPreset && !currentPreset.isBuiltIn && (
                        <button
                            onClick={handleDeletePreset}
                            className="px-3 py-1.5 bg-red-500/10 text-red-400 text-[13px] font-bold rounded-md border border-red-500/30 hover:bg-red-500/20 transition-colors whitespace-nowrap"
                        >
                            삭제
                        </button>
                    )}
                </div>
            </div>

            {/* 1. 전역 스타일 */}
            <div>
                <SectionHeader title="전역 스타일" />
                <div className="flex flex-col gap-3">

                    {/* 1) 폰트 및 행간 */}
                    <SectionCard>
                        <SubSectionHeader title="폰트 및 행간" />

                        <div>
                            <InputLabel className="mb-1 block">기본 폰트</InputLabel>
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

                        <Row>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">헤더 행간</InputLabel>
                                <StyledInput
                                    type="number" step="0.1" value={config.global.headerLineHeight}
                                    onChange={(e) => handleChange('global', 'headerLineHeight', e.target.value)}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">본문 행간</InputLabel>
                                <StyledInput
                                    type="number" step="0.1" value={config.global.contentLineHeight}
                                    onChange={(e) => handleChange('global', 'contentLineHeight', e.target.value)}
                                />
                            </div>
                        </Row>
                    </SectionCard>

                    {/* 2) 본문 */}
                    <SectionCard>
                        <SubSectionHeader title="본문 (Paragraph)" />
                        <Row>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">색상</InputLabel>
                                <ColorInput
                                    value={config.content.paragraph.color}
                                    onChange={(val) => handleDeepChange('content', 'paragraph', 'color', val)}
                                    defaultValue={defaultStyleConfig.content.paragraph.color}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">크기</InputLabel>
                                <StyledSelect
                                    value={config.content.paragraph.fontSize.replace('px', '')}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        handleDeepChange('content', 'paragraph', 'fontSize', val ? `${val}px` : '');
                                    }}
                                >
                                    {[11, 13, 15, 16, 19, 24, 28, 30, 34, 38].map(size => (
                                        <option key={size} value={size}>{size}px</option>
                                    ))}
                                </StyledSelect>
                            </div>
                        </Row>
                    </SectionCard>
                </div>
            </div>

            {/* 2. 헤더 스타일 */}
            <div>
                <SectionHeader title="헤더 스타일" />
                <div className="flex flex-col gap-3">
                    {['h1', 'h2', 'h3', 'h4', 'h5'].map((tag) => {
                        const level = tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
                        const defaultHeader = defaultStyleConfig.headers[level];

                        return (
                            <SectionCard key={level}>
                                <SubSectionHeader title={`${tag.toUpperCase()}`} />
                                <Row>
                                    <div className="flex-1 min-w-0">
                                        <InputLabel className="mb-1 block">색상</InputLabel>
                                        <ColorInput
                                            value={config.headers[level].color}
                                            onChange={(val) => handleDeepChange('headers', level, 'color', val)}
                                            defaultValue={defaultHeader?.color}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <InputLabel className="mb-1 block">크기</InputLabel>
                                        <StyledSelect
                                            value={config.headers[level].fontSize.replace('px', '')}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                handleDeepChange('headers', level, 'fontSize', val ? `${val}px` : '');
                                            }}
                                        >
                                            {[11, 13, 15, 16, 19, 24, 28, 30, 34, 38].map(size => (
                                                <option key={size} value={size}>{size}px</option>
                                            ))}
                                        </StyledSelect>
                                    </div>
                                </Row>
                            </SectionCard>
                        );
                    })}
                </div>
            </div>

            {/* 3. 마크다운 요소 스타일 */}
            <div>
                <SectionHeader title="마크다운 요소 스타일" />
                <div className="flex flex-col gap-3">

                    {/* 1) 강조 */}
                    <SectionCard>
                        <SubSectionHeader title="강조 (Emphasis)" />
                        <Row>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">Bold 색상</InputLabel>
                                <ColorInput
                                    value={config.content.bold.color}
                                    onChange={(val) => handleDeepChange('content', 'bold', 'color', val)}
                                    placeholder="기본(본문)"
                                    defaultValue={defaultStyleConfig.content.bold.color}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">Italic 색상</InputLabel>
                                <ColorInput
                                    value={config.content.italic.color}
                                    onChange={(val) => handleDeepChange('content', 'italic', 'color', val)}
                                    placeholder="기본(본문)"
                                    defaultValue={defaultStyleConfig.content.italic.color}
                                />
                            </div>
                        </Row>
                    </SectionCard>

                    {/* 2) 하이라이트 */}
                    <SectionCard>
                        <SubSectionHeader title="하이라이트 (Highlight)" />
                        <Row>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">배경색</InputLabel>
                                <ColorInput
                                    value={config.content.highlight.bg}
                                    onChange={(val) => handleDeepChange('content', 'highlight', 'bg', val)}
                                    defaultValue={defaultStyleConfig.content.highlight.bg}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">글자색</InputLabel>
                                <ColorInput
                                    value={config.content.highlight.color}
                                    onChange={(val) => handleDeepChange('content', 'highlight', 'color', val)}
                                    placeholder="기본(본문)"
                                    defaultValue={defaultStyleConfig.content.highlight.color}
                                />
                            </div>
                        </Row>
                    </SectionCard>

                    {/* 3) 인용구 */}
                    <SectionCard>
                        <SubSectionHeader title="인용구 (Blockquote)" />
                        <div className="flex flex-col gap-3">
                            <Row>
                                <div className="flex-1 min-w-0">
                                    <InputLabel className="mb-1 block">배경색</InputLabel>
                                    <ColorInput
                                        value={config.content.blockquote.bg}
                                        onChange={(val) => handleDeepChange('content', 'blockquote', 'bg', val)}
                                        defaultValue={defaultStyleConfig.content.blockquote.bg}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <InputLabel className="mb-1 block">글자색</InputLabel>
                                    <ColorInput
                                        value={config.content.blockquote.color}
                                        onChange={(val) => handleDeepChange('content', 'blockquote', 'color', val)}
                                        defaultValue={defaultStyleConfig.content.blockquote.color}
                                    />
                                </div>
                            </Row>
                            <div>
                                <InputLabel className="mb-1 block">테두리 색상</InputLabel>
                                <ColorInput
                                    value={config.content.blockquote.border}
                                    onChange={(val) => handleDeepChange('content', 'blockquote', 'border', val)}
                                    defaultValue={defaultStyleConfig.content.blockquote.border}
                                />
                            </div>
                        </div>
                    </SectionCard>

                    {/* 4) 인라인 코드 */}
                    <SectionCard>
                        <SubSectionHeader title="인라인 코드 (Inline Code)" />
                        <Row>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">배경색</InputLabel>
                                <ColorInput
                                    value={config.content.inlineCode.bg}
                                    onChange={(val) => handleDeepChange('content', 'inlineCode', 'bg', val)}
                                    defaultValue={defaultStyleConfig.content.inlineCode.bg}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">글자색</InputLabel>
                                <ColorInput
                                    value={config.content.inlineCode.color}
                                    onChange={(val) => handleDeepChange('content', 'inlineCode', 'color', val)}
                                    defaultValue={defaultStyleConfig.content.inlineCode.color}
                                />
                            </div>
                        </Row>
                    </SectionCard>

                    {/* 5) 표 */}
                    <SectionCard>
                        <SubSectionHeader title="표 (Table)" />
                        <Row>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">헤더 배경</InputLabel>
                                <ColorInput
                                    value={config.content.table.headerBg}
                                    onChange={(val) => handleDeepChange('content', 'table', 'headerBg', val)}
                                    defaultValue={defaultStyleConfig.content.table.headerBg}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">테두리 색상</InputLabel>
                                <ColorInput
                                    value={config.content.table.borderColor}
                                    onChange={(val) => handleDeepChange('content', 'table', 'borderColor', val)}
                                    defaultValue={defaultStyleConfig.content.table.borderColor}
                                />
                            </div>
                        </Row>
                        <Row>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">헤더 정렬</InputLabel>
                                <StyledSelect
                                    value={config.content.table.headerAlign}
                                    onChange={(e) => handleDeepChange('content', 'table', 'headerAlign', e.target.value)}
                                >
                                    <option value="left">왼쪽 (Left)</option>
                                    <option value="center">가운데 (Center)</option>
                                    <option value="right">오른쪽 (Right)</option>
                                </StyledSelect>
                            </div>
                            <div className="flex-1 min-w-0">
                                <InputLabel className="mb-1 block">본문 정렬</InputLabel>
                                <StyledSelect
                                    value={config.content.table.bodyAlign}
                                    onChange={(e) => handleDeepChange('content', 'table', 'bodyAlign', e.target.value)}
                                >
                                    <option value="left">왼쪽 (Left)</option>
                                    <option value="center">가운데 (Center)</option>
                                    <option value="right">오른쪽 (Right)</option>
                                </StyledSelect>
                            </div>
                        </Row>
                    </SectionCard>

                </div>
            </div>
        </div >
    );
};

export default StyleEditor;
