import loader from '@monaco-editor/loader';
import { type languages, type editor } from 'monaco-editor';

interface MonacoEditorData {
    code?: string;
    language?: string;
    height?: number;
}

class MonacoCodeTool {
    private readonly codeElement: HTMLElement;
    private readonly data: MonacoEditorData;
    private monacoEditor: editor.IStandaloneCodeEditor | null = null;
    private languages: string[] = [];

    constructor({ data }: { data: MonacoEditorData }) {
        this.data = data || { code: '', language: '', height: 3 };
        this.codeElement = document.createElement('code');
    }

    render() {
        const container = document.createElement('div');
        container.classList.add('editor-wrapper');
        // set container min-height
        container.style.minHeight = '300px';

        loader.init().then(monaco => {
            this.monacoEditor = monaco.editor.create(container, {
                value: this.data.code || '// type your code...',
                language: this.data.language || 'plaintext',
            });
            monaco.editor.setTheme('vs-dark');
            this.languages = monaco.languages.getLanguages().map((lang: languages.ILanguageExtensionPoint) => lang.id);
        });

        return container;
    }

    _setLanguage(language: string) {
        if (!this.monacoEditor) {
            return;
        }
        this.data.language = language;
        // reload editor with new language
        loader.init().then(monaco => {
            const model = this.monacoEditor?.getModel();
            if (model) {
                monaco.editor.setModelLanguage(model, language);
            }
        });
    }

    renderSettings() {
        const languageIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" /></svg>`;

        // map languges to array of object
        const langs = this.languages.map((lang: string) => {
            return {
                icon: languageIcon,
                label: lang,
                toggle: 'language',
                isActive: this.data.language === lang,
                onActivate: () => {
                    this._setLanguage(lang);
                }
            };
        });

        return langs;
      }

    save() {
        if (!this.monacoEditor) {
            return this.data;
        }
        const code = this.monacoEditor.getValue();
        return {
            code: code,
            language: this.data.language || ''
        };
    }

    static get toolbox() {
        return {
            title: 'Code',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" /></svg>'
        };
    }

    static get displayInToolbox() {
        return true;
    }
}

export default MonacoCodeTool;
