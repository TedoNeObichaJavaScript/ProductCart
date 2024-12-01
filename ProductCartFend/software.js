const productData = [];
let editIndex = null;
// Assuming your total stock and used stock are taken from the form
const totalStockInput = document.getElementById('totalStock');
const usedStockInput = document.getElementById('usedStock');
const wastageInput = document.getElementById('wastage');
const calculateWastageBtn = document.getElementById('calculateWastageBtn');

calculateWastageBtn.addEventListener('click', function() {
    const totalStock = parseFloat(totalStockInput.value);
    const usedStock = parseFloat(usedStockInput.value);
    
    if (isNaN(totalStock) || isNaN(usedStock)) {
        alert('Please enter valid numbers for total stock and used stock.');
        return;
    }
    
    // Calculate wastage
    const wastage = totalStock - usedStock;

    // Set the value of the wastage input field
    wastageInput.value = wastage.toFixed(2);
});

// Update remaining stock dynamically
document.getElementById("usedStock").addEventListener("input", calculateRemainingStock);
document.getElementById("totalStock").addEventListener("input", calculateRemainingStock);

function calculateRemainingStock() {
    const totalStock = parseFloat(document.getElementById("totalStock").value) || 0;
    const usedStock = parseFloat(document.getElementById("usedStock").value) || 0;

    const remainingStock = totalStock - usedStock;
    document.getElementById("remainingStock").textContent = `Remaining Stock: ${remainingStock >= 0 ? remainingStock : 0} kilos`;
}

// Handle adding/updating a product
document.getElementById("addBtn").addEventListener("click", function () {
    const name = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const category = document.getElementById("productCategory").value;
    const totalStock = parseFloat(document.getElementById("totalStock").value);
    const usedStock = parseFloat(document.getElementById("usedStock").value);

    if (!name || isNaN(price) || isNaN(totalStock) || isNaN(usedStock)) {
        alert("Please fill out all fields!");
        return;
    }

    const product = { name, price, category, totalStock, usedStock };

    if (editIndex !== null) {
        productData[editIndex] = product; // Update existing product
        editIndex = null; // Reset editing mode
        document.getElementById("addBtn").textContent = "Add"; // Reset button label
    } else {
        productData.push(product);
    }

    updateTable();
    clearForm();
});

function updateTable() {
    const table = document.getElementById("productTable").querySelector("tbody");
    table.innerHTML = ""; // Clear table

    productData.forEach((product, index) => {
        const remainingStock = product.totalStock - product.usedStock;

        const row = table.insertRow();
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.category}</td>
            <td>${remainingStock >= 0 ? remainingStock : 0} kilos</td>
            <td>
                <button class="action-btn edit-btn" onclick="editProduct(${index})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteRow(${index})">Delete</button>
            </td>
        `;
    });
}

function clearForm() {
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productCategory").value = "Starter";
    document.getElementById("totalStock").value = "";
    document.getElementById("usedStock").value = "";
    document.getElementById("remainingStock").textContent = "Remaining Stock: 0 kilos";
    editIndex = null;
    document.getElementById("addBtn").textContent = "Add"; // Reset button label
}

function deleteRow(index) {
    productData.splice(index, 1);
    updateTable();
}

function editProduct(index) {
    const product = productData[index];
    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("totalStock").value = product.totalStock;
    document.getElementById("usedStock").value = product.usedStock;

    calculateRemainingStock();

    editIndex = index;
    document.getElementById("addBtn").textContent = "Update"; // Change button label to Update
}

// Handle adding new categories dynamically
document.getElementById("productCategory").addEventListener("change", function () {
    const categoryDropdown = document.getElementById("productCategory");
    if (categoryDropdown.value === "add-category") {
        const newCategory = prompt("Enter a new category name:");
        if (newCategory) {
            const option = document.createElement("option");
            option.value = newCategory;
            option.textContent = newCategory;
            categoryDropdown.insertBefore(option, categoryDropdown.lastElementChild);
            categoryDropdown.value = newCategory; // Set the new category as selected
        } else {
            categoryDropdown.value = "Starter"; // Reset to default if no input
        }
    }
});
