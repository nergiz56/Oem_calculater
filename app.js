// Stroge Controller
const StorageController = (function(){
})();


// Product (ürün) Controller
const ProductController = (function(){

// private (özel)
const Product = function(id, name, price){
    this.id = id;
    this.name = name;
    this.price = price; 
}

const data = {
    products : [ ],
    selectedProduct:null, // (seçilmiş ürün)kullanıcının seçmiş olduğu ürünü saklayalım
    totalPrice:0 // listede bulunan elamanların toplam fiyatını vericek
}

//public (genel)
return {
    getProducts: function(){
        return data.products;
    },
    getData: function(){
        return data;
    },
    getProductById: function(id){
        let product = null;

        data.products.forEach(function(prd){
            if(prd.id == id){
                product = prd;
            }
        })

        return product;
    },
    setCurrentProduct:function(product){
        data.selectedProduct = product;
    },
    getCurrentProduct:function(){
        return data.selectedProduct;
    },
    addProduct: function(name,price){
        let id;

        if(data.products.length > 0){
            id = data.products[data.products.length - 1].id + 1;
        }else{
            id = 0;
        }
        const newProduct = new Product(id,name,parseFloat(price)); 
        data.products.push(newProduct);
        return newProduct;
    },
    getTotal : function(){
        let total = 0;

        data.products.forEach(function(item){
            total += item.price;
        });

        data.totalPrice = total;
        return data.totalPrice;
        
    }

}

})();





// UI Controller, Selectors(seçiciler)
const UIController = (function(){

    const Selectors = {
        productList : "#item-list",
        addButton : '.addBtn',
        updateButton : '.updateBtn',
        cancelButton : '.cancelBtn',
        deleteButton : '.deleteBtn',
        productName : '#productName',
        productPrice : '#productPrice',
        productCard : '#productCard',
        totalTL: '#total-tl',
        totalDolar: '#total-dolar'

    };


    return{
        createProductList: function(products){
            let html=' ';


            products.forEach(prd => {
                html +=`
                    <tr>
                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price}</td>
                        <td class="text-right">
                            <i class="far fa-edit edit-product"></i>  
                        </td>
                    </tr>
                
                `;
            });

            document.querySelector(Selectors.productList).innerHTML += html;
        },
        getSelectors : function(){
            return Selectors;
        },
        addProduct : function(prd){

            document.querySelector(Selectors.productCard).style.display='block';
            var item = `
            <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price}</td>
                <td class="text-right">
                     <i class="far fa-edit edit-product"></i>  
                </td>
            </tr>
            `;
            document.querySelector(Selectors.productList).innerHTML += item;

            
        },
        clearInputs: function(){// burada eleman eklendikten sonra inputun içini temizliyoruz.
            document.querySelector(Selectors.productName).value='';
            document.querySelector(Selectors.productPrice).value='';

        },
        hideCard: function(){// eleman olmadığı zaman kartımızı gizlyelim
            document.querySelector(Selectors.productCard).style.display='none';
        },  
        showTotal: function(total){
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTL).textContent = total*4.5;

        },
        addProductToFrom:function(){
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        addingState:function() { 
            
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display='inline';
            document.querySelector(Selectors.updateButton).style.display='none';
            document.querySelector(Selectors.deleteButton).style.display='none';
            document.querySelector(Selectors.cancelButton).style.display='none';

        },
        editState:function(tr) { 

            const parent = tr.parentNode;

            for(let i=0; i< parent.children.length; i++){
                parent.children[i].classList.remove('bg-warning');
            }

            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display='none';
            document.querySelector(Selectors.updateButton).style.display='inline';
            document.querySelector(Selectors.deleteButton).style.display='inline';
            document.querySelector(Selectors.cancelButton).style.display='inline';
        },
    }
})(); 





// App Controller, ana mödülümüz
const App = (function(ProductCtrl, UICtrl){ // ürün controlü ve UI kontrolu

    const UISelectors = UICtrl.getSelectors();

    //Load Event Listeners
    const loadEventListeners = function(){

        // add product event 
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

        // edit product 
        document.querySelector(UISelectors.productList).addEventListener('click', productEditSubmit);


    }

    const productAddSubmit = function(e){

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName!== '' && productPrice!== ''){
        //Add product
          const newProduct = ProductCtrl.addProduct(productName, productPrice);

          //add item to list
          UIController.addProduct(newProduct);

          //get total
          const total = ProductCtrl.getTotal();
          console.log(total);
            
          //show total, UI gösterelim;
          UICtrl.showTotal(total);  

          //clear inputs
          UIController.clearInputs();

        }
        

        e.preventDefault();
    }

    const productEditSubmit = function(e){

        if(e.target.classList.contains('edit-product')){

            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent ;// html ögesini yazdırır.


           // get selected product
           const product = ProductCtrl.getProductById(id);

           //set current product
            ProductCtrl.setCurrentProduct(product);

            // add product to UI
            UICtrl.addProductToFrom();

            UICtrl.editState(e.target.parentNode.parentNode);
           

        }

    

        e.preventDefault();


    }

    return{
        init: function(){
            console.log('starting app...');

            UICtrl.addingState();
        

            const products = ProductCtrl.getProducts();
           
            if(products.length == 0){
                UICtrl.hideCard();
            }else{
                UIController.createProductList(products);
            }

            
            // load event listeners
            loadEventListeners();

        }
    }



})( ProductController,  UIController );

App.init();