<script lang="ts">
	import { onMount } from 'svelte';

	let editor: HTMLDivElement;
	let quill: any = null;

	export let toolbarOptions = [
		[{ header: 1 }, { header: 2 }, 'blockquote', 'link', 'image', 'video'],
		['bold', 'italic', 'underline', 'strike'],
		[{ list: 'ordered' }, { list: 'ordered' }],
		[{ align: [] }],
		['clean']
	];

	onMount(async () => {
		const { default: Quill } = await import('quill');

		quill = new Quill(editor, {
			modules: {
				toolbar: toolbarOptions
			},
			theme: 'snow',
			placeholder: 'Write your story...'
		});
	});
</script>

<div class="editor-wrapper">
	<div bind:this={editor} />
</div>

<style>
	@import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
</style>
