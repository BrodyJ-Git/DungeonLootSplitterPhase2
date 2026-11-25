// Initial event setup
document.getElementById("party").addEventListener("input", updateUI);
document.getElementById("split").addEventListener("click", updateUI);
document.getElementById("add").addEventListener("click", addLoot);
document.getElementById("warning").hidden = true;

// Intial variable setting
const items = [];

let totalLootValue = 0;
let warningText = "";
let lootText = "";

let totalPartyMembers = 0;
let partyLootSplit = 0;

let validSplit = false;
let validLoot = true;

updateUI();

function splitLoot()
{
    totalPartyMembers = parseFloat(document.getElementById("party").value);

    // checks if party members is valid
    if (!isNaN(totalPartyMembers) && totalPartyMembers > 0 && totalPartyMembers % 1 == 0)
    {
        // if valid it hides the warning and splits then displays
        validSplit = true;
        partyLootSplit = totalLootValue / totalPartyMembers;
        document.getElementById("lootSplit").innerHTML = `Loot Per Party Member: $${partyLootSplit.toFixed(2)}`;
    }
    else { validSplit = false; }
}

function addLoot()
{
    // gets and sets the item inserted
    let itemName = document.getElementById("name").value;
    let itemValue = parseFloat(document.getElementById("itemValue").value);
    let quantity = parseInt(document.getElementById("quantity").value);

    // Validation sequence that checks valid name, valid value, and valid quantity
    validLoot = false;
    if (itemName === "") { warningText = "A loot name is required"; }
    else if (isNaN(itemValue)) { warningText = "Loot value is not valid"; }
    else if (itemValue < 0) { warningText = "Loot value cannot be negative"; }
    else if (isNaN(quantity)) { warningText = "Quantity is not valid"; }
    else if (quantity <= 0) { warningText = "Quantity cannot be zero or negative"; }
    else
    {
        // hides warning text and creates and adds valid item to array
        validLoot = true;
        let newItem = {name: itemName, value: itemValue, quantity: quantity};
        items.push(newItem);
    }  

    updateUI();
}

function removeLoot(itemIndex)
{
    // removes item at specified index then updates UI
    items.splice(itemIndex, 1);
    updateUI();
}

function updateUI()
{
    // clears current loot rows
    let lootRows = document.getElementById("lootRows");
    lootRows.innerHTML = "";

    if (items.length > 0)
    {
        // loop that adds up value. For readability could be combined with loop below
        totalLootValue = 0;
        for (let i = 0; i < items.length; i++)
        {
            totalLootValue += (parseFloat(items[i].value) * parseInt(items[i].quantity));
        }

        // loop that refreshes the loot list and adds new item
        for (let i = 0; i < items.length; i++)
        {
            let row = document.createElement("div");
            row.className = "loot-row";

            let nameCell = document.createElement("div");
            nameCell.className = "loot-cell";
            nameCell.innerText = items[i].name;

            let valueCell = document.createElement("div");
            valueCell.className = "loot-cell";
            valueCell.innerText = items[i].value.toFixed(2);

            let quantityCell = document.createElement("div");
            quantityCell.className = "loot-cell";
            quantityCell.innerText = items[i].quantity;

            let actionCell = document.createElement("div");
            actionCell.className = "loot-cell loot-actions";

            let removeBtn = document.createElement("button");
            removeBtn.innerText = "Remove";
            removeBtn.addEventListener("click", function () {
            removeLoot(i);
            });

            actionCell.appendChild(removeBtn);

            row.appendChild(nameCell);
            row.appendChild(valueCell);
            row.appendChild(quantityCell);
            row.appendChild(actionCell);

            lootRows.appendChild(row);
        }

        splitLoot();

        // if split is valid update and show all split totals else hide it all
        if (validSplit === true)
        {
            document.getElementById("totalSplit").hidden = false;
            document.getElementById("lootSplit").hidden = false;
            document.getElementById("totalSplit").innerHTML = `Total Loot: $${totalLootValue.toFixed(2)}`;
            document.getElementById("split").disabled = false;
        }
        else
        {
            document.getElementById("totalSplit").hidden = true;
            document.getElementById("lootSplit").hidden = true;
            document.getElementById("split").disabled = true;
        }

        // show and update totals
        document.getElementById("totalLoot").hidden = false;
        document.getElementById("totalLoot").innerHTML = `Total Loot: $${totalLootValue.toFixed(2)}`;
        document.getElementById("noLootMessage").hidden = true;
    }
    else
    {
        // hide all totals and disable split button
        document.getElementById("lootSplit").hidden = true;
        document.getElementById("totalSplit").hidden = true;
        document.getElementById("totalLoot").hidden = true;
        document.getElementById("noLootMessage").hidden = false;
        document.getElementById("split").disabled = true;
    }

    // if recently added loot isn't valid show warning else hide it
    if (validLoot == false)
    {
        document.getElementById("warning").hidden = false;
        document.getElementById("warning").innerHTML = warningText;
    }
    else
    {
        document.getElementById("warning").hidden = true;
    }
}