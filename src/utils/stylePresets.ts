import { StyleConfig, defaultStyleConfig } from './styleConverter';

export interface Preset {
    name: string;
    config: StyleConfig;
    isBuiltIn: boolean; // 사용자가 삭제할 수 없는 내장 프리셋 여부
}

// 1. Built-in Presets
const classicPreset: StyleConfig = {
    ...defaultStyleConfig,
    global: {
        ...defaultStyleConfig.global,
        fontFamily: '"NanumMyeongjo", "Batang", serif', // 명조체
        headerLineHeight: '1.5',
        contentLineHeight: '1.9'
    },
    headers: {
        h1: { ...defaultStyleConfig.headers.h1, color: '#333333', fontSize: '30px' },
        h2: { ...defaultStyleConfig.headers.h2, color: '#333333', fontSize: '26px' },
        h3: { ...defaultStyleConfig.headers.h3, color: '#333333', fontSize: '22px' },
        h4: { ...defaultStyleConfig.headers.h4, color: '#333333', fontSize: '18px' },
        h5: { ...defaultStyleConfig.headers.h5, color: '#333333', fontSize: '16px' },
    },
    content: {
        ...defaultStyleConfig.content,
        paragraph: { ...defaultStyleConfig.content.paragraph, color: '#333333' },
        blockquote: { ...defaultStyleConfig.content.blockquote, bg: '#f9f9f9', border: '#999', color: '#555' },
        link: { ...defaultStyleConfig.content.link, color: '#444' }
    }
};

const modernPreset: StyleConfig = {
    ...defaultStyleConfig,
    global: {
        ...defaultStyleConfig.global,
        fontFamily: '"NanumSquare", "Pretendard", sans-serif',
    },
    headers: {
        h1: { ...defaultStyleConfig.headers.h1, color: '#2c3e50', fontSize: '36px' },
        h2: { ...defaultStyleConfig.headers.h2, color: '#2c3e50', fontSize: '30px' },
        h3: { ...defaultStyleConfig.headers.h3, color: '#2c3e50', fontSize: '26px' },
        h4: { ...defaultStyleConfig.headers.h4, color: '#2c3e50', fontSize: '20px' },
        h5: { ...defaultStyleConfig.headers.h5, color: '#2c3e50', fontSize: '18px' },
    },
    content: {
        ...defaultStyleConfig.content,
        // 인라인 코드와 링크에 파란색/보라색 계열 포인트
        inlineCode: { bg: '#eef4ff', color: '#3b82f6' },
        link: { color: '#2563eb' },
        blockquote: { ...defaultStyleConfig.content.blockquote, bg: '#f1f5f9', border: '#cbd5e1', color: '#475569' },
        highlight: { ...defaultStyleConfig.content.highlight, bg: '#bae6fd' }
    }
};



const minimalPreset: StyleConfig = {
    ...defaultStyleConfig,
    headers: {
        h1: { ...defaultStyleConfig.headers.h1, color: '#000000', fontSize: '32px' },
        h2: { ...defaultStyleConfig.headers.h2, color: '#000000', fontSize: '26px' },
        h3: { ...defaultStyleConfig.headers.h3, color: '#000000', fontSize: '22px' },
        h4: { ...defaultStyleConfig.headers.h4, color: '#000000', fontSize: '18px' },
        h5: { ...defaultStyleConfig.headers.h5, color: '#000000', fontSize: '16px' },
    },
    content: {
        ...defaultStyleConfig.content,
        paragraph: { ...defaultStyleConfig.content.paragraph, color: '#111' },
        blockquote: { bg: '#ffffff', border: '#000000', color: '#000000' }, // 흑백
        inlineCode: { bg: '#f0f0f0', color: '#000000' },
        link: { color: '#000000' }, // 링크도 흑백 (밑줄만 있음)
        highlight: { bg: '#e0e0e0', color: '#000000' },
        table: { headerBg: '#ffffff', borderColor: '#000000', headerAlign: 'left', bodyAlign: 'left' }
    }
};

export const builtinPresets: Preset[] = [
    { name: '기본 (Default)', config: defaultStyleConfig, isBuiltIn: true },
    { name: '클래식 (Classic)', config: classicPreset, isBuiltIn: true },
    { name: '모던 (Modern)', config: modernPreset, isBuiltIn: true },

    { name: '미니멀 (Minimal)', config: minimalPreset, isBuiltIn: true },
];

// 2. Storage Key
const STORAGE_KEY = 'marklog_user_presets';

// 3. Helper Functions
export const getUserPresets = (): Preset[] => {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    try {
        const parsed = JSON.parse(json);
        // 간단한 유효성 검사
        if (Array.isArray(parsed)) {
            return parsed.map((p: any) => ({ ...p, isBuiltIn: false }));
        }
        return [];
    } catch (e) {
        console.error('Failed to parse user presets', e);
        return [];
    }
};

export const saveUserPreset = (name: string, config: StyleConfig) => {
    const current = getUserPresets();
    // 덮어쓰기 or 추가
    const existingIndex = current.findIndex(p => p.name === name);
    if (existingIndex >= 0) {
        current[existingIndex] = { name, config, isBuiltIn: false };
    } else {
        current.push({ name, config, isBuiltIn: false });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const deleteUserPreset = (name: string) => {
    const current = getUserPresets();
    const filtered = current.filter(p => p.name !== name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getAllPresets = (): Preset[] => {
    return [...builtinPresets, ...getUserPresets()];
};
