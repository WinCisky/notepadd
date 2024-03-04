<script lang="ts">
	import { update } from 'idb-keyval';
	import type { FormEventHandler } from 'svelte/elements';
	import { writable } from 'svelte/store';

	const items = writable(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']);

	let isDragging = false;
	let draggedItem: string | null = null;
	let draggedOverItem: string | null = null;

	function handleDragStart(event: DragEvent, item: string) {
		draggedItem = item;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', item);
		}
		isDragging = true;
	}

	function handleDragOver(event: DragEvent, item: string) {
		event.preventDefault();
		draggedOverItem = item;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		items.update((items) => {
			if (draggedItem === null || draggedOverItem === null) return items;
			const draggedItemIndex = items.indexOf(draggedItem);
			const draggedOverItemIndex = items.indexOf(draggedOverItem);
			items.splice(draggedItemIndex, 1);
			items.splice(draggedOverItemIndex, 0, draggedItem);
			return items;
		});
		isDragging = false;
	}

	function updateInput(event: Event, index: number) {
		const input = event.target as HTMLInputElement;
		items.update((items) => {
			items[index] = input.value;
			update('items', () => items);
			return items;
		});
	}
</script>

<ul class="list-decimal list-inside space-y-2">
	{#each $items as item, index}
		<li
			class="bg-base-300 p-2 rounded flex items-center relative border-2 border-base-100
                {isDragging && draggedItem === item ? 'opacity-50' : ''}
                {isDragging && draggedOverItem === item ? 'border-dashed' : ''}"
			on:drop={handleDrop}
			on:dragover={(event) => handleDragOver(event, item)}
		>
			<div
				class="cursor-move mr-2"
				draggable="true"
				on:dragstart={(event) => handleDragStart(event, item)}
				role="listitem"
			>
				&#9776; <!-- Unicode character for a "drag handle" icon -->
			</div>
			<input type="text" class="input w-full" on:input={e => updateInput(e, index)} bind:value={item} />
		</li>
	{/each}
</ul>
