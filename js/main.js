var recherche = document.getElementById('search')
var btnRecherche = document.getElementById('btn-lancer-recherche')
var blocresultats = document.getElementById('bloc-resultats')
var btnFavoris = document.getElementById('btn-favoris')
var favorite = []
var datalistRecherche = document.getElementById('datalistRecherche')
var listeFavoris = document.getElementById('liste-favoris')

var images = [
   'Anakin',
   'Luke',
   'Obi-Wan',
   'Shmi',
   'Yoda',
   'R2-D2',
   'Han',
   'Darth',
]

//le Fetch de api
const getPersonFromApi = (person) => {
   displayLoading()
   fetch(encodeURI('https://swapi.dev/api/people/?search=' + person))
      .then((response) => {
         if (!response.ok) {
            throw new Error('Probleme de reseaux!')
         } else {
            removeLoading()
            return response.json()
         }
      })
      .then((data) => {
         searchAPI(data)
      })
}

//Afficher les resultats de l'api
const searchAPI = (data) => {
   blocresultats.innerHTML = ''
   let p
   if (data.results.length == 0) {
      p = document.createElement('p')
      p.textContent = '∅ Aucun résultat trouvé'
      blocresultats.appendChild(p)
   }
   data.results.forEach((personnage) => {
      let persoInfo = displayPerso(personnage)
      blocresultats.appendChild(persoInfo)
   })
}

const init_favorite = () => {
   listeFavoris.innerHTML="";

   for (let fav of favorite) {

      //creation des elements
      let favLi = document.createElement('li');
      let favspan = document.createElement('span');
      let img = document.createElement("img");
      img.style.marginLeft = '15px'

      favspan.title="Cliquer pour relancer la recherche";
      favspan.innerText = fav.charAt(0).toUpperCase() + fav.slice(1);;

      favspan.addEventListener('click', () => {
         getPersonFromApi(favspan.innerText);
      });

      img.src="images/croix.svg";
      img.width = 15;
      img.alt="Icone pour supprimer le favori";
      img.title="Cliquer pour supprimer le favori";

      img.addEventListener('click', () => {
         supprimerDeLaLocalStorage(fav);
      });

      favLi.appendChild(favspan);
      favLi.appendChild(img);
      listeFavoris.appendChild(favLi);
   }

}



const displayPerso = (perso) => {
   //div principale
   let personnage = document.createElement('div')
   personnage.classList.add('personnage')
   //image
   let image = document.createElement('div')
   image.classList.add('image')

   //infos
   let info = document.createElement('div')
   info.classList.add('info')
   let nom = document.createElement('h2')
   let gender = document.createElement('p')
   let dateOfBirth = document.createElement('p')

   //buttons
   let buttons = document.createElement('div')
   buttons.classList.add('btns')
   let favoris = document.createElement('button')
   let voirPlus = document.createElement('button')

   //verifier si l'image que on cherche existe
   let imgurl = perso.name.split(' ')[0]
   if (images.indexOf(imgurl) !== -1) {
      image.style.backgroundImage = `url('images/perso/${imgurl}.jpg')`
   } else {
      if (perso.gender == 'male') {
         image.style.backgroundImage = `url('images/perso/man.svg')`
      } else if (perso.gender == 'female') {
         image.style.backgroundImage = `url('images/perso/woman.svg')`
      } else {
         image.style.backgroundImage = `url('images/perso/what.svg')`
      }
   }

   //infos de personnage
   nom.innerText = perso.name
   gender.innerText = 'Gender : ' + perso.gender
   dateOfBirth.innerText = 'Year of Birth : ' + perso.birth_year

   //appending info
   info.appendChild(nom)
   info.appendChild(gender)
   info.appendChild(dateOfBirth)

   //buttons
   //button favoris

   const index = favorite.indexOf(perso.name.toLowerCase())
   if (index > -1) {
      favoris.innerHTML = `<img src="images/etoile-pleine.svg" alt="Etoile vide" width=22>`
      favoris.setAttribute('alreadyadded', true)
   } else {
      favoris.innerHTML = `<img src="images/etoile-vide.svg" alt="Etoile vide" width=22>`
      favoris.setAttribute('alreadyadded', false)
   }
   favoris.setAttribute('data', perso.name)

   favoris.addEventListener('click', () => {
      ajouterSupprimerButton(favoris)
      if (favoris.getAttribute('alreadyadded') == 'true') {
         favoris.innerHTML = `<img src="images/etoile-pleine.svg" alt="Etoile vide" width=22>`
      } else {
         favoris.innerHTML = `<img src="images/etoile-vide.svg" alt="Etoile vide" width=22>`
      }
   })
   favoris.classList.add('btn-plus')

   //button voir plus
   voirPlus.innerText = `VOIR PLUS`
   voirPlus.classList.add('btn-plus')

   var etat = false;

   voirPlus.addEventListener('click', () =>{
      let height = document.createElement('p')
      let mass = document.createElement('p')
      let hair_color = document.createElement('p')
      let eye_color = document.createElement('p')
      height.classList.add('hidden')
      mass.classList.add('hidden')
      hair_color.classList.add('hidden')
      eye_color.classList.add('hidden')

      height.innerText = "Height : " + perso.height;
      mass.innerText = "Mass : " + perso.mass;
      hair_color.innerText = "Hair Color : " + perso.hair_color;
      eye_color.innerText = "Eye Color : " + perso.eye_color;
      image.classList.add("plus");
      buttons.classList.add("plus");

      image.addEventListener('transitionend', () =>{
         info.appendChild(height);
         info.appendChild(mass);
         info.appendChild(hair_color);
         info.appendChild(eye_color);
         height.classList.remove('hidden');
         mass.classList.remove('hidden');
         hair_color.classList.remove('hidden');
         eye_color.classList.remove('hidden');
      })
      voirPlus.disabled = true;

   })

   //appending buttons
   buttons.appendChild(favoris)
   buttons.appendChild(voirPlus)

   //appending all to personnage div
   personnage.appendChild(image)
   personnage.appendChild(info)
   personnage.appendChild(buttons)

   return personnage
}

