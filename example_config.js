// Example configuration for MMM-LogViewer
// Copy this configuration to your MagicMirror config.js file

{
    module: 'MMM-LogViewer',
    position: 'middle_center', // Can be: top_bar, top_left, top_center, top_right, upper_third, middle_center, lower_third, bottom_left, bottom_center, bottom_right, bottom_bar, fullscreen_above, and fullscreen_below
    config: {
        // Basic Configuration
        logFilePath: '/var/log/syslog', // Path to the log file you want to monitor
        maxLines: 10, // Number of lines to display
        
        // Display Options
        title: 'System Log', // Title displayed above the log
        showLineNumbers: false, // Set to true to show line numbers
        textColor: '#ffffff', // Text color (hex, rgb, or named color)
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Background color
        fontSize: '12px', // Font size
        maxHeight: '300px', // Fixed height of the log display (no scrolling)
        wordWrap: true, // Whether to wrap long lines
        
        // Advanced Options
        encoding: 'utf8', // File encoding (utf8, ascii, etc.)
        showTimestamp: true, // Whether to show timestamps (if available in log)
        watchFile: true // Use file watching for real-time updates (true) or polling (false)
    }
},
