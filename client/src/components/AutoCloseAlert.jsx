export function showAutoCloseAlert(message, duration = 3000) {
    // Create the alert div
    const alertBox = document.createElement('div');
    alertBox.className = 'auto-close-alert';
    alertBox.innerText = message;

    // Append the alert to the body
    document.body.appendChild(alertBox);

    // Set a timeout to remove the alert after `duration` milliseconds
    setTimeout(() => {
        alertBox.classList.add('fade-out');
        // Remove the alert from DOM after fade-out effect
        setTimeout(() => {
            alertBox.remove();
        }, 500); // Match with fade-out transition duration
    }, duration);
}
