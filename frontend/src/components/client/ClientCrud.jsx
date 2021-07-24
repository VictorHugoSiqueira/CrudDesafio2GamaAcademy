import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'users',
    title: 'Cliente',
    subtitle: 'Cadastro de Clientes: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3001/client'

const initialState = {
    client: { name: '', email: '', telephone: '', address: '' },
    list: []
}

export default class ClientCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ client: initialState.client })
    }

    save() {
        const client = this.state.client
        const method = client.id ? 'put' : 'post'
        const url = client.id ? `${baseUrl}/${client.id}` : baseUrl
        axios[method](url, client)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ client: initialState.client, list })
            })
    }

    getUpdatedList(client, add = true) {
        const list = this.state.list.filter(u => u.id !== client.id)
        if (add) list.unshift(client)
        return list
    }

    updateField(event) {
        const client = { ...this.state.client }
        client[event.target.name] = event.target.value
        this.setState({ client })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.client.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="email" className="form-control"
                                name="email"
                                value={this.state.client.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o e-mail..." />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Endereço</label>
                            <input type="text" className="form-control"
                                name="address"
                                value={this.state.client.address}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o Endereço..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Telefone</label>
                            <input type="text" className="form-control"
                                name="telephone"
                                value={this.state.client.telephone}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o Telefone..." />
                        </div>
                    </div>
                </div>

                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(client) {
        this.setState({ client })
    }

    remove(client) {
        axios.delete(`${baseUrl}/${client.id}`).then(resp => {
            const list = this.getUpdatedList(client, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Endereço</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(client => {
            return (
                <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.address}</td>
                    <td>{client.telephone}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(client)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(client)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}