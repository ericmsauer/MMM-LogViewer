var NodeHelper = require("node_helper");
var fs = require("fs");
var path = require("path");

module.exports = NodeHelper.create({
	// Store file watchers
	fileWatchers: {},

	start: function () {
		console.log("MMM-LogViewer helper started");
	},

	stop: function () {
		// Clean up all file watchers
		Object.keys(this.fileWatchers).forEach(filePath => {
			this.stopWatchingFile(filePath);
		});
	},

	socketNotificationReceived: function (notification, data) {
		if (notification === "MMM-LOGVIEWER_START_WATCHING") {
			this.startWatchingFile(data.filePath, data.maxLines, data.encoding, data.watchFile);
		} else if (notification === "MMM-LOGVIEWER_STOP_WATCHING") {
			this.stopWatchingFile(data.filePath);
		}
	},

	startWatchingFile: function (filePath, maxLines, encoding, watchFile) {
		// Stop any existing watcher for this file
		this.stopWatchingFile(filePath);

		// Read the file initially
		this.readLogFile(filePath, maxLines, encoding);

		if (watchFile) {
			// Use file system watcher for real-time updates
			try {
				const watcher = fs.watch(filePath, { persistent: true }, (eventType, filename) => {
					if (eventType === 'change') {
						// Small delay to ensure file is fully written
						setTimeout(() => {
							this.readLogFile(filePath, maxLines, encoding);
						}, 100);
					}
				});

				this.fileWatchers[filePath] = {
					watcher: watcher,
					maxLines: maxLines,
					encoding: encoding
				};

				console.log(`MMM-LogViewer: Started watching file: ${filePath}`);
			} catch (error) {
				console.log(`MMM-LogViewer: Error setting up file watcher for ${filePath}: ${error.message}`);
				// Fallback to polling if file watching fails
				this.startPolling(filePath, maxLines, encoding);
			}
		} else {
			// Use polling as fallback
			this.startPolling(filePath, maxLines, encoding);
		}
	},

	stopWatchingFile: function (filePath) {
		if (this.fileWatchers[filePath]) {
			if (this.fileWatchers[filePath].watcher) {
				this.fileWatchers[filePath].watcher.close();
			}
			if (this.fileWatchers[filePath].pollingInterval) {
				clearInterval(this.fileWatchers[filePath].pollingInterval);
			}
			delete this.fileWatchers[filePath];
			console.log(`MMM-LogViewer: Stopped watching file: ${filePath}`);
		}
	},

	startPolling: function (filePath, maxLines, encoding) {
		// Fallback to polling every 2 seconds if file watching is not available
		const pollingInterval = setInterval(() => {
			this.readLogFile(filePath, maxLines, encoding);
		}, 2000);

		this.fileWatchers[filePath] = {
			watcher: null,
			pollingInterval: pollingInterval,
			maxLines: maxLines,
			encoding: encoding
		};

		console.log(`MMM-LogViewer: Started polling file: ${filePath}`);
	},

	readLogFile: function (filePath, maxLines, encoding) {
		try {
			// Check if file exists
			if (!fs.existsSync(filePath)) {
				console.log(`MMM-LogViewer: File not found: ${filePath}`);
				this.sendSocketNotification("MMM-LOGVIEWER_LOG_DATA", {
					logLines: [`Error: File not found: ${filePath}`]
				});
				return;
			}

			// Get file stats to check size
			const stats = fs.statSync(filePath);
			if (stats.size === 0) {
				this.sendSocketNotification("MMM-LOGVIEWER_LOG_DATA", {
					logLines: ["Log file is empty"]
				});
				return;
			}

			// Read only the last portion of the file efficiently
			const bufferSize = Math.min(8192, stats.size); // Read in 8KB chunks
			const fd = fs.openSync(filePath, 'r');
			const buffer = Buffer.alloc(bufferSize);
			
			// Start reading from near the end of the file
			let position = Math.max(0, stats.size - bufferSize);
			let lastLines = [];
			let remainingLines = maxLines;
			
			while (remainingLines > 0 && position >= 0) {
				const bytesRead = fs.readSync(fd, buffer, 0, bufferSize, position);
				if (bytesRead === 0) break;
				
				// Convert buffer to string and split into lines
				const chunk = buffer.toString(encoding || 'utf8', 0, bytesRead);
				const lines = chunk.split('\n').filter(line => line.trim() !== '');
				
				// Add lines to our result (in reverse order since we're reading backwards)
				for (let i = lines.length - 1; i >= 0 && remainingLines > 0; i--) {
					lastLines.unshift(lines[i]);
					remainingLines--;
				}
				
				// Move position backwards for next read
				position -= bufferSize;
			}
			
			fs.closeSync(fd);
			
			// If we didn't get enough lines, read from the beginning
			if (lastLines.length < maxLines && stats.size > bufferSize) {
				const fd2 = fs.openSync(filePath, 'r');
				const buffer2 = Buffer.alloc(bufferSize);
				const bytesRead = fs.readSync(fd2, buffer2, 0, bufferSize, 0);
				fs.closeSync(fd2);
				
				if (bytesRead > 0) {
					const chunk = buffer2.toString(encoding || 'utf8', 0, bytesRead);
					const lines = chunk.split('\n').filter(line => line.trim() !== '');
					
					// Add lines from the beginning to fill up to maxLines
					for (let i = 0; i < lines.length && lastLines.length < maxLines; i++) {
						lastLines.unshift(lines[i]);
					}
				}
			}
			
			// Ensure we don't exceed maxLines
			lastLines = lastLines.slice(-maxLines);
			
			// Send the data back to the module
			this.sendSocketNotification("MMM-LOGVIEWER_LOG_DATA", {
				logLines: lastLines
			});
			
		} catch (error) {
			console.log(`MMM-LogViewer: Error reading file: ${error.message}`);
			this.sendSocketNotification("MMM-LOGVIEWER_LOG_DATA", {
				logLines: [`Error: ${error.message}`]
			});
		}
	}
});
