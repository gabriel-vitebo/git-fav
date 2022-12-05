// classe que vai conter a lógica dos dados
// comos os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) ||
      document.querySelector(".noFavorites").classList.remove("hide")

    this.entries = []
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)
    this.entries = filteredEntries
    this.update()
  }
}
//classe que vai criar a visualização e eventos do HTML

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector("table tbody")

    this.update()
  }

  update() {
    this.removeAllTr()

    

    this.entries.forEach( user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `imagem de ${user.name}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector(".repositories").textContent = user.public_repos
      row.querySelector(".followers").textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('tem certeza que deseja deletar?')
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
          <img src="https://github.com/gabriel-vitebo.png" alt="Foto de perfil de Gabriel Vitebo">
        <a href="https://github.com/gabriel-vitebo" target="_blank">
          <p>Gabriel Vitebo</p>
          <span>gabriel-vitebo</span>
        </a>
      </td>
      <td class="repositories">18</td>
      <td class="followers">15</td>
      <td>
        <button class="remove">Remover</button>
      </td>
    `

    return tr
  }

  removeAllTr() {
    

    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}