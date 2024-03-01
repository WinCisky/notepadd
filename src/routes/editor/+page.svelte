<script lang="ts">
	import md from 'markdown-it';
	import { onMount } from 'svelte';
	import { FileManager } from '$lib/filemanager';
	import Notepad from '$lib/icons/Notepad.svelte';
	import FolderPlus from '$lib/icons/FolderPlus.svelte';

	let filemanager = new FileManager();
	let renderedContent = '';
	let folderSelected = false;
	let isLoading = true;

	onMount(async () => {
		folderSelected = await filemanager.isFolderLoaded();

		if (folderSelected) {
			if (!(await filemanager.hasPermission())) {
				// TODO: show permission modal
				const permission_modal = document.getElementById('permission_modal') as HTMLDialogElement;
				permission_modal.showModal();
			}
			filemanager.getFoldersAndFiles();
		}

		isLoading = false;
	});

	async function askPermission() {
		await filemanager.askPermission();
		const permission_modal = document.getElementById('permission_modal') as HTMLDialogElement;
		permission_modal.close();
		filemanager.getFoldersAndFiles();
	}

	// function divideMarkdown(content: string) {
	// 	const mdParser = md();
	// 	const tokens = mdParser.parse(content, {});

	// 	// divide the tokens into sections
	// 	let sections = [];
	// 	let currentSection = [];
	// 	for (let i = 0; i < tokens.length; i++) {
	// 		if (tokens[i].type === 'heading_open') {
	// 			if (currentSection.length > 0) {
	// 				sections.push(currentSection);
	// 				currentSection = [];
	// 			}
	// 		}
	// 		currentSection.push(tokens[i]);
	// 	}
	// 	sections.push(currentSection);

	// 	// convert the sections into html
	// 	let htmlSections = [];
	// 	for (let i = 0; i < sections.length; i++) {
	// 		let html = '';
	// 		for (let j = 0; j < sections[i].length; j++) {
	// 			html += mdParser.renderer.render([sections[i][j]], mdParser.options, {});
	// 		}
	// 		htmlSections.push(html);
	// 	}

	// 	// render
	// 	renderedContent = htmlSections.join('');
	// }

	async function openFolder() {
		folderSelected = await filemanager.openFolder();
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
		<nav class="flex min-h-screen w-72 flex-col gap-2 overflow-y-auto bg-base-100 px-6 py-10">
			<div class="mx-4 flex items-center gap-2 font-black">
				<Notepad />
				Notepadd
			</div>
			{#if folderSelected}
				<ul class="menu">
					<li>
						<button class="active">
							<svg data-src="https://unpkg.com/heroicons/20/solid/home.svg" class="h-5 w-5"></svg>
							Dashboard
						</button>
					</li>
					<li>
						<button>
							<svg data-src="https://unpkg.com/heroicons/20/solid/user.svg" class="h-5 w-5"></svg>
							Users
						</button>
					</li>
					<li>
						<details>
							<summary>
								<svg
									data-src="https://unpkg.com/heroicons/20/solid/adjustments-vertical.svg"
									class="h-5 w-5"
								></svg>
								Settings
							</summary>
							<ul>
								<li><button>General</button></li>
								<li><button>Themes</button></li>
								<li><button>Routes</button></li>
								<li><button>Comments</button></li>
								<li><button>Media</button></li>
								<li><button>Roles</button></li>
								<li><button>Merchants</button></li>
								<li>
									<button>Tools</button>
									<ul>
										<li><button>Files</button></li>
										<li><button>Scripts</button></li>
										<li><button>Suggestions</button></li>
									</ul>
								</li>
								<li><button>Databases</button></li>
								<li><button>Gateways</button></li>
								<li><button>Plugins</button></li>
								<li><button>API</button></li>
								<li><button>Support</button></li>
							</ul>
						</details>
					</li>
				</ul>
			{:else if isLoading}
				<button class="btn skeleton mt-4"> Loading... </button>
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
