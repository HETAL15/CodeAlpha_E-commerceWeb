// select all the "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('button');

// create an empty cart object to store selected products
const cart = {};

// add a click event listener to each "Add to Cart" button
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    // get the product details from the button's parent element
    const product = {
      name: button.parentNode.querySelector('h3').textContent,
      price: button.parentNode.querySelector('p').textContent,
      image: button.parentNode.querySelector('img').src
    };
    
    // add the product to the cart
    if (cart[product.name]) {
      // if the product is already in the cart, increase the quantity
      cart[product.name].quantity++;
    } else {
      // otherwise, add the product with quantity 1
      cart[product.name] = { ...product, quantity: 1 };
    }
    
    // update the cart UI
    updateCart();
  });
});

// function to update the cart UI
function updateCart() {
  // select the cart section and the cart table
  const cartSection = document.getElementById('cart');
  const cartTable = cartSection.querySelector('table');
  
  // remove all the current cart items from the cart table
  cartTable.querySelectorAll('tr').forEach(tr => {
    if (tr.className !== 'totals') {
      tr.remove();
    }
  });
  
  // create a new row for each item in the cart object and add it to the cart table
  let subtotal = 0;
  for (const [name, item] of Object.entries(cart)) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${item.image}" height="50"></td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.quantity}</td>
      <td><button class="remove">Remove</button></td>
    `;
    cartTable.insertBefore(row, cartTable.querySelector('.totals'));
    subtotal += parseFloat(item.price.replace('Rs.', '')) * item.quantity;
  }
  
  // update the total in the cart
  const total = subtotal;
  const totalsRow = cartTable.querySelector('.totals');
  totalsRow.querySelector('td:first-child').textContent = `Subtotal: Rs.${subtotal}`;
  totalsRow.querySelector('td:last-child').textContent = `Total: Rs.${total}`;
  
  // add click event listeners to the "Remove" buttons
  const removeButtons = cartTable.querySelectorAll('.remove');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const row = button.parentNode.parentNode;
      const name = row.querySelector('td:nth-child(2)').textContent;
      delete cart[name];
      updateCart();
    });
  });
  
  // show or hide the cart section based on whether there are items in the cart
  if (Object.keys(cart).length === 0) {
    cartSection.style.display = 'none';
  } else {
    cartSection.style.display = 'block';
  }
}
