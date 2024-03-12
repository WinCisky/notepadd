<script lang="ts">
    import { onMount } from 'svelte';

	import EditorJS from '@editorjs/editorjs';
	import Header from '@editorjs/header';
	import NestedList from '@editorjs/nested-list';
	import Checklist from '@editorjs/checklist'
	import CodeTool from '@editorjs/code';
	import InlineCode from '@editorjs/inline-code';

    let timeoutId: number;

    const editor = new EditorJS({
        holder: 'editorjs',
        autofocus: true,
        tools: {
            header: Header,
            nestedList: NestedList,
            checklist: Checklist,
            code: CodeTool,
            inlineCode: InlineCode,
        },
        onChange: editorChange
    });

    onMount(async () => {
        await editor.isReady;
    });

    function editorChange() {
        debounceSave();
    }

    function debounceSave() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(save, 2000);
    }

    function save() {
        editor.save().then((outputData) => {
            console.log('Article data: ', outputData);
            // TODO: save to disk
        });
    }

</script>

<div id="editorjs" class="markdown-body h-full p-4 md:p-8"></div>