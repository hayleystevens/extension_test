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

  /**
   * Shows the choose sheet UI. Once a sheet is selected, the data table for the sheet is shown
   */
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

    // Call to get the selected marks for our sheet
  worksheet.getSelectedMarksAsync().then(reportSelectedMarks);

  function reportSelectedMarks(marks) {
      var html = "";
      if (marks.length == 0)

      alert("selectedMarks: empty list");
    
      else {
    
        const worksheetData = marks.data[0];

        // Map our data into the format which the data table component expects it
        const data = worksheetData.data.map(function (row, index) {
          const rowData = row.map(function (cell) {
            return cell.formattedValue;
          });
  
          return rowData;
        });
      // alert("Mark1" + marks.data[0]);
      // alert("Mark2" + data);
      // alert("Mark3" + data[0][0]);
      $('#returnID').text(filtervalues(data[0][0]));
      }
      function filtervalues(val){
        if(val == "West"){
          return "this is awesome"
        }
        else{
          return "The rest of the country"
        }
      };
    
      // alert(alertOutput);
    
      // for (var markIndex = 0; markIndex < marks.length; markIndex++) {
      //     var pairs = marks[markIndex].getPairs();

      //     for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
      //         var pair = pairs[pairIndex];
      //         if (pair.fieldName="ID")
      //         {
      //           var found_ID=pair.formattedValue;
      //           return found_ID;
      //         }
      //         else{
      //           var found_ID = "could not find";
      //           return found_ID;
      //         }
      //       }
           

      // }
  // }

  // $('#returnID').text(found_ID);

    // Add an event listener for the selection changed event on this sheet.
    unregisterEventHandlerFunction = worksheet.addEventListener(tableau.TableauEventType.MarkSelectionChanged, function (selectionEvent) {
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
}})();


