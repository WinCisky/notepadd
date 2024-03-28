## TODO

- bugfix
    - after setting the heading size, it's not focused the row to type

## Backlog

- extend elements
    - drag & drop to move blocks
    - add link to page

- add missing elements
    - table

- implement features
    - search
    - import from markdown
    - export to markdown

- emoji
    - add emoji to page

## styling editorjs
white theme: use same color scheme as daisy
dark theme: todo

### checklist
```css
.cdx-checklist {
    --radius-border: 5px;
    --checkbox-background: #fff;
    --color-border: #C9C9C9;
    --color-bg-checked: #369FFF;
    --line-height: 1.57em;
    --color-bg-checked-hover: #0059AB;
    --color-tick: #fff;
    --width-checkbox: 22px;
    --height-checkbox: 22px;
}
```

### dark theme
```css
.ce-toolbar__plus {}
.ce-toolbar__settings-btn {}
```