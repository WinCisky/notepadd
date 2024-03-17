import * as shiki from 'shiki';

interface ShikiData {
    code?: string;
    language?: string;
}

class ShikiCodeTool {
    private readonly codeElement: HTMLElement;
    private readonly data: ShikiData;

    constructor({ data }: { data: ShikiData }) {
        this.data = data || { code: '', language: '' };
        this.codeElement = document.createElement('code');
    }

    async highlightCode() {
        const options = {
            langs: ['javascript', 'html', 'css'], // Languages to support
            themes: ['nord'] // Add an empty array for themes
        };
        const highlighter = await shiki.getHighlighter(options);
        const html = await highlighter.codeToHtml(this.codeElement.textContent ?? '', {
            lang: this.data.language || 'javascript',
            theme: 'nord'
        } as shiki.CodeToHastOptions);
        this.codeElement.innerHTML = html;
    }

    render() {
        const container = document.createElement('pre');
        container.classList.add('editorjs-shiki-code'); // Add class for styling

        this.codeElement.contentEditable = 'true'; // Enable editing
        this.codeElement.textContent = this.data.code || '';

        container.appendChild(this.codeElement);

        this.codeElement.addEventListener('input', () => this.highlightCode());

        // Highlight code on initial render
        this.highlightCode();

        return container;
    }

    save() {
        return {
            code: this.data.code || '',
            language: this.data.language || ''
        };
    }

    static get toolbox() {
        return {
            title: 'Shiki Code Block',
            icon: '<svg width="17" height="15" viewBox="0 0 17 15" xmlns="http://www.w3.org/2000/svg"><path d="M2.291 0h12.417c.23 0 .417.187.417.417v14.167a.417.417 0 0 1-.417.416H2.29a.417.417 0 0 1-.417-.416V.417C1.873.187 2.06 0 2.29 0zm11.991 1.25v1.785H2.966V1.25h11.316zm0 11.667v1.786H2.966v-1.786h11.316zM14.174 5.75v5H2.966v-5h11.208zm-1.25-.834h-9.667v6.667h9.667v-6.667zm-1.25 2.916H5.914v1.875h5.708v-1.875zm0-3.75H5.914v1.25h5.708v-1.25z" fill="currentColor" fill-rule="nonzero"/></svg>'
        };
    }

    static get displayInToolbox() {
        return true;
    }
}

export default ShikiCodeTool;
