import { init } from "d2/lib/d2";
import _ from "lodash";
import { nepaliToEnglish } from "../utils/DateUtils";
import { SQLVIEW, OWNERSHIP } from "../constants/Constants";

class DataService {
  constructor() {
    this.initPromise = init({ baseUrl: "/hmis/api" }).then(d2 => {
      this.d2 = d2;
      console.log("Singleton Data Service Initialized");
    });

    this.cacheKeys = [];
    this.cacheValues = [];
  }

  getDataNepali(
    startDate,
    endDate,
    ouUid,
    sqlViewId,
    timelyReferenceDays,
    cutOffDate
  ) {
    return this.getData(sqlViewId, {
      startDate: nepaliToEnglish(startDate),
      endDate: nepaliToEnglish(endDate),
      ouUid,
      timelyReferenceDays,
      cutOffDate: nepaliToEnglish(cutOffDate)
    });
  }

  getDataNepaliFilterableOwnership(
    startDate,
    endDate,
    ouUid,
    ownership,
    sqlViewId,
    timelyReferenceDays,
    cutOffDate
  ) {
    return this.getData(sqlViewId, {
      startDate: nepaliToEnglish(startDate),
      endDate: nepaliToEnglish(endDate),
      ouUid,
      orgUnitGroupId: ownership,
      timelyReferenceDays,
      cutOffDate: nepaliToEnglish(cutOffDate)
    });
  }

  getData(sqlViewId, params) {
    let cacheKey = [sqlViewId, _.values(params)].join("-");
    if (this.cacheKeys[sqlViewId] && this.cacheKeys[sqlViewId] === cacheKey) {
      return new Promise((resolve, reject) => {
        resolve(this.cacheValues[sqlViewId]);
      });
    }
    let apiParams = {
      var: _.map(_.keys(params), key => {
        let value = params[key];
        return `${key}:${value}`;
      }),
      paging: false
    };

    return this.d2.Api.getApi()
      .get(`sqlViews/${sqlViewId}/data`, apiParams)
      .then(data => {
        this.cacheKeys[sqlViewId] = cacheKey;
        this.cacheValues[sqlViewId] = data;
        return data;
      });
  }

  getPrimaryData(
    startDate,
    endDate,
    ouUid,
    ownership,
    timelyReferenceDays = 15,
    cutOffDate
  ) {
    if (ownership === OWNERSHIP.ALL) {
      return this.getDataNepali(
        startDate,
        endDate,
        ouUid,
        SQLVIEW.AGGREGATED_ANY_OWNERSHIP,
        timelyReferenceDays,
        cutOffDate
      );
    } else {
      return this.getDataNepaliFilterableOwnership(
        startDate,
        endDate,
        ouUid,
        ownership,
        SQLVIEW.AGGREGATED_FILTERABLE_OWNERSHIP,
        timelyReferenceDays,
        cutOffDate
      );
    }
  }

  getSecondaryData(
    startDate,
    endDate,
    ouUid,
    ownership,
    timelyReferenceDays = 15,
    cutOffDate
  ) {
    if (ownership === OWNERSHIP.ALL) {
      return this.getDataNepali(
        startDate,
        endDate,
        ouUid,
        SQLVIEW.ALL_HF_DATA,
        timelyReferenceDays,
        cutOffDate
      );
    } else {
      return this.getDataNepaliFilterableOwnership(
        startDate,
        endDate,
        ouUid,
        ownership,
        SQLVIEW.ALL_HF_DATA_FILTERABLE_OWNERSHIP,
        timelyReferenceDays,
        cutOffDate
      );
    }
  }

  saveFavorite(name, configuration) {
    // skip functions from configuration
    let filtered = _.pickBy(configuration, (data, key) => {
      return !_.isFunction(data);
    });
    return this.d2.Api.getApi().post(
      `dataStore/eReportingGIZ/${name}`,
      filtered
    );
  }

  setFavoriteToDashboard(favoriteName, dashboardItemId) {
    return this.d2.Api.getApi().post(
      `dataStore/eReportingGIZ/widget-${dashboardItemId}`,
      favoriteName
    );
  }

  getFavorite(name) {
    return this.initPromise.then(() => {
      return this.d2.Api.getApi().get(`dataStore/eReportingGIZ/${name}`);
    });
  }

  getWidgetFavorite(dashboardItemId) {
    return this.initPromise.then(() => {
      return this.d2.Api.getApi()
        .get(`dataStore/eReportingGIZ/widget-${dashboardItemId}`)
        .then(favoriteName => {
          return this.getFavorite(favoriteName);
        });
    });
  }

  deleteFavorite(name) {
    return this.d2.Api.getApi().delete(`dataStore/eReportingGIZ/${name}`);
  }

  loadFavorites() {
    return this.initPromise.then(() => {
      return this.d2.Api.getApi().get(`dataStore/eReportingGIZ/`);
    });
  }
}

export default new DataService();
