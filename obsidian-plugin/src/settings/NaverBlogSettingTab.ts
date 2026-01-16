import { App, PluginSettingTab, Setting } from 'obsidian';
import MarklogPlugin from '../../main';
import { defaultStyleConfig } from '../utils/styleConverter';

export class NaverBlogSettingTab extends PluginSettingTab {
    plugin: MarklogPlugin;

    constructor(app: App, plugin: MarklogPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Marklog Settings' });

        const fontSizes = ['11', '13', '15', '16', '19', '24', '28', '30', '34', '38'];

        // --- Global Settings ---
        containerEl.createEl('h3', { text: '전역 스타일(Global Styles)' });

        new Setting(containerEl)
            .setName('기본 폰트(Default Font)')
            .setDesc('블로그 포스트의 기본 폰트를 설정합니다.')
            .addDropdown(dropdown => dropdown
                .addOption('"NanumSquare", "NanumGothic", sans-serif', 'NanumSquare (나눔스퀘어)')
                .addOption('"NanumGothic", sans-serif', 'NanumGothic (나눔고딕)')
                .addOption('"NanumBarunGothic", sans-serif', 'NanumBarunGothic (나눔바른고딕)')
                .addOption('"NanumMyeongjo", serif', 'NanumMyeongjo (나눔명조)')
                .addOption('"MaruBuri", serif', 'MaruBuri (마루부리)')
                .setValue(this.plugin.settings.global.fontFamily)
                .onChange(async (value) => {
                    this.plugin.settings.global.fontFamily = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('헤더 행간(Header Line Height)')
            .setDesc('헤더의 줄간격을 설정합니다.')
            .addText(text => text
                .setValue(this.plugin.settings.global.headerLineHeight)
                .onChange(async (value) => {
                    this.plugin.settings.global.headerLineHeight = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('본문 행간(Content Line Height)')
            .setDesc('본문의 줄간격을 설정합니다.')
            .addText(text => text
                .setValue(this.plugin.settings.global.contentLineHeight)
                .onChange(async (value) => {
                    this.plugin.settings.global.contentLineHeight = value;
                    await this.plugin.saveSettings();
                }));

        // Paragraph (Moved to bottom of Global Settings, One line)
        new Setting(containerEl)
            .setName('본문(Paragraph)')
            .setDesc('본문의 색상과 폰트 크기를 설정합니다.')
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.paragraph.color)
                .onChange(async (value) => {
                    this.plugin.settings.content.paragraph.color = value;
                    await this.plugin.saveSettings();
                }))
            .addDropdown(dropdown => {
                fontSizes.forEach(size => dropdown.addOption(`${size}px`, `${size}px`));
                dropdown
                    .setValue(this.plugin.settings.content.paragraph.fontSize)
                    .onChange(async (value) => {
                        this.plugin.settings.content.paragraph.fontSize = value;
                        await this.plugin.saveSettings();
                    });
            });


        // --- Header Settings ---
        containerEl.createEl('h3', { text: '헤더 스타일(Header Styles)' });

        ['h1', 'h2', 'h3', 'h4', 'h5'].forEach((header) => {
            const h = header as keyof typeof defaultStyleConfig.headers;
            new Setting(containerEl)
                .setName(`${header.toUpperCase()}`)
                .setDesc(`${header}의 스타일을 설정합니다.`)
                .addColorPicker(color => color
                    .setValue(this.plugin.settings.headers[h].color)
                    .onChange(async (value) => {
                        this.plugin.settings.headers[h].color = value;
                        await this.plugin.saveSettings();
                    }))
                .addDropdown(dropdown => {
                    fontSizes.forEach(size => dropdown.addOption(`${size}px`, `${size}px`));
                    dropdown
                        .setValue(this.plugin.settings.headers[h].fontSize)
                        .onChange(async (value) => {
                            this.plugin.settings.headers[h].fontSize = value;
                            await this.plugin.saveSettings();
                        });
                })
                .addToggle(toggle => toggle
                    .setTooltip('구분선 모드 (Divider line)')
                    .setValue(this.plugin.settings.headers[h].underlined || false)
                    .onChange(async (value) => {
                        this.plugin.settings.headers[h].underlined = value;
                        // Force refresh to show/hide extra settings if possible, or just let them coexist
                        // In Obsidian API, conditional rendering usually requires re-display()
                        this.display();
                        await this.plugin.saveSettings();
                    }));

            if (this.plugin.settings.headers[h].underlined) {
                new Setting(containerEl)
                    .setName(`  └ ${header.toUpperCase()} 배경색 & 밑줄 색상`)
                    .setDesc('구분선 모드 시 적용될 배경색과 밑줄 색상입니다.')
                    .addColorPicker(color => color
                        .setValue(this.plugin.settings.headers[h].backgroundColor || '#ffffff')
                        .onChange(async (value) => {
                            this.plugin.settings.headers[h].backgroundColor = value;
                            await this.plugin.saveSettings();
                        }))
                    .addColorPicker(color => color
                        .setValue(this.plugin.settings.headers[h].underlineColor || this.plugin.settings.headers[h].color)
                        .onChange(async (value) => {
                            this.plugin.settings.headers[h].underlineColor = value;
                            await this.plugin.saveSettings();
                        }));
            }
        });

        // --- Content Settings ---
        containerEl.createEl('h3', { text: '본문 스타일(Content Styles)' });

        // Highlight
        new Setting(containerEl)
            .setName('하이라이트(Highlight)')
            .setDesc('하이라이트의 배경색과 텍스트색을 설정합니다.')
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.highlight.bg)
                .onChange(async (value) => {
                    this.plugin.settings.content.highlight.bg = value;
                    await this.plugin.saveSettings();
                }))
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.highlight.color)
                .onChange(async (value) => {
                    this.plugin.settings.content.highlight.color = value;
                    await this.plugin.saveSettings();
                }));

        // Bold & Italic
        new Setting(containerEl)
            .setName('볼드(Bold)')
            .setDesc('볼드의 텍스트색을 설정합니다.')
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.bold.color)
                .onChange(async (value) => {
                    this.plugin.settings.content.bold.color = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('이탈릭(Italic)')
            .setDesc('이탈릭의 텍스트색을 설정합니다.')
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.italic.color)
                .onChange(async (value) => {
                    this.plugin.settings.content.italic.color = value;
                    await this.plugin.saveSettings();
                }));

