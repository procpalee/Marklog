import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { convertToNaverHtml, StyleConfig, defaultStyleConfig } from './src/utils/styleConverter';
import { NaverBlogSettingTab } from './src/settings/NaverBlogSettingTab';

export default class MarklogPlugin extends Plugin {
    settings: StyleConfig;

    async onload() {
        await this.loadSettings();

        // Configure Marked (Replicating App.tsx logic)
        marked.use({
            tokenizer: {
                heading(this: any, src: string) {
                    // ATX Header Regex: Only match headers starting with #
                    const regex = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]*#*)?(?:\n|$)/;
                    const match = regex.exec(src);
                    if (match) {
                        return {
                            type: 'heading',
                            raw: match[0],
                            depth: match[1].length,
                            text: match[2]?.trim() || '',
                            tokens: this.lexer.inline(match[2]?.trim() || '')
                        };
                    }
                    // Setext Header Pattern (Underline headers) -> treat as paragraph
                    const setextRegex = /^ {0,3}([^\n]+)\n *(=|-){2,} *(?:\n+|$)/;
                    const setextMatch = setextRegex.exec(src);
                    if (setextMatch) {
                        return {
                            type: 'paragraph',
                            raw: setextMatch[1] + '\n',
                            text: setextMatch[1]?.trim(),
                            tokens: this.lexer.inline(setextMatch[1]?.trim())
                        } as any;
                    }
                    return false;
                }
            }
        });
        marked.use({ breaks: true, gfm: true });

        // Add Ribbon Icon
        this.addRibbonIcon('documents', 'Marklog: Copy as Naver Blog HTML', async (evt: MouseEvent) => {
            await this.copyNaverHtml();
        });

        // Add Command
        this.addCommand({
            id: 'copy-naver-blog-html',
            name: 'Copy as Naver Blog HTML',
            checkCallback: (checking: boolean) => {
                const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (markdownView) {
                    if (!checking) {
                        this.copyNaverHtml();
                    }
                    return true;
                }
                return false;
            }
        });

        // Add Settings Tab
        this.addSettingTab(new NaverBlogSettingTab(this.app, this));
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, defaultStyleConfig, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async copyNaverHtml() {
        const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!markdownView) {
            new Notice('No active Markdown view found.');
            return;
        }

        // Get full content
        let markdown = markdownView.getViewData();

        // Pre-process markdown (Same as App.tsx)
        // 1. Handle consecutive newlines for Naver Blog compatibility
        markdown = markdown.replace(/\n\n+/g, (match) => {
            const newlineCount = match.length;
            const emptyLineCount = newlineCount - 1;
            return '\n\n' + '&nbsp;\n\n'.repeat(emptyLineCount);
        });

        // 2. Highlight syntax (==text==)
        markdown = markdown.replace(/==(.+?)==/g, '<mark>$1</mark>');

        // Convert to HTML
        try {
            const rawHtml = marked.parse(markdown, { async: false }) as string;

            // Sanitize
            const sanitized = DOMPurify.sanitize(rawHtml, {
                ADD_TAGS: ['iframe'],
                ADD_ATTR: ['class', 'style', 'target'],
            });

            // Apply Naver Styles
            const finalHtml = convertToNaverHtml(sanitized, this.settings);

            // Copy to Clipboard
            const blobHtml = new Blob([finalHtml], { type: 'text/html' });
            const blobText = new Blob([finalHtml], { type: 'text/plain' });
            const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];

            await navigator.clipboard.write(data);
            new Notice('Naver Blog HTML copied to clipboard!');

        } catch (error) {
            console.error(error);
            new Notice('Failed to convert or copy. Check console for details.');
        }
    }
}
