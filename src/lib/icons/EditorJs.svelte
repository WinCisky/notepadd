<script lang="ts">
	import { onMount } from 'svelte';
    import { writable, type Writable } from 'svelte/store';
	import { openFile, rootDirectory } from '$lib/stores';
    import { get as getStore } from "svelte/store";

	import EditorJS, { type ToolConstructable } from '@editorjs/editorjs';
	import Header from '@editorjs/header';
	import NestedList from '@editorjs/nested-list';
	import Checklist from '@editorjs/checklist';
	import InlineCode from '@editorjs/inline-code';
    import ImageTool from '@editorjs/image';
	import { FileManager, type TreeNode } from '$lib/filemanager';
	import MonacoCodeTool from '$lib/monaco';

    class LocalImageTool extends ImageTool {
        set image(file: {url: string}) {
            this._data.file = file || {};

            if (typeof file === 'undefined') {
                return;
            }

            // try to json parse the file url
            try {
                const parsedFile = JSON.parse(file.url) as {name: string, path: string[]};
                if (parsedFile.name && parsedFile.path) {
                    // get image at path
                    FileManager.getImgeFromPathAndName(parsedFile.path, parsedFile.name).then((image) => {
                        if (image && (image instanceof FileSystemFileHandle)) {
                            image.getFile().then((file) => {
                                const url = URL.createObjectURL(file);
                                this.ui.fillImage(url);
                            });
                        } else{
                            throw new Error('Image not found');
                        }
                    });
                } else {
                    throw new Error('Invalid file url');
                }

            } catch (e) {
                console.log(e);
                // if it fails, just use the url
                if (file && file.url) {
                    this.ui.fillImage(file.url);
                }
            }
        }
    }

    type ToastType = 'info' | 'error' | 'success' | 'warning';

    const toastTypeToClass = {
        'info': 'alert-info',
        'error': 'alert-error',
        'success': 'alert-success',
        'warning': 'alert-warning'
    };

    interface ToastMessage {
        id: number;
        message: string;
        type: ToastType;
    }

    const toasts: Writable<ToastMessage[]> = writable([]);

	let fileWithError = false;
	let previousOpenFile: FileSystemFileHandle | null = null;

	// on open file changes save the previous file and load the new file
	$: if ($openFile && $openFile !== previousOpenFile) {
		openFileChange();
	}

	const editor = new EditorJS({
		holder: 'editorjs',
        minHeight: 0,
		autofocus: true,
		tools: {
			header: {
                // @ts-ignore
                class: Header,
                config: {
                    levels: [1, 2, 3],
                    defaultLevel: 1
                }
            },
			nestedList: NestedList,
			checklist: Checklist,
            codeBlock: MonacoCodeTool,
			inlineCode: InlineCode,
            image: {
                // @ts-ignore
                class: LocalImageTool,
                config: {
                    uploader: {
                        uploadByFile(file: File): Promise<{success: number, file: {url: string}}> {
                            return uploadImageByFile(file);
                        },
                        uploadByUrl(url: string): Promise<{success: number, file: {url: string}}> {
                            return uploadImageByUrl(url);
                        }
                    }
                }
            }
		},
		onChange: editorChange
	});

	onMount(async () => {
		await editor.isReady;
	});

    function showToast(message: string, type: ToastType, duration = 3000) {
        const id = Date.now(); // good enough
        toasts.update(toasts => [...toasts, { id, message, type: type }]);

        setTimeout(() => {
            toasts.update(toasts => toasts.filter(toast => toast.id !== id));
        }, duration);
    }

    function clearToasts() {
        toasts.set([]);
    }

	async function openFileChange() {
        clearToasts();
		if (!fileWithError && previousOpenFile) {
			await save();
		}
		previousOpenFile = $openFile;
		await loadFile();
	}

	function editorChange() {
		save();
	}

    async function uploadImageByFile(file: File) {

        const root = getStore(rootDirectory);
        if (!root || !$openFile) return { success: 0, file: { url: '' } }
        const resolvedPath = await root.resolve($openFile)
        if (!resolvedPath) return { success: 0, file: { url: '' } }

        // get filde handle of parent folder
        let parentDirHandle = root;
        for (let i = 0; i < resolvedPath.length - 1; i++) {
            parentDirHandle = await parentDirHandle.getDirectoryHandle(resolvedPath[i]);
        }

        const newImage = await FileManager.createFile(parentDirHandle, file.name);
        if (newImage instanceof FileSystemFileHandle) {
            const writable = await newImage.createWritable();
            await writable.write(file);
            await writable.close();
        }

        return {
            success: 1,
            file: {
                url: JSON.stringify({ name: file.name, path: resolvedPath })
            }
        };
    }

    async function uploadImageByUrl(url: string) {
        return {
            success: 1,
            file: {
                url: url,
            }
        };
    }

	async function loadFile() {
		await editor.isReady;
		editor.clear();
		await load();
	}

	async function save() {
		if (fileWithError) return;
		await editor.isReady;
		const outputData = await editor.save();
		if (previousOpenFile && previousOpenFile) {
			FileManager.writeFile(previousOpenFile, JSON.stringify(outputData));
		}
	}

	async function load() {
		fileWithError = true;
		if ($openFile && $openFile) {
			const file = await $openFile.getFile();
			const contents = await file.text();
            if (contents.length > 0) {
                try {
                    const data = JSON.parse(contents);
                    editor.render(data);
                    fileWithError = false;
                } catch (e) {
                    showToast(`File ${$openFile.name} is not a valid JSON file`, 'error');
                }
            } else {
                // empty file
                fileWithError = false;
            }
		}
	}
</script>

<div id="editorjs" class="markdown-body h-full p-4 md:p-8"></div>
<div class="toast toast-top toast-end z-20">
    {#each $toasts as toast (toast.id)}
        <div class="alert {toastTypeToClass[toast.type]}">
            <span>{toast.message}</span>
        </div>
    {/each}
</div>

<style>
    /* disable image caption */
    :global(.image-tool__caption) {
        display: none;
    }

    :global(.editor-wrapper .monaco-editor, .editor-wrapper .overflow-guard){ 
        border-radius: 10px; 
    }

    :global(.codex-editor, .codex-editor__redactor) {
        height: 100%;
    }
</style>