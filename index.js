const container = document.querySelector('.container-jobs');

let keywords = []
const DATA = './data.json';

async function getDataInfo () {
  const response = await fetch(DATA);
  const data = await response.json();
  return data
}

async function displayListJobs () {
  const listJobs = await getDataInfo()
  const allJobs = listJobs.map(job => {
    return `
      <article class='${job.new === true && job.featured === true ? 'article-job border-left-style' : 'article-job'}'> 
        <div class="info-part">
          <figure class="img-job">
            <img src=${job.logo} alt="photosnap">
          </figure>

          <div class="info-job">
            <div class="name-job">
              <p>${job.company}</p>
              ${job.new === true ?
                '<span class="new-span">New!</span>'
              : ''
              }
              ${job.featured === true ?
                '<span class="featured-span">Featured</span>'
              : ''
              }
            </div>
            <p class="position-job">${job.position}</p>
            <div class="habilities">
              <span>${job.postedAt}</span>
              <span>${job.contract}</span>
              <span>${job.location}</span>
            </div>
          </div>
        </div>

        <div class="requirements">
          <span>${job.role}</span>
          <span>${job.level}</span>
          ${job.languages.map( language => {
            return `
              <span>${language}</span>
            `
          })}
        </div>
      </article>
    `
  }).join('');
  container.innerHTML = allJobs
  const spans = document.querySelectorAll('.requirements span')
  spans.forEach(element => element.addEventListener('click', selectWordsList))
}
displayListJobs()


// Funcion para el evento al dar clic en el cual agrega esos elementos seleccionados al Array a activa la funcion FilterElements()
function selectWordsList () {
  // const keywords = []
  if (!keywords.includes(this.textContent)) {
    keywords.push(this.textContent)
  }

  filterElements(keywords)
}


// Funcion para filtrar los elementos seleccionados
function filterElements(list) {
  const allKeywords = list

  if (allKeywords.length !== 0) {
    const mainContainer = document.querySelectorAll('.article-job');
    mainContainer.forEach(element => {
      const spans = element.querySelectorAll('.requirements span')
      
      // logica para filtrar el contenido
      const allCoincide = allKeywords.every(keyword => {
        return Array.from(spans).some(span => {
          return span.textContent.includes(keyword)
        })
      })
      
      // cambia el display
      element.style.display = allCoincide ? 'flex' : 'none'
    }) 
  }
  displayFilteredWords(allKeywords)
}

// Funcion para crear el contenedor de las palabras filtradas
function displayFilteredWords (keywords) {
  let isSectionExists = document.querySelector('.container-jobs section');

  if (!isSectionExists) {
    isSectionExists = document.createElement('section')
    isSectionExists.classList.add('requirements')
    isSectionExists.classList.add('newContainer')

    const firstChildContainer = container.firstChild;
    container.insertBefore(isSectionExists, firstChildContainer);
    container.style.position = 'relative';
    container.style.top = '-80px';
  }

  isSectionExists.innerHTML = ''

  keywords.map(keyword => {
    const span = document.createElement('span');
    span.classList.add('span-keyword')
    span.textContent = `${keyword}`;
    isSectionExists.appendChild(span);
  })

  putEventKeywords()

  if (keywords.length === 0) {
    container.removeChild(isSectionExists)
    container.style.top = '0'
    displayListJobs()
  }
}

// Funcion para colocar los eventos de eliminar a las palabras que filtran.
function putEventKeywords () {
  const keywordsSection = document.querySelectorAll('.span-keyword');
  keywordsSection.forEach(keyword => {
    keyword.addEventListener('click', deleteKeywords)
  })
}

// Funcion para borrar las palabras filtradas
function deleteKeywords () {
  if(keywords.length !== 0) {
    const index = keywords.findIndex( index => index === this.textContent);
    keywords.splice(index, 1)
    displayFilteredWords(keywords)
    filterElements(keywords)
  } 
}