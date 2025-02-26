const titlebarMenus = [
    {
        name: 'Edit',
        items: [
            {
                name: 'Undo',
                action: 'undo',
                shortcut: 'Ctrl+Z'
            },
            {
                name: 'Redo',
                action: 'redo',
                shortcut: 'Ctrl+Y'
            },
            {
                name: '__'
            },
            {
                name: 'Cut',
                action: 'cut',
                shortcut: 'Ctrl+X'
            },
            {
                name: 'Copy',
                action: 'copy',
                shortcut: 'Ctrl+C'
            },
            {
                name: 'Paste',
                action: 'paste',
                shortcut: 'Ctrl+V'
            },
            {
                name: 'Delete',
                action: 'delete'
            },
            {
                name: '__'
            },
            {
                name: 'Select All',
                action: 'select_all',
                shortcut: 'Ctrl+A'
            }
        ]
    },
    {
        name: 'View',
        items: [
            {
                name: 'Reload',
                action: 'reload',
                shortcut: 'Ctrl+R'
            },
            {
                name: 'Force Reload',
                action: 'force_reload',
                shortcut: 'Ctrl+Shift+R'
            },
            {
                name: 'Toogle Developer Tools',
                action: 'toggle_devtools',
                shortcut: 'Ctrl+Shift+I'
            },
            {
                name: '__'
            },
            {
                name: 'Actual Size',
                action: 'actual_size',
                shortcut: 'Ctrl+0'
            },
            {
                name: 'Zoom In',
                action: 'zoom_in',
                shortcut: 'Ctrl++'
            },
            {
                name: 'Zoom Out',
                action: 'zoom_out',
                shortcut: 'Ctrl+-'
            },
            {
                name: '__'
            },
            {
                name: 'Toggle Fullscreen',
                action: 'toggle_fullscreen',
                shortcut: 'F11'
            }
        ]
    },
    {
        name: 'Window',
        items: [
            {
                name: 'Minimize',
                action: 'minimize',
                shortcut: 'Ctrl+M'
            },
            {
                name: 'Close',
                action: 'exit',
                shortcut: 'Ctrl+W'
            }
        ]
    }
];

export default titlebarMenus;
