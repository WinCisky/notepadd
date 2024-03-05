<script lang="ts">
	import md from 'markdown-it';
	import { onMount } from 'svelte';
	import { FileManager, type TreeNode } from '$lib/filemanager';
	import Notepad from '$lib/icons/Notepad.svelte';
	import FolderPlus from '$lib/icons/FolderPlus.svelte';
	import MenuFolder from '$lib/components/MenuFolder.svelte';
	import { openFile } from '$lib/stores';

	let filemanager = new FileManager();
	let renderedContent = '';
	let folderSelected = false;
	let isLoading = true;
	let fileTree: TreeNode | undefined;

	$: {
		if ($openFile) {
			openFileChange($openFile!);
		}
	}

	onMount(async () => {
		folderSelected = await filemanager.isFolderLoaded();

		if (folderSelected) {
			const hasPermission = await filemanager.hasPermission();
			if (!hasPermission) {
				const permission_modal = document.getElementById('permission_modal') as HTMLDialogElement;
				permission_modal.showModal();
			}
			await filemanager.getFoldersAndFiles();
			fileTree = filemanager.root;
		}
		isLoading = false;
	});

	async function askPermission() {
		isLoading = true;
		await filemanager.askPermission();
		const permission_modal = document.getElementById('permission_modal') as HTMLDialogElement;
		permission_modal.close();
		await filemanager.getFoldersAndFiles();
		fileTree = filemanager.root;
		isLoading = false;
	}

	async function openFolder() {
		folderSelected = await filemanager.openFolder();
		if (folderSelected) {
			await filemanager.getFoldersAndFiles();
			fileTree = filemanager.root;
		}
	}

	async function openFileChange(node: TreeNode) {
		console.log('open file change', node);
	}
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" href="github-markdown.css" />
</svelte:head>

<dialog id="permission_modal" class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">No local file access</h3>
		<p class="py-4">May I have your permission to access your local files?</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Cancel</button>
			</form>
			<button class="btn" on:click={askPermission}>Ok</button>
		</div>
	</div>
</dialog>

<div class="drawer min-h-screen bg-base-200 lg:drawer-open">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<main class="drawer-content">
		<div
			class="markdown-body px-6 py-10 h-full"
			contenteditable
			bind:innerHTML={renderedContent}
		></div>
	</main>
	<aside class="drawer-side z-10">
		<label for="my-drawer" class="drawer-overlay"></label>
		<!-- sidebar menu -->
		<nav
			class="flex min-h-screen min-w-72 w-fit flex-col gap-2 overflow-y-auto bg-base-100 px-6 py-10"
		>
			<div class="mx-4 flex items-center gap-2 font-black">
				<Notepad />
				Notepadd
			</div>
			{#if isLoading}
				<button class="btn skeleton mt-4"> Loading... </button>
			{:else if folderSelected}
				<ul class="menu">
					{#if fileTree}
						<MenuFolder node={fileTree} open={true} />
					{:else}
						<li class="mt-4">No files found</li>
					{/if}
				</ul>
			{:else}
				<button class="btn btn-outline mt-4" on:click={openFolder}>
					<FolderPlus />
					Select folder
				</button>
			{/if}
		</nav>
		<!-- /sidebar menu -->
	</aside>
</div>
