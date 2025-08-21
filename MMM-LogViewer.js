Module.register("MMM-LogViewer", {
	defaults: {
		logFilePath: "/var/log/syslog", // Default log file path
		maxLines: 10, // Number of lines to display
		title: "Log Viewer", // Title to display above the log
		showTimestamp: true, // Whether to show timestamps
		showLineNumbers: false, // Whether to show line numbers
		textColor: "#ffffff", // Text color
		backgroundColor: "rgba(0, 0, 0, 0.8)", // Background color
		fontSize: "12px", // Font size
		maxHeight: "300px", // Maximum height of the log display
		wordWrap: true, // Whether to wrap long lines
		encoding: "utf8", // File encoding
		watchFile: true // Whether to watch file for changes (true) or use polling (false)
	},

	// Storage for log data
	logData: [],

	start: function () {
		// Start watching the log file
		this.sendSocketNotification("MMM-LOGVIEWER_START_WATCHING", {
			filePath: this.config.logFilePath,
			maxLines: this.config.maxLines,
			encoding: this.config.encoding,
			watchFile: this.config.watchFile
		});
	},

	stop: function () {
		// Stop watching the log file
		this.sendSocketNotification("MMM-LOGVIEWER_STOP_WATCHING", {
			filePath: this.config.logFilePath
		});
	},

	socketNotificationReceived: function (notification, data) {
		if (notification === "MMM-LOGVIEWER_LOG_DATA") {
			this.logData = data.logLines;
			// Refresh module display
			this.updateDom();
		}
	},

	getDom: function () {
		const wrapper = document.createElement("div");
		wrapper.className = "mmm-logviewer";

		// Create title
		if (this.config.title) {
			const title = document.createElement("div");
			title.className = "mmm-logviewer-title";
			title.innerHTML = this.config.title;
			wrapper.appendChild(title);
		}

		// Create log container
		const logContainer = document.createElement("div");
		logContainer.className = "mmm-logviewer-container";
		logContainer.style.height = this.config.maxHeight;
		logContainer.style.backgroundColor = this.config.backgroundColor;
		logContainer.style.color = this.config.textColor;
		logContainer.style.fontSize = this.config.fontSize;
		logContainer.style.padding = "10px";
		logContainer.style.borderRadius = "5px";
		logContainer.style.fontFamily = "monospace";
		logContainer.style.whiteSpace = this.config.wordWrap ? "pre-wrap" : "pre";

		// Add log lines
		if (this.logData && this.logData.length > 0) {
			this.logData.forEach((line, index) => {
				const lineElement = document.createElement("div");
				lineElement.className = "mmm-logviewer-line";
				lineElement.style.marginBottom = "2px";
				lineElement.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";
				lineElement.style.paddingBottom = "2px";
				
				let displayText = "";
				if (this.config.showLineNumbers) {
					displayText += `${index + 1}: `;
				}
				displayText += line;
				
				lineElement.innerHTML = displayText;
				logContainer.appendChild(lineElement);
			});
		} else {
			const noDataElement = document.createElement("div");
			noDataElement.className = "mmm-logviewer-no-data";
			noDataElement.innerHTML = "No log data available";
			noDataElement.style.fontStyle = "italic";
			noDataElement.style.opacity = "0.7";
			logContainer.appendChild(noDataElement);
		}

		wrapper.appendChild(logContainer);
		return wrapper;
	},

	getStyles: function () {
		return ["MMM-LogViewer.css"];
	}
});
