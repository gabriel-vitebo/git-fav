import { GithubUser } from "./GithubUser.js"

// classe que vai conter a lógica dos dados
// comos os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries =
      JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já foi adicionado')
      }

      const user =  await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]

      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}
//classe que vai criar a visualização e eventos do HTML

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector("table tbody")

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector(".header button")
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".header input")

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    if (this.entries.length === 0) {
      document.querySelector(".noFavorites").classList.remove("hide")
    } else document.querySelector(".noFavorites").classList.add("hide")


    this.entries.forEach( user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
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