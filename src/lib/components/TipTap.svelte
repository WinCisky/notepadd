<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Tipography from '@tiptap/extension-typography';
	import Highlight from '@tiptap/extension-highlight';
	import BubbleMenu from '@tiptap/extension-bubble-menu';

	export let content = '<p>Hello World! 🌍️ </p>';
	let element: HTMLDivElement;
	let editor: Editor;

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
				})
			],
			content: content,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
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
	<!-- TODO: add link to selected text -->
	<details class="dropdown !m-0" id="link-dropdown">
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
					value="{editor?.isActive('link') ? editor?.getAttributes('link').href : ''}"
					class="input input-bordered input-sm w-full max-w-xs" 
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							console.log('enter');
							// # Dropdown menu using <details> tag
							// Stays open until gets clicked again. Or you can close it using JS by removing the `open` attribute
							document.getElementById('link-dropdown')?.removeAttribute('open');
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
			"
		</button>
	</div>
</div>

<!-- {#if editor}
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
		class:active={editor.isActive('heading', { level: 1 })}
	>
		H1
	</button>
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
		class:active={editor.isActive('heading', { level: 2 })}
	>
		H2
	</button>
	<button
		on:click={() => editor.chain().focus().setParagraph().run()}
		class:active={editor.isActive('paragraph')}
	>
		P
	</button>
{/if} -->

<div class="markdown-body h-screen p-8">
	<div class="h-full max-w-5xl m-auto" bind:this={element}></div>
</div>

<style>
	/* button.active {
		background: black;
		color: white;
	} */

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
