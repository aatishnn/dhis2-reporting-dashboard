import { init } from 'd2/lib/d2';
import _ from 'lodash';
import { nepaliToEnglish } from '../utils/DateUtils';
import { SQLVIEW } from '../constants/Constants';

class DataService {
    constructor() {
        this.initPromise = init({ baseUrl: '/hmis/api' })
            .then(d2 => {
                this.d2 = d2;
                console.log("Singleton Data Service Initialized");

            });

        this.cacheKeys = [];
        this.cacheValues = [];
    }

    getDataNepali(startDate, endDate, ouUid, sqlViewId) {
        return this.getData(
            nepaliToEnglish(startDate), nepaliToEnglish(endDate), ouUid, sqlViewId
        )
    }

    getData(startDate, endDate, ouUid, sqlViewId) {
        let cacheKey = `${startDate}-${endDate}-${ouUid}`;
        if (this.cacheKeys[sqlViewId] && this.cacheKeys[sqlViewId] === cacheKey) {
            return new Promise((resolve, reject) => {
                resolve(this.cacheValues[sqlViewId]);
            });
        }

        return this.d2.Api.getApi().get(`sqlViews/${sqlViewId}/data`,
            { 'var': [`startDate:${startDate}`, `endDate:${endDate}`, `ouUid:${ouUid}`] })
            .then(data => {
                this.cacheKeys[sqlViewId] = cacheKey;
                this.cacheValues[sqlViewId] = data;
                return data;
            })

    }

    getPrimaryData(startDate, endDate, ouUid) {
        console.log(SQLVIEW)
        return this.getDataNepali(startDate, endDate, ouUid, SQLVIEW.AGGREGATED_ANY_OWNERSHIP);
    }

    getSecondaryData(startDate, endDate, ouUid) {
        return this.getDataNepali(startDate, endDate, ouUid, SQLVIEW.ALL_HF_DATA);
    }

    saveFavorite(name, configuration) {
        // skip functions from configuration
        let filtered = _.pickBy(configuration, (data, key) => {return !_.isFunction(data)});
        return this.d2.Api.getApi().post(`dataStore/eReportingGIZ/${name}`, filtered);
    }

    setFavoriteToDashboard(favoriteName, dashboardItemId) {
        return this.d2.Api.getApi().post(`dataStore/eReportingGIZ/widget-${dashboardItemId}`, favoriteName);
    }

    getFavorite(name) {
        return this.initPromise.then(() => {
            return this.d2.Api.getApi().get(`dataStore/eReportingGIZ/${name}`);
        })
    }

    getWidgetFavorite(dashboardItemId) {
        return this.initPromise.then(() => {
            return this.d2.Api.getApi().get(`dataStore/eReportingGIZ/widget-${dashboardItemId}`)
                .then((favoriteName) => {
                    return this.getFavorite(favoriteName);
                })
        })
    }


    deleteFavorite(name) {
        return this.d2.Api.getApi().delete(`dataStore/eReportingGIZ/${name}`);
    }


    loadFavorites() {
        return this.initPromise.then(()=> {
            return this.d2.Api.getApi().get(`dataStore/eReportingGIZ/`)
        })
    }
}

export default new DataService();