<script lang="ts">
	import { base } from '$app/paths';
	import Notepad from '$lib/icons/Notepad.svelte';
	import Folder from '$lib/icons/Folder.svelte';
	import CreditCard from '$lib/icons/CreditCard.svelte';
	import Heart from '$lib/icons/Heart.svelte';
</script>

<svelte:head>
	<title>Notepadd</title>
	<meta name="description" content="Local file editor" />
</svelte:head>

<div class="hero min-h-screen">
	<div class="hero-content text-center">
		<div class="flex flex-col gap-6 max-w-lg">
			<div class="flex items-center justify-center gap-2">
				<Notepad class_name="w-24 h-24" />
				<h1 class="text-5xl font-bold">Notepadd</h1>
			</div>
			{#if false}
				<table class="table">
					<tbody>
						<tr>
							<th>
								<Folder class_name="w-6 h-6" />
							</th>
							<th> Local </th>
							<td> your file will stay only on your pc </td>
						</tr>
						<tr>
							<th>
								<CreditCard class_name="w-6 h-6" />
							</th>
							<th> Free </th>
							<td> MIT license for personal and commercial use </td>
						</tr>
						<tr>
							<th>
								<Heart class_name="w-6 h-6" />
							</th>
							<th> Open source </th>
							<td> for those brave enough to contribute </td>
						</tr>
					</tbody>
				</table>
			{/if}
			<a href="{base}/editor" class="btn btn-outline mx-auto w-fit">Open Editor</a>
		</div>
	</div>
</div>
