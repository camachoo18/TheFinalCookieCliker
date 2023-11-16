let interval_click;

function select(tag){
  const elemento = document.querySelector(tag);
  return elemento;
}
function upgradeClick(){
  shop.click.upgrade()
}

function updateElement(tag, contenido){
  const elemento = select(tag);
  elemento.innerHTML = contenido;
}

function showElement(tag){
  const elemento = select(tag);
  elemento.hidden = false;
}

function hideElement(tag){
  const elemento = select(tag);
  elemento.hidden = true;
}

function disableElement(tag){
  const elemento = select(tag);
  elemento.disabled = true;
}

function enableElement(tag){
  const elemento = select(tag);
  elemento.disabled = false;
}

const contador = {
  valor: 0,
  base: 1,
  record: 0,
  reset: function(){
    contador.valor = 0;
    contador.record = 0;
    contador.base = 1; // Corregir aquí
  },
  updateRecord: function(){
    if(contador.valor > contador.record){
      contador.record = contador.valor;
      localStorage.setItem("record", contador.record);
    }
  },
  aumentar: function(){
    console.log(contador.valor);
    contador.valor += contador.base + shop.click.nivel;
    updateElement("#puntos", contador.valor);
    localStorage.setItem("puntos", contador.valor);
    contador.updateRecord();
    shop.updateShop();
  },
  disminuir: function(cantidad){
    contador.valor -= cantidad;
    updateElement("#puntos", contador.valor);
    localStorage.setItem("puntos", contador.valor);
    shop.updateShop();
  },
  autoclick: function(){
    contador.valor += shop.autoclick_base.nivel; // Corregir aquí
    updateElement("#puntos", contador.valor);
    localStorage.setItem("puntos", contador.valor);
    contador.updateRecord();
    shop.updateShop();
  }
};

const shop = {
  click: {
    nivel: 0,
    precio_inicial: 10,
    precio: 10,
    nombre: "click",
    id: "#shop_base",
    calcularPrecio: function(){
      shop.click.precio = 10 * (shop.click.nivel + 1);
    },
    reset: function(){
      shop.click.nivel = 0;
      shop.click.precio = 10;
    },
    upgrade: function(){
      shop.click.nivel++;
      contador.disminuir(shop.click.precio);
      shop.click.calcularPrecio();
      shop.updateShop();
      localStorage.setItem("nivel_click", shop.click.nivel);
    },
  },
  autoclick_base: {
    nivel: 0,
    precio_inicial: 100,
    precio: 100,
    nombre: "autoclick",
    id: "#shop_autoclick_base",
    calcularPrecio: function(){
      shop.autoclick_base.precio = 100 * (shop.autoclick_base.nivel + 1);
    },
    reset: function(){
      shop.autoclick_base.precio = 100;
      shop.autoclick_base.nivel = 0;
    },
    upgrade: function(){
      shop.autoclick_base.nivel++;
      contador.disminuir(shop.autoclick_base.precio);
      shop.autoclick_base.calcularPrecio();
      localStorage.setItem("nivel_autoclick_base", shop.autoclick_base.nivel);
      shop.updateShop();
    },
  },
  reset: function(){
    shop.click.reset();
    shop.updateShop();
  },
  updateItem: function(item){
     if(contador.record >= item.precio_inicial){
       showElement(item.id);
     } else {
       hideElement(item.id);
     }
    if(contador.valor >= item.precio) {
      enableElement(item.id);
    } else {
      disableElement(item.id);
    }
    const button_tag = `${item.nombre} (-${item.precio})`;
    updateElement(item.id, button_tag);
  },
  updateShop: function(){
    shop.updateItem(shop.click);
    shop.updateItem(shop.autoclick_base);

    shop.click.calcularPrecio();
    shop.autoclick_base.calcularPrecio();
  },
};

function upgradeAutoClick() {
  clearInterval(interval_click);
  shop.autoclick_base.upgrade();
  setInterval(contador.autoclick, 2000);
}

function checkLocalStorage(callback){
  const valor = localStorage.getItem("puntos");
  const record = localStorage.getItem("record");
  const nivel_click = localStorage.getItem("nivel_click");
  const nivel_autoclick_base = localStorage.getItem("nivel_autoclick_base");

  if(valor === null){
    console.log("no hay datos");
    localStorage.setItem("puntos", 0);
    localStorage.setItem("record", 0);
    localStorage.setItem("nivel_click", 0);
    localStorage.setItem("nivel_autoclick_base", 0);
    contador.valor = 0;
    contador.record = 0;

  } else {
    console.log("hay datos");
    contador.valor = parseInt(valor);
    contador.record = parseInt(record);
    shop.click.nivel = parseInt(nivel_click);
    shop.autoclick_base.nivel = parseInt(nivel_autoclick_base);
    updateElement("#puntos", valor);
  }
  callback();
}

function init(){
  checkLocalStorage(() => {
    shop.updateShop();
    clearInterval(interval_click);
    interval_click = setInterval(contador.autoclick, 2000);
  });
}

function reset(){
  localStorage.clear();
  contador.reset();
  shop.reset();
  clearInterval(interval_click);
  updateElement("#puntos", 0);
  init();
}

reset();
init();