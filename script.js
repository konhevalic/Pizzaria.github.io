//variavael para quantidade de pizza
let modalQt = 1;
//array para itens adicionado ao carrinho
let cart = [];

modalKey = 0;

//mapeando a lista de sabores
pizzaJson.map( (item, index) => {
    let pizzaItem = document.querySelector(".models .pizza-item").cloneNode(true);

    //inserindo a chave da pizza selecionada
    pizzaItem.setAttribute('data-key', index);

    //aparecer nome das pizza
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;

    //aparecer a descrição
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

    //preço
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;

    //imagem
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;

    //link para o modal
    pizzaItem.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();

        //reconhecendo a pizza que foi clicada
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalQt = 1;
        modalKey = key;

        //preenchendo o modal com informaçoes da pizza selecionada:

        //imagem da pizza
        document.querySelector(".pizzaBig img").src = pizzaJson[key].img;

        //nome da pizza
        document.querySelector(".pizzaInfo h1").innerHTML = pizzaJson[key].name;

        //descrição da pizza
        document.querySelector(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;

        //preço
        document.querySelector(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        //tamanho
        document.querySelectorAll(".pizzaInfo--size").forEach((size, sizeIndex)=> {
            
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        });
        //********************VERIFICAR SELEÇÃO DE TAMANHO */
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;


        console.log(pizzaJson[key] )

        document.querySelector(".pizzaWindowArea").style.opacity = 0

        document.querySelector(".pizzaWindowArea").style.display = "flex"

        setTimeout(() => {
            document.querySelector(".pizzaWindowArea").style.opacity = 1;    
        }, 50);
    })
    //preencher as informações em pizzaItem
    document.querySelector('.pizza-area').append( pizzaItem ); 
} );


//eventos do modal
//funççao o modal:
function closeModal() {
    document.querySelector(".pizzaWindowArea").style.opacity = 0
    setTimeout(()=>{
        document.querySelector(".pizzaWindowArea").style.display = 'none';
    },50);
}
//selecionando a div responsavel pelo botao "cancelar" e executando a função closeModal após clicar no botão
document.querySelectorAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item)=>{
    item.addEventListener('click', closeModal);
})

//aumentando a quantidade
document.querySelector(".pizzaInfo--qtmais").addEventListener('click', ()=>{
    modalQt++;
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt; 
})

//diminuindo a quantidade
document.querySelector(".pizzaInfo--qtmenos").addEventListener('click', ()=>{
    if(modalQt>1){
        modalQt--;
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt; 
    } else {
        alert('Quantidade de Pizzas não pode ser menor que 1')
    }
})
//selecionando o tamanho
document.querySelectorAll(".pizzaInfo--size").forEach((size, sizeIndex)=> {
    size.addEventListener("click", (e)=>{
        //remove o item que já estava selecionado selecionado
        document.querySelector(".pizzaInfo--size.selected").classList.remove('selected')
        //adiciona o item que foi selecionado
        size.classList.add('selected')
    })
});

//adicionado ao carrinho de compras
document.querySelector('.pizzaInfo--addButton').addEventListener("click", ()=>{
    //sabor
    // console.log("pizza:" + modalKey)

    //tamanho
    let size = parseInt(document.querySelector(".pizzaInfo--size.selected").getAttribute('data-key'));

    //se a pizza for do mesmo tamanho e mesmo sabor, adicionaremos a quantidade ao mesmo item ao inves de criar um novo item
    //utilizado id da pizza + simbolo (@) + tamanho
    let identifier = pizzaJson[modalKey].id+'@'+size;

    //verificando se o identificador ja existe no carrinho
    let key = cart.findIndex((item)=>{
        return item.identifier == identifier //se for igual, retornará o identificador, senao, retorna -1
    });

    if(key >-1) {
        cart[key].qt += modalQt;
    } else {
        //adicionado ao array
        cart.push({
            identifier, //irá retornar o id da pizza+tamanho, exemplo: mussarela grande, id 1 + @ + size 1 = 1@1
            id: pizzaJson[modalKey].id,
            size: size,
            qt: modalQt,
        })
    }

    //atualizando o carrinho
    uptdateCart();
    //fechando o modal após adicionar ao carrinho
    closeModal();

    //console.log('tamanho: ' + size )
    //quantidade
    //console.log('quantidade: ' +modalQt)
});


document.querySelector(".menu-openner").addEventListener("click", ()=>{
    if(cart.length>0) {
        document.querySelector('aside').style.left='0';
    }
});

document.querySelector(".menu-closer").addEventListener("click", ()=>{
    document.querySelector('aside').style.left='100vw';
});

//renderizando o carrinho
function uptdateCart() {
    //alterando o valor da quantidade do carrinho na versao mobile
    document.querySelector(".menu-openner span").innerHTML = cart.length;

    if(cart.length>0) {
        //se haver item no carrinho, irá adicionar a tela e mostrar
        document.querySelector('aside').classList.add('show');

        //zerando o cart para que nao adicione novos itens iguais, apenas altere a quantidade
        document.querySelector('.cart').innerHTML= '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            //verificar sabor da pizza
            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == cart[i].id
            });

            subtotal += pizzaItem.price * cart[i].qt;

            //clona o pedido para o carrinho
            let cartItem = document.querySelector(".models .cart--item").cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G'
                    break;
            }
            //colocando a imagem da pizza
            cartItem.querySelector("img").src = pizzaItem.img;

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            //adicionando o nome 
            cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;

            //quantidade
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;

            cartItem.querySelector(".cart--item-qtmenos").addEventListener('click', ()=>{
                if(cart[i].qt >1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                uptdateCart();
            });

            cartItem.querySelector(".cart--item-qtmais").addEventListener('click', ()=>{
                cart[i].qt++;
                uptdateCart();
            })

            //adiciona o item ao carrinho
            document.querySelector(".cart").append(cartItem);
        }

        desconto = subtotal *0.1;
        total = subtotal - desconto;

        document.querySelector(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`
        document.querySelector(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`
        document.querySelector(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`

    } else {
        //se nao houver itens, ele irá remover a tela 
        document.querySelector('aside').classList.remove('show');
        document.querySelector("aside").style.left = "100vw";
    }
}