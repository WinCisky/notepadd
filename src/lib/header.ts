import Header from "@editorjs/header";

class HeaderTool extends Header {
    renderSettings() {
        return this.levels.map(level => ({
            icon: level.svg,
            // @ts-ignore
            label: this.api.i18n.t(`Heading ${level.number}`),
            // focus the text after changing the level
            onActivate: async () => {
                // @ts-ignore
                const blockIndex = this.api.blocks.getCurrentBlockIndex();
                this.setLevel(level.number),
                // @ts-ignore
                await this.api.caret.focus();
                // @ts-ignore
                this.api.caret.setToBlock(blockIndex, 'end');
            },
            closeOnActivate: true,
            isActive: this.currentLevel.number === level.number,
        }));
    }

}

export default HeaderTool;