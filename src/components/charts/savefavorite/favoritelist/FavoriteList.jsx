import React, { Component } from 'react'
import dataService from '../../../../services/dataService';

class FavoriteList extends Component {
    state = {
        loading: true,
        results: []
    }
    componentDidMount() {
        dataService.loadFavorites()
        .then((results) => {
            this.setState({results, loading: false})
        })
        .catch((error)=> {
            console.log(error);
            this.setState({ loading: false })

        })
    }

    deleteFavorite = (favorite) => {
        dataService.deleteFavorite(favorite)
            .then(response => {
                this.setState({results: this.state.results.filter(r => r !== favorite)})
            })
            .catch(error => {
                console.log("Error deleteing favorite: " + favorite + "  " + error);
            })
    }

    setFavoriteToDashboard = (favorite) => {
        dataService.setFavoriteToDashboard(favorite, this.props.dashboardItemId)
            .then(response => {
                console.log("Reload page");
            })
    }
    
    getFavoriteRows(favorites) {
        if (favorites.length) {
            return favorites.filter(favorite => !favorite.startsWith('widget')).map((favorite) => {
                return (
                    <tr key={favorite}>
                        <td>{favorite}</td>
                        <td>
                            {this.props.dashboardItemId? 
                                <button className="btn btn-sm btn-primary" onClick={() => this.setFavoriteToDashboard(favorite)}>Use</button>
                            :   <button className="btn btn-sm btn-danger" onClick={() => this.deleteFavorite(favorite)}>Delete</button>
                            }
                        </td>
                    </tr>
                )
            })
        }
        else {
            return "No favorites"
        }
    }

    render() {
        return (
            <table className="table table-condensed">
                <thead>
                    <th>Name</th>
                    <th>Actions</th>
                </thead>
                <tbody>
                   {!this.state.loading && this.getFavoriteRows(this.state.results)}
                   {this.state.loading && "Loading favorites..."}
                </tbody>
            </table>
        )
    }
}

export default FavoriteList
