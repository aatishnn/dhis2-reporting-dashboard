SELECT
	ps.monthly AS Month,
	children.name,
	COUNT(CASE 
		WHEN DATE(cdr.date) BETWEEN DATE(pe.enddate) AND DATE(pe.enddate) + INTERVAL '${timelyReferenceDays} DAY' THEN 'Timely' 
	END) AS Timely,
	COUNT(CASE 
		WHEN cdr.periodid is NOT NULL AND DATE(cdr.date) NOT BETWEEN DATE(pe.enddate) AND DATE(pe.enddate) + INTERVAL '${timelyReferenceDays} DAY' THEN 1
	END) AS Late,

	COUNT(CASE 
		WHEN cdr.periodid is NULL THEN 1
	END) AS Unreported,

	COUNT(*) AS Expected,

	COUNT(CASE 
		WHEN usermembership.organisationunitid = ou.organisationunitid THEN 1
	END) AS Self_submitted,

	COUNT
	(CASE 
			WHEN
	(cdr.periodid IS NOT NULL AND usermembership.organisationunitid IS NULL) OR usermembership.organisationunitid <> ou.organisationunitid THEN 1
	END) AS Submitted_by_parent,
	COUNT(CASE 
		WHEN cdr.periodid is NOT NULL AND DATE(cdr.date) > (DATE(pe.enddate) + INTERVAL '${timelyReferenceDays} DAY') AND DATE(cdr.date) <= (DATE(pe.enddate) + INTERVAL '${timelyReferenceDays} DAY' + INTERVAL '15 DAY') THEN 1
	END) AS Late_by_15,
	COUNT(CASE 
		WHEN cdr.periodid is NOT NULL AND DATE(cdr.date) > (DATE(pe.enddate) + INTERVAL '${timelyReferenceDays} DAY' + INTERVAL '15 DAY') AND DATE(cdr.date) <= (DATE(pe.enddate) + INTERVAL '${timelyReferenceDays} DAY' + INTERVAL '30 DAY') THEN 1
	END) AS Late_by_30,
	COUNT(CASE 
		WHEN cdr.periodid is NOT NULL AND DATE(cdr.date) > (DATE(pe.enddate) + INTERVAL '${timelyReferenceDays} DAY' + INTERVAL '30 DAY') AND DATE(cdr.date) <= (DATE(pe.enddate) + INTERVAL '${timelyReferenceDays} DAY' + INTERVAL '60 DAY') THEN 1
	END) AS Late_by_60,
	COUNT(CASE 
		WHEN cdr.periodid is NOT NULL AND DATE(cdr.date) > (DATE(pe.enddate) + INTERVAL '${timelyReferenceDays} DAY' + INTERVAL '60 DAY') THEN 1
	END) AS Late_more_than_60

FROM organisationunit ou
	JOIN orgunitlevel ON orgunitlevel.name= 'Health Facility' AND ou.hierarchylevel = orgunitlevel.level
	JOIN organisationunit parent ON parent.path LIKE '%/${ouUid}'
	JOIN organisationunit children ON 
	children.path LIKE '%/${ouUid}%'
		AND ou.path LIKE CONCAT(children.path, '%')
		AND children.hierarchylevel = LEAST((parent.hierarchylevel  + 1), 6)
	JOIN period pe ON pe.periodtypeid = (SELECT periodtypeid
	FROM periodtype
	WHERE name = 'Monthly')
	JOIN _periodstructure ps ON ps.periodid = pe.periodid

	LEFT JOIN completedatasetregistration cdr ON 
	cdr.sourceid = ou.organisationunitid
		AND
		cdr.periodid=pe.periodid
		AND
		(cdr.datasetid = 4628 OR cdr.datasetid = 4657)
	LEFT JOIN users ON users.username = cdr.storedby
	LEFT JOIN usermembership ON usermembership.userinfoid = users.userid AND usermembership.organisationunitid = ou.organisationunitid

WHERE 
	ou.path LIKE '%/${ouUid}%'
	AND
	ou.openingdate <= '${startDate}'
	AND
	(pe.startdate >= '${startDate}' AND pe.enddate <= '${endDate}')
GROUP BY children.name, month
ORDER BY month DESC