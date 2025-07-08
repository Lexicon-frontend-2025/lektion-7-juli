// Interface för att definiera strukturen för ett produktobjekt
interface Product {
    id: number;
    name: string;
    price: number;
    isInStock: boolean;
}

// Array för att lagra alla produkter
let products: Product[] = [];


// Hämta alla referenser till DOM-element
const productForm = document.getElementById("product-form") as HTMLFormElement;
const productNameInput = document.getElementById("product-name") as HTMLInputElement;
const productPriceInput = document.getElementById("product-price") as HTMLInputElement;
const productList = document.getElementById("product-list") as HTMLUListElement;
const nameError = document.getElementById("name-error") as HTMLParagraphElement;
const priceError = document.getElementById("price-error") as HTMLParagraphElement;
const emptyListMessage = document.getElementById("empty-list-message") as HTMLParagraphElement;


// funktion för att lägga till en ny produkt
function addProduct(event: Event): void {
    event.preventDefault();
    const name = productNameInput.value.trim();
    const priceString = productPriceInput.value.trim();

    // validering
    if (name === "") {
        nameError.textContent = "Produktnamn får inte vara tomt"
        return;
    }
    if (priceString === "" || isNaN(parseFloat(priceString))) {
        priceError.textContent = "Pris måste vara ett giltigt nummer";
        return;
    }
    const price = parseFloat(priceString);
    if (price <= 0) {
        priceError.textContent = "Pris måste vara större än noll";
        return;
    }

    // skapa ett unikt ID (enkel räknare)
    let newId: number;
    if (products.length > 0) {
        // om det finns produkter, hitta det högsta ID:t och lägga till 1
        // let maxId = 0;
        // for (const product of products) {
        //     if (product.id > maxId) {
        //         maxId = product.id;
        //     }
        // }
        // newId = maxId + 1;
        newId = Math.max(...products.map(p => p.id)) + 1;
    } else {
        // om det inte finns några produkter, börja med ID 1
        newId = 1;
    }

    const newProduct: Product = {
        id: newId,
        name: name,
        price: price,
        isInStock: true // ny produkt är alltid i lager initialt
    };
    products.push(newProduct);
    renderProducts(); // ritar om listan

    // utan destructuring 
    const pId = newProduct.id;
    const pName = newProduct.name;
    const pPrice = newProduct.price;
    console.log(pId, pName, pPrice);

    // https://www.w3schools.com/js/js_destructuring.asp
    // med destructuring
    const { name: productName, price: productPrice } = newProduct;
    console.log(productName, productPrice);

    // tömma formuläret
    productNameInput.value = "";
    productPriceInput.value = "";
}

function renderProducts(): void {
    // töm listan för att undvika dubbletter
    productList.innerHTML = "";

    // visa/dölj meddelande om tom lista
    if (products.length === 0) {
        emptyListMessage.classList.remove("hidden");
    } else {
        emptyListMessage.classList.add("hidden");
    }

    // loopa igenom varje produkt och skapa HTML-element
    products.forEach(product => {
        const listItem = document.createElement("li");
        listItem.className = `product-item ${product.isInStock ? '' : 'out-of-stock'}`;
        // spara ID på elementet
        listItem.dataset.productId = product.id.toString();
        listItem.innerHTML = `
                    <div class="product-info">
                        <h3 class="product-info_title">${product.name}</h3>
                        <p class="product-info_price">${product.price.toFixed(2)}</p>
                        <p class="product-info_stock-status ${product.isInStock ? 'in' : 'out'}">${product.isInStock ? "I lager" : "Slut i lager"}</p>
                    </div>
                    <div class="product-options">
                        <button data-action="toggle-stock" class="product-options_toggle-stock ${product.isInStock ? 'in-stock' : ''}">
                            ${product.isInStock ? 'Markera slut' : 'Markera i lager'}
                        </button>
                        <button data-action="delete" class="product-options_delete">Ta bort</button>
                    </div>
        `;
        productList.appendChild(listItem);
    });

    const colors = ["röd", "grön", "blå", "lila", "rosa", "gul"];
    // utan destructuring
    // const firstColor = colors[0];
    // const secondColor = colors[1];
    // console.log(firstColor, secondColor);

    // med destructuring
    const [firstColor, secondColor] = colors;
    console.log(firstColor, secondColor);

    // hoppa över värden
    const [, , , , thirdColor] = colors;
    console.log(thirdColor);
    const [first, , , , , last] = colors;
    console.log(first, last);

    // rest-operatorn (...)
    const [primary, ...restOfThem] = ["first", "second", "third", "fourth"];
    console.log(primary);
    console.log(restOfThem);
}

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
// funktion för att hantera klick på växla status och ta bort
function handleProductAction(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const action = target.dataset.action;
    // hitta närmsta element som har klassen .product-item
    const listItem = target.closest(".product-item") as HTMLLIElement;

    if (!listItem) return; // se till att vi klickade på något inom ett listobjekt
    // få ut id:t
    const productId = parseInt(listItem.dataset.productId || "0");

    if (action === "toggle-stock") {
        const productIndex = products.findIndex(p => p.id === productId);
        console.log(productIndex);
        if (productIndex !== -1) {
            products[productIndex].isInStock = !products[productIndex].isInStock;
            renderProducts(); // renderar om listan
        }
    }
}

productForm.addEventListener("submit", addProduct);
productList.addEventListener("click", handleProductAction);

// rendera vid sidans laddning
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});