SELECT 
	ps.monthly AS Month,
	ou.uid as organizationunitid,
--	(Select name from organisationunit where uid = substring(ou.path from 14 for 11)) AS Province,
--	(Select name from organisationunit where uid = substring(ou.path from 26 for 11)) AS District,
--	(Select name from organisationunit where uid = substring(ou.path from 38 for 11)) AS Palika,
--	(Select name from organisationunit where uid = substring(ou.path from 50 for 11)) AS Ward,
	ou.name AS Facility_Name,
	DATE(cdr.date) AS reported_on,
	CASE 
		WHEN cdr.periodid is NULL THEN NULL
		WHEN DATE(cdr.date) BETWEEN DATE(pe.enddate) AND DATE(pe.enddate) + INTERVAL '15 DAY' THEN 'Timely' 
		ELSE 'Late' 
	END AS Timeliness,

	CASE 
		WHEN cdr.periodid is NULL THEN NULL
		WHEN usermembership.organisationunitid = ou.organisationunitid THEN 'Self' 
		ELSE 'Parent OU' 
	END AS Reporting_From,

	cdr.storedby as stored_by,
	storing_ou.name AS stored_by_ou
	
FROM organisationunit ou
JOIN period pe ON pe.periodtypeid = (SELECT periodtypeid FROM periodtype WHERE name = 'Monthly')
JOIN _periodstructure ps ON ps.periodid = pe.periodid

LEFT JOIN completedatasetregistration cdr ON 
	cdr.sourceid = ou.organisationunitid 
	AND 
	cdr.periodid=pe.periodid 
	AND 
	(cdr.datasetid = 4628 OR cdr.datasetid = 4657)
LEFT JOIN users ON users.username = cdr.storedby
LEFT JOIN usermembership ON usermembership.userinfoid = users.userid AND  usermembership.organisationunitid = ou.organisationunitid 
LEFT JOIN organisationunit storing_ou ON storing_ou.organisationunitid = usermembership.organisationunitid

WHERE 
	ou.path LIKE '%/${ouUid}%' 
	AND 
	ou.hierarchylevel = (SELECT level FROM orgunitlevel WHERE name = 'Health Facility')
	AND
	ou.openingdate <= '${startDate}'
	AND
	(pe.startdate >= '${startDate}' AND pe.enddate <= '${endDate}')
	
ORDER BY month DESC
