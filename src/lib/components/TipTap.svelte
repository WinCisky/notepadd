<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Tipography from '@tiptap/extension-typography';
	import Highlight from '@tiptap/extension-highlight';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import Link from '@tiptap/extension-link';

	export let content = '<p>Hello World! 🌍️ </p>';
	let element: HTMLDivElement;
	let editor: Editor;
	let dropdownOpen = false;
	let linkValue = '';

	//  on content changes
	$: if (content) {
		setContent();
	}

	function setContent() {
		editor?.commands.setContent(content);
	}

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Tipography,
				Highlight,
				BubbleMenu.configure({
					element: document.querySelector('.bubble-menu') as HTMLElement
				}),
				Link
			],
			content: content,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});

		editor.on('selectionUpdate', () => {
			dropdownOpen = false;
			if (editor?.isActive('link')) {
				linkValue = editor?.getAttributes('link').href;
			} else {
				linkValue = '';
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div class="bubble-menu bg-base-200 p-2 rounded-lg flex gap-2 w-full">
	<details class="dropdown !m-0" id="link-dropdown" bind:open={dropdownOpen}>
		<summary 
			class={`m-1 btn btn-sm link !m-0 !flex ${editor?.isActive('link') ? 'btn-info' : 'btn-outline'}`}
		>
			link
		</summary>
		
		<div
			class="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-base-300 text-primary-content"
		>
			<div class="card-body">
				<input 
					type="text" 
					placeholder="Paste link"
					bind:value={linkValue}
					class="input input-bordered input-sm w-full max-w-xs" 
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							editor?.commands.setLink({ href: linkValue });
							linkValue = '';
							dropdownOpen = false;
						}
					}}
				/>
			</div>
		</div>
	</details>
	<div class="divider divider-horizontal m-0"></div>
	<div class="join">
		<button
			on:click={() => editor.chain().focus().toggleBold().run()}
			class={`btn btn-sm join-item font-bold ${editor?.isActive('bold') ? 'btn-info' : 'btn-outline'}`}
		>
			B
		</button>
		<button
			on:click={() => editor.chain().focus().toggleItalic().run()}
			class={`btn btn-sm join-item italic ${editor?.isActive('italic') ? 'btn-info' : 'btn-outline'}`}
		>
			i
		</button>
		<button
			on:click={() => editor.chain().focus().toggleStrike().run()}
			class={`btn btn-sm join-item line-through ${editor?.isActive('strike') ? 'btn-info' : 'btn-outline'}`}
		>
			S
		</button>
		<button
			on:click={() => editor.chain().focus().toggleCode().run()}
			class={`btn btn-sm join-item code ${editor?.isActive('code') ? 'btn-info' : 'btn-outline'}`}
		>
			;
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBulletList().run()}
			class={`btn btn-sm join-item list-disc ${editor?.isActive('bulletList') ? 'btn-info' : 'btn-outline'}`}
		>
			ul
		</button>
		<button
			on:click={() => editor.chain().focus().toggleOrderedList().run()}
			class={`btn btn-sm join-item list-decimal ${editor?.isActive('orderedList') ? 'btn-info' : 'btn-outline'}`}
		>
			ol
		</button>
		<button
			on:click={() => editor.chain().focus().toggleBlockquote().run()}
			class={`btn btn-sm join-item blockquote ${editor?.isActive('blockquote') ? 'btn-info' : 'btn-outline'}`}
		>
			|
		</button>
	</div>
</div>

<div class="markdown-body h-screen p-8 overflow-y-scroll">
	<div class="h-full max-w-5xl m-auto" bind:this={element}></div>
</div>

<style>

	/* remove outline */
	:global(.ProseMirror:focus) {
		outline: none;
	}
	/* set */
	:global(.ProseMirror) {
		/* same height as the parent */
		height: 100%;
	}
</style>
