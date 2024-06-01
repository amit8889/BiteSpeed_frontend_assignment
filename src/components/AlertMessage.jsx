const AlertMessage = ({ errorMessage, messageColor }) => {
  // Check if there is an error message to display
  if (errorMessage) {
      // If there is an error message, render a div with the error message and apply the provided CSS class
      return <div className={messageColor}>{errorMessage}</div>;
  }
  // If there is no error message, render a placeholder div with specific classes for styling
  return <div className="savingChanges p-4"></div>;
};

export default AlertMessage; // Export the AlertMessage component as the default export
