Code Documentation for Liability Figures Project
Overview
This project is a React.js-based web application designed to process and display liability data from the FinTrak database. The app allows users to select a date, filter the data, and view detailed summaries of different deposit categories, including demand deposits, savings, term deposits, and more. It also provides the functionality to export the data into an Excel file.
Key Components and Functions
1.	State Variables:
o	data: Stores the raw JSON data, fetched from FinTrak, for liability figures.
o	summedData: Stores aggregated data for deposit categories.
o	totalData: Stores the total sums of each deposit category.
o	branchData: Stores branch-level data grouped by product captions.
o	selectedDate: Tracks the date selected by the user.
2.	useEffect Hook:
o	Monitors the selectedDate state.
o	When a new date is selected, it:
	Filters data based on the selected date.
	Calls calculateSums() to aggregate figures for deposit categories.
	Calls generateBranchData() to group the data by branches.
3.	filterDataByDate(date):
o	Filters the data from FinTrak based on the user-selected date.
o	Uses Moment.js to compare dates and return the relevant records.
4.	onDateChange(date):
o	Updates the selectedDate state when a date is selected.
5.	calculateSums(data):
o	Aggregates the actual balances for the following categories:
	Demand Deposits
	Domiciliary Deposits
	Savings Deposits
	Term Deposits
o	Updates summedData and totalData with the computed figures.
6.	generateBranchData(data):
o	Groups the filtered data by BranchCode and Caption.
o	Aggregates fields like ActualBalance, AverageBalance, and NumOfAccounts per branch.
7.	exportToExcel():
o	Exports the processed data into an Excel file using the XLSX library.
o	Generates separate sheets for branch-level data, summed product data, and total deposit category data.
8.	Table Components:
o	Summed Data Table: Displays the aggregated figures for each deposit category.
o	Total Data Table: Shows the overall totals for each deposit category.
o	Branch Data Table: Displays branch-specific data, including balances and account numbers.
Libraries Used:
•	React.js: For building and managing the UI and state.
•	Ant Design: Provides UI components such as Table, Button, and DatePicker.
•	Moment.js: Handles date formatting and comparisons.
•	XLSX: Enables exporting of data to Excel.
Future Enhancements:
•	API Integration: Replace the static data with dynamic API calls to fetch real-time data from the FinTrak database.
•	Improved Error Handling: Provide clearer feedback to users in cases of invalid dates or empty results.

