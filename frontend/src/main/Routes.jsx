import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import Home from '../components/home/Home'
import ClientCrud from '../components/client/ClientCrud'
import ProductCrud from '../components/products/ProductCrud'


export default props => 
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/client' component={ClientCrud} />
        <Route path='/products' component={ProductCrud} />
        <Redirect from='*' to='/' />
    </Switch>