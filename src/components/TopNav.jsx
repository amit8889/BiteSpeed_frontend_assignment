const TopNav = ({ saveFlow }) => {
  return (
    // Container div with classes for styling and centering content
    <div className="savingChange mt-4 flex justify-center items-center">
      {/* Button that triggers the saveFlow function when clicked */}
      <button onClick={saveFlow} className="cursor-pointer text-black py-2 px-4 rounded">
        Save Changes
      </button>
    </div>
  );
}

export default TopNav; // Export the TopNav component as the default export
