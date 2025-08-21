# MMM-LogViewer

A module for [MagicMirror²](https://github.com/MichMich/MagicMirror) to display the last N lines of a log file in real-time.

## Features

- Display the last N lines of any log file
- Real-time updates using file system watchers (no polling required)
- Fallback to polling if file watching is not available
- Customizable appearance (colors, fonts, sizes)
- Optional line numbers and timestamps
- Word wrap support for long lines
- Fixed height display (no scrolling)
- Error handling for missing or inaccessible files
- Left-aligned log text for better readability

## Installation

1. Clone this repository into your MagicMirror `modules` folder:
```bash
cd ~/MagicMirror/modules
git clone https://github.com/yourusername/MMM-LogViewer.git
```

2. Install the module dependencies:
```bash
cd MMM-LogViewer
npm install
```

3. Add the module to the modules array in your `config/config.js` file:
```javascript
{
    module: 'MMM-LogViewer',
    position: 'top_left',
    config: {
        logFilePath: '/var/log/syslog',
        maxLines: 10,
        updateInterval: 5000
    }
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logFilePath` | string | `"/var/log/syslog"` | Path to the log file to monitor |
| `maxLines` | number | `10` | Number of lines to display |
| `title` | string | `"Log Viewer"` | Title to display above the log |
| `showTimestamp` | boolean | `true` | Whether to show timestamps |
| `showLineNumbers` | boolean | `false` | Whether to show line numbers |
| `textColor` | string | `"#ffffff"` | Text color |
| `backgroundColor` | string | `"rgba(0, 0, 0, 0.8)"` | Background color |
| `fontSize` | string | `"12px"` | Font size |
| `maxHeight` | string | `"300px"` | Maximum height of the log display |
| `wordWrap` | boolean | `true` | Whether to wrap long lines |
| `encoding` | string | `"utf8"` | File encoding |
| `watchFile` | boolean | `true` | Whether to use file watching (true) or polling (false) |

## Example Configuration

```javascript
{
    module: 'MMM-LogViewer',
    position: 'top_left',
    config: {
        logFilePath: '/var/log/auth.log',
        maxLines: 15,
        title: 'Authentication Log',
        showLineNumbers: true,
        textColor: '#00ff00',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        fontSize: '14px',
        maxHeight: '400px',
        watchFile: true
    }
}
```

## Multiple Instances

You can create multiple instances of the module to monitor different log files:

```javascript
{
    module: 'MMM-LogViewer',
    position: 'top_left',
    config: {
        logFilePath: '/var/log/syslog',
        maxLines: 10,
        title: 'System Log'
    }
},
{
    module: 'MMM-LogViewer',
    position: 'top_right',
    config: {
        logFilePath: '/var/log/auth.log',
        maxLines: 8,
        title: 'Auth Log'
    }
}
```

## Troubleshooting

### File Not Found Error
If you see "File not found" errors, make sure:
1. The log file path is correct
2. The MagicMirror process has read permissions for the file
3. The file actually exists

### Permission Denied Error
If you get permission errors:
1. Check file permissions: `ls -la /path/to/logfile`
2. Ensure the MagicMirror user can read the file
3. Consider using `sudo` or adjusting file permissions

### No Updates
If the log doesn't update:
1. Check the browser console for errors
2. Verify the update interval is not too long
3. Ensure the log file is being written to

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to [Michael Teeuw](https://github.com/MichMich) for creating MagicMirror²
- Inspired by the need for real-time log monitoring on MagicMirror displays
