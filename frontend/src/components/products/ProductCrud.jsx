import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'users',
    title: 'Produto',
    subtitle: 'Cadastro de Produtos: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3002/product'

const initialState = {
    product: { productName: '', productPrice: '', fabricator: '' },
    list: []
}

export default class ProductCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ product: initialState.product })
    }

    save() {
        const product = this.state.product
        const method = product.id ? 'put' : 'post'
        const url = product.id ? `${baseUrl}/${product.id}` : baseUrl
        axios[method](url, product)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ product: initialState.product, list })
            })
    }

    getUpdatedList(product, add = true) {
        const list = this.state.list.filter(u => u.id !== product.id)
        if (add) list.unshift(product)
        return list
    }

    updateField(event) {
        const product = { ...this.state.product }
        product[event.target.name] = event.target.value
        this.setState({ product })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Produto</label>
                            <input type="text" className="form-control"
                                name="productName"
                                value={this.state.product.productName}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..." />
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Preço</label>
                            <input type="number" className="form-control"
                                name="productPrice"
                                value={this.state.product.productPrice}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o valor..." />
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Fabricante</label>
                            <input type="text" className="form-control"
                                name="fabricator"
                                value={this.state.product.fabricator}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o fabricante..." />
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

    load(product) {
        this.setState({ product })
    }

    remove(product) {
        axios.delete(`${baseUrl}/${product.id}`).then(resp => {
            const list = this.getUpdatedList(product, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Produto</th>
                        <th>Preço</th>
                        <th>Fabricante</th>
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
        return this.state.list.map(product => {
            return (
                <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.productName}</td>
                    <td>{product.productPrice}</td>
                    <td>{product.fabricator}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(product)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(product)}>
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