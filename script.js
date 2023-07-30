document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid");
  const endSetupButton = document.getElementById("endSetupButton");
  const instructionBox = document.getElementById("instructionBox");
  const errorBox = document.getElementById("errorBox");
  const modalContainer = document.getElementById("modalContainer");
  const modalContent = document.querySelector(".modal-content");
  const modalMessage = document.getElementById("modalMessage");
  const modalInput = document.getElementById("modalInput");
  const modalSubmit = document.getElementById("modalSubmit");
  const modalCancel = document.getElementById("modalCancel");

  const treasures = new Set();
  let treasureHunterPlaced = false;

  // Create the grid
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.row = Math.floor(i / 10);
    cell.dataset.col = i % 10;
    grid.appendChild(cell);
  }

  // Function to place objects on the grid
  function placeObject(row, col, value) {
    const cell = grid.querySelector(`[data-row='${row}'][data-col='${col}']`);

    if (cell.textContent !== "") {
      showError("Cell already occupied!");
      return;
    }

    if (value === "h") {
      if (treasureHunterPlaced) {
        showError("Only one treasure hunter allowed!");
        return;
      }
      treasureHunterPlaced = true;
    } else if (!["o", "5", "6", "7", "8"].includes(value)) {
      showError("Invalid input!");
      return;
    }

    cell.textContent = value;
    treasures.add(`${row}-${col}`);
    hideError();
  }

  // Function to handle grid cell clicks during setup stage
  function handleCellClick(event) {
    const cell = event.target;
    if (cell.tagName === "DIV") {
      showModal("Enter a value (5-8, o, h):", function (value) {
        if (value !== null) {
          placeObject(
            parseInt(cell.dataset.row),
            parseInt(cell.dataset.col),
            value
          );
        }
      });
    }
  }

  grid.addEventListener("click", handleCellClick);

  // Function to show error message in error box
  function showError(message) {
    errorBox.textContent = message;
    errorBox.style.display = "block";
  }

  // Function to hide error box
  function hideError() {
    errorBox.style.display = "none";
  }

  // Function to show custom modal
  function showModal(message, callback) {
    modalMessage.textContent = message;
    modalInput.value = "";
    modalContainer.style.display = "flex";
    modalInput.focus();

    modalSubmit.onclick = function () {
      const value = modalInput.value.trim();
      hideModal();
      callback(value);
    };

    modalCancel.onclick = function () {
      hideModal();
      callback(null);
    };
  }

  // Function to hide custom modal
  function hideModal() {
    modalContainer.style.display = "none";
  }

  // Function to end setup stage
  function endSetupStage() {
    if (!treasureHunterPlaced) {
      showError("Place the treasure hunter before ending setup stage!");
      return;
    }
    hideError();
    grid.removeEventListener("click", handleCellClick);
    endSetupButton.removeEventListener("click", endSetupStage);
    alert("Setup stage ended. Game will continue to the play stage.");
    // Call the function to start the play stage here
    startPlayStage();
  }

  endSetupButton.addEventListener("click", endSetupStage);

  let setupGridCopy; // To store a copy of the grid during the setup stage

  // Function to start the play stage
  function startPlayStage() {
    // Store a copy of the grid during setup stage
    setupGridCopy = grid.innerHTML;

    // Clear the grid and remove any event listeners from setup stage
    grid.innerHTML = "";
    grid.removeEventListener("click", handleCellClick);
    endSetupButton.removeEventListener("click", endSetupStage);

    // Hide the setup stage elements
    instructionBox.style.display = "none";
    endSetupButton.style.display = "none";

    // Show the play stage elements
    const playStageContainer = document.createElement("div");
    playStageContainer.className = "play-stage-container";
    grid.insertAdjacentElement("beforebegin", playStageContainer);

    const playStageHeading = document.createElement("h1");
    playStageHeading.className = "play-stage-heading";
    playStageHeading.textContent = "Play Stage";
    playStageContainer.appendChild(playStageHeading);

    // Show the previous 10*10 grid with all placed objects
    grid.innerHTML = setupGridCopy;
    playStageContainer.appendChild(grid);

    // Display the updated instructions for the play stage
    const playStageInstructions = document.createElement("div");
    playStageInstructions.className = "play-stage-instructions messageBox";
    playStageInstructions.innerHTML = `
      <p>Instructions:</p>
      <p>"a" attempts to move the treasure hunter one cell to the left,</p>
      <p>"d" attempts to move the treasure hunter one cell to the right,</p>
      <p>"w" attempts to move the treasure hunter one cell up,</p>
      <p>"s" attempts to move the treasure hunter one cell down.</p>
    `;
    playStageContainer.appendChild(playStageInstructions);

    // Implement the logic for the play stage here
    // For example, handle the movements of the treasure hunter and game mechanics

    // Sample: Move the treasure hunter randomly across the grid
    const directions = ["up", "down", "left", "right"];
    setInterval(() => {
      // ... (Existing play stage logic)
    }, 1000); // Move every 1 second
  }
});