        // Blockquote
        new Setting(containerEl)
            .setName('인용문(Blockquote)')
            .setDesc('인용문의 배경색, 테두리색, 텍스트색을 설정합니다.')
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.blockquote.bg)
                .onChange(async (value) => {
                    this.plugin.settings.content.blockquote.bg = value;
                    await this.plugin.saveSettings();
                }))
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.blockquote.border)
                .onChange(async (value) => {
                    this.plugin.settings.content.blockquote.border = value;
                    await this.plugin.saveSettings();
                }))
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.blockquote.color)
                .onChange(async (value) => {
                    this.plugin.settings.content.blockquote.color = value;
                    await this.plugin.saveSettings();
                }));

        // Inline Code
        new Setting(containerEl)
            .setName('인라인 코드(Inline Code)')
            .setDesc('인라인 코드의 배경색과 텍스트색을 설정합니다.')
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.inlineCode.bg)
                .onChange(async (value) => {
                    this.plugin.settings.content.inlineCode.bg = value;
                    await this.plugin.saveSettings();
                }))
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.inlineCode.color)
                .onChange(async (value) => {
                    this.plugin.settings.content.inlineCode.color = value;
                    await this.plugin.saveSettings();
                }));

        // Table
        containerEl.createEl('h4', { text: '테이블(Table)' });

        new Setting(containerEl)
            .setName('테이블 헤더(Table Header)')
            .setDesc('테이블 헤더의 배경색과 텍스트 정렬을 설정합니다.')
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.table.headerBg)
                .onChange(async (value) => {
                    this.plugin.settings.content.table.headerBg = value;
                    await this.plugin.saveSettings();
                }))
            .addDropdown(dropdown => dropdown
                .addOption('left', '왼쪽')
                .addOption('center', '가운데')
                .addOption('right', '오른쪽')
                .setValue(this.plugin.settings.content.table.headerAlign)
                .onChange(async (value) => {
                    this.plugin.settings.content.table.headerAlign = value as 'left' | 'center' | 'right';
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('테이블 바디(Table Body)')
            .setDesc('테이블 바디의 테두리색과 바디 텍스트 정렬을 설정합니다.')
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.table.borderColor)
                .onChange(async (value) => {
                    this.plugin.settings.content.table.borderColor = value;
                    await this.plugin.saveSettings();
                }))
            .addDropdown(dropdown => dropdown
                .addOption('left', '왼쪽')
                .addOption('center', '가운데')
                .addOption('right', '오른쪽')
                .setValue(this.plugin.settings.content.table.bodyAlign)
                .onChange(async (value) => {
                    this.plugin.settings.content.table.bodyAlign = value as 'left' | 'center' | 'right';
                    await this.plugin.saveSettings();
                }));

        // Footnotes
        containerEl.createEl('h3', { text: '각주 스타일(Footnote Styles)' });

        new Setting(containerEl)
            .setName('각주(Footnote)')
            .setDesc('각주의 색상과 폰트 크기를 설정합니다.')
            .addColorPicker(color => color
                .setValue(this.plugin.settings.content.footnotes.color)
                .onChange(async (value) => {
                    this.plugin.settings.content.footnotes.color = value;
                    await this.plugin.saveSettings();
                }))
            .addDropdown(dropdown => {
                fontSizes.forEach(size => dropdown.addOption(`${size}px`, `${size}px`));
                dropdown
                    .setValue(this.plugin.settings.content.footnotes.fontSize)
                    .onChange(async (value) => {
                        this.plugin.settings.content.footnotes.fontSize = value;
                        await this.plugin.saveSettings();
                    });
            });
    }
}
