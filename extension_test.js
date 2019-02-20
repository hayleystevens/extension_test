'use strict';

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {
  // Use the jQuery document ready signal to know when everything has been initialized
  $(document).ready(function () {
    // Tell Tableau we'd like to initialize our extension
    tableau.extensions.initializeAsync().then(function () {
      // Once the extension is initialized, ask the user to choose a sheet
      showChooseSheetDialog();

      initializeButtons();
    });
  });

  //Shows the choose sheet UI. Once a sheet is selected, the data table for the sheet is shown
  function showChooseSheetDialog () {
    // Clear out the existing list of sheets
    $('#choose_sheet_buttons').empty();

    // Set the dashboard's name in the title
    const dashboardName = tableau.extensions.dashboardContent.dashboard.name;
    $('#choose_sheet_title').text(dashboardName);

    // The first step in choosing a sheet will be asking Tableau what sheets are available
    const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;

    // Next, we loop through all of these worksheets and add buttons for each one
    worksheets.forEach(function (worksheet) {
      // Declare our new button which contains the sheet name
      const button = createButton(worksheet.name);

      // Create an event handler for when this button is clicked
      button.click(function () {
        // Get the worksheet name which was selected
        const worksheetName = worksheet.name;

        // Close the dialog and show the data table for this worksheet
        $('#choose_sheet_dialog').modal('toggle');
        loadSelectedMarks(worksheetName);
      });

      // Add our button to the list of worksheets to choose from
      $('#choose_sheet_buttons').append(button);
    });

    // Show the dialog
    $('#choose_sheet_dialog').modal('toggle');
  }

  function createButton (buttonTitle) {
    const button =
    $(`<button type='button' class='btn btn-default btn-block'>
      ${buttonTitle}
    </button>`);

    return button;
  }

  // This variable will save off the function we can call to unregister listening to marks-selected events
  let unregisterEventHandlerFunction;

  function loadSelectedMarks (worksheetName) {
    // Remove any existing event listeners
    if (unregisterEventHandlerFunction) {
      unregisterEventHandlerFunction();
    }
 
     // Get the worksheet object we want to get the selected marks for
    const worksheet = getSelectedSheet(worksheetName);

    // Set our title to an appropriate value
    $('#selected_marks_title').text(worksheet.name);
   
 // get the summary data for the sheet
 worksheet.getSummaryDataAsync().then(reportSelectedMarks);

    function reportSelectedMarks(sumdata) {
      const worksheetData = sumdata;

        // Map our data into the format which the data table component expects it
        const data = worksheetData.data.map(function (row, index) {
          const rowData = row.map(function (cell) {
            return cell.formattedValue;
          });
  
          return rowData;
 
        });
      $('#Platform').text((data[0][0]));
      $('#VideoID').text((data[0][1]));
      alert("Platform" + data[0][0]);
      alert("VideoID" + data[0][1]);

      const columns = worksheetData.columns.map(function (column) {
        return { title: column.fieldName };
      });
      
    alert("column0" +columns[0]);  
    alert("column1" +columns[1]);  
    }
         

     // Add an event listener for the selection changed event on this sheet.
     unregisterEventHandlerFunction = worksheet.addEventListener(tableau.TableauEventType.FilterChanged, function (selectionEvent) {
      // When the selection changes, reload the data
      loadSelectedMarks(worksheetName);
    });
  }

  function initializeButtons () {
    $('#show_choose_sheet_button').click(showChooseSheetDialog);
  }

  function getSelectedSheet (worksheetName) {
    // Go through all the worksheets in the dashboard and find the one we want
    return tableau.extensions.dashboardContent.dashboard.worksheets.find(function (sheet) {
      return sheet.name === worksheetName;
    });
  }
})();