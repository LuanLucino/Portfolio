const btnMenu = document.getElementById("btn-menu");
const menuMobile = document.getElementById("menu-mobile");
const overlay = document.getElementById("overlay-menu");
const btnFechar = document.querySelector(".btn-fechar");
const menuLinks = document.querySelectorAll("#menu-mobile nav ul li a");

// Função para fechar com animação
function fecharMenuComAnimacao() {
  menuMobile.classList.add("fechar-animacao");
  overlay.style.display = "none";

  // Aguarda a animação terminar antes de remover completamente
  setTimeout(() => {
    menuMobile.classList.remove("abrir-menu");
    menuMobile.classList.remove("fechar-animacao");
  }, 400); // tempo igual ao da animação
}

btnMenu.addEventListener("click", () => {
  menuMobile.classList.add("abrir-menu");
  overlay.style.display = "block";
});

btnFechar.addEventListener("click", fecharMenuComAnimacao);

overlay.addEventListener("click", fecharMenuComAnimacao);

menuLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // impede o scroll automático por enquanto

    const href = link.getAttribute("href");
    const destino = document.querySelector(href);

    // Fecha o menu com animação
    fecharMenuComAnimacao();

    // Aguarda a animação terminar antes de rolar para a seção
    setTimeout(() => {
      destino.scrollIntoView({ behavior: "smooth" });
    }, 400); // mesmo tempo da animação
  });
});
