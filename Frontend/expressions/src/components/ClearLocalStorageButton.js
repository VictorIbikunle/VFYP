import React from "react";

const ClearLocalStorageButton = () => {
  const handleClearLocalStorage = () => {
    localStorage.removeItem("currentPatientId");
    // Optionally, you can perform additional cleanup here if needed
    // localStorage.clear(); // Uncomment this line to clear all localStorage data
    console.log("localStorage data cleared");
    window.location.reload();
  };

  return (
    <button className="btn btn-danger text-center" onClick={handleClearLocalStorage}>
      Logout
    </button>
  );
};

export default ClearLocalStorageButton;
