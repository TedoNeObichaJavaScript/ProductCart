// Handle form submission
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    // Simulate a successful submission (you can replace this with an actual backend call)
    const successMessage = document.getElementById('success-message');
    successMessage.classList.remove('hidden');

    // Clear form fields
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
});