<script lang="ts">
	import md from 'markdown-it';
	import { onMount } from 'svelte';
	import { FileManager } from '$lib/filemanager';

	let filemanager = new FileManager();
	let renderedContent = '';

	onMount(async () => {
		// await filemanager.openFolder();
	});

	function divideMarkdown(content: string) {
		const mdParser = md();
		const tokens = mdParser.parse(content, {});

		// divide the tokens into sections
		let sections = [];
		let currentSection = [];
		for (let i = 0; i < tokens.length; i++) {
			if (tokens[i].type === 'heading_open') {
				if (currentSection.length > 0) {
					sections.push(currentSection);
					currentSection = [];
				}
			}
			currentSection.push(tokens[i]);
		}
		sections.push(currentSection);

		// convert the sections into html
		let htmlSections = [];
		for (let i = 0; i < sections.length; i++) {
			let html = '';
			for (let j = 0; j < sections[i].length; j++) {
				html += mdParser.renderer.render([sections[i][j]], mdParser.options, {});
			}
			htmlSections.push(html);
		}

		// render
		renderedContent = htmlSections.join('');
	}

	async function openFile() {
		filemanager.openFolder();
		// try {
		// 	let fileHandle;
		// 	// @ts-ignore
		// 	[fileHandle] = await window.showOpenFilePicker();
		// 	const file = await fileHandle.getFile();
		// 	const contents = await file.text();
		// 	divideMarkdown(contents);
		// } catch (error) {
		// 	console.error('Error opening directory', error);
		// }
	}
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" href="github-markdown.css" />
</svelte:head>

<div class="drawer min-h-screen bg-base-200 lg:drawer-open">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<main class="drawer-content">
		<button class="btn" on:click={openFile}>Open file</button>
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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
					/>
				</svg>
				Notepadd
			</div>
			{#if filemanager.isFolderOpen}
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
			{/if}
		</nav>
		<!-- /sidebar menu -->
	</aside>
</div>
