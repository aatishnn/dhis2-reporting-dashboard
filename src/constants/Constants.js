// These are column indices of AGGREGATED SQLViews
const MONTH = 0;
const OU = 1;
const TIMELY = 2;
const LATE = 3;
const UNREPORTED = 4;
const EXPECTED = 5;
const SELF_SUBMITTED = 6;
const SUBMITTED_BY_PARENT = 7;
const LATE_BY_15 = 8;
const LATE_BY_30 = 9;
const LATE_BY_60 = 10;
const LATE_MORE_THAN_60 = 11;



export const COLUMNS = {
    MONTH, OU, TIMELY, LATE, UNREPORTED, EXPECTED, SELF_SUBMITTED, SUBMITTED_BY_PARENT,
    LATE_BY_15, LATE_BY_30, LATE_BY_60, LATE_MORE_THAN_60
};

const SECONDARY_COLUMN_REPORTED_ON = 3;
const SECONDARY_COLUMN_TIMELINESS = 4;
const SECONDARY_COLUMN_VALUE_TIMELY = 'Timely';
const SECONDARY_COLUMN_VALUE_LATE = 'Late';

export const SECONDARY_COLUMNS = {
    REPORTED_ON: SECONDARY_COLUMN_REPORTED_ON,
    TIMELINESS: SECONDARY_COLUMN_TIMELINESS,
    VALUE_TIMELY: SECONDARY_COLUMN_VALUE_TIMELY,
    VALUE_LATE: SECONDARY_COLUMN_VALUE_LATE,
}


const LINE = 'line';
const COLUMN = 'column';
export const CHARTS = {LINE, COLUMN}


// OWNERSHIP CHOICES

// these are DB IDs of Public and Private Org Group ID in DHIS2
// this is sufficiently stable
const OWNERSHIP_PUBLIC = 49380
const OWNERSHIP_PRIVATE = 49381
// OWNERSHIP_ALL is a pseudo ID, not an actual ID in DHIS2. It is
// used to switch between SQLVIEWS depending on whether non-filtering
// version of SQLVIEW is required
const OWNERSHIP_ALL = "sql_view_all" 

export const OWNWERSHIP = {
    PRIVATE: OWNERSHIP_PRIVATE, 
    PUBLIC: OWNERSHIP_PUBLIC,
    ALL: OWNERSHIP_ALL
};

// SQL VIEWS
const SQL_VIEW_AGGREGATED_ANY_OWNERSHIP = process.env.REACT_APP_SQL_VIEW_AGGREGATED_ANY_OWNERSHIP;
const SQL_VIEW_AGGREGATED_FILTERABLE_OWNERSHIP = process.env.REACT_APP_SQL_VIEW_AGGREGATED_FILTERABLE_OWNERSHIP;
const SQL_VIEW_ALL_HF_DATA = process.env.REACT_APP_SQL_VIEW_ALL_HF_DATA;

export const SQLVIEW = {
    AGGREGATED_ANY_OWNERSHIP: SQL_VIEW_AGGREGATED_ANY_OWNERSHIP,
    AGGREGATED_FILTERABLE_OWNERSHIP: SQL_VIEW_AGGREGATED_FILTERABLE_OWNERSHIP,
    ALL_HF_DATA: SQL_VIEW_ALL_HF_DATA
}