//verification si recherche enul ou pas
const verifRecherche = () => {
   if (recherche.value === '') {
      // si recherche est nul
   } else {
      getPersonFromApi(recherche.value)
   }
}

const displayLoading = () => {
   document.getElementById('bloc-gif-attente').style.display = 'block'
}

const removeLoading = () => {
   document.getElementById('bloc-gif-attente').style.display = 'none'
}

//Favorites
btnFavoris.addEventListener('click', () => {
   ajouterFavoris(recherche)
})

//ajouter ou supprimer sur la localstorage le personnage choisi
const ajouterSupprimerButton = (button) => {

   if (button.getAttribute('alreadyadded') == 'false') { //ajouter
      favorite.push(button.getAttribute('data').toLowerCase())
      localStorage.setItem('favorites', JSON.stringify(favorite))
      button.setAttribute('alreadyadded', true)
   } else {
      const index = favorite.indexOf(button.getAttribute('data').toLowerCase()) //supprimer
      if (index > -1) {
         favorite.splice(index, 1)
      }
      localStorage.setItem('favorites', JSON.stringify(favorite))
      button.setAttribute('alreadyadded', false)
   }
   updateDataList()
}

const supprimerDeLaLocalStorage = (fav)=>{
   const index = favorite.indexOf(fav.toLowerCase()) //supprimer
   if (index > -1) {
      favorite.splice(index, 1)
   }
   localStorage.setItem('favorites', JSON.stringify(favorite))
   updateDataList()
   getPersonFromApi(recherche.value)
}

const ajouterFavoris = (recherche) => {
   if (recherche.value != '') {
      //si la recherche n'est pas vide
      if (favorite.indexOf(recherche.value.toLowerCase()) == -1) {
         //si la valeur entrée n'existe pas dans le tableau
         favorite.push(recherche.value.toLowerCase())
         localStorage.setItem('favorites', JSON.stringify(favorite))
         btnFavoris.innerHTML = '<img src="images/etoile-pleine.svg" alt="Etoile vide" width="22">'
      } else {
         //si elle existe deja --> demander pour la suppression
         const index = favorite.indexOf(recherche.value)
         favorite.splice(index, 1)
         localStorage.setItem('favorites', JSON.stringify(favorite))
         btnFavoris.innerHTML = '<img src="images/etoile-vide.svg" alt="Etoile vide" width="22">'
      }
      updateDataList()
   } else {
   } //champ vide donc rien
}

const recoverFavoris = () => {
   let fav = localStorage.getItem('favorites')
   if (!fav) {
      favorite = []
   } else {
      favorite = JSON.parse(fav)
   }
}
recoverFavoris()
//Event Listeners

//datalist
const updateDataList = () => {
   datalistRecherche.innerHTML = ''
   favorite.forEach((el) => {
      let opt = document.createElement('option')
      opt.value = el
      datalistRecherche.appendChild(opt)
   })
   init_favorite()
}

document.addEventListener('keydown', (e) => {
   if (e.key === 'Enter') {
      e.preventDefault()
      verifRecherche()
   }
})


btnRecherche.addEventListener('click', () => {

   document.getElementById('search').validity.valid;
   verifRecherche()
})

recherche.addEventListener('keyup', () => {
   if (recherche.value == ""){
      btnFavoris.classList.remove('btn_clicable');
   }else{
      btnFavoris.classList.add('btn_clicable');
      if (favorite.indexOf(recherche.value.toLowerCase()) > -1){
         btnFavoris.innerHTML = '<img src="images/etoile-pleine.svg" alt="Etoile vide" width="22">'
      }else{
         btnFavoris.innerHTML = '<img src="images/etoile-vide.svg" alt="Etoile vide" width="22">'

      }
   }
});

window.onload = () => {
   init_favorite();
}

